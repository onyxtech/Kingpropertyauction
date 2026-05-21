import Campaign from './campaign.model.js';
import User from '../user/user.model.js';
import Property from '../property/property.model.js';
import Auction from '../auction/auction.model.js';
import { sendEmail } from '../notifications/email.service.js';
import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import cache from '../../utils/cache.js';

// BullMQ queue for scheduled campaigns
const campaignQueue = new Queue('campaign-jobs', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 100,
  },
});

// ─── Marketing Template Presets ─────────────────────────────────
const marketingTemplates = {
  modern: {
    name: 'Modern Professional',
    wrapper: (content, subject) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;">
        <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:36px 24px;text-align:center;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:26px;font-weight:900;">${subject}</h1>
        </div>
        <div style="background:white;padding:32px 24px;">${content}</div>
        <div style="background:#1e293b;padding:20px 24px;text-align:center;border-radius:0 0 12px 12px;">
          <p style="color:#94a3b8;margin:0;font-size:13px;font-weight:600;">King Property Auction</p>
          <p style="color:#64748b;margin:4px 0 0;font-size:12px;">Transparent, Fast & Trusted</p>
        </div>
      </div>`,
  },
  classic: {
    name: 'Classic Newsletter',
    wrapper: (content, subject) => `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf8f5;">
        <div style="background:#1a1a2e;padding:32px 24px;text-align:center;border-bottom:4px solid #c9a84c;">
          <h1 style="color:#c9a84c;margin:0;font-size:24px;font-weight:700;letter-spacing:1px;">${subject}</h1>
        </div>
        <div style="background:white;padding:32px 24px;border-left:1px solid #e5e0d8;border-right:1px solid #e5e0d8;">${content}</div>
        <div style="background:#1a1a2e;padding:20px 24px;text-align:center;border-top:4px solid #c9a84c;">
          <p style="color:#c9a84c;margin:0;font-size:12px;">King Property Auction • Est. 2024</p>
        </div>
      </div>`,
  },
  minimal: {
    name: 'Minimal Clean',
    wrapper: (content, subject) => `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px;margin:0 auto;">
        <div style="padding:24px;border-bottom:2px solid #e5e7eb;"><h2 style="color:#111827;margin:0;font-size:22px;font-weight:600;">${subject}</h2></div>
        <div style="padding:24px;">${content}</div>
        <div style="padding:16px 24px;border-top:2px solid #e5e7eb;text-align:center;"><p style="color:#9ca3af;margin:0;font-size:12px;">King Property Auction</p></div>
      </div>`,
  },
  bold: {
    name: 'Bold Promotional',
    wrapper: (content, subject) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;">
        <div style="background:linear-gradient(135deg,#dc2626,#ea580c);padding:40px 24px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:2px;">${subject}</h1>
        </div>
        <div style="background:#111827;padding:32px 24px;color:#e5e7eb;">${content}</div>
        <div style="background:#000;padding:20px 24px;text-align:center;border-top:1px solid #1f2937;">
          <p style="color:#6b7280;margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;">King Property Auction</p>
        </div>
      </div>`,
  },
  elegant: {
    name: 'Elegant Luxury',
    wrapper: (content, subject) => `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fdfbf7;">
        <div style="background:linear-gradient(135deg,#1e3a5f,#2d5a27);padding:36px 24px;text-align:center;border-radius:8px 8px 0 0;">
          <div style="width:60px;height:2px;background:#c9a84c;margin:0 auto 16px;"></div>
          <h1 style="color:#f5f0e8;margin:0;font-size:24px;font-weight:400;letter-spacing:3px;text-transform:uppercase;">${subject}</h1>
          <div style="width:60px;height:2px;background:#c9a84c;margin:16px auto 0;"></div>
        </div>
        <div style="background:white;padding:36px 28px;border:1px solid #e5dccf;border-top:none;">${content}</div>
        <div style="background:#1e3a5f;padding:18px 24px;text-align:center;border-radius:0 0 8px 8px;">
          <p style="color:#8a9bb5;margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;">King Property Auction</p>
        </div>
      </div>`,
  },
};

// ─── Get templates list ─────────────────────────────────────────
export const getMarketingTemplates = () => {
  return Object.entries(marketingTemplates).map(([key, tpl]) => ({ key, name: tpl.name }));
};

// ─── Get properties for dropdown ────────────────────────────────
export const getPropertiesForCampaign = async () => {
  const properties = await Property.find({ approvalStatus: 'approved' })
    .select('propertyTitle slug pricing propertyType location.city')
    .sort('-createdAt')
    .limit(50)
    .lean();
  return properties.map((p) => ({
    _id: p._id,
    title: p.propertyTitle,
    slug: p.slug,
    price: p.pricing?.startingAuctionPrice || 0,
    type: p.propertyType,
    city: p.location?.city || '',
  }));
};

