import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    required: true,
    // refPath makes this dynamic — points to User, Admin, or Lead
    refPath: 'senderModel',
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Admin', 'Lead'], // 'Admin' kept for backward compat with existing DB data
  },
  // True when message was sent by an admin user (stored as senderModel:'User' since admin IS a User)
  isAdminMessage: {
    type: Boolean,
    default: false,
  },
  // Fallback display name (used when sender is a Lead/guest or populate fails)
  senderName: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  attachments: [{
    url: String,
    name: String,
    type: String,
  }],
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;