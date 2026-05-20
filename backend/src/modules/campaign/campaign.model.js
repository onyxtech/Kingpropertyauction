import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['newsletter', 'property_alert', 'auction_reminder', 'promotional', 'announcement'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
      default: 'draft',
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
    },
    content: {
      type: String,
      default: '',
    },
    // Marketing template preset (different from notification templates)
    templatePreset: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'bold', 'elegant', 'custom'],
      default: 'modern',
    },

    // Targeting
    targetRoles: [{
      type: String,
      enum: ['user', 'agent'],
    }],
    targetAll: {
      type: Boolean,
      default: false,
    },

    // Stats
    totalSent: { type: Number, default: 0 },
    totalOpened: { type: Number, default: 0 },
    totalClicked: { type: Number, default: 0 },
    totalBounced: { type: Number, default: 0 },

    // Scheduling
    scheduledAt: { type: Date },
    sentAt: { type: Date },

    // Creator
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1 });
campaignSchema.index({ type: 1 });
campaignSchema.index({ createdAt: -1 });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;