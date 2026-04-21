import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for group messages
    },
    chatGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatGroup",
      default: null, // null for direct messages
    },
    messageType: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "file"],
        },
        url: String,
        name: String,
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ chatGroup: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
