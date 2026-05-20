import { Save, Send, AlertCircle, Shield, Zap } from "lucide-react";

interface EmailForm {
  mailer: string;
  host: string;
  port: string;
  encryption: string;
  username: string;
  password: string;
  sendgridApiKey: string;
  mailgunApiKey: string;
  mailgunDomain: string;
  mailchimpApiKey: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
}

interface EmailConfigTabProps {
  emailForm: EmailForm;
  setEmailForm: (form: EmailForm) => void;
  isSaving: boolean;
  isTesting: boolean;
  testEmail: string;
  setTestEmail: (v: string) => void;
  onSave: () => void;
  onTest: () => void;
  mailerOptions: { value: string; label: string }[];
}

export default function EmailConfigTab({
  emailForm,
  setEmailForm,
  isSaving,
  isTesting,
  testEmail,
  setTestEmail,
  onSave,
  onTest,
  mailerOptions,
}: EmailConfigTabProps) {
  return (
    <div>
      {/* Mailer Selector */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
          <Zap className="size-4 text-amber-500" /> Mailer Provider
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mailerOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEmailForm({ ...emailForm, mailer: opt.value })}
              className={`p-4 rounded-xl text-sm font-bold transition-all border-2 ${
                emailForm.mailer === opt.value
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* SMTP Fields */}
      {emailForm.mailer === "smtp" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "SMTP Host", key: "host", placeholder: "smtp.hostinger.com" },
            { label: "Port", key: "port", placeholder: "465" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                {field.label}
              </label>
              <input
                type="text"
                value={(emailForm as any)[field.key]}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, [field.key]: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Encryption
            </label>
            <select
              value={emailForm.encryption}
              onChange={(e) =>
                setEmailForm({ ...emailForm, encryption: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="SSL">SSL</option>
              <option value="TLS">TLS</option>
              <option value="None">None</option>
            </select>
          </div>
          {[
            {
              label: "Username",
              key: "username",
              placeholder: "admin@kingpropertyauction.com",
            },
            {
              label: "Password",
              key: "password",
              type: "password",
              placeholder: "Enter password",
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                value={(emailForm as any)[field.key]}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, [field.key]: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      )}

      {/* SendGrid */}
      {emailForm.mailer === "sendgrid" && (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
          <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
            🔑 SendGrid API Configuration
          </label>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              API Key
            </label>
            <input
              type="password"
              value={emailForm.sendgridApiKey}
              onChange={(e) =>
                setEmailForm({ ...emailForm, sendgridApiKey: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
            />
            {!emailForm.sendgridApiKey && (
              <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                <AlertCircle className="size-3" /> API key required to send
                emails via SendGrid.
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Get your key at{" "}
              <a
                href="https://app.sendgrid.com/settings/api_keys"
                target="_blank"
                className="text-blue-600 underline"
              >
                SendGrid Dashboard
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Mailgun */}
      {emailForm.mailer === "mailgun" && (
        <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
          <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
            🔑 Mailgun API Configuration
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                API Key
              </label>
              <input
                type="password"
                value={emailForm.mailgunApiKey}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, mailgunApiKey: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="key-xxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Domain
              </label>
              <input
                type="text"
                value={emailForm.mailgunDomain}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, mailgunDomain: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="mg.kingpropertyauction.com"
              />
            </div>
          </div>
          {(!emailForm.mailgunApiKey || !emailForm.mailgunDomain) && (
            <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
              <AlertCircle className="size-3" /> API key and domain required to
              send emails via Mailgun.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Get your key at{" "}
            <a
              href="https://app.mailgun.com/settings/api_security"
              target="_blank"
              className="text-red-600 underline"
            >
              Mailgun Dashboard
            </a>
          </p>
        </div>
      )}

      {/* Mailchimp */}
      {emailForm.mailer === "mailchimp" && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
          <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
            🔑 Mailchimp Transactional API Configuration
          </label>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              API Key
            </label>
            <input
              type="password"
              value={emailForm.mailchimpApiKey}
              onChange={(e) =>
                setEmailForm({ ...emailForm, mailchimpApiKey: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              placeholder="md-xxxxxxxxxxxxxxxxxxxx"
            />
            {!emailForm.mailchimpApiKey && (
              <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                <AlertCircle className="size-3" /> API key required to send
                emails via Mailchimp.
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Get your key at{" "}
              <a
                href="https://mandrillapp.com/settings"
                target="_blank"
                className="text-amber-600 underline"
              >
                Mailchimp Transactional Settings
              </a>
            </p>
          </div>
        </div>
      )}

      {/* No mailer warning */}
      {!emailForm.mailer && (
        <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-3">
          <AlertCircle className="size-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Please select a mailer provider above to configure email settings.
          </p>
        </div>
      )}

      {/* Sender Identity */}
      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-4">
          <Shield className="size-4 text-blue-500" /> Sender Identity
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              label: "Sender Name",
              key: "senderName",
              placeholder: "King Property Auction",
            },
            {
              label: "Sender Email",
              key: "senderEmail",
              type: "email",
              placeholder: "noreply@kingpropertyauction.com",
            },
            {
              label: "Reply-To Email",
              key: "replyTo",
              type: "email",
              placeholder: "info@kingpropertyauction.com",
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                value={(emailForm as any)[field.key]}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, [field.key]: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="size-4" />{" "}
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>

          <div className="h-10 w-px bg-slate-300" />

          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1.5">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="px-4 py-2.5 bg-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
              placeholder="Enter email to send test..."
            />
            <button
              onClick={onTest}
              disabled={isTesting || !testEmail}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="size-4" /> {isTesting ? "Sending..." : "Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
