import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
}

function dbNameOf(url) {
  try { return new URL(url).pathname.replace(/^\//, ''); } catch { return ''; }
}

function withDbName(url, name) {
  const u = new URL(url);
  u.pathname = `/${name}`;
  return u.toString();
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTables(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS claims (
      id SERIAL PRIMARY KEY,
      claim_number CHAR(6) UNIQUE NOT NULL,
      wallet_address TEXT NOT NULL,
      loss_token_ca TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rejected', 'paid', 'hidden')),
      rejection_reason TEXT,
      tx_hash TEXT,
      tx_chain TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_claims_created ON claims(created_at DESC, id DESC);
    CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
    -- Migration (Nov 2026): 'hidden' claim status. CREATE TABLE IF NOT
    -- EXISTS never alters the live table, so the CHECK is replaced here
    -- on every boot (idempotent).
    ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;
    ALTER TABLE claims ADD CONSTRAINT claims_status_check
      CHECK (status IN ('pending', 'rejected', 'paid', 'hidden'));
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT NOT NULL,
      project TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC, id DESC);
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

// Boot: create the tables, creating the database itself first if it does
// not exist yet (first boot on a shared server). The maintenance
// connection goes to the `postgres` database on the same server.
export async function initDb() {
  try {
    await createTables(pool);
    return;
  } catch (err) {
    if (err.code !== '3D000') throw err;
  }
  const target = dbNameOf(process.env.DATABASE_URL);
  if (!target) throw new Error('DATABASE_URL has no database name');
  const maintUrl = withDbName(process.env.DATABASE_URL, 'postgres');
  const maint = new pg.Client({ connectionString: maintUrl, ssl: { rejectUnauthorized: false } });
  await maint.connect();
  try {
    await maint.query(`CREATE DATABASE "${target.replace(/"/g, '')}"`);
  } catch (err) {
    // 42P04 = database already exists (raced creation) — safe to proceed.
    if (err.code !== '42P04') throw err;
  } finally {
    await maint.end();
  }
  await createTables(pool);
}

export async function getSetting(key) {
  const { rows } = await pool.query('SELECT value FROM app_settings WHERE key = $1', [key]);
  return rows.length ? rows[0].value : null;
}
