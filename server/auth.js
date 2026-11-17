import crypto from 'node:crypto';

// HMAC-SHA256 admin tokens, same scheme as BPN (role-tagged, 12h expiry).
// SESSION_SECRET should be set in production; without it, tokens are only
// valid for the lifetime of this process (a random per-boot secret).
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

function b64u(buf) {
  return Buffer.from(buf).toString('base64url');
}

export function signAdminToken() {
  const payload = b64u(JSON.stringify({ role: 'admin', exp: Date.now() + 1000 * 60 * 60 * 12 }));
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token) {
  try {
    const [payload, sig] = String(token || '').split('.');
    if (!payload || !sig) return false;
    const expect = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.role === 'admin' && data.exp >= Date.now();
  } catch {
    return false;
  }
}
