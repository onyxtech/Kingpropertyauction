import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.ObjectId, ref: "User", required: true, index: true },
  property: { type: mongoose.Schema.ObjectId, ref: "Property", required: true },
  auction: { type: mongoose.Schema.ObjectId, ref: "Auction" },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "overdue", "refunded", "cancelled"],
    default: "pending",
    index: true,
  },
  method: {
    type: String,
    enum: ["bank_transfer", "cheque", "cash", "other"],
    default: "bank_transfer",
  },
  reference: { type: String },
  notes: { type: String },
  dueDate: { type: Date },
  paidAt: { type: Date },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
}, { timestamps: true });

paymentSchema.index({ buyer: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);
