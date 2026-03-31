import { api } from "../api";

export const chatService = {
  getRooms: async () => {
    return api.get("/api/chat/rooms");
  },

  getDMs: async () => {
    return api.get("/api/chat/dms");
  },

  getMessages: async (roomId: string, cursor?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", String(limit));
    const query = params.toString();
    return api.get(`/api/chat/conversations/${roomId}/messages${query ? `?${query}` : ""}`);
  },

  sendMessage: async (roomId: string, content: string, type?: string) => {
    return api.post(`/api/chat/conversations/${roomId}/messages`, {
      content,
      type: type || "TEXT",
    });
  },

  searchUsers: async (query: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    params.append("q", query);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    return api.get(`/api/chat/users/search?${params.toString()}`);
  },

  markAsRead: async (roomId: string, messageIds?: string[]) => {
    return api.post(`/api/chat/conversations/${roomId}/read`, { messageIds });
  },
};
