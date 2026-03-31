import { api } from "../api";

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  ctc: string;
  type: string;
  skills: string[];
  deadline: string;
  minCgpa: number;
  branches: string[];
  maxBacklogs: number;
  status: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
    color?: string;
  };
}

export interface JobFilters {
  q?: string;
  type?: string;
  location?: string;
  ctc_min?: number;
  ctc_max?: number;
  skills?: string[];
  company?: string;
  eligible_only?: boolean;
}

export const jobsService = {
  getJobs: async (filters?: JobFilters & { page?: number; limit?: number }) => {
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
    return api.get(`/api/jobs${query ? `?${query}` : ""}`);
  },

  getJob: async (id: string) => {
    return api.get(`/api/jobs/${id}`);
  },

  getRecommended: async () => {
    return api.get("/api/jobs/recommended");
  },

  apply: async (jobId: string) => {
    return api.post(`/api/jobs/${jobId}/apply`, {});
  },

  save: async (jobId: string) => {
    return api.post(`/api/jobs/${jobId}/save`, {});
  },

  unsave: async (jobId: string) => {
    return api.delete(`/api/jobs/${jobId}/save`);
  },

  getSaved: async () => {
    return api.get("/api/jobs/saved");
  },

  getApplied: async () => {
    return api.get("/api/applications");
  },
};
