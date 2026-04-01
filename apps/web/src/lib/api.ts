import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Redirect to login on 401 (except for auth endpoints to avoid redirect loops)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      // Skip redirect for auth endpoints to let pages handle errors properly
      const requestUrl = err.config?.url || "";
      const isAuthEndpoint = 
        requestUrl.includes("/auth/login") || 
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/google") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/reset-password");
      
      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);
