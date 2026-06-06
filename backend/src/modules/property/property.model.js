import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // 1. Basic Property Information
    propertyTitle: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      maxlength: 200,
    },
    propertyDescription: {
      type: String,
      required: [true, "Property description is required"],
      maxlength: 5000,
    },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "land", "commercial", "farmhouse"],
      required: true,
    },
    propertyCategory: {
      type: String,
      enum: ["residential", "commercial", "industrial"],
      required: true,
    },
    listingType: {
      type: String,
      enum: ["auction", "direct_sale"],
      default: "auction",
    },
    propertyID: {
      type: String,
      unique: true,
      sparse: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    propertyStatus: {
      type: String,
      enum: ["available", "sold", "pending", "unsold"],
      default: "available",
    },

    // 2. Location Details
    location: {
      country: { type: String, default: "United Kingdom" },
      state: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      streetAddress: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    // 3. Property Specifications
    specifications: {
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      floors: { type: Number },
      yearBuilt: { type: Number },
      parkingSpaces: { type: Number },
      furnishedStatus: {
        type: String,
        enum: ["unfurnished", "semi-furnished", "fully-furnished"],
        default: "unfurnished",
      },
    },

    // 4. Pricing Information
    pricing: {
      currency: {
        type: String,
        enum: ["GBP", "USD", "EUR"],
        default: "GBP",
      },
      startingAuctionPrice: { type: Number, required: true },
      reservePrice: { type: Number, required: true },
      buyNowPrice: { type: Number },
      minimumBidIncrement: { type: Number, required: true },
      estimatedMarketValue: { type: Number },
    },

    // 5. Auction Details
    auctionDetails: {
      auctionStatus: {
        type: String,
        enum: ["upcoming", "live", "closed"],
        default: "upcoming",
      },
      bidDepositAmount: { type: Number },
      autoBidEnabled: { type: Boolean, default: false },
      maximumBidLimit: { type: Number },
      // numberOfBidders removed — use top-level totalBids instead
      // winner removed — use top-level winningBidder instead
      // currentBid removed — use top-level currentBid instead
      // soldPrice removed — use top-level currentBid/soldPrice instead
    },

    /*
     * Run in mongosh after deploying:
     * db.properties.updateMany({}, {
     *   $unset: {
     *     "auctionDetails.currentBid": "",
     *     "auctionDetails.numberOfBidders": "",
     *     "auctionDetails.winner": "",
     *     "auctionDetails.soldPrice": ""
     *   }
     * })
     */

    // 6. Features
    features: {
      garden: { type: Boolean, default: false },
      swimmingPool: { type: Boolean, default: false },
      balcony: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      securitySystem: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      solarSystem: { type: Boolean, default: false },
    },

    // 7. Legal Information
    legalInfo: {
      ownershipType: {
        type: String,
        required: true,
        enum: ["freehold", "leasehold", "shared"],
      },
      titleDeedNumber: { type: String },
    },

    // 8. Agent Information
    sellerInfo: {
      agentName: { type: String },
      agentContact: { type: String },
    },

    // 9. Media
    media: {
      propertyImages: [{ type: String }],
      propertyVideos: [{ type: String }],
      virtualTour: { type: String },
      floorPlans: [{ type: String }],
      legalDocuments: [{ type: String }],
    },

    // 10. System Fields
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    // ── Per-Property Bidding (NEW) ──
    currentBid: {
      type: Number,
      default: function () {
        return this.pricing?.startingAuctionPrice || 0;
      },
    },
    totalBids: {
      type: Number,
      default: 0,
    },
    winningBidder: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    soldPrice: {
      type: Number,
      default: null,
    },
    soldTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    savedBy: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for common queries
propertySchema.index({ propertyStatus: 1 });
propertySchema.index({ "auctionDetails.auctionStatus": 1 });
propertySchema.index({ "location.city": 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ currentBid: 1 });

propertySchema.pre('save', function(next) {
  if (this.isModified('propertyTitle')) {
    this.slug = this.propertyTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + this._id.toString().slice(-6);
  }
  next();
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
