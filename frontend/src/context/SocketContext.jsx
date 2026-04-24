import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Context as AuthContext } from "../main";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthorized, user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthorized && user) {
      // Get token from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      };

      const token = getCookie("token");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
      // Socket.io needs the base URL without /api/v1 path
      const socketUrl = apiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

      const newSocket = io(socketUrl, {
        withCredentials: true,
        auth: { token },
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthorized, user]);

  const joinGroup = (groupId) => {
    if (socket && isConnected) {
      socket.emit("join_group", { groupId });
    }
  };

  const leaveGroup = (groupId) => {
    if (socket && isConnected) {
      socket.emit("leave_group", { groupId });
    }
  };

  const sendDirectMessage = (recipientId, content, callback) => {
    if (socket && isConnected) {
      socket.emit("send_direct_message", { recipientId, content }, callback);
    }
  };

  const sendGroupMessage = (groupId, content, callback) => {
    if (socket && isConnected) {
      socket.emit("send_group_message", { groupId, content }, callback);
    }
  };

  const emitTyping = (recipientId) => {
    if (socket && isConnected) {
      socket.emit("typing_direct", { recipientId });
    }
  };

  const emitGroupTyping = (groupId) => {
    if (socket && isConnected) {
      socket.emit("typing_group", { groupId });
    }
  };

  const emitStopTyping = (recipientId, groupId) => {
    if (socket && isConnected) {
      socket.emit("stop_typing", { recipientId, groupId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinGroup,
        leaveGroup,
        sendDirectMessage,
        sendGroupMessage,
        emitTyping,
        emitGroupTyping,
        emitStopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
