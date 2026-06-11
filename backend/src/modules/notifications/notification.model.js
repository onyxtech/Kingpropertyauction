import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bid", "user", "lead", "property", "auction_live", "auction_completed", "property_sold", "bid_won", "message", "auction", "system", "offer"],
      required: true,
    },
    icon: { type: String, default: "bell" },
    message: { type: String, required: true },
    link: { type: String, default: null },
    color: { type: String, default: "blue" },
    readBy: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    metadata: { type: mongoose.Schema.Types.Mixed },
    offerResponse: {
      type: String,
      enum: ["accepted", "declined", null],
      default: null,
    },
    targetUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ readBy: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;