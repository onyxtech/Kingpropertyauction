import Lead from './lead.model.js';
import { sendEmail } from '../notifications/email.service.js';
import { isNotificationEnabled } from '../settings/settings.service.js';

const getNotificationKeys = (lead) => {
  const subject = (lead.subject || '').toLowerCase();
  if (subject.includes('register') && subject.includes('alert'))
    return { ruleKey: 'registerAlert', templateKey: 'registerAlert' };
  if (subject.includes('solicitor'))
    return { ruleKey: 'solicitorEnquiry', templateKey: 'solicitorEnquiry' };
  if (subject.includes('home report'))
    return { ruleKey: 'homeReport', templateKey: 'homeReport' };
  if (subject.includes('referral'))
    return { ruleKey: 'referralFee', templateKey: 'referralFee' };
  if (subject.includes('buying overview'))
    return { ruleKey: 'buyingEnquiry', templateKey: 'buyingEnquiry' };
  if (subject.includes('selling overview'))
    return { ruleKey: 'sellingEnquiry', templateKey: 'sellingEnquiry' };
  if (lead.leadType === 'valuation')
    return { ruleKey: 'valuationRequest', templateKey: 'valuationRequest' };
  if (lead.leadType === 'catalogue')
    return { ruleKey: 'catalogueRequest', templateKey: 'catalogueRequest' };
  return { ruleKey: 'contactForm', templateKey: 'contactForm' };
};

export const createLead = async (data) => {
  const lead = await Lead.create(data);

  const { ruleKey, templateKey } = getNotificationKeys(lead);

  // Auto-reply to the user (fire and forget)
  (async () => {
    try {
      const enabled = await isNotificationEnabled(ruleKey);
      if (!enabled) return;
      await sendEmail({
        to: lead.email,
        subject: 'Thank you for contacting King Property Auction',
        templateKey,
        variables: {
          user_name: lead.name,
          user_email: lead.email,
          user_phone: lead.phone || 'Not provided',
          message: lead.message || '',
          property_type: '',
          property_address: '',
          location: '',
          budget: '',
          timeline: '',
          bedrooms: '',
        },
      });
    } catch (e) {
      console.error('[Lead] Auto-reply failed:', e.message);
    }
  })();

  // Notify all active admins (fire and forget)
  (async () => {
    try {
      const enabled = await isNotificationEnabled(ruleKey);
      if (!enabled) return;
      const { default: User } = await import('../user/user.model.js');
      const admins = await User.find({ role: 'admin', isActive: true }).select('email name');
      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: `📋 New Lead: ${lead.name} — ${lead.leadType}`,
          templateKey: 'adminLeadAlert',
          variables: {
            admin_name: admin.name,
            lead_name: lead.name,
            lead_email: lead.email,
            lead_phone: lead.phone || 'Not provided',
            lead_type: lead.leadType,
            message: lead.message,
            admin_url: `${process.env.CLIENT_URL}/admin/leads`,
          },
        }).catch(() => {});
      }
    } catch (e) {
      console.error('[Lead] Admin alert failed:', e.message);
    }
  })();

  // Auto-create conversation thread from this lead
  import('../message/message.service.js').then(async ({ createConversationFromLead }) => {
    await createConversationFromLead(lead._id);
  }).catch(e => console.error('[Lead] Conversation creation failed:', e.message));

  return lead;
};

export const getLeads = async (query = {}) => {
  const { page = 1, limit = 20, status, type, search } = query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.leadType = type;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')
      .populate('property', 'propertyTitle'),
    Lead.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getLeadById = async (id) => {
  return Lead.findById(id)
    .populate('assignedTo', 'name email')
    .populate('property', 'propertyTitle');
};

// ─── Get leads submitted by a specific email (customer dashboard) ───
export const getLeadsByEmail = async (email, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [leads, total] = await Promise.all([
    Lead.find({ email })
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('property', 'propertyTitle'),
    Lead.countDocuments({ email }),
  ]);

  return {
    leads,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  };
};

export const updateLead = async (id, data) => {
  return Lead.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLead = async (id) => {
  return Lead.findByIdAndDelete(id);
};

export const getLeadsStats = async () => {
  const [total, newLeads, contacted, qualified, converted, closed, byType] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Lead.countDocuments({ status: 'contacted' }),
    Lead.countDocuments({ status: 'qualified' }),
    Lead.countDocuments({ status: 'converted' }),
    Lead.countDocuments({ status: 'closed' }),
    Lead.aggregate([
      { $group: { _id: '$leadType', count: { $sum: 1 } } },
    ]),
  ]);

  return { total, newLeads, contacted, qualified, converted, closed, byType };
};
