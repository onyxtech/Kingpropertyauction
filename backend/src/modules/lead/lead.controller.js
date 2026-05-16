import * as leadService from './lead.service.js';
import Lead from './lead.model.js';

export const create = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json({ success: true, data: lead, message: 'Your message has been received!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query);
    res.status(200).json({ success: true, data: result.leads, pagination: result.pagination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await leadService.getLeadsStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Customer: get their own leads ───
export const getMyLeads = async (req, res) => {
  try {
    const result = await leadService.getLeadsByEmail(req.user.email, req.query);
    res.status(200).json({ success: true, data: result.leads, pagination: result.pagination });
  } catch (error) {
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
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;">
          <div style="background:linear-gradient(135deg,#1e40af,#4f46e5);padding:24px;border-radius:12px 12px 0 0;">
            <h2 style="color:white;margin:0;font-size:20px;font-weight:900;">King Property Auction</h2>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">Response to your enquiry</p>
          </div>
          <div style="background:white;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
            <p style="color:#374151;font-size:15px;margin-bottom:8px;">Dear ${lead.name},</p>
            <div style="color:#374151;font-size:15px;line-height:1.7;white-space:pre-wrap;margin:16px 0;">${message}</div>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
            <p style="color:#374151;font-size:14px;margin-bottom:4px;font-weight:bold;">Best regards,</p>
            <p style="color:#374151;font-size:14px;margin:0;">${settings.senderName || 'King Property Auction Team'}</p>
            <p style="color:#6b7280;font-size:13px;margin:4px 0;">Phone: 0800 123 4567</p>
            <p style="color:#6b7280;font-size:13px;margin:4px 0;">Email: info@kingauction.com</p>
          </div>
        </div>
      `,
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
    res.status(500).json({ success: false, message: error.message });
  }
};
