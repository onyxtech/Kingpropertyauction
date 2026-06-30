import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // Linked entities
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: true,
    },
    auction: {
      type: mongoose.Schema.ObjectId,
      ref: "Auction",
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    buyerName: { type: String },
    buyerEmail: { type: String },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    buyerAddress: {
      street: { type: String },
      city: { type: String },
      postcode: { type: String },
    },
    payment: {
      type: mongoose.Schema.ObjectId,
      ref: "Payment",
    },
    commission: {
      type: mongoose.Schema.ObjectId,
      ref: "Commission",
    },
    // Amounts
    salePrice: {
      type: Number,
      required: true,
    },
    buyersFeePercent: {
      type: Number,
      default: 3,
    },
    buyersFeeAmount: {
      type: Number,
      required: true,
    },
    vatPercent: {
      type: Number,
      default: 20,
    },
    vatAmount: {
      type: Number,
      required: true,
    },
    depositPercent: {
      type: Number,
      default: 10,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    additionalFees: { type: Number, default: 0 },
    // Status
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "overdue",
        "cancelled",
        "refunded",
        "withdrawn",
      ],
      default: "pending",
    },
    // Dates
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },
    // Notes
    notes: {
      type: String,
    },
    // Who created
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    // Invoice type
    invoiceType: {
      type: String,
      enum: [
        "auction_sale",
        "direct_sale",
        "offer_accept",
        "reassigned",
        "manual",
      ],
      default: "auction_sale",
    },
    // Terms text
    termsOfSale: {
      type: String,
      default:
        "Standard Terms: 4 week completion with 1 week extension. 10% deposit (minimum £3,000). Buyer's fee: 3% of sale price (minimum £3,250 + VAT).",
    },
  },
  { timestamps: true },
);

invoiceSchema.index({ buyer: 1, status: 1 });
invoiceSchema.index({ property: 1 });
invoiceSchema.index({ createdAt: -1 });

// Auto-generate invoice number
invoiceSchema.pre("validate", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-KPA-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
