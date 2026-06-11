import { sendEmail } from "./email.service.js";
import { isNotificationEnabled } from "../settings/settings.service.js";
import User from "../user/user.model.js";
import Property from "../property/property.model.js";
import Auction from "../auction/auction.model.js";
import Bid from "../bid/bid.model.js";
import Notification from "./notification.model.js";

// Event types
export const NotificationEvents = {
  USER_REGISTERED: "user.registered",
  USER_APPROVED: "user.approved",
  USER_REJECTED: "user.rejected",
  BID_PLACED: "bid.placed",
  BID_OUTBID: "bid.outbid",
  AUCTION_WON: "auction.won",
  AUCTION_LOST: "auction.lost",
  PROPERTY_SUBMITTED: "property.submitted",
  PROPERTY_APPROVED: "property.approved",
  PROPERTY_REJECTED: "property.rejected",
  PROPERTY_SOLD: "property.sold",
  PROPERTY_UNSOLD: "property.unsold",
  AUCTION_STARTING_SOON: "auction.startingSoon",
  AUCTION_STARTED: "auction.started",
  AUCTION_ENDED: "auction.ended",
};

class NotificationTriggerService {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  async emit(event, data) {
    const callbacks = this.listeners[event] || [];
    for (const callback of callbacks) {
      try {
        await callback(data);
      } catch (e) {
        console.error(`[Notification] Error handling ${event}:`, e.message);
      }
    }
  }
}

const notificationService = new NotificationTriggerService();

// ─── Register Event Handlers ───

// Welcome Email
notificationService.on(
  NotificationEvents.USER_REGISTERED,
  async ({ userId }) => {
    const enabled = await isNotificationEnabled('welcome');
    if (!enabled) return;

    const user = await User.findById(userId);
    if (!user) return;

    // If user is already active (created by admin), send approval email
    if (user.isActive) {
      await sendEmail({
        to: user.email,
        subject: 'Your Account Has Been Created',
        templateKey: 'accountApproved',
        variables: {
          user_name: user.name,
          site_url: process.env.CLIENT_URL || 'http://localhost:5173',
        },
      });
      return;
    }

    // Normal registration - pending approval
    await sendEmail({
      to: user.email,
      subject: 'Welcome to King Property Auction! 🏠',
      templateKey: 'welcome',
      variables: {
        user_name: user.name,
        site_url: process.env.CLIENT_URL || 'http://localhost:5173',
      },
    });

    await Notification.create({
      type: "user",
      icon: "user",
      message: `New ${user.role} registered: ${user.name} (${user.email})`,
      link: "/admin/users",
      color: "blue",
      targetUser: null,
    }).catch(e => console.warn("Admin notification failed:", e.message));
  },
);

