import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Notification } from "../models/notificationSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Get all notifications for logged-in user
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    notifications,
  });
});

// Mark notification as read
export const markAsRead = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOne({ _id: id, user: userId });
  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

// Clear all notifications for user
export const clearAllNotifications = catchAsyncErrors(async (req, res, next) => {
  await Notification.deleteMany({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: "All notifications cleared",
  });
});

// Create notification (internal use by other controllers)
export const createNotification = async (userId, message, type = "system", relatedId = null) => {
  try {
    await Notification.create({
      user: userId,
      message,
      type,
      relatedId,
    });
  } catch (error) {
    // Silently fail - notifications are not critical
    console.error("Failed to create notification:", error);
  }
};
