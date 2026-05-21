import * as leadService from './lead.service.js';
import Lead from './lead.model.js';

export const create = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json({ success: true, data: lead, message: 'Your message has been received!' });
  } catch (error) {
    console.error('[Lead] create error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query);
    res.status(200).json({ success: true, data: result.leads, pagination: result.pagination });
  } catch (error) {
    console.error('[Lead] getAll error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('[Lead] getById error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('[Lead] update error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    console.error('[Lead] remove error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    lead.notes = lead.notes || [];
    lead.notes.push({
      text: req.body.text,
      addedBy: req.user._id,
      createdAt: new Date(),
    });
    await lead.save();

    res.status(200).json({ success: true, data: lead, message: 'Note added' });
  } catch (error) {
    console.error('[Lead] addNote error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await leadService.getLeadsStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('[Lead] getStats error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Customer: get their own leads ───
export const getMyLeads = async (req, res) => {
  try {
    const result = await leadService.getLeadsByEmail(req.user.email, req.query);
    res.status(200).json({ success: true, data: result.leads, pagination: result.pagination });
  } catch (error) {
    console.error('[Lead] getMyLeads error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyToLead = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const { message, subject } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message is required' });

    const { sendEmail } = await import('../notifications/email.service.js');
    const { getEmailSettings, isNotificationEnabled } = await import('../settings/settings.service.js');
    const settings = await getEmailSettings();

    const emailSubject = subject?.trim() || ('Re: ' + (lead.subject || 'Your Enquiry at King Property Auction'));

    const replyEnabled = await isNotificationEnabled('adminReply');
    if (!replyEnabled) {
      console.log('[Email] adminReply notification disabled - skipping reply email');
      return res.status(200).json({ success: true, message: 'Reply recorded but email sending is currently disabled.' });
    }

    const result = await sendEmail({
      to: lead.email,
      subject: emailSubject,
      templateKey: 'adminReply',
      variables: {
        user_name: lead.name,
        subject: lead.subject || 'Your Enquiry',
        message: message,
        site_url: process.env.CLIENT_URL || 'http://localhost:5173',
      },
    });

    if (!result.success) {
      return res.status(500).json({ success: false, message: 'Failed to send email: ' + result.message });
    }

    lead.notes = lead.notes || [];
    lead.notes.push({
      text: '📧 Email reply sent: ' + message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      addedBy: req.user._id,
      createdAt: new Date(),
    });
    await lead.save();

    // ─── Sync reply to Inbox conversation ───
    try {
      const { default: Conversation } = await import('../message/conversation.model.js');
      const { default: Message } = await import('../message/message.model.js');

      // Find the conversation linked to this lead
      let conversation = await Conversation.findOne({ lead: lead._id });

      // If no conversation exists yet, create one
      if (!conversation) {
        conversation = await Conversation.create({
          lead: lead._id,
          subject: lead.subject || ('Inquiry from ' + lead.name),
          source: lead.leadType || 'contact',
          participants: [],
          unreadCount: { admin: 0, user: 1 },
        });
        // Add original lead message as first message if exists
        if (lead.message) {
          await Message.create({
            conversation: conversation._id,
            sender: lead._id,
            senderModel: 'Lead',
            senderName: lead.name,
            text: lead.message,
          });
        }
      }

      // Save admin reply as a message in the conversation
      await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        senderModel: 'User',
        senderName: req.user.name + ' (via Email)',
        text: message,
        isAdminMessage: true,
      });

      // Update conversation lastMessage and mark as open
      await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: {
          text: message.substring(0, 200),
          sender: req.user._id,
          senderModel: 'User',
          createdAt: new Date(),
        },
        status: 'open',
        'unreadCount.user': (conversation.unreadCount?.user || 0) + 1,
      });

      console.log('[Lead Reply] Synced to conversation:', conversation._id);
    } catch (syncError) {
      // Don't fail the email send if sync fails - just log it
      console.error('[Lead Reply] Failed to sync to inbox:', syncError.message);
    }

    res.status(200).json({ success: true, message: 'Reply sent successfully to ' + lead.email });
  } catch (error) {
    console.error('[Lead] replyToLead error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
