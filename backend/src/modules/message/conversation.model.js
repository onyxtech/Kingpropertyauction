import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lead',
    index: true,
  },
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    index: true,
  },
  source: {
    type: String,
    enum: [
      'contact',
      'valuation',
      'catalogue',
      'chat',
      'direct',
      'general',
      'referral',
      'finance',
      'alert',
      'solicitor',
      'home-report',
      'buying',
      'selling',
      'legal',
      'faq',
      'newsletter',
      'property_inquiry',
      'faq_support',
      'legal_enquiry',
      'register_alert',
      'referral_fee',
      'home_report',
    ],
    default: 'direct',
  },
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    senderModel: String,
    createdAt: Date,
  },
  unreadCount: {
    admin: { type: Number, default: 0 },
    user: { type: Number, default: 0 },
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  agentModeActive: {
    type: Boolean,
    default: false,
  },
  tags: [String],
}, { timestamps: true });

conversationSchema.index({ status: 1, updatedAt: -1 });
conversationSchema.index({ 'participants': 1 });
conversationSchema.index({ assignedTo: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;