// ─── Get auctions for dropdown ──────────────────────────────────
export const getAuctionsForCampaign = async () => {
  const auctions = await Auction.find({ status: { $in: ['scheduled', 'live'] } })
    .select('auctionTitle slug startDateTime auctionType')
    .sort('-startDateTime')
    .limit(50)
    .lean();
  return auctions.map((a) => ({
    _id: a._id,
    title: a.auctionTitle,
    slug: a.slug,
    date: a.startDateTime,
    type: a.auctionType,
    city: '',
  }));
};

// ─── CRUD ───────────────────────────────────────────────────────
export const createCampaign = async (data, userId) => {
  const campaign = await Campaign.create({ ...data, createdBy: userId });

  await cache.del('campaign:stats');

  // Schedule if status is scheduled
  if (campaign.status === 'scheduled' && campaign.scheduledAt) {
    const delay = Math.max(new Date(campaign.scheduledAt).getTime() - Date.now(), 0);
    if (delay > 0) {
      await campaignQueue.add('send-campaign', { campaignId: campaign._id.toString() }, { delay, jobId: `campaign-${campaign._id}` });
      console.log(`📅 Campaign scheduled: "${campaign.name}" in ${Math.round(delay / 1000)}s`);
    }
  }

  return campaign;
};

export const getCampaigns = async (query = {}) => {
  const { page = 1, limit = 10, status, type, sortBy = '-createdAt' } = query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const [campaigns, total] = await Promise.all([
    Campaign.find(filter).populate('createdBy', 'name email').sort(sortBy).skip(skip).limit(limit),
    Campaign.countDocuments(filter),
  ]);
  return { campaigns, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } };
};

export const getCampaignById = async (id) => {
  const campaign = await Campaign.findById(id).populate('createdBy', 'name email');
  if (!campaign) throw new Error('Campaign not found');
  return campaign;
};

export const updateCampaign = async (id, data) => {
  const campaign = await Campaign.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!campaign) throw new Error('Campaign not found');

  await cache.del('campaign:stats');

  // Handle scheduling
  const oldJob = await campaignQueue.getJob(`campaign-${id}`);
  if (oldJob) await oldJob.remove();

  if (campaign.status === 'scheduled' && campaign.scheduledAt) {
    const delay = Math.max(new Date(campaign.scheduledAt).getTime() - Date.now(), 0);
    if (delay > 0) {
      await campaignQueue.add('send-campaign', { campaignId: id.toString() }, { delay, jobId: `campaign-${id}` });
    }
  }

  return campaign;
};

export const deleteCampaign = async (id) => {
  const oldJob = await campaignQueue.getJob(`campaign-${id}`);
  if (oldJob) await oldJob.remove();
  const campaign = await Campaign.findByIdAndDelete(id);
  if (!campaign) throw new Error('Campaign not found');

  await cache.del('campaign:stats');

  return campaign;
};

export const duplicateCampaign = async (id, userId) => {
  const original = await Campaign.findById(id);
  if (!original) throw new Error('Campaign not found');
  return Campaign.create({
    name: `${original.name} (Copy)`, type: original.type, subject: original.subject,
    content: original.content, templatePreset: original.templatePreset,
    targetRoles: original.targetRoles, targetAll: original.targetAll, status: 'draft', createdBy: userId,
  });
};

// ─── SEND ───────────────────────────────────────────────────────
export const sendTestEmail = async (id, testEmail) => {
  const campaign = await Campaign.findById(id);
  if (!campaign) throw new Error('Campaign not found');
  const tpl = marketingTemplates[campaign.templatePreset] || marketingTemplates.modern;
  const html = tpl.wrapper(campaign.content, campaign.subject);
  await sendEmail({ to: testEmail, subject: `[TEST] ${campaign.subject}`, html });
  return { sentTo: testEmail };
};

