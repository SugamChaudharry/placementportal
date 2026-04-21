import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form !"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered !"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered Sucessfully !");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role !"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password !", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found !`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In Sucessfully !");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
    .json({
      success: true,
      message: "Logged Out Successfully !",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  // Sanitize user data to remove sensitive fields
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  res.status(200).json({
    success: true,
    user: sanitizedUser,
  });
});

export const getAllJobSeekers = catchAsyncErrors(async (req, res, next) => {
  const jobSeekers = await User.find({ role: "Job Seeker" }).select(
    "_id name email phone role createdAt"
  );

  res.status(200).json({
    success: true,
    count: jobSeekers.length,
    jobSeekers,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, phone, currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Update basic info
  if (name) user.name = name;
  if (phone) user.phone = phone;

  // Update password if provided
  if (currentPassword && newPassword) {
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }
    user.password = newPassword;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

// Get public profile by ID
export const getPublicProfile = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select("_id name email phone role createdAt");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Get user's bookmarked jobs
export const getBookmarks = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("bookmarks");

  res.status(200).json({
    success: true,
    bookmarkedJobs: user.bookmarks || [],
  });
});

// Add job to bookmarks
export const addBookmark = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if already bookmarked
  if (user.bookmarks.includes(jobId)) {
    return next(new ErrorHandler("Job already bookmarked", 400));
  }

  user.bookmarks.push(jobId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Job bookmarked successfully",
  });
});

// Remove job from bookmarks
export const removeBookmark = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.bookmarks = user.bookmarks.filter((id) => id.toString() !== jobId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Bookmark removed successfully",
  });
});