import type { Server } from "socket.io";
export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId as string;
    socket.on("join:room", (roomId: string) => socket.join(roomId));
    socket.on("chat:send", (payload: { roomId: string; content: string }) => {
      io.to(payload.roomId).emit("chat:message", { ...payload, senderId: userId, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    });
    socket.on("join:notifications", () => socket.join("notif:" + userId));
    socket.on("disconnect", () => console.log("Disconnected:", socket.id));
  });
}
