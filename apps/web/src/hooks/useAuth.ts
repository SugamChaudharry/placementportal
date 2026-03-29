import { useAuthStore } from "@/store/auth.store";
export function useAuth() {
  const { user, token, setAuth, logout } = useAuthStore();
  return { user, token, isAuthenticated: !!token, role: user?.role, setAuth, logout };
}
