import express from "express";
import { login, register, logout, getUser, getAllJobSeekers, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);
router.get("/jobseekers", isAuthenticated, getAllJobSeekers);
router.put("/update", isAuthenticated, updateProfile);

export default router;
