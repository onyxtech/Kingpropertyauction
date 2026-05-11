import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_FILE = path.join(__dirname, "../../data/email-templates.json");

const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultTemplates = {
  welcome: {
    subject: "Welcome to King Property Auction! 🏠",
    html: `<h2>Welcome, {user_name}!</h2>
<p>Thank you for registering with King Property Auction.</p>
<p>Your account has been created and is pending admin approval. You'll receive another email once your account is activated.</p>
<p>Start browsing properties: <a href="{site_url}/website">Browse Properties</a></p>`,
    variables: ["user_name", "site_url"],
  },
  accountApproved: {
    subject: "Your account has been approved! ✅",
    html: `<h2>Great news, {user_name}!</h2>
<p>Your account has been approved. You can now place bids on properties.</p>
<p><a href="{site_url}/login" style="background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Login & Start Bidding</a></p>`,
    variables: ["user_name", "site_url"],
  },
  accountRejected: {
    subject: "Account Status Update",
    html: `<h2>Account Status Update</h2>
<p>Hi {user_name},</p>
<p>{reason}</p>
<p>If you believe this is an error, please contact us at {site_url}/contact-us.</p>`,
    variables: ["user_name", "reason", "site_url"],
  },
  passwordReset: {
    subject: "Reset Your Password",
    html: `<h2>Password Reset Request</h2>
<p>You requested a password reset. Click the link below to set a new password:</p>
<p><a href="{reset_link}" style="background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
<p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
    variables: ["user_name", "reset_link"],
  },
  bidConfirmation: {
    subject: "Bid Confirmed - {property_title}",
    html: `<h2>Bid Placed Successfully!</h2>
<p>Hi {user_name},</p>
<p>Your bid of <strong>{bid_amount}</strong> on <strong>{property_title}</strong> has been placed.</p>
<p>Current bid: {current_bid}</p>
<p><a href="{property_url}">View Property</a></p>`,
    variables: [
      "user_name",
      "property_title",
      "bid_amount",
      "current_bid",
      "property_url",
    ],
  },
  outbidAlert: {
    subject: "⚠️ You've been outbid on {property_title}",
    html: `<h2>You've Been Outbid!</h2>
<p>Hi {user_name},</p>
<p>Someone placed a higher bid on <strong>{property_title}</strong>.</p>
<p>Your bid: {your_bid}</p>
<p>Current highest: {current_bid}</p>
<p><a href="{property_url}" style="background:#DC2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Place a Higher Bid</a></p>`,
    variables: [
      "user_name",
      "property_title",
      "your_bid",
      "current_bid",
      "property_url",
    ],
  },
  auctionWon: {
    subject: "🎉 Congratulations! You won {property_title}",
    html: `<h2>You Won the Auction!</h2>
<p>Congratulations {user_name}!</p>
<p>You won <strong>{property_title}</strong> for <strong>{final_price}</strong>.</p>
<p>Auction: {auction_name}</p>
<p>Our team will contact you to complete the purchase.</p>`,
    variables: ["user_name", "property_title", "final_price", "auction_name"],
  },
  auctionLost: {
    subject: "Auction Ended - {property_title}",
    html: `<h2>Auction Ended</h2>
<p>Hi {user_name},</p>
<p>The auction for <strong>{property_title}</strong> has ended.</p>
<p>Final price: {final_price}</p>
<p>You were not the winning bidder. Browse more properties below:</p>
<p><a href="{site_url}/website">Browse Properties</a></p>`,
    variables: ["user_name", "property_title", "final_price", "site_url"],
  },
  propertySold: {
    subject: "✅ Your property has been sold! - {property_title}",
    html: `<h2>Your Property Has Been Sold!</h2>
<p>Hi {seller_name},</p>
<p>Your property <strong>{property_title}</strong> has been sold for <strong>{final_price}</strong>.</p>
<p>Our team will contact you to complete the sale.</p>`,
    variables: ["seller_name", "property_title", "final_price"],
  },
  propertyUnsold: {
    subject: "Auction Result - {property_title}",
    html: `<h2>Auction Result: Unsold</h2>
<p>Hi {seller_name},</p>
<p>The auction for <strong>{property_title}</strong> has ended without meeting the reserve price.</p>
<p>Highest bid: {highest_bid}</p>
<p>Reserve price: {reserve_price}</p>
<p>Contact us to discuss relisting options.</p>`,
    variables: [
      "seller_name",
      "property_title",
      "highest_bid",
      "reserve_price",
    ],
  },
  contactForm: {
    subject: "New Contact Form Submission",
    html: `<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {user_name}</p>
<p><strong>Email:</strong> {user_email}</p>
<p><strong>Phone:</strong> {user_phone}</p>
<p><strong>Message:</strong> {message}</p>`,
    variables: ["user_name", "user_email", "user_phone", "message"],
  },
  valuationRequest: {
    subject: "New Valuation Request",
    html: `<h2>New Valuation Request</h2>
<p><strong>Name:</strong> {user_name}</p>
<p><strong>Email:</strong> {user_email}</p>
<p><strong>Phone:</strong> {user_phone}</p>
<p><strong>Property Address:</strong> {property_address}</p>
<p><strong>Property Type:</strong> {property_type}</p>`,
    variables: [
      "user_name",
      "user_email",
      "user_phone",
      "property_address",
      "property_type",
    ],
  },
};

const readTemplates = () => {
  try {
    if (fs.existsSync(TEMPLATES_FILE)) {
      return {
        ...defaultTemplates,
        ...JSON.parse(fs.readFileSync(TEMPLATES_FILE, "utf8")),
      };
    }
  } catch (e) {
    console.error("Error reading templates:", e.message);
  }
  return defaultTemplates;
};

const writeTemplates = (templates) => {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
};

export const renderTemplate = (key, variables = {}) => {
  const templates = readTemplates();
  const template = templates[key];
  if (!template) return `<p>Template "${key}" not found.</p>`;

  let html = template.html;
  Object.entries(variables).forEach(([varName, value]) => {
    html = html.replace(new RegExp(`\\{${varName}\\}`, "g"), value || "");
  });

  return html;
};

export const getAllTemplates = () => {
  return readTemplates();
};

export const getTemplate = (key) => {
  const templates = readTemplates();
  return templates[key] || null;
};

export const updateTemplate = (key, data) => {
  const templates = readTemplates();
  templates[key] = { ...templates[key], ...data };
  writeTemplates(templates);
  return templates[key];
};

export const resetTemplate = (key) => {
  const templates = readTemplates();
  templates[key] = { ...defaultTemplates[key] };
  writeTemplates(templates);
  return templates[key];
};
