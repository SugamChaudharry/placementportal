import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: [true, "Please provide a notification message."],
  },
  type: {
    type: String,
    enum: ["job", "application", "message", "system"],
    default: "system",
  },
  relatedId: {
    type: mongoose.Schema.ObjectId,
    // refPath removed - relatedId is a generic ObjectId that can reference
    // Job, Application, or Message collections as needed by the application logic
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
