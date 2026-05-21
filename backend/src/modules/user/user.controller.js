import User from "./user.model.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select("-password -refreshToken");
    res.status(200).json({ success: true, data: users });
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

// Update user profile (name, email, role)
export const updateUser = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.role) updates.role = req.body.role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password -refreshToken");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res
      .status(200)
      .json({ success: true, data: user, message: "User updated" });
  } catch (error) {
    console.error('[User] updateUser error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
