import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = ["/auth/login", "/auth/register", "/onboarding/role"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or localStorage (we'll check cookies first)
  const token = request.cookies.get("token")?.value;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If has token and trying to access auth routes, redirect to home
  if (token && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
