import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.ObjectId, ref: "User", required: true, index: true },
  property: { type: mongoose.Schema.ObjectId, ref: "Property", required: true },
  auction: { type: mongoose.Schema.ObjectId, ref: "Auction" },
  buyer: { type: mongoose.Schema.ObjectId, ref: "User" },
  salePrice: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "paid", "disputed"],
    default: "pending",
    index: true,
  },
  notes: { type: String },
  paidAt: { type: Date },
  paidBy: { type: mongoose.Schema.ObjectId, ref: "User" },
}, { timestamps: true });

commissionSchema.index({ agent: 1, status: 1 });
commissionSchema.index({ createdAt: -1 });

export default mongoose.model("Commission", commissionSchema);
