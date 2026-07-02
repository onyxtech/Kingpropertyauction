import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from "../user/user.model.js";
import { getOAuthConfig } from "../settings/settings.service.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Lazy Google Strategy
let googleStrategyInitialized = false;
const ensureGoogleStrategy = async () => {
  if (googleStrategyInitialized) return;
  const config = await getOAuthConfig();
  const google = config?.google || {};

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: google.clientId || "dummy",
        clientSecret: google.clientSecret || "dummy",
        callbackURL: "https://kingpropertyauction.co.uk/api/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          if (!google.enabled)
            return done(null, false, { message: "Google login is disabled" });
          const email = profile.emails?.[0]?.value;
          if (!email)
            return done(null, false, { message: "No email from Google" });

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              password: "oauth-" + Math.random().toString(36).slice(2),
              role: "buyer",
              isActive: true,
              permissions: {
                canBid: true,
                canListProperties: false,
              },
            });
          } else {
            const needsUpdate = !user.isActive ||
              (user.role === "buyer" && !user.permissions?.canBid);
            if (needsUpdate) {
              user = await User.findByIdAndUpdate(
                user._id,
                { isActive: true, "permissions.canBid": true },
                { new: true }
              );
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
  googleStrategyInitialized = true;
};

// Lazy GitHub Strategy
let githubStrategyInitialized = false;
const ensureGitHubStrategy = async () => {
  if (githubStrategyInitialized) return;
  const config = await getOAuthConfig();
  const github = config?.github || {};

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: github.clientId || "dummy",
        clientSecret: github.clientSecret || "dummy",
        callbackURL: "https://kingpropertyauction.co.uk/api/auth/github/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          if (!github.enabled)
            return done(null, false, { message: "GitHub login is disabled" });

          let email = profile.emails?.[0]?.value;
          if (!email || email.includes("github.user")) {
            try {
              const response = await fetch(
                "https://api.github.com/user/emails",
                {
                  headers: {
                    Authorization: `token ${accessToken}`,
                    "User-Agent": "King-Property-Auction",
                  },
                },
              );
              const emails = await response.json();
              const primary = emails.find((e) => e.primary && e.verified);
              if (primary) email = primary.email;
            } catch (e) {
              console.error("❌ Failed to fetch GitHub emails:", e.message);
            }
          }

          if (!email) email = `${profile.username}@github.user`;

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              password: "oauth-" + Math.random().toString(36).slice(2),
              role: "buyer",
              isActive: true,
              permissions: {
                canBid: true,
                canListProperties: false,
              },
            });
          } else {
            const needsUpdate = !user.isActive ||
              (user.role === "buyer" && !user.permissions?.canBid);
            if (needsUpdate) {
              user = await User.findByIdAndUpdate(
                user._id,
                { isActive: true, "permissions.canBid": true },
                { new: true }
              );
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
  githubStrategyInitialized = true;
};

// Lazy Facebook Strategy
let facebookStrategyInitialized = false;
const ensureFacebookStrategy = async () => {
  if (facebookStrategyInitialized) return;
  const config = await getOAuthConfig();
  const facebook = config?.facebook || {};

  passport.use('facebook', new FacebookStrategy({
    clientID: facebook.clientId || 'dummy',
    clientSecret: facebook.clientSecret || 'dummy',
    callbackURL: 'https://kingpropertyauction.co.uk/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'name'],
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      if (!facebook.enabled) return done(null, false, { message: 'Facebook login is disabled' });
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false, { message: 'No email from Facebook' });

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          password: 'oauth-' + Math.random().toString(36).slice(2),
          role: 'buyer',
          isActive: true,
          permissions: {
            canBid: true,
            canListProperties: false,
          },
        });
      } else {
        const needsUpdate = !user.isActive ||
          (user.role === 'buyer' && !user.permissions?.canBid);
        if (needsUpdate) {
          user = await User.findByIdAndUpdate(
            user._id,
            { isActive: true, 'permissions.canBid': true },
            { new: true }
          );
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
  facebookStrategyInitialized = true;
};

export { ensureGoogleStrategy, ensureGitHubStrategy, ensureFacebookStrategy };
export default passport;