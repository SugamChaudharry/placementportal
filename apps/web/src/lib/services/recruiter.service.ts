import { api } from "../api";

export const recruiterService = {
  getDashboardStats: async () => {
    return api.get("/api/recruiter/dashboard/stats");
  },

  getDriveCandidates: async (driveId: string, filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return api.get(`/api/recruiter/drives/${driveId}/candidates${query ? `?${query}` : ""}`);
  },

  bulkUpdateStatus: async (candidateIds: string[], newStatus: string) => {
    return api.put("/api/recruiter/drives/candidates/status", {
      candidateIds,
      newStatus,
    });
  },

  aiShortlist: async (driveId: string, weights: {
    cgpa: number;
    skills: number;
    projects: number;
  }) => {
    return api.post(`/api/recruiter/drives/${driveId}/shortlist/ai`, {
      weights,
    });
  },

  scheduleBatch: async (
    driveId: string,
    candidateIds: string[],
    duration: number,
    availableSlots: string[]
  ) => {
    return api.post(`/api/recruiter/drives/${driveId}/schedule-batch`, {
      candidateIds,
      duration,
      availableSlots,
    });
  },
};
