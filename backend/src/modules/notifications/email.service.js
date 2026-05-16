import nodemailer from 'nodemailer';
import { getEmailSettings } from '../settings/settings.service.js';
import { renderTemplate } from './template.service.js';

let _transporter = null;
let _settingsHash = null;

// ─── Build a settings hash to detect config changes ───
const hashSettings = (s) => `${s.host}:${s.port}:${s.username}:${s.encryption}`;

// ─── Get or rebuild the Nodemailer transporter ───
const getTransporter = async () => {
  const settings = await getEmailSettings();

  if (!settings?.host || !settings?.username || !settings?.password || !settings?.senderEmail) {
    return null;
  }

  const hash = hashSettings(settings);

  // Return cached transporter if settings haven't changed
  if (_transporter && _settingsHash === hash) {
    return { transporter: _transporter, settings };
  }

  _transporter = nodemailer.createTransport({
    host: settings.host,
    port: parseInt(settings.port),
    secure: settings.encryption === 'ssl' || settings.encryption === 'SSL',
    auth: {
      user: settings.username,
      pass: settings.password,
    },
    ...(settings.encryption === 'tls' && {
      tls: { rejectUnauthorized: false },
    }),
    // Connection pool for performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  _settingsHash = hash;
  console.log('📧 Email transporter created:', settings.host, settings.port);

  return { transporter: _transporter, settings };
};

// ─── Core send function ───
export const sendEmail = async ({ to, subject, templateKey, variables, html }) => {
  try {
    const result = await getTransporter();

    if (!result) {
      console.warn('[Email] Not configured — skipping email to:', to);
      return { success: false, message: 'Email not configured' };
    }

    const { transporter, settings } = result;

    // Render template if a key is provided, otherwise use raw html
    let emailHtml = html;
    if (templateKey) {
      try {
        emailHtml = await renderTemplate(templateKey, variables || {});
      } catch (e) {
        console.error('[Email] Template render failed, using fallback:', e.message);
        // Graceful fallback: plain HTML from variables
        emailHtml = `<div style="font-family:Arial,sans-serif;padding:24px;">
          <h2>${subject}</h2>
          ${variables?.message ? `<p>${variables.message}</p>` : ''}
        </div>`;
      }
    }

    if (!emailHtml) {
      return { success: false, message: 'No email content provided' };
    }

    const info = await transporter.sendMail({
      from: `"${settings.senderName || 'King Property Auction'}" <${settings.senderEmail}>`,
      to,
      subject,
      html: emailHtml,
    });

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error(`[Email] ❌ Failed to send to ${to}:`, error.message);
    return { success: false, message: error.message };
  }
};

// ─── Bulk send (for campaigns) with rate limiting ───
export const sendBulkEmail = async (recipients, { subject, templateKey, variables, html }, delayMs = 200) => {
  const results = [];

  for (const recipient of recipients) {
    const mergedVariables = { ...variables, user_name: recipient.name, user_email: recipient.email };
    const result = await sendEmail({
      to: recipient.email,
      subject,
      templateKey,
      variables: mergedVariables,
      html,
    });
    results.push({ email: recipient.email, ...result });

    // Respect SMTP rate limits
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return {
    total: results.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
};

// ─── Reset transporter (called when settings are updated) ───
export const resetTransporter = () => {
  _transporter = null;
  _settingsHash = null;
  console.log('[Email] Transporter reset — will rebuild on next send');
};

// ─── Test connection (called from settings controller) ───
export const testEmailConnection = async (testEmail) => {
  const result = await getTransporter();
  if (!result) {
    throw new Error('Email not configured — fill in all SMTP fields first');
  }
  const { transporter, settings } = result;
  await transporter.verify();
  await transporter.sendMail({
    from: `"${settings.senderName || 'King Property Auction'}" <${settings.senderEmail}>`,
    to: testEmail,
    subject: 'King Property Auction — SMTP Test',
    html: '<p>Your email configuration is working correctly.</p>',
  });
  return { success: true };
};
