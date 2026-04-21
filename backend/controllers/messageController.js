import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Message } from "../models/messageSchema.js";
import { ChatGroup } from "../models/chatGroupSchema.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { getIO } from "../socket.js";

// Send a direct message
export const sendDirectMessage = catchAsyncErrors(async (req, res, next) => {
  const { recipientId, content } = req.body;
  const senderId = req.user._id;

  if (!recipientId || !content) {
    return next(new ErrorHandler("Recipient and content are required", 400));
  }

  // Verify recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(new ErrorHandler("Recipient not found", 404));
  }

  const message = await Message.create({
    content,
    sender: senderId,
    recipient: recipientId,
    messageType: "direct",
  });

  // Populate sender info
  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name email role")
    .populate("recipient", "name email role");

  // Emit to recipient via socket
  const io = getIO();
  if (io) {
    io.to(`user_${recipientId}`).emit("receive_message", {
      type: "direct",
      message: populatedMessage,
    });
  }

  res.status(201).json({
    success: true,
    message: populatedMessage,
  });
});

// Send a group message
export const sendGroupMessage = catchAsyncErrors(async (req, res, next) => {
  const { chatGroupId, content } = req.body;
  const senderId = req.user._id;

  if (!chatGroupId || !content) {
    return next(new ErrorHandler("Chat group and content are required", 400));
  }

  // Verify chat group exists and user is a member
  const chatGroup = await ChatGroup.findById(chatGroupId);
  if (!chatGroup) {
    return next(new ErrorHandler("Chat group not found", 404));
  }

  const isMember = chatGroup.members.some(
    (m) => m.user.toString() === senderId.toString()
  );
  if (!isMember) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }

  const message = await Message.create({
    content,
    sender: senderId,
    chatGroup: chatGroupId,
    messageType: "group",
  });

  // Populate sender info
  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name email role");

  // Update last message in chat group
  chatGroup.lastMessage = {
    content,
    sender: senderId,
    sentAt: new Date(),
  };
  await chatGroup.save();

  // Emit to all group members via socket
  const io = getIO();
  if (io) {
    io.to(`group_${chatGroupId}`).emit("receive_message", {
      type: "group",
      groupId: chatGroupId,
      message: populatedMessage,
    });
  }

  res.status(201).json({
    success: true,
    message: populatedMessage,
  });
});

// Get direct chat history between two users
export const getDirectChatHistory = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;
  const { page = 1, limit = 50 } = req.query;

  const messages = await Message.find({
    messageType: "direct",
    $or: [
      { sender: currentUserId, recipient: userId },
      { sender: userId, recipient: currentUserId },
    ],
  })
    .populate("sender", "name email role")
    .populate("recipient", "name email role")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Message.countDocuments({
    messageType: "direct",
    $or: [
      { sender: currentUserId, recipient: userId },
      { sender: userId, recipient: currentUserId },
    ],
  });

  res.status(200).json({
    success: true,
    messages: messages.reverse(),
    total,
    page: page * 1,
    pages: Math.ceil(total / limit),
  });
});

// Get group chat history
export const getGroupChatHistory = catchAsyncErrors(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;
  const { page = 1, limit = 50 } = req.query;

  // Verify user is a member
  const chatGroup = await ChatGroup.findById(groupId);
  if (!chatGroup) {
    return next(new ErrorHandler("Chat group not found", 404));
  }

  const isMember = chatGroup.members.some(
    (m) => m.user.toString() === userId.toString()
  );
  if (!isMember) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }

  const messages = await Message.find({
    chatGroup: groupId,
    messageType: "group",
  })
    .populate("sender", "name email role")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Message.countDocuments({
    chatGroup: groupId,
    messageType: "group",
  });

  res.status(200).json({
    success: true,
    messages: messages.reverse(),
    total,
    page: page * 1,
    pages: Math.ceil(total / limit),
  });
});

// Get all user's chats (direct and groups)
export const getUserChats = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // Get user's chat groups
  const chatGroups = await ChatGroup.find({
    "members.user": userId,
    isActive: true,
  })
    .populate("creator", "name email")
    .populate("members.user", "name email role")
    .populate("job", "title companyName")
    .sort({ updatedAt: -1 });

  // Get recent direct message partners
  const directMessages = await Message.aggregate([
    {
      $match: {
        messageType: "direct",
        $or: [{ sender: userId }, { recipient: userId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$sender", userId] },
            then: "$recipient",
            else: "$sender",
          },
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$sender", userId] },
                  {
                    $not: {
                      $in: [userId, "$readBy.user"],
                    },
                  },
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          role: "$user.role",
        },
        lastMessage: 1,
        unreadCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    chatGroups,
    directChats: directMessages,
  });
});

// Mark messages as read
export const markMessagesAsRead = catchAsyncErrors(async (req, res, next) => {
  const { chatType, chatId } = req.body;
  const userId = req.user._id;

  let query = {};
  if (chatType === "direct") {
    query = {
      messageType: "direct",
      sender: chatId,
      recipient: userId,
    };
  } else if (chatType === "group") {
    query = {
      messageType: "group",
      chatGroup: chatId,
      sender: { $ne: userId },
    };
  }

  await Message.updateMany(
    { ...query, "readBy.user": { $ne: userId } },
    { $push: { readBy: { user: userId, readAt: new Date() } } }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });
});

// Search users for chat
export const searchUsers = catchAsyncErrors(async (req, res, next) => {
  const { query } = req.query;
  const currentUserId = req.user._id;

  if (!query || query.length < 2) {
    return next(new ErrorHandler("Search query must be at least 2 characters", 400));
  }

  const users = await User.find({
    $and: [
      { _id: { $ne: currentUserId } },
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      },
    ],
  })
    .select("_id name email phone role createdAt")
    .limit(20);

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});
