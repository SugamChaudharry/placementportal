import { api } from "../api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "recruiter", "admin"]).optional(),
});

export const googleSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  googleId: z.string(),
  role: z.enum(["student", "recruiter", "admin"]).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type GoogleCredentials = z.infer<typeof googleSchema>;
export type ForgotPasswordCredentials = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  needsOnboarding?: boolean;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const validated = loginSchema.parse(credentials);
    const response = await api.post<AuthResponse>("/api/auth/login", validated);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const validated = registerSchema.parse(credentials);
    const response = await api.post<AuthResponse>("/api/auth/register", validated);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  google: async (credentials: GoogleCredentials): Promise<AuthResponse> => {
    const validated = googleSchema.parse(credentials);
    const response = await api.post<AuthResponse>("/api/auth/google", validated);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const validated = forgotPasswordSchema.parse({ email });
    const response = await api.post<{ message: string }>("/api/auth/forgot-password", validated);
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const validated = resetPasswordSchema.parse({ token, newPassword });
    const response = await api.post<{ message: string }>("/api/auth/reset-password", validated);
    return response.data;
  },

  getMe: async (): Promise<AuthResponse["user"]> => {
    const response = await api.get<AuthResponse["user"]>("/api/auth/me");
    return response.data;
  },

  updateRole: async (role: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/auth/update-role", { role });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },
};
