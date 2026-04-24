import express from "express";
import passport from "passport";
import { sendToken } from "../utils/jwtToken.js";

const router = express.Router();

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/oauth-failed",
    session: false,
  }),
  (req, res) => {
    // Generate JWT and set cookie
    const user = req.user;
    const token = user.getJWTToken();

    // Set cookie
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

    console.log("Google OAuth callback - setting cookie:", { isProduction, sameSite: options.sameSite, secure: options.secure, frontendUrl: process.env.FRONTEND_URL });

    // Redirect to frontend with token and user data as query params
    // Frontend will handle the token and check if profile completion is needed
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const needsCompletion = !user.isProfileComplete;

    res
      .cookie("token", token, options)
      .redirect(
        `${frontendUrl}/oauth/callback?success=true&needsCompletion=${needsCompletion}`
      );
  }
);

// GitHub OAuth routes
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/v1/auth/oauth-failed",
    session: false,
  }),
  (req, res) => {
    // Generate JWT and set cookie
    const user = req.user;
    const token = user.getJWTToken();

    // Set cookie
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

    // Redirect to frontend with token and user data as query params
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const needsCompletion = !user.isProfileComplete;

    res
      .cookie("token", token, options)
      .redirect(
        `${frontendUrl}/oauth/callback?success=true&needsCompletion=${needsCompletion}`
      );
  }
);

// OAuth failure handler
router.get("/oauth-failed", (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/login?error=oauth_failed`);
});

export default router;
