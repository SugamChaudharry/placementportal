import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { ChatGroup } from "../models/chatGroupSchema.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { getIO } from "../socket.js";

// Create a job chat group (called when job is created or first application)
export const createJobChatGroup = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.body;
  const employerId = req.user._id;

  if (!jobId) {
    return next(new ErrorHandler("Job ID is required", 400));
  }

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  // Check if group already exists for this job
  let chatGroup = await ChatGroup.findOne({ job: jobId, type: "job" });

  if (chatGroup) {
    return res.status(200).json({
      success: true,
      message: "Chat group already exists",
      chatGroup,
    });
  }

  // Create new chat group
  chatGroup = await ChatGroup.create({
    name: `${job.title} - Applicants`,
    description: `Discussion group for ${job.title} position`,
    type: "job",
    job: jobId,
    creator: employerId,
    members: [
      {
        user: employerId,
        role: "admin",
        joinedAt: new Date(),
      },
    ],
  });

  const populatedGroup = await ChatGroup.findById(chatGroup._id)
    .populate("creator", "name email")
    .populate("job", "title companyName");

  res.status(201).json({
    success: true,
    message: "Job chat group created",
    chatGroup: populatedGroup,
  });
});

// Add member to job chat group (called when applicant applies)
export const addMemberToJobGroup = catchAsyncErrors(async (req, res, next) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    return next(new ErrorHandler("Job ID and User ID are required", 400));
  }

  // Find or create chat group
  let chatGroup = await ChatGroup.findOne({ job: jobId, type: "job" });

  if (!chatGroup) {
    // Create group if doesn't exist
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    chatGroup = await ChatGroup.create({
      name: `${job.title} - Applicants`,
      description: `Discussion group for ${job.title} position`,
      type: "job",
      job: jobId,
      creator: job.postedBy,
      members: [
        {
          user: job.postedBy,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    });
  }

  // Check if user is already a member
  const isMember = chatGroup.members.some(
    (m) => m.user.toString() === userId.toString()
  );

  if (isMember) {
    return res.status(200).json({
      success: true,
      message: "User is already a member",
      chatGroup,
    });
  }

  // Add member
  chatGroup.members.push({
    user: userId,
    role: "member",
    joinedAt: new Date(),
  });

  await chatGroup.save();

  const populatedGroup = await ChatGroup.findById(chatGroup._id)
    .populate("creator", "name email")
    .populate("members.user", "name email role")
    .populate("job", "title companyName");

  // Notify via socket
  const io = getIO();
  io.to(`group_${chatGroup._id}`).emit("member_joined", {
    groupId: chatGroup._id,
    userId,
  });

  res.status(200).json({
    success: true,
    message: "Member added to group",
    chatGroup: populatedGroup,
  });
});

// Get chat group details
export const getChatGroupDetails = catchAsyncErrors(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const chatGroup = await ChatGroup.findById(groupId)
    .populate("creator", "name email")
    .populate("members.user", "name email role")
    .populate("job", "title companyName description");

  if (!chatGroup) {
    return next(new ErrorHandler("Chat group not found", 404));
  }

  // Check if user is a member
  const isMember = chatGroup.members.some(
    (m) => m.user._id.toString() === userId.toString()
  );

  if (!isMember) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }

  res.status(200).json({
    success: true,
    chatGroup,
  });
});

// Get all chat groups for a job
export const getJobChatGroups = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const chatGroups = await ChatGroup.find({
    job: jobId,
    isActive: true,
    "members.user": userId,
  })
    .populate("creator", "name email")
    .populate("members.user", "name email role")
    .populate("job", "title companyName");

  res.status(200).json({
    success: true,
    count: chatGroups.length,
    chatGroups,
  });
});

// Leave chat group
export const leaveChatGroup = catchAsyncErrors(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const chatGroup = await ChatGroup.findById(groupId);
  if (!chatGroup) {
    return next(new ErrorHandler("Chat group not found", 404));
  }

  // Check if user is a member
  const memberIndex = chatGroup.members.findIndex(
    (m) => m.user.toString() === userId.toString()
  );

  if (memberIndex === -1) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }

  // Remove user from members
  chatGroup.members.splice(memberIndex, 1);

  // If no members left, deactivate group
  if (chatGroup.members.length === 0) {
    chatGroup.isActive = false;
  }

  await chatGroup.save();

  // Notify via socket
  const io = getIO();
  io.to(`group_${groupId}`).emit("member_left", {
    groupId,
    userId,
  });

  res.status(200).json({
    success: true,
    message: "Left chat group successfully",
  });
});

// Get all members of a chat group
export const getChatGroupMembers = catchAsyncErrors(async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const chatGroup = await ChatGroup.findById(groupId)
    .populate("members.user", "_id name email phone role createdAt");

  if (!chatGroup) {
    return next(new ErrorHandler("Chat group not found", 404));
  }

  // Check if user is a member
  const isMember = chatGroup.members.some(
    (m) => m.user._id.toString() === userId.toString()
  );

  if (!isMember) {
    return next(new ErrorHandler("You are not a member of this group", 403));
  }

  res.status(200).json({
    success: true,
    count: chatGroup.members.length,
    members: chatGroup.members,
  });
});
