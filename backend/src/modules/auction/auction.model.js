import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    // Auction identification
    auctionTitle: {
      type: String,
      required: [true, "Auction title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    auctionType: {
      type: String,
      enum: ["live", "online", "hybrid", "reserve", "absolute"],
      required: true,
    },
    description: {
      type: String,
      maxlength: 2000,
    },

    // Linked Properties
    properties: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Property",
      },
    ],

    // Bidding Configuration
    startingBid: {
      type: Number,
      required: [true, "Starting bid is required"],
    },
    bidIncrement: {
      type: Number,
      required: [true, "Bid increment is required"],
    },
    reservePrice: {
      type: Number,
    },
    antiSnipingMinutes: {
      type: Number,
      default: 5,
    },
    enableAutoBidding: {
      type: Boolean,
      default: false,
    },
    maxBidders: {
      type: Number,
    },

    // Schedule
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },

    // Venue (for live/hybrid auctions)
    venue: {
      name: { type: String },
      address: { type: String },
      city: { type: String },
      postcode: { type: String },
    },

    auctionImage: { type: String }, // Banner image for the auction
    totalLots: { type: Number, default: 0 }, // Number of properties

    // Fees
    registrationFee: {
      type: Number,
      default: 0,
    },
    depositRequired: {
      type: Number,
      default: 0,
    },

    // Status & Tracking
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },
    currentBid: {
      type: Number,
      default: 0,
    },
    totalBids: {
      type: Number,
      default: 0,
    },
    totalBidders: {
      type: Number,
      default: 0,
    },
    winningBidder: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    // Notifications
    sendEmailNotifications: {
      type: Boolean,
      default: false,
    },

    // Creator
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
auctionSchema.index({ status: 1 });
auctionSchema.index({ auctionType: 1 });
auctionSchema.index({ startDateTime: 1 });
auctionSchema.index({ property: 1 });

auctionSchema.pre("save", function (next) {
  if (this.isModified("auctionTitle")) {
    this.slug =
      this.auctionTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      this._id.toString().slice(-6);
  }
  next();
});

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
