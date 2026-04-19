import type { SessionOptions } from 'iron-session';
import type { SessionData } from './types';

const MIN_SECRET_LENGTH = 32;

/** iron-session rejects shorter secrets; validate before calling getIronSession. */
export function getIronSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (typeof password !== 'string' || password.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `iron-session: SESSION_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters long.`,
    );
  }
  return {
    password,
    cookieName: 'lodha_admin_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

export type { SessionData };
