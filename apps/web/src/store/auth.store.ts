import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@portal/types";

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
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
        window.location.href = "/";
      },
    }),
    { name: "auth-storage", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
