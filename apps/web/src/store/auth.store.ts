import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@portal/types";
import { setTokenCookie, removeTokenCookie } from "@/lib/cookies";
import { api } from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        setTokenCookie(token);
        set({ user, token });
      },
      logout: async () => {
        try {
          await api.delete("/auth/logout");
        } catch {
          // Continue with local cleanup even if server logout fails
        }
        localStorage.removeItem("token");
        removeTokenCookie();
        set({ user: null, token: null });
        window.location.href = "/auth/login";
      },
    }),
    { name: "auth-storage", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
