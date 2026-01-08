import crypto from 'crypto';

const COOKIE_NAME = 'tare_admin_session';

type SessionPayload = {
  iat: number;
  exp: number;
};

function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function base64urlDecode(input: string): string {
  const padLength = (4 - (input.length % 4)) % 4;
  const padded = input.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat(padLength);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('Missing ADMIN_SESSION_SECRET');
  }
  return secret;
}

export function getAdminSessionCookieName() {
  return COOKIE_NAME;
}

export function createAdminSessionToken(options?: { maxAgeSeconds?: number }) {
  const now = Math.floor(Date.now() / 1000);
  const maxAgeSeconds = options?.maxAgeSeconds ?? 60 * 60 * 24 * 7; // 7 days
  const payload: SessionPayload = { iat: now, exp: now + maxAgeSeconds };
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const sig = sign(payloadB64, getSecret());
  const token = `${payloadB64}.${sig}`;
  return { token, maxAgeSeconds };
}

export function isAdminSessionValidFromRequest(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1];
  if (!token) return false;

  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;

  const expectedSig = sign(payloadB64, getSecret());
  // Constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const payloadJson = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadJson) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return false;
    return true;
  } catch {
    return false;
  }
}

