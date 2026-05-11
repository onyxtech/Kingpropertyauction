import { sendEmail } from './email.service.js';
import { isNotificationEnabled } from '../settings/settings.service.js';
import User from '../user/user.model.js';
import Property from '../property/property.model.js';
import Auction from '../auction/auction.model.js';

// Event types
export const NotificationEvents = {
  USER_REGISTERED: 'user.registered',
  USER_APPROVED: 'user.approved',
  USER_REJECTED: 'user.rejected',
  BID_PLACED: 'bid.placed',
  BID_OUTBID: 'bid.outbid',
  AUCTION_WON: 'auction.won',
  AUCTION_LOST: 'auction.lost',
  PROPERTY_SOLD: 'property.sold',
  PROPERTY_UNSOLD: 'property.unsold',
  PROPERTY_SUBMITTED: 'property.submitted',
  PROPERTY_APPROVED: 'property.approved',
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
notificationService.on(NotificationEvents.USER_REGISTERED, async ({ userId }) => {
  const enabled = await isNotificationEnabled('welcome');
  if (!enabled) return;

  const user = await User.findById(userId);
  if (!user) return;

  await sendEmail({
    to: user.email,
    subject: 'Welcome to King Property Auction! 🏠',
    templateKey: 'welcome',
    variables: {
      user_name: user.name,
      site_url: process.env.CLIENT_URL || 'http://localhost:5173',
    },
  });
});

// Account Approved Email
notificationService.on(NotificationEvents.USER_APPROVED, async ({ userId }) => {
  const enabled = await isNotificationEnabled('accountApproved');
  if (!enabled) return;

  const user = await User.findById(userId);
  if (!user) return;

  await sendEmail({
    to: user.email,
    subject: 'Your account has been approved! ✅',
    templateKey: 'accountApproved',
    variables: {
      user_name: user.name,
      site_url: process.env.CLIENT_URL || 'http://localhost:5173',
    },
  });
});

// Account Rejected Email
notificationService.on(NotificationEvents.USER_REJECTED, async ({ userId, reason }) => {
  const enabled = await isNotificationEnabled('accountRejected');
  if (!enabled) return;

  const user = await User.findById(userId);
  if (!user) return;

  await sendEmail({
    to: user.email,
    subject: 'Account Status Update',
    templateKey: 'accountRejected',
    variables: {
      user_name: user.name,
      reason: reason || 'Your account was not approved.',
    },
  });
});


// ─── Bidding Events ───

// Bid Confirmation
notificationService.on(NotificationEvents.BID_PLACED, async ({ userId, propertyId, auctionId, amount }) => {
  const enabled = await isNotificationEnabled('bidConfirmation');
  if (!enabled) return;

  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  if (!user || !property) return;

  await sendEmail({
    to: user.email,
    subject: `Bid Confirmed - ${property.propertyTitle}`,
    templateKey: 'bidConfirmation',
    variables: {
      user_name: user.name,
      property_title: property.propertyTitle,
      bid_amount: `£${amount.toLocaleString()}`,
      current_bid: `£${amount.toLocaleString()}`,
      property_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/properties/${property.slug || property._id}`,
    },
  });
});

// Outbid Alert
notificationService.on(NotificationEvents.BID_OUTBID, async ({ userId, propertyId, auctionId, newAmount, previousAmount }) => {
  const enabled = await isNotificationEnabled('outbidAlert');
  if (!enabled) return;

  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  if (!user || !property) return;

  await sendEmail({
    to: user.email,
    subject: `⚠️ You've been outbid on ${property.propertyTitle}`,
    templateKey: 'outbidAlert',
    variables: {
      user_name: user.name,
      property_title: property.propertyTitle,
      your_bid: `£${previousAmount.toLocaleString()}`,
      current_bid: `£${newAmount.toLocaleString()}`,
      property_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/properties/${property.slug || property._id}`,
    },
  });
});

// Auction Won
notificationService.on(NotificationEvents.AUCTION_WON, async ({ userId, propertyId, auctionId, finalPrice }) => {
  const enabled = await isNotificationEnabled('auctionWon');
  if (!enabled) return;

  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  const auction = await Auction.findById(auctionId);
  if (!user || !property) return;

  await sendEmail({
    to: user.email,
    subject: `🎉 Congratulations! You won ${property.propertyTitle}`,
    templateKey: 'auctionWon',
    variables: {
      user_name: user.name,
      property_title: property.propertyTitle,
      final_price: `£${finalPrice.toLocaleString()}`,
      auction_name: auction?.auctionTitle || 'Auction',
    },
  });
});

// Auction Lost
notificationService.on(NotificationEvents.AUCTION_LOST, async ({ userId, propertyId, auctionId, finalPrice }) => {
  const enabled = await isNotificationEnabled('auctionLost');
  if (!enabled) return;

  const user = await User.findById(userId);
  const property = await Property.findById(propertyId);
  if (!user || !property) return;

  await sendEmail({
    to: user.email,
    subject: `Auction Ended - ${property.propertyTitle}`,
    templateKey: 'auctionLost',
    variables: {
      user_name: user.name,
      property_title: property.propertyTitle,
      final_price: `£${finalPrice.toLocaleString()}`,
      site_url: process.env.CLIENT_URL || 'http://localhost:5173',
    },
  });
});

export default notificationService;