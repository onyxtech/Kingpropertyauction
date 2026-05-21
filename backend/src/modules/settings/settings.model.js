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
});

// ─── API Integrations Schema ───
export const ApiIntegrationsSchema = z.object({
  groqApiKey: z.string().default(""),
  geminiApiKey: z.string().default(""),
  googlePlacesApiKey: z.string().default(""),
  openaiApiKey: z.string().default(""),
  activeAiProvider: z.enum(["groq", "gemini", "openai"]).default("groq"),
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
