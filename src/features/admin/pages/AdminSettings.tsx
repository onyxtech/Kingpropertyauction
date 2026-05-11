import { useState, useEffect, useRef } from "react";
import {
  Save,
  Send,
  CheckCircle,
  XCircle,
  Mail,
  Bell,
  FileText,
  Shield,
  Zap,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import AdminLayout from "../components/AdminLayout";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("email");
  const [testEmail, setTestEmail] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [emailForm, setEmailForm] = useState({
    mailer: "smtp",
    host: "",
    port: "465",
    encryption: "SSL",
    username: "",
    password: "",
    sendgridApiKey: "",
    mailgunApiKey: "",
    mailgunDomain: "",
    mailchimpApiKey: "",
    senderName: "King Property Auction",
    senderEmail: "",
    replyTo: "",
  });

  const [oauthForm, setOAuthForm] = useState({
    google: { enabled: false, clientId: "", clientSecret: "" },
    github: { enabled: false, clientId: "", clientSecret: "" },
    facebook: { enabled: false, clientId: "", clientSecret: "" },
  });
  const [rules, setRules] = useState<Record<string, boolean>>({});
  const loadedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || loadedRef.current) return;
    loadedRef.current = true;

    const loadData = async () => {
      try {
        const settingsResult = await apiClient.fetch("/settings/email");
        if (settingsResult.success && settingsResult.data) {
          setEmailForm((prev) => ({
            ...prev,
            ...settingsResult.data,
            password: "",
          }));
        }
        const rulesResult = await apiClient.fetch("/settings/rules");
        if (rulesResult.success && rulesResult.data) {
          setRules(rulesResult.data);
        }
        const oauthResult = await apiClient.fetch("/settings/oauth");
        if (oauthResult.success && oauthResult.data) {
          setOAuthForm((prev) => ({ ...prev, ...oauthResult.data }));
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await apiClient.fetch("/settings/email", {
        method: "PUT",
        body: JSON.stringify(emailForm),
      });
      setSaveMessage(
        result.success
          ? "Settings saved successfully!"
          : "Error: " + result.message,
      );
    } catch (e: any) {
      setSaveMessage("Error: " + e.message);
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleTest = async () => {
    if (!testEmail) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await apiClient.fetch("/settings/test", {
        method: "POST",
        body: JSON.stringify({ testEmail }),
      });
      setTestResult(result);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    }
    setIsTesting(false);
  };

  const handleOAuthSave = async () => {
    setIsSaving(true);
    try {
      const result = await apiClient.fetch("/settings/oauth", {
        method: "PUT",
        body: JSON.stringify(oauthForm),
      });
      setSaveMessage(
        result.success ? "OAuth settings saved!" : "Error: " + result.message,
      );
    } catch (e: any) {
      setSaveMessage("Error: " + e.message);
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleRuleToggle = async (key: string) => {
    const updated = { ...rules, [key]: !rules[key] };
    setRules(updated);
    try {
      await apiClient.fetch("/settings/rules", {
        method: "PUT",
        body: JSON.stringify(updated),
      });
    } catch (e) {}
  };

  const tabs = [
    {
      id: "email",
      label: "Email Configuration",
      icon: Mail,
      description: "SMTP settings, test emails, mailer preferences",
    },
    {
      id: "rules",
      label: "Notification Rules",
      icon: Bell,
      description: "Toggle automatic email notifications",
    },
    {
      id: "templates",
      label: "Email Templates",
      icon: FileText,
      description: "Customize email content and design",
    },
    {
      id: "oauth",
      label: "OAuth Providers",
      icon: Shield,
      description: "Google, GitHub, Facebook login",
    },
  ];

  const mailerOptions = [
    { value: "smtp", label: "SMTP (Hostinger, cPanel, Custom)" },
    { value: "sendgrid", label: "SendGrid" },
    { value: "mailgun", label: "Mailgun" },
    { value: "mailchimp", label: "Mailchimp Transactional" },
  ];

  const ruleLabels: Record<string, string> = {
    welcome: "Welcome Email",
    accountApproved: "Account Approved",
    accountRejected: "Account Rejected",
    bidConfirmation: "Bid Confirmation",
    outbidAlert: "Outbid Alert",
    auctionWon: "Auction Won",
    auctionLost: "Auction Lost",
    propertySold: "Property Sold",
    propertyUnsold: "Property Unsold",
    passwordReset: "Password Reset",
    contactForm: "Contact Form",
    valuationRequest: "Valuation Request",
  };

  if (isLoading) {
    return (
      <AdminLayout activeTab="settings" onTabChange={() => {}}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <AdminLayout activeTab="settings" onTabChange={() => {}}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-slate-900">Settings</h2>
          <p className="text-slate-600 font-medium mt-1">
            Manage email configuration, notifications, and templates
          </p>
        </div>

        {/* Tab Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 scale-[1.02]"
                    : "bg-white/80 backdrop-blur-xl border-2 border-white/60 shadow-lg hover:shadow-xl hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`size-10 rounded-xl flex items-center justify-center mb-3 ${
                    isActive
                      ? "bg-white/20"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  <Icon
                    className={`size-5 ${isActive ? "text-white" : "text-white"}`}
                  />
                </div>
                <h3
                  className={`font-black text-sm mb-1 ${isActive ? "text-white" : "text-slate-900"}`}
                >
                  {tab.label}
                </h3>
                <p
                  className={`text-xs font-medium ${isActive ? "text-white/70" : "text-slate-500"}`}
                >
                  {tab.description}
                </p>
                {isActive && (
                  <div className="absolute top-4 right-4 size-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/60 shadow-xl overflow-hidden">
          {/* Tab Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 px-8 py-5">
            <div className="flex items-center gap-3">
              {activeTabData && (
                <>
                  <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <activeTabData.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {activeTabData.label}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {activeTabData.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* ─── Email Configuration ─── */}
            {activeTab === "email" && (
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
                        onClick={() =>
                          setEmailForm({ ...emailForm, mailer: opt.value })
                        }
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

                {/* SMTP Fields - Only show for SMTP mailer */}
                {emailForm.mailer === "smtp" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      {
                        label: "SMTP Host",
                        key: "host",
                        placeholder: "smtp.hostinger.com",
                      },
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
                            setEmailForm({
                              ...emailForm,
                              [field.key]: e.target.value,
                            })
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
                          setEmailForm({
                            ...emailForm,
                            encryption: e.target.value,
                          })
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
                            setEmailForm({
                              ...emailForm,
                              [field.key]: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* SendGrid API Key */}
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
                          setEmailForm({
                            ...emailForm,
                            sendgridApiKey: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
                      />
                      {!emailForm.sendgridApiKey && (
                        <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                          <AlertCircle className="size-3" /> API key required to
                          send emails via SendGrid.
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

                {/* Mailgun API Key */}
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
                            setEmailForm({
                              ...emailForm,
                              mailgunApiKey: e.target.value,
                            })
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
                            setEmailForm({
                              ...emailForm,
                              mailgunDomain: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          placeholder="mg.kingpropertyauction.com"
                        />
                      </div>
                    </div>
                    {(!emailForm.mailgunApiKey || !emailForm.mailgunDomain) && (
                      <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                        <AlertCircle className="size-3" /> API key and domain
                        required to send emails via Mailgun.
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

                {/* Mailchimp API Key */}
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
                          setEmailForm({
                            ...emailForm,
                            mailchimpApiKey: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        placeholder="md-xxxxxxxxxxxxxxxxxxxx"
                      />
                      {!emailForm.mailchimpApiKey && (
                        <p className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                          <AlertCircle className="size-3" /> API key required to
                          send emails via Mailchimp.
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

                {/* No mailer selected warning */}
                {!emailForm.mailer && (
                  <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-3">
                    <AlertCircle className="size-5 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-800 font-medium">
                      Please select a mailer provider above to configure email
                      settings.
                    </p>
                  </div>
                )}

                {/* Sender Info - Always visible */}
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
                            setEmailForm({
                              ...emailForm,
                              [field.key]: e.target.value,
                            })
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
                      onClick={handleSave}
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
                        onClick={handleTest}
                        disabled={isTesting || !testEmail}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <Send className="size-4" />{" "}
                        {isTesting ? "Sending..." : "Test"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Notification Rules ─── */}
            {activeTab === "rules" && (
              <div>
                <p className="text-sm text-slate-600 mb-6">
                  Enable or disable automatic email notifications for each event
                  type.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(ruleLabels).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border-2 border-transparent hover:border-slate-200"
                    >
                      <span className="font-semibold text-slate-900 text-sm">
                        {label}
                      </span>
                      <button
                        onClick={() => handleRuleToggle(key)}
                        className={`relative w-12 h-7 rounded-full transition-all duration-200 ${rules[key] !== false ? "bg-green-500" : "bg-slate-300"}`}
                      >
                        <div
                          className={`absolute top-0.5 size-6 bg-white rounded-full shadow-md transition-all duration-200 ${rules[key] !== false ? "left-5" : "left-0.5"}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Templates ─── */}
            {activeTab === "templates" && (
              <div>
                <p className="text-sm text-slate-600 mb-6">
                  Select a template to edit its subject and content. Full editor
                  coming soon.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(ruleLabels).map(([key, label]) => (
                    <div
                      key={key}
                      className="p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-blue-200 cursor-pointer group"
                    >
                      <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <FileText className="size-5 text-white" />
                      </div>
                      <p className="font-bold text-slate-900 text-sm">
                        {label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        template: {key}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OAuth Providers Tab */}
            {activeTab === "oauth" && (
              <div>
                <p className="text-sm text-slate-600 mb-6">
                  Configure OAuth providers for social login. Users can sign in
                  with Google or GitHub.
                </p>

                {/* Google */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-slate-900">
                      🔵 Google OAuth
                    </h4>
                    <button
                      onClick={() =>
                        setOAuthForm((prev) => ({
                          ...prev,
                          google: {
                            ...prev.google,
                            enabled: !prev.google.enabled,
                          },
                        }))
                      }
                      className={`relative w-12 h-7 rounded-full transition-all duration-200 ${oauthForm.google.enabled ? "bg-green-500" : "bg-slate-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 size-6 bg-white rounded-full shadow-md transition-all duration-200 ${oauthForm.google.enabled ? "left-5" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Client ID
                      </label>
                      <input
                        type="text"
                        placeholder="Google OAuth Client ID"
                        value={oauthForm.google.clientId}
                        onChange={(e) =>
                          setOAuthForm({
                            ...oauthForm,
                            google: {
                              ...oauthForm.google,
                              clientId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        placeholder="Google OAuth Client Secret"
                        value={oauthForm.google.clientSecret}
                        onChange={(e) =>
                          setOAuthForm({
                            ...oauthForm,
                            google: {
                              ...oauthForm.google,
                              clientSecret: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Redirect URI:{" "}
                    <code className="bg-blue-100 px-2 py-0.5 rounded">
                      {window.location.origin}/api/auth/google/callback
                    </code>
                  </p>
                </div>

                {/* GitHub */}
                <div className="p-5 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border-2 border-slate-200 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-slate-900">
                      🐙 GitHub OAuth
                    </h4>
                    <button
                      onClick={() =>
                        setOAuthForm((prev) => ({
                          ...prev,
                          github: {
                            ...prev.github,
                            enabled: !prev.github.enabled,
                          },
                        }))
                      }
                      className={`relative w-12 h-7 rounded-full transition-all duration-200 ${oauthForm.github.enabled ? "bg-green-500" : "bg-slate-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 size-6 bg-white rounded-full shadow-md transition-all duration-200 ${oauthForm.github.enabled ? "left-5" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Client ID
                      </label>
                      <input
                        type="text"
                        placeholder="GitHub OAuth Client ID"
                        value={oauthForm.github.clientId}
                        onChange={(e) =>
                          setOAuthForm({
                            ...oauthForm,
                            github: {
                              ...oauthForm.github,
                              clientId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        placeholder="GitHub OAuth Client Secret"
                        value={oauthForm.github.clientSecret}
                        onChange={(e) =>
                          setOAuthForm({
                            ...oauthForm,
                            github: {
                              ...oauthForm.github,
                              clientSecret: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Redirect URI:{" "}
                    <code className="bg-gray-100 px-2 py-0.5 rounded">
                      {window.location.origin}/api/auth/github/callback
                    </code>
                  </p>
                </div>

                {/* Facebook */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-slate-900">
                      📘 Facebook OAuth
                    </h4>
                    <button
                      onClick={() =>
                        setOAuthForm((prev) => ({
                          ...prev,
                          facebook: {
                            ...prev.facebook,
                            enabled: !prev.facebook.enabled,
                          },
                        }))
                      }
                      className={`relative w-12 h-7 rounded-full transition-all duration-200 ${oauthForm.facebook?.enabled ? "bg-green-500" : "bg-slate-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 size-6 bg-white rounded-full shadow-md transition-all duration-200 ${oauthForm.facebook?.enabled ? "left-5" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        App ID
                      </label>
                      <input
                        type="text"
                        placeholder="Facebook App ID"
                        value={oauthForm.facebook?.clientId || ""}
                        onChange={(e) =>
                          setOAuthForm({
                            ...oauthForm,
                            facebook: {
                              ...oauthForm.facebook,
                              clientId: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                        App Secret
                      </label>
                      <input
                        type="password"
                        placeholder="Facebook App Secret"
                        value={oauthForm.facebook?.clientSecret || ""}
                        onChange={(e) =>
                          setOAuthForm({
                            ...oauthForm,
                            facebook: {
                              ...oauthForm.facebook,
                              clientSecret: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Redirect URI:{" "}
                    <code className="bg-blue-100 px-2 py-0.5 rounded">
                      {window.location.origin}/api/auth/facebook/callback
                    </code>
                  </p>
                </div>

                <button
                  onClick={handleOAuthSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="size-4" />{" "}
                  {isSaving ? "Saving..." : "Save OAuth Settings"}
                </button>

                {/* Setup Guide */}
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
                  <h4 className="font-black text-slate-900 mb-4">
                    📖 How to Get OAuth Keys
                  </h4>

                  <div className="space-y-4">
                    <details className="group">
                      <summary className="font-bold text-blue-700 cursor-pointer hover:text-blue-900">
                        🔵 Google OAuth Setup
                      </summary>
                      <div className="mt-2 text-sm text-slate-600 space-y-2 pl-4">
                        <p>
                          1. Go to{" "}
                          <a
                            href="https://console.cloud.google.com"
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            Google Cloud Console
                          </a>
                        </p>
                        <p>
                          2. Create a project → Enable OAuth consent screen
                          (External)
                        </p>
                        <p>
                          3. Go to Credentials → Create OAuth Client ID → Web
                          application
                        </p>
                        <p>
                          4. Add redirect URI:{" "}
                          <code className="bg-blue-100 px-1 rounded">
                            {window.location.origin}/api/auth/google/callback
                          </code>
                        </p>
                        <p>5. Copy Client ID and Client Secret</p>
                      </div>
                    </details>

                    <details className="group">
                      <summary className="font-bold text-slate-700 cursor-pointer hover:text-slate-900">
                        🐙 GitHub OAuth Setup
                      </summary>
                      <div className="mt-2 text-sm text-slate-600 space-y-2 pl-4">
                        <p>
                          1. Go to{" "}
                          <a
                            href="https://github.com/settings/developers"
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            GitHub Developer Settings
                          </a>
                        </p>
                        <p>2. Click New OAuth App</p>
                        <p>
                          3. Set callback URL:{" "}
                          <code className="bg-gray-100 px-1 rounded">
                            {window.location.origin}/api/auth/github/callback
                          </code>
                        </p>
                        <p>4. Register → Generate Client Secret</p>
                        <p>5. Copy Client ID and Client Secret</p>
                      </div>
                    </details>

                    <details className="group">
                      <summary className="font-bold text-blue-800 cursor-pointer hover:text-blue-900">
                        📘 Facebook OAuth Setup
                      </summary>
                      <div className="mt-2 text-sm text-slate-600 space-y-2 pl-4">
                        <p>
                          1. Go to{" "}
                          <a
                            href="https://developers.facebook.com"
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            Meta for Developers
                          </a>
                        </p>
                        <p>2. Create App → Consumer → Set name</p>
                        <p>3. Add Product → Facebook Login → Web</p>
                        <p>
                          4. Set redirect URI:{" "}
                          <code className="bg-blue-100 px-1 rounded">
                            {window.location.origin}/api/auth/facebook/callback
                          </code>
                        </p>
                        <p>5. Settings → Basic → Copy App ID and App Secret</p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast Notifications */}
        {saveMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right duration-300">
            <div
              className={`px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${
                saveMessage.includes("Error")
                  ? "bg-red-500/95 border-red-400 text-white"
                  : "bg-green-500/95 border-green-400 text-white"
              }`}
            >
              {saveMessage.includes("Error") ? (
                <XCircle className="size-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="size-5 flex-shrink-0" />
              )}
              <span className="font-bold text-sm">{saveMessage}</span>
              <button
                onClick={() => setSaveMessage("")}
                className="ml-2 opacity-70 hover:opacity-100"
              >
                <XCircle className="size-4" />
              </button>
            </div>
          </div>
        )}

        {testResult && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right duration-300">
            <div
              className={`px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${
                testResult.success
                  ? "bg-green-500/95 border-green-400 text-white"
                  : "bg-red-500/95 border-red-400 text-white"
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="size-5 flex-shrink-0" />
              ) : (
                <XCircle className="size-5 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {testResult.success ? "Test Email Sent!" : "Test Failed"}
                </p>
                <p className="text-xs opacity-90">
                  {testResult.success
                    ? "Check your inbox to verify delivery."
                    : testResult.message}
                </p>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className="ml-2 opacity-70 hover:opacity-100"
              >
                <XCircle className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
