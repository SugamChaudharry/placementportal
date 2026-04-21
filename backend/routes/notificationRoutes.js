import express from "express";
import { getNotifications, markAsRead, clearAllNotifications } from "../controllers/notificationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.patch("/:id/read", isAuthenticated, markAsRead);
router.delete("/", isAuthenticated, clearAllNotifications);

export default router;
