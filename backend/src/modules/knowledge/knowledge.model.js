import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    category: {
      type: String,
      enum: ['company', 'process', 'fees', 'legal', 'faq', 'custom'],
      default: 'custom',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 100,
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

knowledgeSchema.index({ isActive: 1, order: 1 });
knowledgeSchema.index({ category: 1 });

const Knowledge = mongoose.model('Knowledge', knowledgeSchema);
export default Knowledge;
