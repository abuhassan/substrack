import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get the token using next-auth/jwt
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Paths that require authentication
  const isAuthRoute = request.nextUrl.pathname.startsWith("/dashboard");
  
  // Redirect to login if accessing protected route without being authenticated
  if (isAuthRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if already authenticated but trying to access login/register
  if (token && (
    request.nextUrl.pathname.startsWith("/auth/login") ||
    request.nextUrl.pathname.startsWith("/auth/register")
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
  ],
};