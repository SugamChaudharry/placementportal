// Cookie utilities for auth token storage
// Using cookies allows server-side middleware to read token

const TOKEN_COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Set token cookie (works in browser)
 * Note: httpOnly flag is NOT set so client JS can read it too
 */
export function setTokenCookie(token: string): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get token from cookie
 */
export function getTokenCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === TOKEN_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return undefined;
}

/**
 * Remove token cookie (logout)
 */
export function removeTokenCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${TOKEN_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}
