import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import formData from "form-data";
import Mailgun from "mailgun.js";
import mailchimp from "@mailchimp/mailchimp_transactional";
import { getEmailSettings } from "../settings/settings.service.js";
import { renderTemplate } from "./template.service.js";

let transporter = null;
let currentMailer = null;

const getTransporter = async () => {
  const settings = await getEmailSettings();
  if (!settings) return null;

  // Return cached transporter if settings haven't changed
  if (transporter && currentMailer === settings.mailer) {
    return transporter;
  }

  currentMailer = settings.mailer;

  switch (settings.mailer) {
    case "smtp": {
      if (!settings.host || !settings.username) return null;
      transporter = nodemailer.createTransport({
        host: settings.host,
        port: parseInt(settings.port),
        secure: settings.encryption === "SSL",
        auth: {
          user: settings.username,
          pass: settings.password,
        },
      });
      console.log("📧 Using SMTP mailer");
      break;
    }

    case "sendgrid": {
      if (!settings.sendgridApiKey) return null;
      sgMail.setApiKey(settings.sendgridApiKey);
      transporter = "sendgrid"; // Flag-based
      console.log("📧 Using SendGrid mailer");
      break;
    }

    case "mailgun": {
      if (!settings.mailgunApiKey || !settings.mailgunDomain) return null;
      const mailgunClient = new Mailgun(formData);
      transporter = mailgunClient.client({
        key: settings.mailgunApiKey,
        username: "api",
      });
      console.log("📧 Using Mailgun mailer");
      break;
    }

    case "mailchimp": {
      if (!settings.mailchimpApiKey) return null;
      transporter = mailchimp(settings.mailchimpApiKey);
      console.log("📧 Using Mailchimp mailer");
      break;
    }

    default:
      return null;
  }

  return transporter;
};

export const sendEmail = async ({
  to,
  subject,
  templateKey,
  variables,
  html,
}) => {
  try {
    const transport = await getTransporter();
    if (!transport) return { success: false, message: "Email not configured" };

    const settings = await getEmailSettings();

    let emailHtml = html;
    if (templateKey) {
      emailHtml = await renderTemplate(templateKey, variables);
    }

    const mailOptions = {
      from: `"${settings.senderName || "King Property Auction"}" <${settings.senderEmail}>`,
      to,
      subject,
      html: emailHtml,
    };

    // Send based on mailer type
    if (currentMailer === "sendgrid") {
      const [response] = await sgMail.send(mailOptions);
      console.log(`✅ SendGrid email sent: ${response.statusCode}`);
      return { success: true, messageId: response.headers?.["x-message-id"] };
    } else if (currentMailer === "mailgun") {
      const result = await transport.messages.create(settings.mailgunDomain, {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
      });
      console.log(`✅ Mailgun email sent: ${result.id}`);
      return { success: true, messageId: result.id };
    } else if (currentMailer === "mailchimp") {
      const result = await transport.messages.send({
        message: {
          from_email: settings.senderEmail,
          from_name: settings.senderName,
          to: [{ email: to }],
          subject,
          html: emailHtml,
        },
      });
      console.log(`✅ Mailchimp email sent: ${result[0]?._id}`);
      return { success: true, messageId: result[0]?._id };
    } else {
      // SMTP (nodemailer)
      const info = await transport.sendMail(mailOptions);
      console.log(`✅ SMTP email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return { success: false, error: error.message };
  }
};

export const testEmailConnection = async (testEmail) => {
  try {
    const transport = await getTransporter();
    if (!transport)
      return {
        success: false,
        message: "Email not configured. Please save mailer settings first.",
      };

    const settings = await getEmailSettings();

    // Verify connection
    if (currentMailer === "smtp") {
      await transport.verify();
    }
    // For API-based mailers, verification is just checking API keys exist

    if (testEmail) {
      await sendEmail({
        to: testEmail,
        subject: "✅ King Property Auction - Email Test",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#2563EB;">Email Configuration Successful!</h2>
          <p>Your <strong>${currentMailer.toUpperCase()}</strong> mailer is configured correctly.</p>
          <p>Mailer: ${currentMailer}</p>
          <p style="color:#64748B;font-size:12px;">Sent from King Property Auction Platform</p>
        </div>`,
      });
    }

    return {
      success: true,
      message: `${currentMailer.toUpperCase()} connection successful`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
