import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Public routes - accessible without authentication
const publicRoutes = ["/auth/login", "/auth/register", "/onboarding/role"];

// Protected routes - require valid JWT authentication
const protectedRoutes = ["/", "/onboarding/student", "/onboarding/recruiter"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get("token")?.value;

  // // Check if route is public
  // const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

  // 1. No token + protected route → redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Verify JWT if token exists
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      // Token is valid

      // If valid token + auth route → redirect to home
      if (pathname.startsWith("/auth/")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Token is invalid/fake/expired
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      // On public routes, allow but token won't work for API calls
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
