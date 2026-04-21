import express from "express";
import {
  createJobChatGroup,
  addMemberToJobGroup,
  getChatGroupDetails,
  getJobChatGroups,
  leaveChatGroup,
  getChatGroupMembers,
} from "../controllers/chatGroupController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Create chat group for job
router.post("/create/job", isAuthenticated, createJobChatGroup);

// Add member to job group
router.post("/add-member", isAuthenticated, addMemberToJobGroup);

// Get chat group details
router.get("/details/:groupId", isAuthenticated, getChatGroupDetails);

// Get job chat groups
router.get("/job/:jobId", isAuthenticated, getJobChatGroups);

// Get chat group members
router.get("/members/:groupId", isAuthenticated, getChatGroupMembers);

// Leave chat group
router.delete("/leave/:groupId", isAuthenticated, leaveChatGroup);

export default router;
