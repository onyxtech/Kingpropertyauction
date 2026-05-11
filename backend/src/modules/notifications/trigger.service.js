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

export default notificationService;