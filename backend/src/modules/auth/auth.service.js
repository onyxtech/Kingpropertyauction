import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import fs from "fs";
import path from "path";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }
  // Auto-approve sellers and agents, buyers still need admin approval
  const isActive =
    userData.isActive !== undefined
      ? userData.isActive
      : userData.role === "seller" || userData.role === "agent"
        ? true
        : false;
  // Auto-set permissions based on role
  const permissions = {
    canBid: !["admin", "agent", "seller"].includes(userData.role),
    canListProperties: ["admin", "agent", "seller"].includes(userData.role),
  };
  // Handle ID documents (base64 files from registration)
  let idDocuments = [];
  if (userData.idDocuments && userData.idDocuments.length > 0) {
    const dir = "uploads/id-documents";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const doc of userData.idDocuments) {
      if (doc.fileData) {
        const base64Data = doc.fileData.replace(/^data:.*;base64,/, "");
        const ext = doc.originalName?.split(".").pop() || "jpg";
        const fileName = `id-doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        fs.writeFileSync(`${dir}/${fileName}`, base64Data, "base64");

        idDocuments.push({
          docType: doc.docType || "other_id",
          fileUrl: `/uploads/id-documents/${fileName}`,
          fileName: fileName,
          originalName: doc.originalName,
          mimeType: doc.mimeType || "application/octet-stream",
          fileSize: doc.fileSize || 0,
          verificationStatus: "pending",
        });
      }
    }
  }

  // Remove fileData before creating user
  const { idDocuments: _docs, ...cleanUserData } = userData;

  const user = await User.create({ ...cleanUserData, isActive, permissions });

  // Save ID documents to the right place
  if (idDocuments.length > 0) {
    if (userData.role === "agent") {
      user.agentDetails = { ...user.agentDetails, idDocuments };
    } else if (userData.role === "seller") {
      user.ownerDocuments = idDocuments;
      if (!user.agentDetails) user.agentDetails = {};
      user.agentDetails.idDocuments = idDocuments;
    }
    await user.save();
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Fire-and-forget: Emit event (non-blocking)
  notificationService
    .emit(NotificationEvents.USER_REGISTERED, { userId: user._id })
    .catch((e) => console.error("Notification event failed:", e.message));

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || false,
      phone: user.phone,
      isActive: user.isActive,
      activeView: user.activeView,
      permissions: user.permissions,
      roleRequest: user.roleRequest,
      agentDetails: user.agentDetails,
      ownerDocuments: user.ownerDocuments,
      bankDetails: user.bankDetails,
      notificationSettings: user.notificationSettings,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error(
      "Your account is pending approval. An admin will review and activate your account shortly.",
    );
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const correctActiveView =
    (user.role === "seller" || user.role === "agent") &&
    user.activeView === "buyer" &&
    !user.permissions?.canBid
      ? "seller"
      : user.activeView ||
        (user.role === "seller" || user.role === "agent" ? "seller" : "buyer");

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || false,
      phone: user.phone,
      isActive: user.isActive,
      activeView: correctActiveView,
      permissions: user.permissions,
      roleRequest: user.roleRequest,
      agentDetails: user.agentDetails,
      ownerDocuments: user.ownerDocuments,
      bankDetails: user.bankDetails,
      notificationSettings: user.notificationSettings,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = generateAccessToken(user._id);
    return { accessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
