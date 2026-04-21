import mongoose from "mongoose";

const chatGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["job", "general"],
      default: "general",
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null, // null for non-job groups
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      sentAt: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
chatGroupSchema.index({ "members.user": 1 });
chatGroupSchema.index({ job: 1 });
chatGroupSchema.index({ type: 1, isActive: 1 });

export const ChatGroup = mongoose.model("ChatGroup", chatGroupSchema);
