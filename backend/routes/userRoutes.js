import express from "express";
import { login, register, logout, getUser, getAllJobSeekers, updateProfile, getPublicProfile, getBookmarks, addBookmark, removeBookmark } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);
router.get("/jobseekers", isAuthenticated, getAllJobSeekers);
router.put("/update", isAuthenticated, updateProfile);
router.get("/profile/:id", isAuthenticated, getPublicProfile);

// Bookmark routes
router.get("/bookmarks", isAuthenticated, getBookmarks);
router.post("/bookmarks/:jobId", isAuthenticated, addBookmark);
router.delete("/bookmarks/:jobId", isAuthenticated, removeBookmark);

export default router;
