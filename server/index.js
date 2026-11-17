import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool, initDb, getSetting } from './db.js';
import { signAdminToken, verifyAdminToken } from './auth.js';

const app = express();
app.set('trust proxy', 1);
app.use(express.json());

// CORS: the Recoupa static site (both domains) + localhost for local dev.
const ALLOWED_ORIGINS = new Set([
  'https://recoupafi.com',
  'https://www.recoupafi.com',
  'https://recoupa.onrender.com'
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const u = new URL(origin);
    return (u.hostname === 'localhost' || u.hostname === '127.0.0.1') && (u.protocol === 'http:' || u.protocol === 'https:');
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const CLAIM_NUMBER_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TX_CHAINS = ['solana', 'base', 'bsc', 'robinhood'];

function randomClaimNumber() {
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += CLAIM_NUMBER_CHARS[crypto.randomInt(CLAIM_NUMBER_CHARS.length)];
  }
  return out;
}

function isValidClaimNumber(value) {
  return typeof value === 'string' && value.length === 6 &&
    [...value].every((c) => CLAIM_NUMBER_CHARS.includes(c));
}

function isValidDateFiled(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  // Not in the future (allow today).
  return d.getTime() <= Date.now();
}

function publicClaim(row) {
  return {
    id: row.id,
    claim_number: row.claim_number,
    wallet_address: row.wallet_address,
    loss_token_ca: row.loss_token_ca,
    status: row.status,
    rejection_reason: row.rejection_reason,
    tx_hash: row.tx_hash,
    tx_chain: row.tx_chain,
    created_at: row.created_at
  };
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Public claims board: every claim, newest first.
app.get('/api/claims', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM claims ORDER BY created_at DESC, id DESC'
    );
    res.json(rows.map(publicClaim));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load claims.' });
  }
});

// Public claim filing. The claim number is generated server-side; the
// optional claimNumber + dateFiled fields exist ONLY for the one-time
// migration of claims a visitor previously filed into localStorage.
app.post('/api/claims', async (req, res) => {
  try {
    const { walletAddress, lossTokenCa, claimNumber, dateFiled } = req.body || {};
    const wallet = typeof walletAddress === 'string' ? walletAddress.trim() : '';
    const ca = typeof lossTokenCa === 'string' ? lossTokenCa.trim() : '';
    if (!wallet || !ca || wallet.length > 128 || ca.length > 128) {
      return res.status(400).json({ error: 'A wallet address and a loss token CA (128 characters or fewer each) are required.' });
    }
    // Exact duplicate pending claim: same wallet + same loss token, still pending.
    const { rows: dup } = await pool.query(
      `SELECT id FROM claims WHERE wallet_address = $1 AND loss_token_ca = $2 AND status = 'pending' LIMIT 1`,
      [wallet, ca]
    );
    if (dup.length) {
      return res.status(409).json({ error: 'A claim for this wallet and loss token is already open.' });
    }
    const migrating = claimNumber !== undefined || dateFiled !== undefined;
    if (migrating) {
      if (!isValidClaimNumber(claimNumber) || !isValidDateFiled(dateFiled)) {
        return res.status(400).json({ error: 'The migrated claim number or filed date is invalid.' });
      }
      try {
        const { rows } = await pool.query(
          `INSERT INTO claims (claim_number, wallet_address, loss_token_ca, created_at)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [claimNumber, wallet, ca, `${dateFiled}T12:00:00Z`]
        );
        return res.status(201).json(publicClaim(rows[0]));
      } catch (err) {
        if (err.code === '23505') {
          return res.status(409).json({ error: 'A claim with this claim number already exists.' });
        }
        throw err;
      }
    }
    // Fresh filing: server-generated claim number, retry on collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO claims (claim_number, wallet_address, loss_token_ca)
           VALUES ($1, $2, $3) RETURNING *`,
          [randomClaimNumber(), wallet, ca]
        );
        return res.status(201).json(publicClaim(rows[0]));
      } catch (err) {
        if (err.code === '23505') continue; // claim number collision — retry
        throw err;
      }
    }
    return res.status(500).json({ error: 'Could not file the claim. Please try again.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not file the claim. Please try again.' });
  }
});

// ---------- /addy admin area ----------
// The admin password is never hardcoded, never logged, and never returned
// by any endpoint. It is set by Yemi on first visit to /addy (one-time
// setup form) and stored bcrypt-hashed in app_settings.
async function adminConfigured() {
  const hash = await getSetting('admin_password_hash');
  return !!hash;
}

function adminAuthed(req) {
  return verifyAdminToken((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
}

app.get('/api/admin/status', async (req, res) => {
  try {
    res.json({ configured: await adminConfigured() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not check admin status.' });
  }
});

app.post('/api/admin/setup', async (req, res) => {
  try {
    if (await adminConfigured()) return res.status(409).json({ error: 'An admin password is already set.' });
    const { password } = req.body || {};
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Please choose a password of 8+ characters.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO app_settings (key, value) VALUES ('admin_password_hash', $1::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [JSON.stringify(hash)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Setup failed. Please try again.' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const hash = await getSetting('admin_password_hash');
    if (!hash) return res.status(409).json({ error: 'No admin password has been set yet.' });
    const { password } = req.body || {};
    if (!(await bcrypt.compare(password || '', hash))) {
      return res.status(401).json({ error: 'Admin password is incorrect.' });
    }
    res.json({ token: signAdminToken() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/api/admin/claims', async (req, res) => {
  if (!adminAuthed(req)) return res.status(401).json({ error: 'Admin login required.' });
  try {
    const { rows } = await pool.query(
      'SELECT * FROM claims ORDER BY created_at DESC, id DESC'
    );
    res.json(rows.map(publicClaim));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load claims.' });
  }
});

app.patch('/api/admin/claims/:id', async (req, res) => {
  if (!adminAuthed(req)) return res.status(401).json({ error: 'Admin login required.' });
  try {
    const { status, rejectionReason, txHash, txChain } = req.body || {};
    if (!['rejected', 'paid', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status must be rejected, paid, or pending.' });
    }
    let reason = null;
    let hash = null;
    let chain = null;
    if (status === 'rejected') {
      reason = typeof rejectionReason === 'string' ? rejectionReason.trim() : '';
      if (!reason || reason.length > 500) {
        return res.status(400).json({ error: 'A rejection reason (500 characters or fewer) is required.' });
      }
    }
    if (status === 'paid') {
      hash = typeof txHash === 'string' ? txHash.trim() : '';
      if (!hash || hash.length > 128) {
        return res.status(400).json({ error: 'A payout transaction hash (128 characters or fewer) is required.' });
      }
      chain = txChain === undefined || txChain === null || txChain === '' ? 'solana' : txChain;
      if (!TX_CHAINS.includes(chain)) {
        return res.status(400).json({ error: 'Chain must be solana, base, bsc, or robinhood.' });
      }
    }
    const { rows } = await pool.query(
      `UPDATE claims
       SET status = $1, rejection_reason = $2, tx_hash = $3, tx_chain = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [status, reason, hash, chain, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Claim not found.' });
    res.json(publicClaim(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update the claim.' });
  }
});

const PORT = process.env.PORT || 3000;
initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => console.log(`Recoupa API listening on ${PORT}`));
}).catch((err) => {
  console.error('Database init failed', err);
  process.exit(1);
});
