import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/userSchema.js";

export const initializePassport = () => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:4000"}/api/v1/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName + " " + profile.name?.familyName;
          const avatar = profile.photos?.[0]?.value;
          const providerId = profile.id;

          if (!email) {
            return done(new Error("Email not provided by Google"), null);
          }

          // Check if user exists by providerId or email
          let user = await User.findOne({
            $or: [{ providerId: providerId, provider: "google" }, { email: email }],
          });

          if (user) {
            // If user exists but was created with local auth, link the accounts
            if (user.provider === "local") {
              user.provider = "google";
              user.providerId = providerId;
              if (avatar) user.avatar = avatar;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user from OAuth data
          // OAuth users don't have phone initially - they need to complete profile
          user = await User.create({
            name,
            email,
            phone: "", // Will be collected in profile completion
            role: "Job Seeker", // Default role, user can change in profile completion
            provider: "google",
            providerId,
            avatar,
            isProfileComplete: false,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:4000"}/api/v1/auth/github/callback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || profile._json?.email;
          const name = profile.displayName || profile.username || "GitHub User";
          const avatar = profile.photos?.[0]?.value || profile._json?.avatar_url;
          const providerId = profile.id;

          if (!email) {
            return done(new Error("Email not provided by GitHub"), null);
          }

          // Check if user exists by providerId or email
          let user = await User.findOne({
            $or: [{ providerId: providerId, provider: "github" }, { email: email }],
          });

          if (user) {
            // If user exists but was created with local auth, link the accounts
            if (user.provider === "local") {
              user.provider = "github";
              user.providerId = providerId;
              if (avatar) user.avatar = avatar;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user from OAuth data
          user = await User.create({
            name,
            email,
            phone: "", // Will be collected in profile completion
            role: "Job Seeker", // Default role, user can change in profile completion
            provider: "github",
            providerId,
            avatar,
            isProfileComplete: false,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session (we use JWT, so minimal session usage)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passport;
