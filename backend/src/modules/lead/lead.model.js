import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    leadType: {
      type: String,
      enum: ['contact', 'valuation', 'finance', 'catalogue', 'referral', 'general'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
      default: 'new',
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;