import { api } from "../api";

export const meetingsService = {
  getUpcoming: async () => {
    return api.get("/api/meetings/upcoming");
  },

  getMeeting: async (id: string) => {
    return api.get(`/api/meetings/${id}`);
  },

  join: async (id: string) => {
    return api.post(`/api/meetings/${id}/join`, {});
  },

  submitFeedback: async (id: string, data: {
    rating: number;
    notes?: string;
    privateScorecard?: any;
  }) => {
    return api.post(`/api/meetings/${id}/feedback`, data);
  },

  reschedule: async (id: string, newTime: string, reason: string) => {
    return api.put(`/api/meetings/${id}/reschedule`, { newTime, reason });
  },
};
