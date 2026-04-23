import express from "express";
import { login, register, logout, getUser, getAllJobSeekers, updateProfile, getPublicProfile, getBookmarks, addBookmark, removeBookmark, completeOAuthProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);
router.get("/jobseekers", isAuthenticated, getAllJobSeekers);
router.put("/update", isAuthenticated, updateProfile);
router.get("/profile/:id", isAuthenticated, getPublicProfile);

// Bookmark routes
router.get("/bookmarks", isAuthenticated, getBookmarks);
router.post("/bookmarks/:jobId", isAuthenticated, addBookmark);
router.delete("/bookmarks/:jobId", isAuthenticated, removeBookmark);

// OAuth profile completion route
router.put("/complete-oauth-profile", isAuthenticated, completeOAuthProfile);

export default router;
