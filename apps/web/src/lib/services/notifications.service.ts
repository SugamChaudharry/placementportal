import { api } from "../api";

export interface Notification {
  id: string;
  type: "SUCCESS" | "INFO" | "WARNING" | "ERROR";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export const notificationsService = {
  getNotifications: async (options?: {
    unread_only?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return api.get(`/api/notifications${query ? `?${query}` : ""}`);
  },

  markAsRead: async (ids?: string[]) => {
    return api.put("/api/notifications/read", { ids });
  },

  markAllAsRead: async () => {
    return api.put("/api/notifications/read", {});
  },

  getSettings: async () => {
    return api.get("/api/notifications/settings");
  },

  updateSettings: async (settings: any) => {
    return api.put("/api/notifications/settings", settings);
  },
};
