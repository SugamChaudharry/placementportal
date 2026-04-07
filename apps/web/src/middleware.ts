import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // No token - redirect to login (except auth pages)
  if (!token) {
    if (pathname.startsWith("/auth/")) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Decode without crypto verification (~0.1ms vs ~5ms for jwtVerify)
    const payload = decodeJwt(token);
    const needsOnboarding = Boolean(payload.needsOnboarding);
    const isOnboardingRoute = pathname.startsWith("/onboarding/");
    const verificationStatus = payload.verificationStatus as string | undefined;
    const isPendingVerification = verificationStatus === "PENDING";

    // Logged-in users on auth pages → redirect to home
    if (pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Pending verification recruiters - only allow access to pending verification page
    if (isPendingVerification) {
      if (pathname === "/onboarding/pending-verification") {
        return NextResponse.next();
      }
      // Redirect all other routes to pending verification page
      return NextResponse.redirect(new URL("/onboarding/pending-verification", request.url));
    }

    // Onboarded users on onboarding routes → redirect to home
    if (isOnboardingRoute && !needsOnboarding) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // New users on protected routes → redirect to onboarding
    if (!isOnboardingRoute && needsOnboarding) {
      return NextResponse.redirect(new URL("/onboarding/role", request.url));
    }
  } catch {
    // Invalid token format - clear and redirect
    const res = NextResponse.redirect(new URL("/auth/login", request.url));
    res.cookies.delete("token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",                    // Home
    "/auth/:path*",         // Auth pages (for redirect if logged in)
    "/onboarding",           // Onboarding base
    "/onboarding/:path*",   // Onboarding routes
    "/dashboard/:path*",    // App routes
    "/student/:path*",
    "/recruiter/:path*",
  ],
};
