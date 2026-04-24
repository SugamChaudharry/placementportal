import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/userSchema.js";

export const initializePassport = () => {
  // Google OAuth Strategy — only initialize if credentials are configured
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth: Initializing with callback URL:", `${process.env.BACKEND_URL || "http://localhost:4000"}/api/v1/auth/google/callback`);
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
            const givenName = profile.name?.givenName || "";
            const familyName = profile.name?.familyName || "";
            const nameFromParts = `${givenName} ${familyName}`.trim();
            const name = profile.displayName || nameFromParts || "Google User";
            const avatar = profile.photos?.[0]?.value;
            const providerId = profile.id;

            if (!email) {
              return done(new Error("Email not provided by Google"), null);
            }

            // Check if user exists by providerId first
            let user = await User.findOne({
              providerId: providerId,
              provider: "google",
            });

            if (user) {
              return done(null, user);
            }

            // Check if email already exists with local account
            const existingLocalUser = await User.findOne({ email: email, provider: "local" });
            if (existingLocalUser) {
              return done(new Error("An account with this email already exists. Please login and connect your Google account from profile settings."), null);
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
  } else {
    console.warn("Google OAuth credentials not configured — Google login disabled.");
  }

  // GitHub OAuth Strategy — only initialize if credentials are configured
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
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
            const name = profile.displayName || (profile.username ? `@${profile.username}` : null) || "GitHub User";
            const avatar = profile.photos?.[0]?.value || profile._json?.avatar_url;
            const providerId = profile.id;

            if (!email) {
              return done(new Error("Email not provided by GitHub"), null);
            }

            // Check if user exists by providerId first
            let user = await User.findOne({
              providerId: providerId,
              provider: "github",
            });

            if (user) {
              return done(null, user);
            }

            // Check if email already exists with local account
            const existingLocalUser = await User.findOne({ email: email, provider: "local" });
            if (existingLocalUser) {
              return done(new Error("An account with this email already exists. Please login and connect your GitHub account from profile settings."), null);
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
  } else {
    console.warn("GitHub OAuth credentials not configured — GitHub login disabled.");
  }

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

