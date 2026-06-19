import mongoose from "mongoose";

const propertyOfferSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: true,
    },
    // Offeror Details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    postcode: {
      type: String,
      required: [true, "Postcode is required"],
      trim: true,
    },
    // Offer Details
    offerAmount: {
      type: Number,
      required: [true, "Offer amount is required"],
      min: 1,
    },
    offerAmountInWords: {
      type: String,
      required: [true, "Offer amount in words is required"],
      trim: true,
    },
    // Solicitor Details
    solicitorDetails: {
      type: String,
      required: [true, "Solicitor details are required"],
      trim: true,
    },
    // Terms Acceptance
    termsAccepted: {
      type: Boolean,
      required: [true, "You must accept the terms of sale"],
      enum: [true],
    },
    // Signature (base64 image or data URL)
    signature: {
      type: String,
      default: "",
    },
    // Status
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "declined", "withdrawn"],
      default: "pending",
    },
    // Who submitted (optional - null for guests)
    submittedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    // Linked lead for inbox tracking
    lead: {
      type: mongoose.Schema.ObjectId,
      ref: "Lead",
    },
    // Admin notes
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

propertyOfferSchema.index({ property: 1, createdAt: -1 });
propertyOfferSchema.index({ status: 1 });
propertyOfferSchema.index({ email: 1 });

const PropertyOffer = mongoose.model("PropertyOffer", propertyOfferSchema);
export default PropertyOffer;