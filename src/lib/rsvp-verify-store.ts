/**
 * In-memory store for RSVP SMS verification codes.
 * Key: normalized phone digits. Value: { name, code, expiresAt }.
 * For multi-instance deployments, replace with Redis/Vercel KV or Airtable.
 */

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type Pending = { name: string; code: string; expiresAt: number };

const store = new Map<string, Pending>();

export function setPending(phoneDigits: string, name: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + CODE_TTL_MS;
  store.set(phoneDigits, { name, code, expiresAt });
  return code;
}

export function verifyAndConsume(phoneDigits: string, code: string): { name: string } | null {
  const pending = store.get(phoneDigits);
  if (!pending || pending.code !== code || Date.now() > pending.expiresAt) return null;
  store.delete(phoneDigits);
  return { name: pending.name };
}
