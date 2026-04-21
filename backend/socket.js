import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "./models/userSchema.js";

let io = null;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.cookie?.split("token=")[1]?.split(";")[0];

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed: " + error.message));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.user.name})`);

    // Join user's personal room for direct messages
    socket.join(`user_${socket.userId}`);

    // Handle joining a chat group
    socket.on("join_group", async (data) => {
      const { groupId } = data;
      socket.join(`group_${groupId}`);
      console.log(`User ${socket.userId} joined group ${groupId}`);

      // Notify other members
      socket.to(`group_${groupId}`).emit("user_joined", {
        groupId,
        userId: socket.userId,
        userName: socket.user.name,
      });
    });

    // Handle leaving a chat group
    socket.on("leave_group", (data) => {
      const { groupId } = data;
      socket.leave(`group_${groupId}`);
      console.log(`User ${socket.userId} left group ${groupId}`);

      // Notify other members
      socket.to(`group_${groupId}`).emit("user_left", {
        groupId,
        userId: socket.userId,
        userName: socket.user.name,
      });
    });

    // Handle typing indicator for direct messages
    socket.on("typing_direct", (data) => {
      const { recipientId } = data;
      socket.to(`user_${recipientId}`).emit("typing", {
        userId: socket.userId,
        userName: socket.user.name,
        type: "direct",
      });
    });

    // Handle typing indicator for group messages
    socket.on("typing_group", (data) => {
      const { groupId } = data;
      socket.to(`group_${groupId}`).emit("typing", {
        userId: socket.userId,
        userName: socket.user.name,
        type: "group",
        groupId,
      });
    });

    // Handle stop typing
    socket.on("stop_typing", (data) => {
      const { recipientId, groupId } = data;
      if (recipientId) {
        socket.to(`user_${recipientId}`).emit("stop_typing", {
          userId: socket.userId,
        });
      } else if (groupId) {
        socket.to(`group_${groupId}`).emit("stop_typing", {
          userId: socket.userId,
          groupId,
        });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
