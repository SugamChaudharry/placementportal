import express from "express";
import dbConnection  from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import chatGroupRouter from "./routes/chatGroupRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import oauthRouter from "./routes/oauthRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { initializePassport } from "./config/passport.js";

const app = express();
config({ path: "./.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
initializePassport();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);
app.use("/api/v1/auth", oauthRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chat", chatGroupRouter);
app.use("/api/v1/notifications", notificationRouter);

// Health check and API routes documentation endpoint
app.get("/", (req, res) => {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  };

  const apiRoutes = {
    base: "/api/v1",
    endpoints: [
      { path: "/", method: "GET", description: "Health check and API info" },
      { path: "/auth/*", method: " Various", description: "OAuth authentication routes (Google, GitHub, etc.)" },
      { path: "/user/*", method: "Various", description: "User management (register, login, profile, update)" },
      { path: "/job/*", method: "Various", description: "Job postings (create, list, update, delete, search)" },
      { path: "/application/*", method: "Various", description: "Job applications (apply, status, history)" },
      { path: "/message/*", method: "Various", description: "Messaging system (send, receive, conversations)" },
      { path: "/chat/*", method: "Various", description: "Chat groups management" },
      { path: "/notifications/*", method: "Various", description: "User notifications" },
    ],
  };

  res.status(200).json({
    message: "Placement Portal API Server",
    health: healthStatus,
    api: apiRoutes,
    documentation: "Visit /api/v1/* endpoints for specific resources",
  });
});

dbConnection();

app.use(errorMiddleware);
export default app;
