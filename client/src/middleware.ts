// Used for redirecting to landing page if user is not authenticated
// (using connect.sid cookie)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If authenticated user is on welcome page or /, redirect to home page
  if (
    request.cookies.has('connect.sid') &&
    (request.nextUrl.pathname === '/welcome' ||
      request.nextUrl.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If unauthenticated user is on any page other than welcome page, redirect to welcome page
  else if (
    !request.cookies.has('connect.sid') &&
    request.nextUrl.pathname !== '/welcome'
  ) {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/welcome',
    '/home',
    '/trips',
    '/trips/:path',
    '/social',
    '/social/:path',
    '/leaderboard',
    '/leaderboard/:path',
    '/passport-tool',
    '/passport-tool/:path',
    '/profile',
    '/profile/:path',
  ],
};
