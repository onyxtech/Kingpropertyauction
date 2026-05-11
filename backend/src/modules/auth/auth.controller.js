import { registerSchema, loginSchema } from "../user/user.validation.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service.js";
import User from "../user/user.model.js";
import crypto from "crypto";
import { sendEmail } from "../notifications/email.service.js";
import { isNotificationEnabled } from "../settings/settings.service.js";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await registerUser(value);

    res.cookie("refreshToken", result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await loginUser(value.email, value.password);

    res.cookie("refreshToken", result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const result = await refreshAccessToken(token);

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    await logoutUser(req.user.id);
    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    // Update name and email
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // Update password if provided
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Forgot Password ───
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate crypto-random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing (never store plain text)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetEnabled = await isNotificationEnabled("passwordReset");
    if (resetEnabled) {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset Your Password",
          templateKey: "passwordReset",
          variables: {
            user_name: user.name,
            reset_link: resetUrl,
          },
        });
      } catch (e) {
        console.error("Password reset email failed:", e.message);
        // Rollback token if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res
          .status(500)
          .json({
            success: false,
            message: "Email could not be sent. Please try again.",
          });
      }
    }

    res.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Reset Password ───
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired reset token. Please request a new one.",
        });
    }

    // Update password
    user.password = password;
    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // Invalidate all existing sessions (security best practice)
    user.refreshToken = null;
    await user.save();

    res.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
