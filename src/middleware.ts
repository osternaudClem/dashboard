import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

// Define the protected routes
const protectedRoutes = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the requested path is under `/dashboard`
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // If user is not logged in and tries to access a protected route, redirect to /login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Continue as normal
  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: '/dashboard/:path*', // Apply middleware to all paths under `/dashboard`
};
