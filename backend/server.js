import http from "http";
import app from "./app.js";
import cloudinary from "cloudinary";
import { initializeSocket } from "./socket.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // CLOUDINARY_CLIENT_NAME
  api_key: process.env.CLOUDINARY_API_KEY,       // CLOUDINARY_CLIENT_API
  api_secret: process.env.CLOUDINARY_API_SECRET, // CLOUDINARY_CLIENT_SECRET
});

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
