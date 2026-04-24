export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  // Sanitize user data — never leak password hash or internal fields
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    provider: user.provider,
    avatar: user.avatar,
    isProfileComplete: user.isProfileComplete,
    createdAt: user.createdAt,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: sanitizedUser,
    message,
    token,
  });
};
