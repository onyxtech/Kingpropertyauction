import mongoose from "mongoose";
import { z } from "zod";

// ─── Zod Validation Schemas ───
export const EmailConfigSchema = z.object({
  mailer: z.enum(["smtp", "sendgrid", "mailgun", "mailchimp"]).default("smtp"),

  // SMTP fields
  host: z.string().default(""),
  port: z.string().default("465"),
  encryption: z.enum(["SSL", "TLS", "None"]).default("SSL"),
  username: z.string().default(""),
  password: z.string().default(""),

  // API keys for cloud mailers
  sendgridApiKey: z.string().default(""),
  mailgunApiKey: z.string().default(""),
  mailgunDomain: z.string().default(""),
  mailchimpApiKey: z.string().default(""),

  // Sender info
  senderName: z.string().default("King Property Auction"),
  senderEmail: z.string().email().default(""),
  replyTo: z.string().email().optional().default(""),
});

export const NotificationRulesSchema = z.object({
  welcome: z.boolean().default(true),
  accountApproved: z.boolean().default(true),
  accountRejected: z.boolean().default(true),
  passwordReset: z.boolean().default(true),
  bidConfirmation: z.boolean().default(true),
  outbidAlert: z.boolean().default(true),
  auctionWon: z.boolean().default(true),
  auctionLost: z.boolean().default(true),
  auctionStartingSoon: z.boolean().default(true),
  auctionStarted: z.boolean().default(true),
  auctionStartedSeller: z.boolean().default(true),
  auctionEnded: z.boolean().default(true),
  propertySubmitted: z.boolean().default(true),
  propertyApproved: z.boolean().default(true),
  propertyRejected: z.boolean().default(true),
  propertySold: z.boolean().default(true),
  propertyUnsold: z.boolean().default(true),
  contactForm: z.boolean().default(true),
  valuationRequest: z.boolean().default(true),
  catalogueRequest: z.boolean().default(true),
  adminLeadAlert: z.boolean().default(true),
  adminReply: z.boolean().default(true),
  newSupportTicket: z.boolean().default(true),
  supportReply: z.boolean().default(true),
  roleRequestAdmin: z.boolean().default(true),
  roleRequestApproved: z.boolean().default(true),
  registerAlert: z.boolean().default(true),
  solicitorEnquiry: z.boolean().default(true),
  homeReport: z.boolean().default(true),
  referralFee: z.boolean().default(true),
  buyingEnquiry: z.boolean().default(true),
  sellingEnquiry: z.boolean().default(true),
  chatEnquiry: z.boolean().default(true),
  faqSupport: z.boolean().default(true),
  legalEnquiry: z.boolean().default(true),
  newsletterSignup: z.boolean().default(true),
  propertyInquiry: z.boolean().default(true),
  propertyInquiryReply: z.boolean().default(true),
  buyerToOwnerMessage: z.boolean().default(true),
  ownerToBuyerReply: z.boolean().default(true),
  adminInquiryCC: z.boolean().default(true),
  propertyAddedToAuction: z.boolean().default(true),
  propertyInquiryConfirmation: z.boolean().default(true),
  offerNotification: z.boolean().default(true),
  paymentDue: z.boolean().default(true),
  paymentOverdue: z.boolean().default(true),
  paymentWithdrawn: z.boolean().default(true),
  commissionEarned: z.boolean().default(true),
  withdrawalRequested: z.boolean().default(true),
  fundsTransferred: z.boolean().default(true),
  propertyAvailableAgain: z.boolean().default(true),
  offerConfirmation: z.boolean().default(true),
  offerNotification: z.boolean().default(true),
  offerReply: z.boolean().default(true),
  offerAccepted: z.boolean().default(true),
  offerDeclined: z.boolean().default(true),
  invoiceGenerated: z.boolean().default(true),
  invoicePaid: z.boolean().default(true),
});

// ─── API Integrations Schema ───
export const ApiIntegrationsSchema = z.object({
  groqApiKey: z.string().default(""),
  geminiApiKey: z.string().default(""),
  googlePlacesApiKey: z.string().default(""),
  openaiApiKey: z.string().default(""),
  activeAiProvider: z.enum(["groq", "gemini", "openai"]).default("groq"),
    // Zoopla Integration
  zooplaEnabled: z.boolean().default(false),
  zooplaApiKey: z.string().default(""),
  zooplaApiSecret: z.string().default(""),
  zooplaBranchId: z.string().default(""),
  zooplaAgentId: z.string().default(""),
  zooplaTestMode: z.boolean().default(true),
});

// ─── OAuth Configuration Schema ───
export const OAuthProviderSchema = z.object({
  enabled: z.boolean().default(false),
  clientId: z.string().default(""),
  clientSecret: z.string().default(""),
  callbackUrl: z.string().default(""),
});

export const OAuthConfigSchema = z.object({
  google: OAuthProviderSchema.default({}),
  github: OAuthProviderSchema.default({}),
  facebook: OAuthProviderSchema.default({}),
});

export const GeneralSchema = z.object({
  defaultCommissionRate: z.number().min(0).max(100).default(5),
  paymentDueHours: z.number().min(1).default(48),
  // Invoice defaults
  invoiceBuyersFeePercent: z.number().min(0).max(100).default(3),
  invoiceBuyersFeeMin: z.number().min(0).default(3250),
  invoiceDepositPercent: z.number().min(0).max(100).default(10),
  invoiceDepositMin: z.number().min(0).default(3000),
  invoiceVatPercent: z.number().min(0).max(100).default(20),
  invoicePrefix: z.string().default("INV-KPA-"),
  invoiceAdditionalFees: z.number().min(0).default(0),
  // Default Terms of Sale text
  defaultTermsOfSale: z.string().default("*10% Deposit (Minimum £3,000)\nStandard Completion (Unless specified differently in any Special Conditions of Sale)\n*Buyers Fee = 3% of Sale Price (Minimum £3,250 + vat)\n\nSTANDARD TERMS OF SALE are 4 week completion with 1 week extension. Sellers can request an earlier or later completion date which will be detailed in any Special Conditions of Sale for this lot. Buyers must satisfy themselves prior to bidding as to the terms on offer.\n\n* If no Special Conditions of Sale are present in the legal docs download bidders are advised to request a copy by email prior to bidding."),
});

export const SettingKeySchema = z.enum([
  "email_config",
  "notification_rules",
  "oauth_config",
  "general",
  "api_integrations",
]);

// ─── Mongoose Schema ───
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => SettingKeySchema.safeParse(v).success,
        message: "Invalid setting key",
      },
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
