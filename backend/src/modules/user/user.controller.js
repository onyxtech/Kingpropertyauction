import User from "./user.model.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select("-password -refreshToken").lean();
    const usersWithStatus = users.map(u => ({
      ...u,
      status: !u.isActive ? "suspended"
        : u.roleRequest?.status === "pending" ? "pending"
        : "active",
    }));
    res.status(200).json({ success: true, data: usersWithStatus });
  } catch (error) {
    console.error('[User] getAllUsers error:', error.message);
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
    console.error('[User] updateUserStatus error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buyer requests to become a seller
export const requestRoleSwitch = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Admins cannot change roles" });
    }

    if (user.roleRequest?.status === "pending") {
      return res.status(400).json({ success: false, message: "You already have a pending role request" });
    }

    const { requestedRole = "seller", message: note } = req.body;
    if (!["seller", "agent", "buyer"].includes(requestedRole)) {
      return res.status(400).json({ success: false, message: "Invalid requested role" });
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
      const { isNotificationEnabled } = await import("../settings/settings.service.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      const admins = await User.find({ role: "admin" }).select("email name").lean();
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
          }).catch(e => console.warn("Role request admin email failed:", e.message));
        }
      }
      await Notification.create({
        type: "user",
        icon: "user",
        message: `Role request: ${req.user.name} wants to become ${requestedRole}`,
        link: "/admin/users",
        color: "amber",
        targetUser: null,
      }).catch(e => console.warn("Admin notification failed:", e.message));

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

    res.status(200).json({ success: true, message: "Role request submitted successfully", data: { roleRequest: user.roleRequest } });
  } catch (error) {
    console.error('[User] requestRoleSwitch error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seller/agent switches active dashboard view
export const switchActiveView = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const canSwitch = ["seller", "agent", "admin"].includes(user.role);
    if (!canSwitch) {
      return res.status(403).json({ success: false, message: "Only sellers and agents can switch views" });
    }

    const { view } = req.body;
    if (!["buyer", "seller"].includes(view)) {
      return res.status(400).json({ success: false, message: "Invalid view. Use 'buyer' or 'seller'" });
    }

    user.activeView = view;
    await user.save();

    res.status(200).json({ success: true, message: `Switched to ${view} view`, data: { activeView: view } });
  } catch (error) {
    console.error('[User] switchActiveView error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin reviews a role request
export const reviewRoleRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.roleRequest || user.roleRequest.status !== "pending") {
      return res.status(400).json({ success: false, message: "No pending role request for this user" });
    }

    const { decision, reviewNote } = req.body;
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Decision must be 'approved' or 'rejected'" });
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
      const { isNotificationEnabled } = await import("../settings/settings.service.js");
      const Notification = (await import("../notifications/notification.model.js")).default;
      const enabled = await isNotificationEnabled("roleRequestApproved");
      const isApproved = decision === "approved";
      const requestedRole = user.roleRequest.requestedRole;
      const permissionsSummary = isApproved
        ? (requestedRole === "buyer" || user.permissions?.canBid)
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
        }).catch(e => console.warn("Role approval email failed:", e.message));
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
      }).catch(e => console.warn("User notification failed:", e.message));
    } catch (e) {
      console.warn("Role review notifications failed:", e.message);
    }

    const updatedUser = await User.findById(req.params.id).select("-password -refreshToken");
    res.status(200).json({ success: true, message: `Role request ${decision}`, data: updatedUser });
  } catch (error) {
    console.error('[User] reviewRoleRequest error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile (name, email, role, agentDetails, bankDetails)
export const updateUser = async (req, res) => {
  try {
    const allowedFields = ["name", "email", "phone", "role", "isActive"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Handle agentDetails merge
    if (req.body.agentDetails) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      user.agentDetails = { ...((user.agentDetails || {})), ...req.body.agentDetails };
      user.markModified("agentDetails");
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
      }
      await user.save();
      const updated = await User.findById(req.params.id).select("-password -refreshToken");
      return res.json({ success: true, data: updated, message: "User updated" });
    }

    // Handle bankDetails merge
    if (req.body.bankDetails) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      user.bankDetails = { ...((user.bankDetails || {})), ...req.body.bankDetails };
      user.markModified("bankDetails");
      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
      }
      await user.save();
      const updated = await User.findById(req.params.id).select("-password -refreshToken");
      return res.json({ success: true, data: updated, message: "User updated" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .select("-password -refreshToken");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user, message: "User updated" });
  } catch (error) {
    console.error('[User] updateUser error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single user with full stats (admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshToken")
      .lean();

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const Property = (await import("../property/property.model.js")).default;
    const Bid = (await import("../bid/bid.model.js")).default;
    const Commission = (await import("../commission/commission.model.js")).default;
    const Payment = (await import("../payment/payment.model.js")).default;

    const [totalProperties, totalBids, wonBids, commissions, payments] = await Promise.all([
      Property.countDocuments({ createdBy: user._id }),
      Bid.countDocuments({ bidder: user._id }),
      Bid.countDocuments({ bidder: user._id, status: "won" }),
      Commission.find({ agent: user._id })
        .populate("property", "propertyTitle")
        .lean(),
      Payment.find({ buyer: user._id })
        .populate("property", "propertyTitle")
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          totalProperties,
          totalBids,
          wonBids,
          totalCommissions: commissions.length,
          pendingCommission: commissions
            .filter(c => c.status === "pending")
            .reduce((s, c) => s + c.commissionAmount, 0),
          paidCommission: commissions
            .filter(c => c.status === "paid")
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
