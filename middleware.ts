import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { getIronSessionOptions } from '@/lib/session';
import type { SessionData } from '@/lib/types';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and login API through without auth check
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/logout')
  ) {
    return NextResponse.next();
  }

  let sessionOptions;
  try {
    sessionOptions = getIronSessionOptions();
  } catch {
    return new NextResponse(
      'Admin is unavailable: set SESSION_SECRET in the server environment (must be at least 32 characters).',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    );
  }

  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isAdmin) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
