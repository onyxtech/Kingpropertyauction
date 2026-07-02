import User from "./user.model.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter)
      .select("-password -refreshToken")
      .lean();
    const usersWithStatus = users.map((u) => ({
      ...u,
      status: !u.isActive ? "pending" : "active",
    }));
    res.status(200).json({ success: true, data: usersWithStatus });
  } catch (error) {
    console.error("[User] getAllUsers error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "pending", "suspended"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wasPreviouslyInactive = !user.isActive;
    const newIsActive = status === "active";

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: newIsActive },
      { new: true },
    ).select("-password -refreshToken");

    // Emit notification events (non-blocking)
    if (newIsActive && wasPreviouslyInactive) {
      notificationService
        .emit(NotificationEvents.USER_APPROVED, { userId: updatedUser._id })
        .catch((e) => console.error("Notification event failed:", e.message));
    } else if (
      !newIsActive &&
      (status === "suspended" || status === "pending")
    ) {
      notificationService
        .emit(NotificationEvents.USER_REJECTED, {
          userId: updatedUser._id,
          reason: "Your account has been suspended by the administrator.",
        })
        .catch((e) => console.error("Notification event failed:", e.message));
    }

    res.json({
      success: true,
      user: updatedUser,
      message: `User ${newIsActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("[User] updateUserStatus error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buyer requests to become an Owner
export const requestRoleSwitch = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Admins cannot change roles" });
    }

    if (user.roleRequest?.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "You already have a pending role request",
      });
    }

    const { requestedRole = "seller", message: note } = req.body;
    if (!["seller", "agent", "buyer"].includes(requestedRole)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid requested role" });
    }

    user.roleRequest = {
      requestedRole,
      status: "pending",
      requestedAt: new Date(),
      reviewNote: note || "",
    };
    await user.save();

    // Email to admin + admin notification
    try {
      const { sendEmail } = await import("../notifications/email.service.js");
      const { isNotificationEnabled } =
        await import("../settings/settings.service.js");
      const Notification = (
        await import("../notifications/notification.model.js")
      ).default;
      const admins = await User.find({ role: "admin" })
        .select("email name")
        .lean();
      const enabled = await isNotificationEnabled("roleRequestAdmin");
      const reasonText = note
        ? `<div style="background:#f1f5f9;border-radius:8px;padding:12px 16px;margin:0 0 16px;"><p style="margin:0 0 6px;color:#475569;font-weight:700;font-size:12px;">REASON:</p><p style="margin:0;color:#374151;font-size:14px;font-style:italic;">${note}</p></div>`
        : "";
      if (enabled) {
        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: `Role Request: ${req.user.name} wants to become ${requestedRole}`,
            templateKey: "roleRequestAdmin",
            variables: {
              user_name: req.user.name,
              user_email: req.user.email,
              current_role: req.user.role,
              requested_role: requestedRole,
              reason: reasonText,
              dashboard_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/users`,
            },
          }).catch((e) =>
            console.warn("Role request admin email failed:", e.message),
          );
        }
      }
      await Notification.create({
        type: "user",
        icon: "user",
        message: `Role request: ${req.user.name} wants to become ${requestedRole}`,
        link: "/admin/users",
        color: "amber",
        targetUser: null,
      }).catch((e) => console.warn("Admin notification failed:", e.message));

      const { emitToAdmins } = await import("../../socket.js");
      emitToAdmins("new_notification", {
        type: "user",
        message: `${req.user.name} requested ${requestedRole} role`,
        link: "/admin/users",
        color: "amber",
      });
    } catch (e) {
      console.warn("Role request notifications failed:", e.message);
    }

    res.status(200).json({
      success: true,
      message: "Role request submitted successfully",
      data: { roleRequest: user.roleRequest },
    });
  } catch (error) {
    console.error("[User] requestRoleSwitch error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller/agent switches active dashboard view
export const switchActiveView = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const canSwitch = ["seller", "agent", "admin"].includes(user.role);
    if (!canSwitch) {
      return res.status(403).json({
        success: false,
        message: "Only sellers and agents can switch views",
      });
    }

    const { view } = req.body;
    if (!["buyer", "seller"].includes(view)) {
      return res.status(400).json({
        success: false,
        message: "Invalid view. Use 'buyer' or 'seller'",
      });
    }

    user.activeView = view;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Switched to ${view} view`,
      data: { activeView: view },
    });
  } catch (error) {
    console.error("[User] switchActiveView error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin reviews a role request
export const reviewRoleRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.roleRequest || user.roleRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "No pending role request for this user",
      });
    }

    const { decision, reviewNote } = req.body;
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be 'approved' or 'rejected'",
      });
    }

    user.roleRequest.status = decision;
    user.roleRequest.reviewedAt = new Date();
    user.roleRequest.reviewNote = reviewNote || "";

    if (decision === "approved") {
      const requestedRole = user.roleRequest.requestedRole;

      if (requestedRole === "seller" || requestedRole === "agent") {
        // buyer → seller/agent: keep canBid, add canListProperties
        user.role = requestedRole;
        user.activeView = "seller";
        user.permissions.canBid = true;
        user.permissions.canListProperties = true;
      } else if (requestedRole === "buyer") {
        // seller/agent → buyer: keep role, just add canBid
        user.permissions.canBid = true;
        user.activeView = "buyer";
        // canListProperties remains as-is from seller/agent role
      }
    }

    await user.save();

    // Email to user + user notification
    try {
      const { sendEmail } = await import("../notifications/email.service.js");
      const { isNotificationEnabled } =
        await import("../settings/settings.service.js");
      const Notification = (
        await import("../notifications/notification.model.js")
      ).default;
      const enabled = await isNotificationEnabled("roleRequestApproved");
      const isApproved = decision === "approved";
      const requestedRole = user.roleRequest.requestedRole;
      const permissionsSummary = isApproved
        ? requestedRole === "buyer" || user.permissions?.canBid
          ? "✅ Place bids on auctions\n✅ List properties for auction\n✅ View auction history"
          : requestedRole === "seller"
            ? "✅ List properties for auction\n✅ Manage your listings\n✅ View auction stats"
            : "✅ Place bids on auctions\n✅ Participate in live auctions"
        : "Your request was not approved at this time. Contact support for more information.";
      if (enabled) {
        await sendEmail({
          to: user.email,
          subject: `Role Request ${isApproved ? "Approved" : "Rejected"}: ${requestedRole}`,
          templateKey: "roleRequestApproved",
          variables: {
            user_name: user.name,
            decision: isApproved ? "Approved" : "Rejected",
            new_role: isApproved ? requestedRole : user.role,
            permissions_summary: permissionsSummary,
            dashboard_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`,
          },
        }).catch((e) => console.warn("Role approval email failed:", e.message));
      }
      await Notification.create({
        type: "user",
        icon: isApproved ? "check" : "x-circle",
        message: isApproved
          ? `Your request to become ${requestedRole} has been approved! 🎉`
          : `Your role request was not approved at this time.`,
        link: "/dashboard/profile",
        color: isApproved ? "green" : "red",
        targetUser: user._id,
      }).catch((e) => console.warn("User notification failed:", e.message));
    } catch (e) {
      console.warn("Role review notifications failed:", e.message);
    }

    const updatedUser = await User.findById(req.params.id).select(
      "-password -refreshToken",
    );
    res.status(200).json({
      success: true,
      message: `Role request ${decision}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("[User] reviewRoleRequest error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile (name, email, role, agentDetails, bankDetails)
export const updateUser = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "role",
      "isActive",
      "isSuperAdmin",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Handle agentDetails merge
    if (req.body.agentDetails) {
      const user = await User.findById(req.params.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      user.agentDetails = {
        ...(user.agentDetails || {}),
        ...req.body.agentDetails,
      };
      user.markModified("agentDetails");
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
      }
      await user.save();
      const updated = await User.findById(req.params.id).select(
        "-password -refreshToken",
      );
      return res.json({
        success: true,
        data: updated,
        message: "User updated",
      });
    }

    // Handle bankDetails merge
    if (req.body.bankDetails) {
      const user = await User.findById(req.params.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      user.bankDetails = {
        ...(user.bankDetails || {}),
        ...req.body.bankDetails,
      };
      user.markModified("bankDetails");
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
      }
      await user.save();
      const updated = await User.findById(req.params.id).select(
        "-password -refreshToken",
      );
      return res.json({
        success: true,
        data: updated,
        message: "User updated",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password -refreshToken");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user, message: "User updated" });
  } catch (error) {
    console.error("[User] updateUser error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload ID document for agent or owner
export const uploadIdDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { docType } = req.body;
    if (
      !docType ||
      !["driving_license", "passport", "proof_of_address", "other_id"].includes(
        docType,
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid document type" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const docEntry = {
      docType,
      fileUrl: `/uploads/id-documents/${req.file.filename}`,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      verificationStatus: "pending",
    };

    // Store in the right place based on role
    if (user.role === "agent") {
      if (!user.agentDetails) user.agentDetails = {};
      if (!user.agentDetails.idDocuments) user.agentDetails.idDocuments = [];
      user.agentDetails.idDocuments.push(docEntry);
    } else if (user.role === "seller") {
      if (!user.ownerDocuments) user.ownerDocuments = [];
      user.ownerDocuments.push(docEntry);
    }

    await user.save();

    res.json({
      success: true,
      data: docEntry,
      message: "ID document uploaded successfully",
    });
  } catch (error) {
    console.error("ID document upload error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload document" });
  }
};

// Verify/Reject ID document (Admin only)
export const verifyIdDocument = async (req, res) => {
  try {
    const { userId, docIndex, status, rejectionReason } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ─── Check BOTH arrays ──────────────────────────────────────────────
    let docArray = null;
    let docSource = null;

    // First, check agentDetails.idDocuments
    if (
      user.agentDetails?.idDocuments &&
      user.agentDetails.idDocuments.length > 0
    ) {
      if (docIndex < user.agentDetails.idDocuments.length) {
        docArray = user.agentDetails.idDocuments;
        docSource = "agent";
      }
    }

    // If not found in agent docs, check ownerDocuments
    if (!docArray && user.ownerDocuments && user.ownerDocuments.length > 0) {
      if (docIndex < user.ownerDocuments.length) {
        docArray = user.ownerDocuments;
        docSource = "owner";
      }
    }

    // If still not found, try combined approach
    if (!docArray) {
      const combined = [
        ...(user.agentDetails?.idDocuments || []),
        ...(user.ownerDocuments || []),
      ];
      if (docIndex < combined.length) {
        const agentCount = user.agentDetails?.idDocuments?.length || 0;
        if (docIndex < agentCount) {
          docArray = user.agentDetails.idDocuments;
          docSource = "agent";
        } else {
          docArray = user.ownerDocuments;
          docSource = "owner";
        }
      }
    }

    if (!docArray || !docArray[docIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const doc = docArray[docIndex];

    // ─── Update document status ──────────────────────────────────────────
    doc.verificationStatus = status;
    doc.verifiedBy = req.user._id;
    doc.verifiedAt = new Date();
    if (rejectionReason) {
      doc.rejectionReason = rejectionReason;
    }

    // Mark the array as modified so Mongoose saves it
    if (docSource === "agent") {
      user.markModified("agentDetails.idDocuments");
    } else if (docSource === "owner") {
      user.markModified("ownerDocuments");
    }

    await user.save();

    res.json({
      success: true,
      message: `Document ${status === "verified" ? "verified" : "rejected"} successfully`,
    });
  } catch (error) {
    console.error("Verify ID document error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify document" });
  }
};

// Delete ID document
export const deleteIdDocument = async (req, res) => {
  try {
    const { docIndex } = req.body;
    if (docIndex === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Document index is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let docArray;
    if (user.role === "agent") {
      docArray = user.agentDetails?.idDocuments;
    } else if (user.role === "seller") {
      docArray = user.ownerDocuments;
    }

    if (!docArray || !docArray[docIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const doc = docArray[docIndex];

    // Delete file from disk
    const fs = await import("fs");
    const filePath = `uploads/${doc.fileUrl?.replace("/uploads/", "")}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from array
    docArray.splice(docIndex, 1);

    // Also remove from agentDetails if seller
    if (user.role === "seller" && user.agentDetails?.idDocuments) {
      const agentIdx = user.agentDetails.idDocuments.findIndex(
        (d) => d.fileUrl === doc.fileUrl,
      );
      if (agentIdx > -1) user.agentDetails.idDocuments.splice(agentIdx, 1);
    }
    // Also remove from ownerDocuments if agent
    if (user.role === "agent" && user.ownerDocuments) {
      const ownerIdx = user.ownerDocuments.findIndex(
        (d) => d.fileUrl === doc.fileUrl,
      );
      if (ownerIdx > -1) user.ownerDocuments.splice(ownerIdx, 1);
    }

    await user.save();

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete ID document error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete document" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshToken")
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const Property = (await import("../property/property.model.js")).default;
    const Bid = (await import("../bid/bid.model.js")).default;
    const Auction = (await import("../auction/auction.model.js")).default;
    const Commission = (await import("../commission/commission.model.js"))
      .default;
    const Payment = (await import("../payment/payment.model.js")).default;

    // ─── KYC Status Calculation ──────────────────────────────────────────
    // Get all KYC documents from both arrays
    const kycDocuments = [
      ...(user.agentDetails?.idDocuments || []),
      ...(user.ownerDocuments || []),
    ];

    // Check status of each document type
    let drivingLicenseStatus = null; // null = missing
    let passportStatus = null; // null = missing
    let proofOfAddressStatus = null; // null = missing

    kycDocuments.forEach((doc) => {
      if (doc.docType === "driving_license") {
        drivingLicenseStatus = doc.verificationStatus;
      } else if (doc.docType === "passport") {
        passportStatus = doc.verificationStatus;
      } else if (doc.docType === "proof_of_address") {
        proofOfAddressStatus = doc.verificationStatus;
      }
    });

    let kycStatus = "pending";

    // ─── Step 1: Check if Proof of Address is verified ──────────────────
    if (proofOfAddressStatus !== "verified") {
      // Proof of Address is NOT verified → KYC Pending or Rejected
      if (proofOfAddressStatus === "rejected") {
        kycStatus = "rejected";
      } else {
        kycStatus = "pending";
      }
    } else {
      // Proof of Address IS verified → Check Driving License OR Passport
      const hasDrivingLicenseVerified = drivingLicenseStatus === "verified";
      const hasPassportVerified = passportStatus === "verified";

      // Check if either Driving License OR Passport is rejected
      const hasDrivingLicenseRejected = drivingLicenseStatus === "rejected";
      const hasPassportRejected = passportStatus === "rejected";

      // Check if either is pending (and not rejected)
      const hasDrivingLicensePending =
        drivingLicenseStatus === "pending" || drivingLicenseStatus === null;
      const hasPassportPending =
        passportStatus === "pending" || passportStatus === null;

      if (hasDrivingLicenseRejected || hasPassportRejected) {
        // Either is rejected → KYC Rejected
        kycStatus = "rejected";
      } else if (hasDrivingLicenseVerified || hasPassportVerified) {
        // At least one is verified → KYC Verified
        kycStatus = "verified";
      } else if (hasDrivingLicensePending || hasPassportPending) {
        // One is pending/missing → KYC Pending
        kycStatus = "pending";
      } else {
        kycStatus = "pending";
      }
    }

    // ─── Properties Count ──────────────────────────────────────────────
    const listedProperties = await Property.countDocuments({
      createdBy: user._id,
    });
    const purchasedProperties = await Property.countDocuments({
      soldTo: user._id,
    });

    // ─── Auctions Count ────────────────────────────────────────────────
    const auctionIdsFromBids = await Bid.distinct("auction", {
      bidder: user._id,
    });
    const bidAuctionsCount = auctionIdsFromBids.length;

    const listedPropertyIds = await Property.find({
      createdBy: user._id,
    }).distinct("_id");
    const listedAuctionsCount = await Auction.countDocuments({
      properties: { $in: listedPropertyIds },
    });

    // ─── Bids Count ─────────────────────────────────────────────────────
    const totalBids = await Bid.countDocuments({ bidder: user._id });
    const wonBids = await Bid.countDocuments({
      bidder: user._id,
      status: "won",
    });

    // ─── Commissions & Payments ────────────────────────────────────────
    const commissions = await Commission.find({ agent: user._id })
      .populate("property", "propertyTitle")
      .lean();
    const payments = await Payment.find({ buyer: user._id })
      .populate("property", "propertyTitle")
      .lean();

    // ─── Documents Count ────────────────────────────────────────────────
    // Count KYC documents
    const kycDocsCount = kycDocuments.length;

    // Count property documents (images, videos, floor plans, legal docs)
    let propertyDocCount = 0;
    if (listedPropertyIds.length > 0) {
      const properties = await Property.find({
        _id: { $in: listedPropertyIds },
      })
        .select("media legalInfo")
        .lean();

      properties.forEach((prop) => {
        if (prop.media?.propertyImages)
          propertyDocCount += prop.media.propertyImages.length;
        if (prop.media?.propertyVideos)
          propertyDocCount += prop.media.propertyVideos.length;
        if (prop.media?.floorPlans)
          propertyDocCount += prop.media.floorPlans.length;
        if (prop.media?.legalDocuments)
          propertyDocCount += prop.media.legalDocuments.length;
        if (prop.legalInfo?.privateDocuments)
          propertyDocCount += prop.legalInfo.privateDocuments.length;
      });
    }

    const totalDocuments = kycDocsCount + propertyDocCount;

    // ─── Response ──────────────────────────────────────────────────────
    res.json({
      success: true,
      data: {
        ...user,
        kycStatus,
        stats: {
          listedProperties,
          purchasedProperties,
          totalProperties: listedProperties + purchasedProperties,
          bidAuctionsCount,
          listedAuctionsCount,
          totalAuctions: bidAuctionsCount + listedAuctionsCount,
          totalBids,
          wonBids,
          totalDocuments, // ← ADDED
          totalCommissions: commissions.length,
          pendingCommission: commissions
            .filter((c) => c.status === "pending")
            .reduce((s, c) => s + c.commissionAmount, 0),
          paidCommission: commissions
            .filter((c) => c.status === "paid")
            .reduce((s, c) => s + c.commissionAmount, 0),
        },
        commissions,
        payments,
      },
    });
  } catch (error) {
    console.error("[User] getUserById error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProperties = async (req, res) => {
  try {
    const userId = req.params.id;

    // ─── Pagination ──────────────────────────────────────────────────────
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const Property = (await import("../property/property.model.js")).default;
    const Bid = (await import("../bid/bid.model.js")).default;
    const Auction = (await import("../auction/auction.model.js")).default;
    const User = (await import("./user.model.js")).default;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let properties = [];
    const propertyIds = new Set();

    // ─── 1. Properties LISTED by user (createdBy) ──────────────────────
    const listedProperties = await Property.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    for (const prop of listedProperties) {
      const propId = prop._id.toString();
      if (!propertyIds.has(propId)) {
        propertyIds.add(propId);

        // Determine type
        let type = "Listing"; // Default for auction properties
        let status = prop.propertyStatus || "available";

        // If direct sale
        if (prop.listingType === "direct_sale") {
          type = "Sale";
          // Status for direct sale
          if (prop.propertyStatus === "sold") {
            status = `Sold ${formatPrice(prop.soldPrice || prop.pricing?.startingAuctionPrice || 0)}`;
          } else {
            status = prop.propertyStatus || "available";
          }
        } else {
          // Auction property - check if it's in an auction
          const auction = await Auction.findOne({
            properties: prop._id,
          }).lean();

          if (auction) {
            // Property is in an auction
            if (auction.status === "live") {
              status = "Active";
            } else if (
              auction.status === "upcoming" ||
              auction.status === "scheduled"
            ) {
              status = "Scheduled";
            } else if (auction.status === "completed") {
              if (prop.propertyStatus === "sold") {
                status = `Sold ${formatPrice(prop.soldPrice || 0)}`;
              } else if (prop.propertyStatus === "unsold") {
                status = "Unsold";
              } else {
                status = "Completed";
              }
            } else {
              status = prop.propertyStatus || "available";
            }
          } else {
            // Not in any auction yet
            status = prop.propertyStatus || "available";
          }
        }

        properties.push({
          ...prop,
          _relation: "listed",
          _displayType: type,
          _displayStatus: status,
        });
      }
    }

    // ─── 2. Properties PURCHASED by user (soldTo) ──────────────────────
    const purchasedProperties = await Property.find({ soldTo: userId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    purchasedProperties.forEach((prop) => {
      const propId = prop._id.toString();
      if (!propertyIds.has(propId)) {
        propertyIds.add(propId);
        properties.push({
          ...prop,
          _relation: "purchased",
          _displayType: "Purchase",
          _displayStatus: "Purchased",
        });
      }
    });

    // ─── 3. Properties in WATCHLIST (savedBy) ──────────────────────────
    const watchlistProperties = await Property.find({
      savedBy: userId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    watchlistProperties.forEach((prop) => {
      const propId = prop._id.toString();
      if (!propertyIds.has(propId)) {
        propertyIds.add(propId);
        properties.push({
          ...prop,
          _relation: "watchlist",
          _displayType: "Watchlist",
          _displayStatus: "Watching",
        });
      }
    });

    // ─── 4. Properties with ACTIVE BIDS (live auctions) ──────────────────
    const activeBids = await Bid.find({
      bidder: userId,
      status: { $in: ["winning", "outbid", "bidding"] },
    })
      .populate("property")
      .populate({
        path: "auction",
        match: { status: "live" },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    activeBids.forEach((bid) => {
      if (bid.property && bid.auction) {
        const propId = bid.property._id.toString();
        if (!propertyIds.has(propId)) {
          propertyIds.add(propId);
          properties.push({
            ...bid.property,
            _relation: "active_bid",
            _displayType: "Active Bid",
            _displayStatus: "Bidding Active",
            _bidAmount: bid.amount,
            _bidStatus: bid.status,
            _auctionId: bid.auction._id,
          });
        }
      }
    });

    // ─── 5. Properties with LOST BIDS (completed auctions) ──────────────
    const lostBids = await Bid.find({
      bidder: userId,
      status: "lost",
    })
      .populate("property")
      .populate({
        path: "auction",
        match: { status: "completed" },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    lostBids.forEach((bid) => {
      if (bid.property && bid.auction) {
        const propId = bid.property._id.toString();
        if (!propertyIds.has(propId)) {
          propertyIds.add(propId);
          properties.push({
            ...bid.property,
            _relation: "bid_lost",
            _displayType: "Past Bid",
            _displayStatus: "Lost Bid",
            _bidAmount: bid.amount,
            _auctionId: bid.auction._id,
          });
        }
      }
    });

    // Sort by createdAt (most recent first)
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total: properties.length,
      },
    });
  } catch (error) {
    console.error("[User] getUserProperties error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to format price (needed inside the function)
const formatPrice = (val) => {
  if (!val) return "£0";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(val);
};

export const getUserAuctions = async (req, res) => {
  try {
    const userId = req.params.id;

    // ─── Pagination ──────────────────────────────────────────────────────
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const Bid = (await import("../bid/bid.model.js")).default;
    const Auction = (await import("../auction/auction.model.js")).default;
    const Property = (await import("../property/property.model.js")).default;
    const User = (await import("./user.model.js")).default;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let auctions = [];
    const auctionIds = new Set();

    // ─── Check permissions ──────────────────────────────────────────────
    // ✅ Admin can list properties (canList = true)
    const canBid =
      user.permissions?.canBid || user.role === "buyer" || user.role === "user";
    const canList =
      user.permissions?.canListProperties ||
      user.role === "seller" ||
      user.role === "agent" ||
      user.role === "admin";

    // ─── 1. Get BID DATA (if user can bid) ──────────────────────────────
    if (canBid) {
      const bids = await Bid.find({ bidder: userId })
        .populate({
          path: "auction",
          populate: {
            path: "properties",
            model: "Property",
          },
        })
        .populate("property")
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Group by auction
      const auctionMap = new Map();

      bids.forEach((bid) => {
        if (!bid.auction) return;
        const auctionId = bid.auction._id.toString();

        if (!auctionMap.has(auctionId)) {
          auctionMap.set(auctionId, {
            auction: bid.auction,
            userBids: [],
            allBids: [],
            userHighestBid: 0,
            auctionHighestBid: 0,
            properties: bid.auction.properties || [],
            propertyBids: {},
          });
        }

        const entry = auctionMap.get(auctionId);
        entry.allBids.push(bid);
        if (bid.amount > entry.auctionHighestBid) {
          entry.auctionHighestBid = bid.amount;
        }

        if (bid.bidder.toString() === userId) {
          entry.userBids.push(bid);
          if (bid.amount > entry.userHighestBid) {
            entry.userHighestBid = bid.amount;
          }
        }

        const propertyId = bid.property?._id?.toString();
        if (propertyId) {
          if (!entry.propertyBids[propertyId]) {
            entry.propertyBids[propertyId] = {
              property: bid.property,
              bids: [],
              propertyHighestBid: 0,
              userBidsForProperty: [],
              userHighestForProperty: 0,
            };
          }
          entry.propertyBids[propertyId].bids.push(bid);
          if (bid.amount > entry.propertyBids[propertyId].propertyHighestBid) {
            entry.propertyBids[propertyId].propertyHighestBid = bid.amount;
          }
          if (bid.bidder.toString() === userId) {
            entry.propertyBids[propertyId].userBidsForProperty.push(bid);
            if (
              bid.amount > entry.propertyBids[propertyId].userHighestForProperty
            ) {
              entry.propertyBids[propertyId].userHighestForProperty =
                bid.amount;
            }
          }
        }
      });

      // Process each auction - create one entry per property
      for (const [auctionId, entry] of auctionMap) {
        const auction = entry.auction;
        const propertyIds = Object.keys(entry.propertyBids);

        for (const propId of propertyIds) {
          const propData = entry.propertyBids[propId];
          const property = propData.property;

          if (!property) continue;

          let result = "Registered";
          let hammerPrice = 0;

          // Get total bids for this property from ALL bidders
          const totalBidsForProperty = await Bid.countDocuments({
            property: property._id,
            auction: auction._id,
          });

          const userBidsForProperty = propData.userBidsForProperty.length;

          // Check if user won this property
          if (property.soldTo) {
            const winnerId =
              typeof property.soldTo === "object"
                ? property.soldTo._id?.toString()
                : property.soldTo?.toString();

            if (winnerId === userId) {
              result = "Won";
              hammerPrice =
                property.soldPrice || propData.propertyHighestBid || 0;
            } else if (propData.userBidsForProperty.length > 0) {
              result = "Lost";
              hammerPrice =
                property.soldPrice || propData.propertyHighestBid || 0;
            }
          }
          // If property not sold yet
          else {
            if (auction.status === "live") {
              if (
                propData.userHighestForProperty ===
                  propData.propertyHighestBid &&
                propData.userHighestForProperty > 0
              ) {
                result = "Winning";
              } else if (
                propData.userBidsForProperty.length > 0 &&
                propData.userHighestForProperty < propData.propertyHighestBid
              ) {
                result = "Outbid";
              } else if (propData.userBidsForProperty.length > 0) {
                result = "Bidding";
              }
              hammerPrice = propData.propertyHighestBid || 0;
            } else if (
              auction.status === "completed" ||
              auction.status === "ended"
            ) {
              if (propData.userBidsForProperty.length > 0) {
                result = "Lost";
                hammerPrice =
                  property.soldPrice || propData.propertyHighestBid || 0;
              }
            }
            // Upcoming auction - users can't bid, so no entries
            else if (
              auction.status === "upcoming" ||
              auction.status === "scheduled"
            ) {
              continue;
            }
          }

          // Only add if user has bids for this property
          if (propData.userBidsForProperty.length > 0) {
            const auctionKey = `${auction._id}-${property._id}`;
            if (!auctionIds.has(auctionKey)) {
              auctionIds.add(auctionKey);
              auctions.push({
                auctionId: auction._id,
                auctionSlug: auction.slug || auction._id,
                auctionTitle: auction.auctionTitle || "Untitled Auction",
                propertyTitle: property.propertyTitle || "N/A",
                propertyId: property._id,
                result: result,
                hammerPrice: hammerPrice,
                date: auction.endDateTime || auction.createdAt,
                userBids: userBidsForProperty,
                totalBids: totalBidsForProperty,
                status: auction.status,
                source: "bid",
              });
            }
          }
        }
      }
    }

    // ─── 2. Get LISTING DATA (if user can list properties) ──────────────
    // ✅ Admin included here via canList check
    if (canList) {
      const properties = await Property.find({ createdBy: userId })
        .skip(skip)
        .limit(limit)
        .lean();
      const propertyIds = properties.map((p) => p._id);

      if (propertyIds.length > 0) {
        const auctionsData = await Auction.find({
          properties: { $in: propertyIds },
        })
          .populate("properties")
          .lean();

        for (const auction of auctionsData) {
          for (const property of auction.properties || []) {
            if (
              property.createdBy?.toString() === userId ||
              propertyIds.some(
                (id) => id.toString() === property._id?.toString(),
              )
            ) {
              let result = auction.status || "Completed";
              if (property.propertyStatus === "sold") result = "Sold";
              else if (property.propertyStatus === "unsold") result = "Unsold";
              else if (auction.status === "live") result = "Live";
              else if (auction.status === "upcoming") result = "Scheduled";
              else if (auction.status === "completed") result = "Completed";

              // Get total bids for this property in this auction
              const totalBidsForProperty = await Bid.countDocuments({
                property: property._id,
                auction: auction._id,
              });

              const auctionKey = `${auction._id}-${property._id}`;
              if (!auctionIds.has(auctionKey)) {
                auctionIds.add(auctionKey);
                auctions.push({
                  auctionId: auction._id,
                  auctionSlug: auction.slug || auction._id,
                  auctionTitle: auction.auctionTitle,
                  propertyTitle: property.propertyTitle || "N/A",
                  propertyId: property._id,
                  result: result,
                  hammerPrice: auction.finalPrice || property.soldPrice || 0,
                  date: auction.endDateTime || auction.createdAt,
                  userBids: 0, // No bids for listing
                  totalBids: totalBidsForProperty,
                  status: auction.status,
                  source: "listing",
                });
              } else {
                // Update existing entry to include listing data
                const existing = auctions.find(
                  (a) =>
                    a.auctionId === auction._id &&
                    a.propertyId === property._id,
                );
                if (existing && existing.source === "bid") {
                  existing.listingResult = result;
                  existing.listingHammerPrice =
                    auction.finalPrice || property.soldPrice || 0;
                  // Update totalBids if listing has more accurate count
                  if (totalBidsForProperty > existing.totalBids) {
                    existing.totalBids = totalBidsForProperty;
                  }
                }
              }
            }
          }
        }
      }
    }

    // ─── 3. For ADMIN: REMOVED - Admin now handled by canList above ────
    // Admin will see their listed properties in auctions

    // Sort by date (most recent first)
    auctions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: auctions,
      pagination: {
        page,
        limit,
        total: auctions.length,
      },
    });
  } catch (error) {
    console.error("[User] getUserAuctions error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBids = async (req, res) => {
  try {
    const userId = req.params.id;

    // ─── Pagination ──────────────────────────────────────────────────────
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const Bid = (await import("../bid/bid.model.js")).default;
    const User = (await import("./user.model.js")).default;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ─── Check if user can bid ──────────────────────────────────────────
    const canBid =
      user.permissions?.canBid || user.role === "buyer" || user.role === "user";

    // If user cannot bid, return empty array
    if (!canBid) {
      return res.json({
        success: true,
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
      });
    }

    // ─── Get total count for pagination ────────────────────────────────
    const total = await Bid.countDocuments({ bidder: userId });

    // ─── Get bids by this user ──────────────────────────────────────────
    const bids = await Bid.find({ bidder: userId })
      .populate({
        path: "auction",
        select: "auctionTitle slug status",
      })
      .populate({
        path: "property",
        select: "propertyTitle slug location",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // ─── Format bid data ────────────────────────────────────────────────
    const formattedBids = bids.map((bid) => {
      // Build property address from location
      let propertyAddress = null;
      if (bid.property?.location) {
        const parts = [
          bid.property.location.streetAddress,
          bid.property.location.city,
          bid.property.location.area,
          bid.property.location.postalCode,
        ].filter(Boolean);
        propertyAddress = parts.length > 0 ? parts.join(", ") : null;
      }

      return {
        _id: bid._id,
        bidId: bid._id.toString().slice(-8).toUpperCase(),
        auctionId: bid.auction?._id || null,
        auctionTitle: bid.auction?.auctionTitle || "N/A",
        auctionSlug: bid.auction?.slug || null,
        propertyId: bid.property?._id || null,
        propertyTitle: bid.property?.propertyTitle || "N/A",
        propertySlug: bid.property?.slug || null,
        propertyAddress: propertyAddress,
        amount: bid.amount || 0,
        status: bid.status || "pending",
        createdAt: bid.createdAt,
        isAutoBid: bid.isAutoBid || false,
        maxBid: bid.maxBid || null,
      };
    });

    res.json({
      success: true,
      data: formattedBids,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[User] getUserBids error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const User = (await import("./user.model.js")).default;
    const Property = (await import("../property/property.model.js")).default;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let documents = [];

    // ─── 1. User KYC Documents ──────────────────────────────────────────
    // Agent ID Documents
    if (user.agentDetails?.idDocuments?.length > 0) {
      user.agentDetails.idDocuments.forEach((doc, index) => {
        const docTypeMap = {
          driving_license: "Driving License",
          passport: "Passport",
          proof_of_address: "Proof of Address",
          other_id: "Other ID",
        };
        documents.push({
          _id: `${user._id}_agent_${index}`,
          name: doc.originalName || doc.fileName || "ID Document",
          type: doc.docType || "other_id",
          typeLabel: docTypeMap[doc.docType] || "ID Document",
          category: "KYC / Verification",
          fileUrl: doc.fileUrl,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          uploadedAt: doc.uploadedAt || user.createdAt,
          verificationStatus: doc.verificationStatus || "pending",
          verifiedBy: doc.verifiedBy,
          verifiedAt: doc.verifiedAt,
          rejectionReason: doc.rejectionReason,
          source: "user_kyc",
          sourceType: "User KYC",
          userRole: "agent",
        });
      });
    }

    // Owner Documents
    if (user.ownerDocuments?.length > 0) {
      user.ownerDocuments.forEach((doc, index) => {
        const docTypeMap = {
          driving_license: "Driving License",
          passport: "Passport",
          proof_of_address: "Proof of Address",
          other_id: "Other ID",
        };
        documents.push({
          _id: `${user._id}_owner_${index}`,
          name: doc.originalName || doc.fileName || "ID Document",
          type: doc.docType || "other_id",
          typeLabel: docTypeMap[doc.docType] || "ID Document",
          category: "KYC / Verification",
          fileUrl: doc.fileUrl,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          uploadedAt: doc.uploadedAt || user.createdAt,
          verificationStatus: doc.verificationStatus || "pending",
          verifiedBy: doc.verifiedBy,
          verifiedAt: doc.verifiedAt,
          rejectionReason: doc.rejectionReason,
          source: "user_kyc",
          sourceType: "User KYC",
          userRole: "owner",
        });
      });
    }

    // ─── 2. Property Documents ──────────────────────────────────────────
    const properties = await Property.find({ createdBy: userId })
      .select("propertyTitle media legalInfo createdAt")
      .lean();

    properties.forEach((property) => {
      const propTitle = property.propertyTitle || "Untitled Property";
      const propId = property._id;

      // Property Images
      if (property.media?.propertyImages?.length > 0) {
        property.media.propertyImages.forEach((url, index) => {
          documents.push({
            _id: `${propId}_image_${index}`,
            name: `${propTitle} - Image ${index + 1}`,
            type: "image",
            typeLabel: "Property Image",
            category: "Property Images",
            fileUrl: url,
            fileSize: null,
            mimeType: "image/webp",
            uploadedAt: property.createdAt,
            propertyId: propId,
            propertyTitle: propTitle,
            source: "property_media",
            sourceType: "Property Image",
            verificationStatus: "approved",
          });
        });
      }

      // Property Videos
      if (property.media?.propertyVideos?.length > 0) {
        property.media.propertyVideos.forEach((url, index) => {
          documents.push({
            _id: `${propId}_video_${index}`,
            name: `${propTitle} - Video ${index + 1}`,
            type: "video",
            typeLabel: "Property Video",
            category: "Property Videos",
            fileUrl: url,
            fileSize: null,
            mimeType: "video/mp4",
            uploadedAt: property.createdAt,
            propertyId: propId,
            propertyTitle: propTitle,
            source: "property_media",
            sourceType: "Property Video",
            verificationStatus: "approved",
          });
        });
      }

      // Floor Plans
      if (property.media?.floorPlans?.length > 0) {
        property.media.floorPlans.forEach((url, index) => {
          documents.push({
            _id: `${propId}_floorplan_${index}`,
            name: `${propTitle} - Floor Plan ${index + 1}`,
            type: "floor_plan",
            typeLabel: "Floor Plan",
            category: "Floor Plans",
            fileUrl: url,
            fileSize: null,
            mimeType: "application/pdf",
            uploadedAt: property.createdAt,
            propertyId: propId,
            propertyTitle: propTitle,
            source: "property_media",
            sourceType: "Floor Plan",
            verificationStatus: "approved",
          });
        });
      }

      // Legal Documents (from media)
      if (property.media?.legalDocuments?.length > 0) {
        property.media.legalDocuments.forEach((url, index) => {
          documents.push({
            _id: `${propId}_legal_${index}`,
            name: `${propTitle} - Legal Document ${index + 1}`,
            type: "legal",
            typeLabel: "Legal Document",
            category: "Legal Documents",
            fileUrl: url,
            fileSize: null,
            mimeType: "application/pdf",
            uploadedAt: property.createdAt,
            propertyId: propId,
            propertyTitle: propTitle,
            source: "property_media",
            sourceType: "Legal Document",
            verificationStatus: "approved",
          });
        });
      }

      // Private Legal Documents (from legalInfo with docType)
      if (property.legalInfo?.privateDocuments?.length > 0) {
        property.legalInfo.privateDocuments.forEach((doc, index) => {
          const docTypeMap = {
            photo_id: "Photo ID",
            solicitor_doc: "Solicitor Document",
            legal_pack: "Legal Pack",
            proof_of_address: "Proof of Address",
            other: "Other Document",
          };
          documents.push({
            _id: `${propId}_private_${index}`,
            name:
              doc.originalName ||
              doc.fileName ||
              doc.customLabel ||
              `Private Document ${index + 1}`,
            type: doc.docType || "other",
            typeLabel:
              docTypeMap[doc.docType] ||
              doc.customLabel ||
              "Private Legal Document",
            category: "Private Legal Documents",
            fileUrl: doc.url,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            uploadedAt: doc.uploadedAt || property.createdAt,
            propertyId: propId,
            propertyTitle: propTitle,
            source: "property_legal",
            sourceType: "Private Legal",
            verificationStatus: "approved",
            customLabel: doc.customLabel,
          });
        });
      }
    });

    // Sort by uploadedAt (most recent first)
    documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    const totalCount = documents.length;
    const paginatedDocs = documents.slice(skip, skip + limit);

    res.json({
      success: true,
      data: paginatedDocs,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[User] getUserDocuments error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const userId = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const Invoice = (await import("../invoice/invoice.model.js")).default;
    const Payment = (await import("../payment/payment.model.js")).default;
    const Commission = (await import("../commission/commission.model.js"))
      .default;
    const Property = (await import("../property/property.model.js")).default;
    const User = (await import("./user.model.js")).default;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let payments = [];

    // ─── 1. Invoices (as Buyer) ──────────────────────────────────────────
    const buyerInvoices = await Invoice.find({ buyer: userId })
      .populate({
        path: "property",
        select: "propertyTitle slug location",
        populate: {
          path: "location",
          select: "city area postcode streetAddress",
        },
      })
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    buyerInvoices.forEach((invoice) => {
      const property = invoice.property || {};
      const location = property.location || {};
      const addressParts = [
        location.streetAddress,
        location.city,
        location.area,
        location.postcode,
      ].filter(Boolean);
      const fullAddress =
        addressParts.length > 0 ? addressParts.join(", ") : "";

      payments.push({
        _id: invoice._id,
        reference: invoice.invoiceNumber,
        type: "invoice_buyer",
        typeLabel: "Invoice (Buyer)",
        propertyId: property._id,
        propertyTitle: property.propertyTitle || "N/A",
        propertySlug: property.slug || null,
        propertyAddress: fullAddress,
        propertyLocation: location.city || location.area || "",
        amount: invoice.totalAmount || invoice.salePrice || 0,
        status: invoice.status || "pending",
        date: invoice.issuedDate || invoice.createdAt,
        dueDate: invoice.dueDate,
        description: `Invoice for ${property.propertyTitle || "Property"}`,
        salePrice: invoice.salePrice,
        buyersFee: invoice.buyersFeeAmount,
        vatAmount: invoice.vatAmount,
        depositAmount: invoice.depositAmount,
        invoiceNumber: invoice.invoiceNumber,
        invoiceType: invoice.invoiceType,
        counterparty: invoice.seller?.name || "N/A",
      });
    });

    // ─── 2. Invoices (as Seller) ──────────────────────────────────────────
    const sellerInvoices = await Invoice.find({ seller: userId })
      .populate({
        path: "property",
        select: "propertyTitle slug location",
        populate: {
          path: "location",
          select: "city area postcode streetAddress",
        },
      })
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    sellerInvoices.forEach((invoice) => {
      const property = invoice.property || {};
      const location = property.location || {};
      const addressParts = [
        location.streetAddress,
        location.city,
        location.area,
        location.postcode,
      ].filter(Boolean);
      const fullAddress =
        addressParts.length > 0 ? addressParts.join(", ") : "";

      payments.push({
        _id: invoice._id,
        reference: invoice.invoiceNumber,
        type: "invoice_seller",
        typeLabel: "Invoice (Seller)",
        propertyId: property._id,
        propertyTitle: property.propertyTitle || "N/A",
        propertySlug: property.slug || null,
        propertyAddress: fullAddress,
        propertyLocation: location.city || location.area || "",
        amount: invoice.totalAmount || invoice.salePrice || 0,
        status: invoice.status || "pending",
        date: invoice.issuedDate || invoice.createdAt,
        dueDate: invoice.dueDate,
        description: `Invoice for ${property.propertyTitle || "Property"}`,
        salePrice: invoice.salePrice,
        buyersFee: invoice.buyersFeeAmount,
        vatAmount: invoice.vatAmount,
        depositAmount: invoice.depositAmount,
        invoiceNumber: invoice.invoiceNumber,
        invoiceType: invoice.invoiceType,
        counterparty: invoice.buyer?.name || "N/A",
      });
    });

    // ─── 3. Payments (as Buyer) ──────────────────────────────────────────
    const buyerPayments = await Payment.find({ buyer: userId })
      .populate({
        path: "property",
        select: "propertyTitle slug location",
        populate: {
          path: "location",
          select: "city area postcode streetAddress",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    buyerPayments.forEach((payment) => {
      const property = payment.property || {};
      const location = property.location || {};
      const addressParts = [
        location.streetAddress,
        location.city,
        location.area,
        location.postcode,
      ].filter(Boolean);
      const fullAddress =
        addressParts.length > 0 ? addressParts.join(", ") : "";

      payments.push({
        _id: payment._id,
        reference:
          payment.reference || payment._id.toString().slice(-8).toUpperCase(),
        type: "payment_buyer",
        typeLabel: "Payment (Buyer)",
        propertyId: property._id,
        propertyTitle: property.propertyTitle || "N/A",
        propertySlug: property.slug || null,
        propertyAddress: fullAddress,
        propertyLocation: location.city || location.area || "",
        amount: payment.amount || 0,
        status: payment.status || "pending",
        date: payment.createdAt,
        dueDate: payment.dueDate,
        description: `Payment for ${property.propertyTitle || "Property"}`,
        method: payment.method,
        paidAt: payment.paidAt,
      });
    });

    // ─── 4. Commissions (as Agent) ──────────────────────────────────────
    const commissions = await Commission.find({ agent: userId })
      .populate({
        path: "property",
        select: "propertyTitle slug location",
        populate: {
          path: "location",
          select: "city area postcode streetAddress",
        },
      })
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    commissions.forEach((commission) => {
      const property = commission.property || {};
      const location = property.location || {};
      const addressParts = [
        location.streetAddress,
        location.city,
        location.area,
        location.postcode,
      ].filter(Boolean);
      const fullAddress =
        addressParts.length > 0 ? addressParts.join(", ") : "";

      payments.push({
        _id: commission._id,
        reference: commission._id.toString().slice(-8).toUpperCase(),
        type: "commission",
        typeLabel: "Commission",
        propertyId: property._id,
        propertyTitle: property.propertyTitle || "N/A",
        propertySlug: property.slug || null,
        propertyAddress: fullAddress,
        propertyLocation: location.city || location.area || "",
        amount: commission.commissionAmount || 0,
        status: commission.status || "pending",
        date: commission.createdAt,
        description: `Commission for ${property.propertyTitle || "Property"}`,
        salePrice: commission.salePrice,
        commissionRate: commission.commissionRate,
        paidAt: commission.paidAt,
        buyer: commission.buyer?.name || "N/A",
      });
    });

    // Sort by date (most recent first)
    payments.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalCount = payments.length;
    const paginatedPayments = payments.slice(0, limit);

    res.json({
      success: true,
      data: paginatedPayments,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[User] getUserPayments error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const User = (await import("./user.model.js")).default;
    const Property = (await import("../property/property.model.js")).default;
    const Auction = (await import("../auction/auction.model.js")).default;
    const Bid = (await import("../bid/bid.model.js")).default;
    const Invoice = (await import("../invoice/invoice.model.js")).default;
    const Payment = (await import("../payment/payment.model.js")).default;
    const Commission = (await import("../commission/commission.model.js"))
      .default;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const activities = [];

    // ─── 1. USER ACTIVITIES ──────────────────────────────────────────────
    // User Registration
    activities.push({
      type: "user_registered",
      label: "Account Registered",
      description: `${user.name} registered their account`,
      icon: "user",
      color: "blue",
      date: user.createdAt,
      userId: user._id,
      metadata: { email: user.email, role: user.role },
    });

    // KYC Documents (from user model)
    const kycDocs = [
      ...(user.agentDetails?.idDocuments || []),
      ...(user.ownerDocuments || []),
    ];

    kycDocs.forEach((doc) => {
      const docTypeMap = {
        driving_license: "Driving License",
        passport: "Passport",
        proof_of_address: "Proof of Address",
        other_id: "Other ID",
      };
      activities.push({
        type: "kyc_uploaded",
        label: "KYC Document Uploaded",
        description: `${docTypeMap[doc.docType] || "ID Document"} uploaded for verification`,
        icon: "shield",
        color: "amber",
        date: doc.uploadedAt || user.createdAt,
        userId: user._id,
        metadata: { docType: doc.docType, status: doc.verificationStatus },
      });

      if (doc.verificationStatus === "verified") {
        activities.push({
          type: "kyc_verified",
          label: "KYC Document Verified",
          description: `${docTypeMap[doc.docType] || "ID Document"} has been verified`,
          icon: "shield",
          color: "green",
          date: doc.verifiedAt || user.createdAt,
          userId: user._id,
          metadata: { docType: doc.docType, verifiedBy: doc.verifiedBy },
        });
      }
    });

    // ─── 2. PROPERTY ACTIVITIES ──────────────────────────────────────────
    const properties = await Property.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    properties.forEach((prop) => {
      // Property Created
      activities.push({
        type: "property_created",
        label: "Property Listed",
        description: `${prop.propertyTitle} was listed for ${prop.listingType === "auction" ? "auction" : "sale"}`,
        icon: "property",
        color: "blue",
        date: prop.createdAt,
        userId: userId,
        metadata: {
          propertyId: prop._id,
          propertyTitle: prop.propertyTitle,
          listingType: prop.listingType,
          status: prop.propertyStatus,
        },
      });

      // Property Status Change
      if (prop.propertyStatus === "sold") {
        activities.push({
          type: "property_sold",
          label: "Property Sold",
          description: `${prop.propertyTitle} was sold${prop.soldPrice ? ` for ${formatPrice(prop.soldPrice)}` : ""}`,
          icon: "property",
          color: "green",
          date: prop.updatedAt,
          userId: userId,
          metadata: {
            propertyId: prop._id,
            propertyTitle: prop.propertyTitle,
            soldPrice: prop.soldPrice,
          },
        });
      }

      if (prop.propertyStatus === "unsold") {
        activities.push({
          type: "property_unsold",
          label: "Property Unsold",
          description: `${prop.propertyTitle} did not sell in auction`,
          icon: "property",
          color: "orange",
          date: prop.updatedAt,
          userId: userId,
          metadata: { propertyId: prop._id, propertyTitle: prop.propertyTitle },
        });
      }
    });

    // ─── 4. BID ACTIVITIES ──────────────────────────────────────────────
    const bids = await Bid.find({ bidder: userId })
      .populate("property", "propertyTitle")
      .populate("auction", "auctionTitle slug")
      .sort({ createdAt: -1 })
      .lean();

    bids.forEach((bid) => {
      const statusMap = {
        won: "Won",
        winning: "Currently Winning",
        outbid: "Outbid",
        bidding: "Bid Placed",
        lost: "Lost",
        retracted: "Retracted",
      };

      const statusLabel = statusMap[bid.status] || bid.status;
      const emoji =
        bid.status === "won"
          ? "🏆"
          : bid.status === "winning"
            ? "👑"
            : bid.status === "outbid"
              ? "📉"
              : "📈";

      activities.push({
        type: "bid_placed",
        label: `${statusLabel} Bid`,
        description: `${emoji} ${statusLabel} bid of ${formatPrice(bid.amount)} on ${bid.property?.propertyTitle || "property"}`,
        icon: "bid",
        color:
          bid.status === "won"
            ? "green"
            : bid.status === "winning"
              ? "teal"
              : bid.status === "outbid"
                ? "orange"
                : "blue",
        date: bid.createdAt,
        userId: userId,
        metadata: {
          bidId: bid._id,
          amount: bid.amount,
          status: bid.status,
          propertyId: bid.property?._id,
          propertyTitle: bid.property?.propertyTitle,
          auctionId: bid.auction?._id,
          auctionTitle: bid.auction?.auctionTitle,
        },
      });
    });

    // ─── 5. INVOICE ACTIVITIES ──────────────────────────────────────────
    // As Buyer
    const buyerInvoices = await Invoice.find({ buyer: userId })
      .populate("property", "propertyTitle")
      .sort({ createdAt: -1 })
      .lean();

    buyerInvoices.forEach((invoice) => {
      const statusMap = {
        pending: "Generated",
        paid: "Paid",
        overdue: "Overdue",
        cancelled: "Cancelled",
        withdrawn: "Withdrawn",
      };

      activities.push({
        type: "invoice_created",
        label: `Invoice ${statusMap[invoice.status] || "Created"}`,
        description: `Invoice ${invoice.invoiceNumber} of ${formatPrice(invoice.totalAmount)} for ${invoice.property?.propertyTitle || "property"}`,
        icon: "payment",
        color:
          invoice.status === "paid"
            ? "green"
            : invoice.status === "overdue"
              ? "red"
              : "blue",
        date: invoice.issuedDate || invoice.createdAt,
        userId: userId,
        metadata: {
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.totalAmount,
          status: invoice.status,
          propertyId: invoice.property?._id,
        },
      });
    });

    // ─── 6. PAYMENT ACTIVITIES ──────────────────────────────────────────
    const payments = await Payment.find({ buyer: userId })
      .populate("property", "propertyTitle")
      .sort({ createdAt: -1 })
      .lean();

    payments.forEach((payment) => {
      const statusMap = {
        pending: "Initiated",
        paid: "Completed",
        overdue: "Overdue",
        refunded: "Refunded",
        cancelled: "Cancelled",
        withdrawn: "Withdrawn",
      };

      activities.push({
        type: "payment_made",
        label: `Payment ${statusMap[payment.status] || "Created"}`,
        description: `Payment of ${formatPrice(payment.amount)} for ${payment.property?.propertyTitle || "property"} ${payment.status === "paid" ? "✅ Completed" : ""}`,
        icon: "payment",
        color:
          payment.status === "paid"
            ? "green"
            : payment.status === "pending"
              ? "amber"
              : "red",
        date: payment.createdAt,
        userId: userId,
        metadata: {
          paymentId: payment._id,
          amount: payment.amount,
          status: payment.status,
          propertyId: payment.property?._id,
          method: payment.method,
        },
      });
    });

    // ─── 7. COMMISSION ACTIVITIES ──────────────────────────────────────
    const commissions = await Commission.find({ agent: userId })
      .populate("property", "propertyTitle")
      .sort({ createdAt: -1 })
      .lean();

    commissions.forEach((commission) => {
      const statusMap = {
        pending: "Earned (Pending)",
        approved: "Approved",
        paid: "Paid",
        disputed: "Disputed",
        voided: "Voided",
      };

      activities.push({
        type: "commission_earned",
        label: `Commission ${statusMap[commission.status] || "Created"}`,
        description: `Commission of ${formatPrice(commission.commissionAmount)} on ${commission.property?.propertyTitle || "property"} ${commission.status === "paid" ? "✅ Paid" : ""}`,
        icon: "payment",
        color:
          commission.status === "paid"
            ? "green"
            : commission.status === "approved"
              ? "blue"
              : "amber",
        date: commission.createdAt,
        userId: userId,
        metadata: {
          commissionId: commission._id,
          amount: commission.commissionAmount,
          status: commission.status,
          propertyId: commission.property?._id,
          salePrice: commission.salePrice,
        },
      });
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalCount = activities.length;
    const paginatedActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[User] getUserActivity error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
