import { NextResponse } from 'next/server';
import { createAdminSessionToken, getAdminSessionCookieName } from '@/lib/admin-session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: 'Missing ADMIN_PASSWORD' }, { status: 500 });
    }

    if (!password || password !== expected) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { token, maxAgeSeconds } = createAdminSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(getAdminSessionCookieName(), token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: maxAgeSeconds,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Login failed', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

