import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // Allow access to login and public pages
  const publicPaths = ['/', '/login', '/pricing', '/demo'];
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Block access to premium routes without a subscription
  const protectedPaths = ['/create', '/chat'];
  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    const res = await fetch(`${req.nextUrl.origin}/api/user/subscription`, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    });

    const data = await res.json();

    if (!data.subscription || data.subscription.status !== 'active') {
      return NextResponse.redirect(new URL('/pricing', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create', '/chat/:path*'],
};
