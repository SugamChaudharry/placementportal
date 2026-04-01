import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@portal/types";
import { setTokenCookie, removeTokenCookie } from "@/lib/cookies";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        setTokenCookie(token); // Also set cookie for middleware
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("token");
        removeTokenCookie(); // Also remove cookie
        set({ user: null, token: null });
        window.location.href = "/auth/login";
      },
    }),
    { name: "auth-storage", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
