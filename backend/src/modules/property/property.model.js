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
      enum: ["available", "sold", "pending"],
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
      latitude: { type: String },
      longitude: { type: String },
    },

    // 3. Property Specifications
    specifications: {
      totalArea: { type: Number, required: true },
      landArea: { type: Number },
      coveredArea: { type: Number },
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
      auctionStartDate: { type: Date, required: true },
      auctionEndDate: { type: Date, required: true },
      auctionStatus: {
        type: String,
        enum: ["upcoming", "live", "closed"],
        default: "upcoming",
      },
      bidDepositAmount: { type: Number },
      autoBidEnabled: { type: Boolean, default: false },
      maximumBidLimit: { type: Number },
      numberOfBidders: { type: Number, default: 0 },
    },

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
      propertyTaxInfo: { type: String },
      mortgageStatus: {
        type: String,
        enum: ["clear", "mortgaged", "partially_paid"],
        default: "clear",
      },
      zoningType: { type: String },
    },

    // 8. Seller & Agent Information
    sellerInfo: {
      sellerName: { type: String, required: true },
      sellerContact: { type: String, required: true },
      sellerEmail: { type: String, required: true },
      agentName: { type: String },
      agentContact: { type: String },
    },

    // 9. Media
    media: {
      propertyImages: [{ type: String }],
      propertyVideo: { type: String },
      virtualTour: { type: String },
      floorPlan: { type: String },
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
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
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
