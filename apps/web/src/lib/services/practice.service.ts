import { api } from "../api";

export const practiceService = {
  getProblems: async (filters?: {
    difficulty?: string;
    tags?: string[];
    company?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(","));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const query = params.toString();
    return api.get(`/api/practice/problems${query ? `?${query}` : ""}`);
  },

  getProblem: async (id: string) => {
    return api.get(`/api/practice/problems/${id}`);
  },

  runCode: async (problemId: string, code: string, language: string) => {
    return api.post(`/api/practice/problems/${problemId}/run`, {
      code,
      language,
    });
  },

  submitSolution: async (problemId: string, code: string, language: string) => {
    return api.post(`/api/practice/problems/${problemId}/submit`, {
      code,
      language,
    });
  },

  getSolution: async (id: string) => {
    return api.get(`/api/practice/problems/${id}/solution`);
  },

  getHint: async (id: string, attemptCount: number) => {
    return api.post(`/api/practice/problems/${id}/hint`, { attemptCount });
  },

  getLeaderboard: async (period?: string, branch?: string) => {
    const params = new URLSearchParams();
    if (period) params.append("period", period);
    if (branch) params.append("branch", branch);
    const query = params.toString();
    return api.get(`/api/practice/leaderboard${query ? `?${query}` : ""}`);
  },

  getStreak: async () => {
    return api.get("/api/practice/dashboard/streak");
  },
};
