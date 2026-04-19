import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { getIronSessionOptions } from '@/lib/session';
import type { SessionData } from '@/lib/types';

export async function POST(req: NextRequest) {
  let sessionOptions;
  try {
    sessionOptions = getIronSessionOptions();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.destroy();
  return res;
}
