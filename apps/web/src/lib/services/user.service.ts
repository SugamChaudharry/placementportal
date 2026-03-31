import { api } from "../api";

export const userService = {
  getProfile: async () => {
    return api.get("/api/users/me");
  },

  updateProfile: async (data: any) => {
    return api.put("/api/users/me", data);
  },

  completeOnboarding: async (data: any) => {
    return api.post("/api/users/onboarding", data);
  },

  getActivity: async () => {
    return api.get("/api/users/me/activity");
  },

  getColleges: async () => {
    return api.get("/api/users/colleges");
  },

  getPublicProfile: async (username: string) => {
    return api.get(`/api/users/public/${username}`);
  },
};