// Account Approved Email
notificationService.on(NotificationEvents.USER_APPROVED, async ({ userId }) => {
  const enabled = await isNotificationEnabled("accountApproved");
  if (!enabled) return;

  const user = await User.findById(userId);
  if (!user) return;

  await sendEmail({
    to: user.email,
    subject: "Your account has been approved! ✅",
    templateKey: "accountApproved",
    variables: {
      user_name: user.name,
      site_url: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });

  await Notification.create({
    type: "user",
    icon: "check",
    message: "🎉 Your account has been approved! You can now access all features.",
    link: "/dashboard",
    color: "green",
    targetUser: user._id,
  }).catch(e => console.warn("User approval notification failed:", e.message));

  const { emitToUser } = await import("../../socket.js");
  emitToUser(user._id.toString(), "new_notification", {
    type: "user",
    message: "Your account has been approved!",
    link: "/dashboard",
  });
});

// Account Rejected Email
notificationService.on(
  NotificationEvents.USER_REJECTED,
  async ({ userId, reason }) => {
    const enabled = await isNotificationEnabled("accountRejected");
    if (!enabled) return;

    const user = await User.findById(userId);
    if (!user) return;

    await sendEmail({
      to: user.email,
      subject: "Account Status Update",
      templateKey: "accountRejected",
      variables: {
        user_name: user.name,
        reason: reason || "Your account was not approved.",
      },
    });

    await Notification.create({
      type: "user",
      icon: "x-circle",
      message: `Your account application was not approved.${reason ? ' Reason: ' + reason : ''}`,
      link: "/login",
      color: "red",
      targetUser: user._id,
    }).catch(e => console.warn("User rejection notification failed:", e.message));

    const { emitToUser } = await import("../../socket.js");
    emitToUser(user._id.toString(), "new_notification", {
      type: "user",
      message: "Your account application was not approved.",
      link: "/login",
      color: "red",
    });
  },
);

// ─── Bidding Events ───

// Bid Confirmation
notificationService.on(
  NotificationEvents.BID_PLACED,
  async ({ userId, propertyId, auctionId, amount }) => {
    const enabled = await isNotificationEnabled("bidConfirmation");
    if (!enabled) return;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    if (!user || !property) return;

    await sendEmail({
      to: user.email,
      subject: `Bid Confirmed - ${property.propertyTitle}`,
      templateKey: "bidConfirmation",
      variables: {
        user_name: user.name,
        property_title: property.propertyTitle,
        bid_amount: `£${amount.toLocaleString()}`,
        current_bid: `£${amount.toLocaleString()}`,
        property_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/properties/${property.slug || property._id}`,
      },
    });

    // Notify the property SELLER
    try {
      const sellerProperty = await Property.findById(propertyId)
        .populate("createdBy", "name email _id").lean();

      if (sellerProperty?.createdBy &&
          sellerProperty.createdBy._id.toString() !== userId.toString()) {
        await Notification.create({
          type: "bid",
          icon: "gavel",
          message: `New bid of £${amount.toLocaleString()} placed on ${sellerProperty.propertyTitle}`,
          link: "/dashboard/property-bidders",
          color: "blue",
          targetUser: sellerProperty.createdBy._id,
        }).catch(e => console.warn("Seller bid notification failed:", e.message));

        const { emitToUser } = await import("../../socket.js");
        emitToUser(sellerProperty.createdBy._id.toString(), "new_notification", {
          type: "bid",
          message: `New bid of £${amount.toLocaleString()} on ${sellerProperty.propertyTitle}`,
          link: "/dashboard/property-bidders",
        });
      }
    } catch (e) {
      console.warn("Seller bid notification failed:", e.message);
    }

    // Admin notification for new bid
    await Notification.create({
      type: "bid",
      icon: "gavel",
      message: `New bid of £${amount.toLocaleString()} placed on ${property?.propertyTitle || "property"}`,
      link: `/admin/bids`,
      color: "purple",
      targetUser: null,
    }).catch(e => console.warn("Admin bid notification failed:", e.message));
  },
);

// Outbid Alert
notificationService.on(
  NotificationEvents.BID_OUTBID,
  async ({ userId, propertyId, auctionId, newAmount, previousAmount }) => {
    const enabled = await isNotificationEnabled("outbidAlert");

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    if (!user || !property) return;

    // Save notification to DB for user dashboard
    await Notification.create({
      type: "bid",
      icon: "alert-circle",
      message: `You've been outbid on ${property.propertyTitle}. New highest bid: £${newAmount.toLocaleString()}`,
      link: `/auctions/${auctionId}`,
      color: "orange",
      targetUser: userId,
    }).catch((e) => console.error("[Notification] Failed to save outbid notification:", e.message));

    if (!enabled) return;

    await sendEmail({
      to: user.email,
      subject: `⚠️ You've been outbid on ${property.propertyTitle}`,
      templateKey: "outbidAlert",
      variables: {
        user_name: user.name,
        property_title: property.propertyTitle,
        your_bid: `£${previousAmount.toLocaleString()}`,
        current_bid: `£${newAmount.toLocaleString()}`,
        property_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/properties/${property.slug || property._id}`,
      },
    });
  },
);

// Auction Won
notificationService.on(
  NotificationEvents.AUCTION_WON,
  async ({ userId, propertyId, auctionId, finalPrice }) => {
    const enabled = await isNotificationEnabled("auctionWon");

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    const auction = await Auction.findById(auctionId);
    if (!user || !property) return;

    // Save notification to DB for user dashboard
    await Notification.create({
      type: "bid_won",
      icon: "award",
      message: `Congratulations! You won the auction for ${property.propertyTitle} at £${finalPrice.toLocaleString()}`,
      link: `/auctions/${auctionId}`,
      color: "green",
      targetUser: userId,
    }).catch((e) => console.error("[Notification] Failed to save auction_won notification:", e.message));

    if (!enabled) return;

    await sendEmail({
      to: user.email,
      subject: `🎉 Congratulations! You won ${property.propertyTitle}`,
      templateKey: "auctionWon",
      variables: {
        user_name: user.name,
        property_title: property.propertyTitle,
        final_price: `£${finalPrice.toLocaleString()}`,
        auction_name: auction?.auctionTitle || "Auction",
      },
    });
  },
);

// Auction Lost
notificationService.on(
  NotificationEvents.AUCTION_LOST,
  async ({ userId, propertyId, auctionId, finalPrice }) => {
    const enabled = await isNotificationEnabled("auctionLost");

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    if (!user || !property) return;

    // Save notification to DB for user dashboard
    await Notification.create({
      type: "bid",
      icon: "x-circle",
      message: `Auction ended for ${property.propertyTitle}. Unfortunately you did not win.`,
      link: `/auctions/${auctionId}`,
      color: "red",
      targetUser: userId,
    }).catch((e) => console.error("[Notification] Failed to save auction_lost notification:", e.message));

    if (!enabled) return;

    await sendEmail({
      to: user.email,
      subject: `Auction Ended - ${property.propertyTitle}`,
      templateKey: "auctionLost",
      variables: {
        user_name: user.name,
        property_title: property.propertyTitle,
        final_price: `£${finalPrice.toLocaleString()}`,
        site_url: process.env.CLIENT_URL || "http://localhost:5173",
      },
    });
  },
);

// ─── Property Submitted ───
notificationService.on(
  NotificationEvents.PROPERTY_SUBMITTED,
  async ({ propertyId, userId }) => {
    const enabled = await isNotificationEnabled("propertySubmitted");
    if (!enabled) return;

    const property = await Property.findById(propertyId);
    const user = await User.findById(userId);
    if (!property || !user) return;

    // Only notify admins if the submitter is NOT an admin (avoids self-notification)
    if (user.role === "admin") return;

    const admins = await User.find({ role: "admin", isActive: true });
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `📋 New Property Submitted - ${property.propertyTitle}`,
        templateKey: "propertySubmitted",
        variables: {
          user_name: admin.name,
          property_title: property.propertyTitle,
          submitted_by: user?.name || "Unknown",
          property_url: `${process.env.CLIENT_URL}/admin/properties`,
        },
      });
    }

    // Admin DB notification for property submission
    await Notification.create({
      type: "property",
      icon: "building",
      message: `New property submitted for approval: ${property?.propertyTitle || "property"}`,
      link: `/admin/properties`,
      color: "blue",
      targetUser: null,
    }).catch(e => console.warn("Admin property notification failed:", e.message));
  },
);

// ─── Property Approved ───
notificationService.on(
  NotificationEvents.PROPERTY_APPROVED,
  async ({ propertyId }) => {
    const enabled = await isNotificationEnabled("propertyApproved");
    if (!enabled) return;

    const property = await Property.findById(propertyId).populate(
      "createdBy",
      "name email",
    );
    if (!property?.createdBy) return;

    await sendEmail({
      to: property.createdBy.email,
      subject: `✅ Your property has been approved - ${property.propertyTitle}`,
      templateKey: "propertyApproved",
      variables: {
        user_name: property.createdBy.name,
        property_title: property.propertyTitle,
        property_url: `${process.env.CLIENT_URL}/properties/${property.slug || property._id}`,
      },
    });

    await Notification.create({
      type: "property",
      icon: "building",
      message: `✅ Your property "${property.propertyTitle}" has been approved and is now live.`,
      link: `/properties/${property.slug || property._id}`,
      color: "green",
      targetUser: property.createdBy._id,
    }).catch(e => console.warn("Property approved user notification failed:", e.message));

    const { emitToUser } = await import("../../socket.js");
    emitToUser(property.createdBy._id.toString(), "new_notification", {
      type: "property",
      message: `Your property "${property.propertyTitle}" has been approved!`,
      link: `/properties/${property.slug || property._id}`,
    });
  },
);

// ─── Property Rejected ───
notificationService.on(
  NotificationEvents.PROPERTY_REJECTED,
  async ({ propertyId, reason }) => {
    const enabled = await isNotificationEnabled('propertyRejected');
    if (!enabled) return;

    const property = await Property.findById(propertyId)
      .populate('createdBy', 'name email');
    if (!property?.createdBy) return;

    await sendEmail({
      to: property.createdBy.email,
      subject: `Property Update - ${property.propertyTitle}`,
      templateKey: 'propertyRejected',
      variables: {
        user_name: property.createdBy.name,
        property_title: property.propertyTitle,
        reason: reason || 'Your property did not meet our current requirements.',
      },
    });

    await Notification.create({
      type: "property",
      icon: "x-circle",
      message: `❌ Your property "${property.propertyTitle}" was not approved.`,
      link: "/dashboard/my-properties",
      color: "red",
      targetUser: property.createdBy._id,
    }).catch(e => console.warn("Property rejected user notification failed:", e.message));
  },
);

// ─── Property Sold ───
notificationService.on(
  NotificationEvents.PROPERTY_SOLD,
  async ({ propertyId }) => {
    const enabled = await isNotificationEnabled("propertySold");
    if (!enabled) return;

    const property = await Property.findById(propertyId).populate(
      "createdBy",
      "name email",
    );
    if (!property?.createdBy) return;

    await sendEmail({
      to: property.createdBy.email,
      subject: `🎉 Your property has been sold! - ${property.propertyTitle}`,
      templateKey: "propertySold",
      variables: {
        user_name: property.createdBy.name,
        property_title: property.propertyTitle,
        final_price: `£${(property.soldPrice || property.currentBid || 0).toLocaleString()}`,
      },
    });

    const { emitToUser } = await import("../../socket.js");

    await Notification.create({
      type: "property_sold",
      icon: "check",
      message: `🎉 Your property "${property.propertyTitle}" has been sold!`,
      link: "/dashboard/my-properties",
      color: "green",
      targetUser: property.createdBy._id,
    }).catch(e => console.warn("Property sold notification failed:", e.message));

    emitToUser(property.createdBy._id.toString(), "new_notification", {
      type: "property_sold",
      message: `🎉 Your property "${property.propertyTitle}" has been sold!`,
      link: "/dashboard/my-properties",
      color: "green",
    });
  },
);

// ─── Property Unsold ───
notificationService.on(
  NotificationEvents.PROPERTY_UNSOLD,
  async ({ propertyId }) => {
    const enabled = await isNotificationEnabled("propertyUnsold");
    if (!enabled) return;

    const property = await Property.findById(propertyId).populate(
      "createdBy",
      "name email",
    );
    if (!property?.createdBy) return;

    await sendEmail({
      to: property.createdBy.email,
      subject: `❌ Auction Result - ${property.propertyTitle}`,
      templateKey: "propertyUnsold",
      variables: {
        user_name: property.createdBy.name,
        property_title: property.propertyTitle,
        highest_bid: `£${(property.currentBid || 0).toLocaleString()}`,
        reserve_price: `£${(property.pricing?.reservePrice || 0).toLocaleString()}`,
      },
    });

    const { emitToUser } = await import("../../socket.js");

    await Notification.create({
      type: "property",
      icon: "x-circle",
      message: `Auction ended: "${property.propertyTitle}" - Reserve not met`,
      link: "/dashboard/my-properties",
      color: "orange",
      targetUser: property.createdBy._id,
    }).catch(e => console.warn("Property unsold notification failed:", e.message));

    emitToUser(property.createdBy._id.toString(), "new_notification", {
      type: "property",
      message: `Auction ended: "${property.propertyTitle}" - Reserve not met`,
      link: "/dashboard/my-properties",
      color: "orange",
    });
  },
);

// ─── Auction Starting Soon ───
notificationService.on(
  NotificationEvents.AUCTION_STARTING_SOON,
  async ({ auctionId }) => {
    const enabled = await isNotificationEnabled("auctionStartingSoon");
    if (!enabled) return;

    const auction = await Auction.findById(auctionId).populate(
      "properties",
      "propertyTitle",
    );
    if (!auction) return;

    const previousBidderIds = await Bid.distinct("bidder", { auction: auction._id });
    const auctionForOwners = await Auction.findById(auctionId).populate("properties", "createdBy");
    const propertyOwnerIds = (auctionForOwners?.properties || [])
      .map(p => p.createdBy?.toString())
      .filter(Boolean);
    const relevantIds = [...new Set([
      ...previousBidderIds.map(id => id.toString()),
      ...propertyOwnerIds,
    ])];
    const users = await User.find({ _id: { $in: relevantIds }, isActive: true });

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `⏰ Auction Starting Soon - ${auction.auctionTitle}`,
        templateKey: "auctionStartingSoon",
        variables: {
          user_name: user.name,
          auction_name: auction.auctionTitle,
          start_time: new Date(auction.startDateTime).toLocaleString(),
          lot_count: String(auction.properties?.length || 0),
          auction_url: `${process.env.CLIENT_URL}/auctions/${auction.slug || auction._id}`,
        },
      });
    }
  },
);

// ─── Auction Started ───
notificationService.on(
  NotificationEvents.AUCTION_STARTED,
  async ({ auctionId }) => {
    try {
      const enabled = await isNotificationEnabled("auctionStarted");
      if (!enabled) return;

      const auction = await Auction.findById(auctionId)
        .populate("properties", "createdBy propertyTitle");
      if (!auction) return;

      const { emitToUser } = await import("../../socket.js");
      const auctionUrl = `${process.env.CLIENT_URL}/auctions/${auction.slug || auction._id}`;

      // Get property owner IDs
      const ownerIds = (auction.properties || [])
        .map(p => p.createdBy?.toString())
        .filter(Boolean);

      // ALL active buyers excluding owners
      const allBuyers = await User.find({
        isActive: true,
        "permissions.canBid": true,
        _id: { $nin: ownerIds },
      });

      // Property owners
      const owners = await User.find({
        _id: { $in: ownerIds },
        isActive: true,
      });

      // Admin users
      const admins = await User.find({
        role: "admin",
        isActive: true,
      });

      // 1. Send "Bidding is Open" to ALL buyers
      for (const buyer of allBuyers) {
        await sendEmail({
          to: buyer.email,
          subject: `🔴 Auction Now Live - ${auction.auctionTitle}`,
          templateKey: "auctionStarted",
          variables: {
            user_name: buyer.name,
            auction_name: auction.auctionTitle,
            lot_count: String(auction.properties?.length || 0),
            auction_url: auctionUrl,
          },
        }).catch(e => console.warn("Buyer auction start email failed:", e.message));

        await Notification.create({
          type: "auction",
          icon: "gavel",
          message: `🔴 Auction Now Live: ${auction.auctionTitle} — Start bidding!`,
          link: `/auctions/${auction.slug || auction._id}`,
          color: "red",
          targetUser: buyer._id,
        }).catch(e => console.warn("Buyer start notification failed:", e.message));

        emitToUser(buyer._id.toString(), "new_notification", {
          type: "auction",
          message: `🔴 Auction Now Live: ${auction.auctionTitle}`,
          link: `/auctions/${auction.slug || auction._id}`,
          color: "red",
        });
      }

      // 2. Send "Your Auction Started" to property owners
      const sellerEnabled = await isNotificationEnabled("auctionStartedSeller");
      if (sellerEnabled) {
        for (const owner of owners) {
          await sendEmail({
            to: owner.email,
            subject: `🎯 Your Auction is Now Live - ${auction.auctionTitle}`,
            templateKey: "auctionStartedSeller",
            variables: {
              user_name: owner.name,
              auction_name: auction.auctionTitle,
              lot_count: String(auction.properties?.length || 0),
              auction_url: auctionUrl,
            },
          }).catch(e => console.warn("Owner auction start email failed:", e.message));

          await Notification.create({
            type: "auction",
            icon: "gavel",
            message: `🎯 Your auction "${auction.auctionTitle}" is now live!`,
            link: `/auctions/${auction.slug || auction._id}`,
            color: "green",
            targetUser: owner._id,
          }).catch(e => console.warn("Owner start notification failed:", e.message));

          emitToUser(owner._id.toString(), "new_notification", {
            type: "auction",
            message: `🎯 Your auction "${auction.auctionTitle}" is now live!`,
            link: `/auctions/${auction.slug || auction._id}`,
            color: "green",
          });
        }
      }

      // 3. Admin bell notification
      for (const admin of admins) {
        await Notification.create({
          type: "auction",
          icon: "gavel",
          message: `Auction started: ${auction.auctionTitle}`,
          link: `/admin/auctions`,
          color: "purple",
          targetUser: null,
        }).catch(e => console.warn("Admin auction start notification failed:", e.message));
      }

    } catch (e) {
      console.warn("AUCTION_STARTED handler error:", e.message);
    }
  },
);

// ─── Auction Ended ───
notificationService.on(
  NotificationEvents.AUCTION_ENDED,
  async ({ auctionId }) => {
    const enabled = await isNotificationEnabled("auctionEnded");
    if (!enabled) return;

    const auction = await Auction.findById(auctionId);
    if (!auction) return;

    const bidderIds = await Bid.distinct("bidder", { auction: auctionId });
    const bidders = await User.find({
      _id: { $in: bidderIds },
      isActive: true,
    });

    for (const bidder of bidders) {
      await sendEmail({
        to: bidder.email,
        subject: `🏁 Auction Ended - ${auction.auctionTitle}`,
        templateKey: "auctionEnded",
        variables: {
          user_name: bidder.name,
          auction_name: auction.auctionTitle,
          auction_url: `${process.env.CLIENT_URL}/auctions/${auction.slug || auction._id}`,
        },
      });

      await Notification.create({
        type: "auction_completed",
        icon: "check",
        message: `Auction ended: ${auction.auctionTitle}. Check your results.`,
        link: `/auctions/${auction.slug || auction._id}`,
        color: "purple",
        targetUser: bidder._id,
      }).catch(e => console.warn("Bidder auction end notification failed:", e.message));

      const { emitToUser } = await import("../../socket.js");
      emitToUser(bidder._id.toString(), "new_notification", {
        type: "auction_completed",
        message: `Auction ended: ${auction.auctionTitle}`,
        link: `/auctions/${auction.slug || auction._id}`,
        color: "purple",
      });
    }

    // Admin notification for auction ended
    await Notification.create({
      type: "auction_completed",
      icon: "check",
      message: `Auction ended: ${auction?.auctionTitle || "auction"}`,
      link: `/admin/auctions`,
      color: "purple",
      targetUser: null,
    }).catch(e => console.warn("Admin auction end notification failed:", e.message));

  },
);

export default notificationService;
