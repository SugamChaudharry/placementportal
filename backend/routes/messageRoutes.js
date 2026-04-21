import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
  getDirectChatHistory,
  getGroupChatHistory,
  getUserChats,
  markMessagesAsRead,
  searchUsers,
} from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Send messages
router.post("/send/direct", isAuthenticated, sendDirectMessage);
router.post("/send/group", isAuthenticated, sendGroupMessage);

// Get chat history
router.get("/history/direct/:userId", isAuthenticated, getDirectChatHistory);
router.get("/history/group/:groupId", isAuthenticated, getGroupChatHistory);

// Get all chats
router.get("/chats", isAuthenticated, getUserChats);

// Mark as read
router.put("/read", isAuthenticated, markMessagesAsRead);

// Search users
router.get("/search", isAuthenticated, searchUsers);

export default router;
