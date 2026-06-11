import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin", "buyer", "seller"],
      default: "user",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      postcode: { type: String },
      country: { type: String, default: "United Kingdom" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    agentDetails: {
      companyName: String,
      licenseNumber: String,
      commissionRate: Number,
      specialization: String,
      companyAddress: String,
    },
    bankDetails: {
      accountHolderName: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      sortCode: { type: String, default: "" },
      iban: { type: String, default: "" },
      bankAddress: { type: String, default: "" },
    },
    notificationSettings: {
      bidPlaced: { type: Boolean, default: true },
      outbid: { type: Boolean, default: true },
      auctionWon: { type: Boolean, default: true },
      auctionLost: { type: Boolean, default: true },
      auctionStarted: { type: Boolean, default: true },
      propertyApproved: { type: Boolean, default: true },
      propertyRejected: { type: Boolean, default: true },
      propertySold: { type: Boolean, default: true },
      newBidOnProperty: { type: Boolean, default: true },
      newEnquiry: { type: Boolean, default: true },
      messageReceived: { type: Boolean, default: true },
      auctionEnded: { type: Boolean, default: true },
      offerReceived: { type: Boolean, default: true },
      paymentDue: { type: Boolean, default: true },
      paymentOverdue: { type: Boolean, default: true },
      commissionEarned: { type: Boolean, default: true },
      withdrawalUpdate: { type: Boolean, default: true },
      fundsTransferred: { type: Boolean, default: true },
    },
    permissions: {
      canBid: { type: Boolean, default: true },
      canListProperties: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
    },
    marketingOptOut: { type: Boolean, default: false },
    activeView: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    roleRequest: {
      requestedRole: { type: String, enum: ["seller", "agent", "buyer"] },
      status: { type: String, enum: ["pending", "approved", "rejected"] },
      requestedAt: { type: Date },
      reviewedAt: { type: Date },
      reviewNote: { type: String },
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Set role-based permissions for new users
userSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  if (!this.permissions) this.permissions = {};
  if (this.role === "buyer" || this.role === "user") {
    this.permissions.canBid = true;
    this.permissions.canListProperties = false;
  } else if (this.role === "seller" || this.role === "agent") {
    this.permissions.canBid = false;
    this.permissions.canListProperties = true;
  } else if (this.role === "admin") {
    this.permissions.canBid = false;
    this.permissions.canListProperties = false;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1 });

const User = mongoose.model("User", userSchema);
export default User;
