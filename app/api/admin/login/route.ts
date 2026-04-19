import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { timingSafeEqual } from 'crypto';
import { getIronSessionOptions } from '@/lib/session';
import type { SessionData } from '@/lib/types';

function safeStringEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 }); }
  const { password } = body as { password?: string };
  if (!password) return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 });
  const plain = process.env.ADMIN_PASSWORD;
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!plain && !hash) {
    return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
  }

  const valid = plain ? safeStringEqual(password, plain) : await bcrypt.compare(password, hash!);
  if (!valid) return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });

  let sessionOptions;
  try {
    sessionOptions = getIronSessionOptions();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server configuration error: SESSION_SECRET must be at least 32 characters.' },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ success: true });
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.isAdmin = true;
  await session.save();
  return res;
}