export const sendCampaign = async (id) => {
  const campaign = await Campaign.findById(id);
  if (!campaign) throw new Error('Campaign not found');
  if (campaign.status === 'sending' || campaign.status === 'sent') {
    throw new Error('Campaign is already sending or has been sent');
  }

  // Exclude admins and users who have opted out of marketing emails
  const userFilter = { isActive: true, role: { $ne: 'admin' }, marketingOptOut: { $ne: true } };
  if (!campaign.targetAll && campaign.targetRoles?.length > 0) {
    userFilter.role = { $in: campaign.targetRoles.filter((r) => r !== 'admin') };
  }

  const recipients = await User.find(userFilter).select('name email');
  if (recipients.length === 0) throw new Error('No recipients found');

  await Campaign.findByIdAndUpdate(id, { status: 'sending', totalSent: 0, totalOpened: 0, totalClicked: 0 });

  const trackingPixel = `${process.env.CLIENT_URL || 'http://localhost:5173'}/api/campaigns/track/open/${id}`;
  const clickTrackBase = `${process.env.CLIENT_URL || 'http://localhost:5173'}/api/campaigns/track/click/${id}`;
  const tpl = marketingTemplates[campaign.templatePreset] || marketingTemplates.modern;

  const BATCH_SIZE = 10;
  let sentCount = 0, failedCount = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (user) => {
        let content = campaign.content
          .replace(/\{user_name\}/g, user.name)
          .replace(/\{user_email\}/g, user.email)
          .replace(/\{campaign_name\}/g, campaign.name)
          .replace(/\{site_url\}/g, process.env.CLIENT_URL || 'http://localhost:5173');

        let html = tpl.wrapper(content, campaign.subject);

        // Wrap external links with click tracking (skip tracking/unsubscribe URLs)
        html = html.replace(/href="(https?:\/\/[^"]+)"/g, (match, url) => {
          if (url.includes('/track/') || url.includes('/unsubscribe')) return match;
          return `href="${clickTrackBase}?url=${encodeURIComponent(url)}"`;
        });

        // Append unsubscribe footer
        const unsubscribeUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/api/campaigns/unsubscribe?email=${encodeURIComponent(user.email)}&token=${Buffer.from(user.email).toString('base64')}`;
        html += `<div style="text-align:center;margin-top:32px;padding:16px;border-top:1px solid #e5e7eb;"><p style="color:#9ca3af;font-size:12px;margin:0;">You are receiving this email because you registered on King Property Auction. <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a></p></div>`;

        // Open tracking pixel
        html += `<img src="${trackingPixel}?uid=${user._id}" width="1" height="1" style="display:none" alt="" />`;

        return sendEmail({ to: user.email, subject: campaign.subject, html });
      })
    );
    results.forEach((r) => { if (r.status === 'fulfilled') sentCount++; else failedCount++; });
    await Campaign.findByIdAndUpdate(id, { totalSent: sentCount + failedCount, totalBounced: failedCount });
    // Rate limit: 500ms between batches to avoid SMTP throttling
    if (i + BATCH_SIZE < recipients.length) await new Promise((r) => setTimeout(r, 500));
  }

  await Campaign.findByIdAndUpdate(id, { status: 'sent', sentAt: new Date(), totalSent: sentCount, totalBounced: failedCount });

  // Invalidate cached stats so dashboard reflects the new send
  await cache.del('campaign:stats');
  await cache.delPattern('analytics:campaigns:*');

  return { campaign: campaign.name, totalRecipients: recipients.length, sent: sentCount, failed: failedCount };
};

export const trackOpen = async (campaignId) => {
  await Campaign.findByIdAndUpdate(campaignId, { $inc: { totalOpened: 1 } });
  return Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
};

export const trackClick = async (campaignId, redirectUrl) => {
  await Campaign.findByIdAndUpdate(campaignId, { $inc: { totalClicked: 1 } });
  return redirectUrl || process.env.CLIENT_URL || 'http://localhost:5173';
};

export const unsubscribeUser = async (email, token) => {
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  if (decoded !== email) throw new Error('Invalid unsubscribe token');
  await User.findOneAndUpdate({ email }, { marketingOptOut: true });
};

export const getCampaignStats = async () => {
  const cacheKey = 'campaign:stats';
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const [total, draft, scheduled, sent, sending, failed] = await Promise.all([
    Campaign.countDocuments(), Campaign.countDocuments({ status: 'draft' }), Campaign.countDocuments({ status: 'scheduled' }),
    Campaign.countDocuments({ status: 'sent' }), Campaign.countDocuments({ status: 'sending' }), Campaign.countDocuments({ status: 'failed' }),
  ]);
  const sentAgg = await Campaign.aggregate([
    { $match: { status: { $in: ['sent', 'sending'] } } },
    { $group: { _id: null, totalSent: { $sum: '$totalSent' }, totalOpened: { $sum: '$totalOpened' }, totalClicked: { $sum: '$totalClicked' } } },
  ]);
  const s = sentAgg[0] || { totalSent: 0, totalOpened: 0, totalClicked: 0 };
  const stats = { total, draft, scheduled, sent, sending, failed, totalEmailsSent: s.totalSent, totalOpened: s.totalOpened, totalClicked: s.totalClicked, openRate: s.totalSent > 0 ? Math.round((s.totalOpened / s.totalSent) * 100) : 0, clickRate: s.totalSent > 0 ? Math.round((s.totalClicked / s.totalSent) * 100) : 0 };

  await cache.set(cacheKey, stats, 60);
  return stats;
};
