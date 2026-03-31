import type { Server } from "socket.io";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId as string;
    const userRole = socket.handshake.auth.role as string;

    console.log(`[Socket] User ${userId} (${userRole}) connected: ${socket.id}`);

    // Join room
    socket.on("join:room", (roomId: string) => {
      socket.join(roomId);
      console.log(`[Socket] ${socket.id} joined room: ${roomId}`);
    });

    // Leave room
    socket.on("leave:room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`[Socket] ${socket.id} left room: ${roomId}`);
    });

    // Chat message
    socket.on("chat:send", (payload: { roomId: string; content: string; type?: string }) => {
      io.to(payload.roomId).emit("chat:message", {
        ...payload,
        senderId: userId,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    });

    // Typing indicator
    socket.on("chat:typing", (payload: { roomId: string; isTyping: boolean }) => {
      socket.to(payload.roomId).emit("chat:typing", {
        userId,
        isTyping: payload.isTyping,
      });
    });

    // Mark messages as read
    socket.on("chat:read", (payload: { roomId: string; messageIds: string[] }) => {
      io.to(payload.roomId).emit("chat:read", {
        userId,
        messageIds: payload.messageIds,
        readAt: new Date().toISOString(),
      });
    });

    // Join notifications room
    socket.on("join:notifications", () => {
      socket.join(`notif:${userId}`);
      console.log(`[Socket] ${socket.id} joined notifications`);
    });

    // Proctoring: flag event (from student browser)
    socket.on("proctor:flag", (payload: {
      testId: string;
      type: "TAB_SWITCH" | "FACE_NOT_DETECTED" | "FULLSCREEN_EXIT";
      timestamp: string;
    }) => {
      // Broadcast to recruiter's monitor dashboard
      io.to(`monitor:${payload.testId}`).emit("monitor:flag", {
        studentId: userId,
        ...payload,
      });
    });

    // Monitor: join test monitoring (for recruiters)
    socket.on("monitor:join", (testId: string) => {
      if (userRole === "recruiter" || userRole === "admin") {
        socket.join(`monitor:${testId}`);
        console.log(`[Socket] ${socket.id} joined monitor for test: ${testId}`);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}
