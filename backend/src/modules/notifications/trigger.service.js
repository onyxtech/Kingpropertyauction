import { sendEmail } from "./email.service.js";
import { isNotificationEnabled } from "../settings/settings.service.js";
import User from "../user/user.model.js";
import Property from "../property/property.model.js";
import Auction from "../auction/auction.model.js";
import Bid from "../bid/bid.model.js";

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
    const enabled = await isNotificationEnabled("welcome");
    if (!enabled) return;

    const user = await User.findById(userId);
    if (!user) return;

    await sendEmail({
      to: user.email,
      subject: "Welcome to King Property Auction! 🏠",
      templateKey: "welcome",
      variables: {
        user_name: user.name,
        site_url: process.env.CLIENT_URL || "http://localhost:5173",
      },
    });
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
  },
);

// Outbid Alert
notificationService.on(
  NotificationEvents.BID_OUTBID,
  async ({ userId, propertyId, auctionId, newAmount, previousAmount }) => {
    const enabled = await isNotificationEnabled("outbidAlert");
    if (!enabled) return;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    if (!user || !property) return;

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
    if (!enabled) return;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    const auction = await Auction.findById(auctionId);
    if (!user || !property) return;

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
    if (!enabled) return;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    if (!user || !property) return;

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
  },
);

// ─── Property Rejected ───
notificationService.on(
  NotificationEvents.PROPERTY_REJECTED,
  async ({ propertyId, reason }) => {
    const enabled = await isNotificationEnabled("propertyRejected");
    if (!enabled) return;

    const property = await Property.findById(propertyId).populate(
      "createdBy",
      "name email",
    );
    if (!property?.createdBy) return;

    await sendEmail({
      to: property.createdBy.email,
      subject: `❌ Property Update - ${property.propertyTitle}`,
      templateKey: "propertyRejected",
      variables: {
        user_name: property.createdBy.name,
        property_title: property.propertyTitle,
        reason: reason || "Your property was not approved.",
      },
    });
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

    // const users = await User.find({ isActive: true, role: 'user' });
    const users = await User.find({ isActive: true, role: { $in: ['user', 'investor'] } });

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
    const enabled = await isNotificationEnabled("auctionStarted");
    if (!enabled) return;

    const auction = await Auction.findById(auctionId);
    if (!auction) return;

    // Get ALL active users buyers/investors (not just bidders, since auction just started)
    // const users = await User.find({ isActive: true, role: 'user' });
    const users = await User.find({ isActive: true, role: { $in: ['user', 'investor'] } });

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `🔴 Auction Now Live - ${auction.auctionTitle}`,
        templateKey: "auctionStarted",
        variables: {
          user_name: user.name,
          auction_name: auction.auctionTitle,
          lot_count: String(auction.properties?.length || 0),
          auction_url: `${process.env.CLIENT_URL}/auctions/${auction.slug || auction._id}`,
        },
      });
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
    }
  },
);

export default notificationService;
