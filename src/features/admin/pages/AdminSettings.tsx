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
  Brain,
  Trash2,
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
  const [templates, setTemplates] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateFilter, setTemplateFilter] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [templateMessage, setTemplateMessage] = useState("");
  const [simpleMode, setSimpleMode] = useState(true);
  const [simpleFields, setSimpleFields] = useState<{label: string, value: string, index: number}[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkStyle, setLinkStyle] = useState<'text' | 'button'>('button');
  const [focusedFieldIndex, setFocusedFieldIndex] = useState<number | null>(null);
  const loadedRef = useRef(false);
  const [knowledgeEntries, setKnowledgeEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("custom");
  const [knowledgeSaving, setKnowledgeSaving] = useState(false);
  const [knowledgeMsg, setKnowledgeMsg] = useState("");

  useEffect(() => {
    if (activeTab !== "templates") return;
    apiClient
      .fetch("/notifications/templates")
      .then((r) => {
        if (r.success && r.data) setTemplates(r.data);
      })
      .catch(() => {});
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "knowledge") return;
    apiClient
      .fetch("/knowledge")
      .then((r) => {
        if (r.success && r.data) setKnowledgeEntries(r.data);
      })
      .catch(() => {});
  }, [activeTab]);

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

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
    setTemplateSaving(true);
    try {
      await apiClient.fetch(`/notifications/templates/${selectedTemplate}`, {
        method: "PUT",
        body: JSON.stringify({ subject: editSubject, html: editHtml }),
      });
      setTemplateMessage("Template saved!");
      setTimeout(() => setTemplateMessage(""), 3000);
    } catch (e) {
      setTemplateMessage("Error saving template");
    }
    setTemplateSaving(false);
  };

  const handleResetTemplate = async () => {
    if (!selectedTemplate || !confirm("Reset this template to default?"))
      return;
    try {
      const result = await apiClient.fetch(
        `/notifications/templates/${selectedTemplate}/reset`,
        { method: "POST" },
      );
      console.log('[Reset] API response:', JSON.stringify(result));
      if (result.success && result.data) {
        const newHtml = result.data.html;
        const newSubject = result.data.subject;
        setEditHtml(newHtml);
        setEditSubject(newSubject);
        setSimpleMode(true);
        setSimpleFields(extractSimpleFields(newHtml));
        setShowPreview(false);
        setTemplates(prev => ({
          ...prev,
          [selectedTemplate]: {
            ...prev[selectedTemplate],
            html: newHtml,
            subject: newSubject,
          },
        }));
        setTemplateMessage('Template reset to default!');
        setTimeout(() => setTemplateMessage(''), 3000);
      }
    } catch (e) {
      setTemplateMessage("Error resetting template");
    }
  };

  const handleSelectEntry = (entry: any) => {
    setSelectedEntry(entry);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setEditCategory(entry.category || "custom");
    setKnowledgeMsg("");
  };

  const handleSaveEntry = async () => {
    if (!selectedEntry) return;
    setKnowledgeSaving(true);
    try {
      const isNew = selectedEntry._id === "new";
      const payload = {
        title: editTitle,
        content: editContent,
        category: editCategory,
        ...(isNew
          ? {
              key:
                editTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "_")
                  .replace(/(^_|_$)/g, "") +
                "_" +
                Date.now(),
            }
          : {}),
      };
      const result = isNew
        ? await apiClient.fetch("/knowledge", {
            method: "POST",
            body: JSON.stringify(payload),
          })
        : await apiClient.fetch(`/knowledge/${selectedEntry._id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
      if (result.success) {
        if (isNew && result.data) {
          setKnowledgeEntries((prev) => [...prev, result.data]);
          setSelectedEntry(result.data);
        } else {
          setKnowledgeEntries((prev) =>
            prev.map((e) =>
              e._id === selectedEntry._id ? { ...e, ...payload } : e,
            ),
          );
          setSelectedEntry((prev: any) => ({ ...prev, ...payload }));
        }
        setKnowledgeMsg("Saved!");
      } else {
        setKnowledgeMsg("Error: " + result.message);
      }
    } catch (e: any) {
      setKnowledgeMsg("Error: " + e.message);
    }
    setKnowledgeSaving(false);
    setTimeout(() => setKnowledgeMsg(""), 3000);
  };

  const handleKnowledgeToggle = async (entry: any) => {
    try {
      const result = await apiClient.fetch(`/knowledge/${entry._id}/toggle`, {
        method: "PATCH",
      });
      if (result.success) {
        setKnowledgeEntries((prev) =>
          prev.map((e) =>
            e._id === entry._id ? { ...e, isActive: !e.isActive } : e,
          ),
        );
        if (selectedEntry?._id === entry._id) {
          setSelectedEntry((prev: any) => ({
            ...prev,
            isActive: !prev.isActive,
          }));
        }
      }
    } catch (e) {}
  };

  const handleDeleteEntry = async (entry: any) => {
    try {
      const result = await apiClient.fetch(`/knowledge/${entry._id}`, {
        method: "DELETE",
      });
      if (result.success) {
        setKnowledgeEntries((prev) => prev.filter((e) => e._id !== entry._id));
        if (selectedEntry?._id === entry._id) {
          setSelectedEntry(null);
          setEditTitle("");
          setEditContent("");
        }
      }
    } catch (e) {}
  };

  const extractSimpleFields = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fields: {label: string, value: string, index: number}[] = [];
      let idx = 0;
      doc.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
        const text = el.textContent?.trim();
        if (text !== undefined && text !== null) {
          const tag = el.tagName.toLowerCase();
          const isHeading = ['h1','h2','h3','h4'].includes(tag);
          fields.push({
            label: isHeading ? `Heading: ${text.substring(0, 30)}` : `Text: ${text.substring(0, 30)}...`,
            value: text,
            index: idx++,
          });
        }
      });
      return fields;
    } catch (e) {
      return [];
    }
  };

  const updateSimpleField = (fieldIndex: number, newValue: string) => {
    const updated = simpleFields.map(f =>
      f.index === fieldIndex ? { ...f, value: newValue } : f
    );
    setSimpleFields(updated);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(editHtml, 'text/html');
      const elements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, p'))
        .filter(el => el.textContent !== null && el.textContent !== undefined);
      updated.forEach((field) => {
        if (elements[field.index]) {
          elements[field.index].textContent = field.value || '';
        }
      });
      setEditHtml(doc.body.innerHTML);
    } catch (e) {}
  };

  useEffect(() => {
    if (editHtml) {
      setSimpleFields(extractSimpleFields(editHtml));
    }
  }, [selectedTemplate, editHtml]);

  const insertBeforeClose = (html: string, newContent: string) => {
    // Find the last <a ...> tag (the CTA button) and insert after its closing </div>
    const lastAnchorEnd = html.lastIndexOf('</a>');
    if (lastAnchorEnd !== -1) {
      const insertPoint = html.indexOf('</div>', lastAnchorEnd);
      if (insertPoint !== -1) {
        return html.slice(0, insertPoint) + newContent + html.slice(insertPoint);
      }
    }
    // Fallback: insert before last </div></div>
    const lastIndex = html.lastIndexOf('</div></div>');
    if (lastIndex === -1) return html + newContent;
    return html.slice(0, lastIndex) + newContent + html.slice(lastIndex);
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
    {
      id: "knowledge",
      label: "AI Knowledge",
      icon: Brain,
      description: "Manage AI assistant knowledge base",
    },
  ];

  const mailerOptions = [
    { value: "smtp", label: "SMTP (Hostinger, cPanel, Custom)" },
    { value: "sendgrid", label: "SendGrid" },
    { value: "mailgun", label: "Mailgun" },
    { value: "mailchimp", label: "Mailchimp Transactional" },
  ];

  const templateLabels: Record<
    string,
    { label: string; icon: string; category: string }
  > = {
    welcome: { label: "Welcome Email", icon: "👋", category: "Auth" },
    accountApproved: {
      label: "Account Approved",
      icon: "✅",
      category: "Auth",
    },
    accountRejected: {
      label: "Account Rejected",
      icon: "❌",
      category: "Auth",
    },
    passwordReset: { label: "Password Reset", icon: "🔑", category: "Auth" },
    bidConfirmation: {
      label: "Bid Confirmation",
      icon: "🔨",
      category: "Bidding",
    },
    outbidAlert: { label: "Outbid Alert", icon: "⚠️", category: "Bidding" },
    auctionWon: { label: "Auction Won", icon: "🎉", category: "Bidding" },
    auctionLost: { label: "Auction Lost", icon: "😢", category: "Bidding" },
    auctionStartingSoon: {
      label: "Auction Starting Soon",
      icon: "⏰",
      category: "Auction",
    },
    auctionStarted: {
      label: "Auction Started",
      icon: "🔴",
      category: "Auction",
    },
    auctionEnded: { label: "Auction Ended", icon: "🏁", category: "Auction" },
    propertySubmitted: {
      label: "Property Submitted",
      icon: "📋",
      category: "Property",
    },
    propertyApproved: {
      label: "Property Approved",
      icon: "✅",
      category: "Property",
    },
    propertyRejected: {
      label: "Property Rejected",
      icon: "❌",
      category: "Property",
    },
    propertySold: { label: "Property Sold", icon: "🏠", category: "Property" },
    propertyUnsold: {
      label: "Property Unsold",
      icon: "📉",
      category: "Property",
    },
    contactForm: { label: "Contact Form", icon: "📧", category: "Leads" },
    valuationRequest: {
      label: "Valuation Request",
      icon: "💰",
      category: "Leads",
    },
    adminLeadAlert: {
      label: "Admin Lead Alert",
      icon: "📋",
      category: "Leads",
    },
    catalogueRequest: {
      label: "Catalogue Request",
      icon: "📚",
      category: "Leads",
    },
    adminReply: { label: "Admin Reply", icon: "💬", category: "Leads" },
    faqsupport: { label: "FAQ Support", icon: "💬", category: "Leads" },
    legalenquiry: { label: "Legal Enquiry", icon: "⚖️", category: "Leads" },
    newsletterwelcome: { label: "Newsletter Welcome", icon: "📰", category: "Leads" },
  };

  const ruleLabels: Record<string, string> = {
    welcome: "Welcome Email",
    accountApproved: "Account Approved",
    accountRejected: "Account Rejected",
    passwordReset: "Password Reset",
    bidConfirmation: "Bid Confirmation",
    outbidAlert: "Outbid Alert",
    auctionWon: "Auction Won",
    auctionLost: "Auction Lost",
    auctionStartingSoon: "Auction Starting Soon",
    auctionStarted: "Auction Started",
    auctionEnded: "Auction Ended",
    propertySubmitted: "Property Submitted (Admin Alert)",
    propertyApproved: "Property Approved",
    propertyRejected: "Property Rejected",
    propertySold: "Property Sold",
    propertyUnsold: "Property Unsold",
    contactForm: "Contact Form",
    valuationRequest: "Valuation Request",
    catalogueRequest: "Catalogue Request",
    adminReply: "Admin Reply to Lead",
    adminLeadAlert: "Admin Lead Alert",
    registerAlert: "Register for Property Alerts",
    solicitorEnquiry: "Solicitor Enquiry",
    homeReport: "Home Report Request",
    referralFee: "Referral Fee Enquiry",
    buyingEnquiry: "Buying Overview Enquiry",
    sellingEnquiry: "Selling Overview Enquiry",
    chatEnquiry: "Chat Enquiry (AI Widget)",
    faqSupport: "FAQ Support Enquiry",
    legalEnquiry: "Legal Enquiry",
    newsletterSignup: "Newsletter Signup",
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                {/* Category Filter — OUTSIDE the flex layout */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    "All",
                    "Auth",
                    "Bidding",
                    "Auction",
                    "Property",
                    "Leads",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setTemplateFilter(
                          cat === "All" ? "" : cat.toLowerCase(),
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        templateFilter ===
                        (cat === "All" ? "" : cat.toLowerCase())
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Main flex layout: Left List + Right Editor */}
                <div className="flex gap-6" style={{ minHeight: "560px" }}>
                  {/* Left: Template List */}
                  <div className="w-1/3 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
                    {Object.keys(templates).length === 0 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">
                          Loading templates...
                        </p>
                      </div>
                    ) : (
                      Object.entries(templates)
                        .filter(([key]: [string, any]) => {
                          if (!templateFilter) return true;
                          const tpl = templates[key];
                          const cat = (
                            tpl?.category ||
                            templateLabels[key]?.category ||
                            ""
                          ).toLowerCase();
                          return cat === templateFilter.toLowerCase();
                        })
                        .map(([key, tpl]: [string, any]) => (
                          <div
                            key={key}
                            onClick={() => {
                              setSelectedTemplate(key);
                              setEditSubject(tpl.subject);
                              setEditHtml(tpl.html);
                              setSimpleMode(true);
                              setSimpleFields(extractSimpleFields(tpl.html));
                              setTemplateMessage('');
                              setShowPreview(false);
                            }}
                            className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                              selectedTemplate === key
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {templateLabels[key]?.icon || "📧"}
                              </span>
                              <span className="font-bold text-sm text-slate-900 truncate">
                                {templateLabels[key]?.label || key}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 capitalize">
                                {templates[key]?.category ||
                                  templateLabels[key]?.category ||
                                  "System"}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate">
                                {tpl.subject}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Right: Editor */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {!selectedTemplate ? (
                      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                        <div className="text-center">
                          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <FileText className="size-7 text-slate-400" />
                          </div>
                          <p className="font-bold text-slate-600">
                            Select a template to edit
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Choose from the list on the left
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 overflow-y-auto">
                        {/* Heading + buttons */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="font-black text-slate-900 text-base">
                            {templateLabels[selectedTemplate]?.label ||
                              selectedTemplate
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                              <button
                                onClick={() => { setSimpleMode(true); setShowPreview(false); }}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${simpleMode && !showPreview ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                              >
                                ✏️ Simple
                              </button>
                              <button
                                onClick={() => { setSimpleMode(false); setShowPreview(false); }}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${!simpleMode && !showPreview ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                              >
                                {'</>'} HTML
                              </button>
                              <button
                                onClick={() => { setShowPreview(true); setSimpleMode(false); }}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${showPreview ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                              >
                                👁️ Preview
                              </button>
                            </div>
                            <button
                              onClick={handleResetTemplate}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200"
                            >
                              Reset to Default
                            </button>
                          </div>
                          {templateMessage && (
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-lg ${
                                templateMessage.includes("Error")
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {templateMessage}
                            </span>
                          )}
                        </div>

                        {/* Variable chips */}
                        {templates[selectedTemplate]?.variables?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Available Variables
                            </p>
                            <p className="text-xs text-slate-400 mb-2">
                              💡 Click inside a text field above, then click a variable to insert it there.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {templates[selectedTemplate].variables.map(
                                (v: string) => (
                                  <span
                                    key={v}
                                    onClick={() => {
                                      const insertion = `{${v}}`;
                                      if (focusedFieldIndex !== null) {
                                        updateSimpleField(focusedFieldIndex,
                                          (simpleFields.find(f => f.index === focusedFieldIndex)?.value || '') + insertion
                                        );
                                        setTemplateMessage(`Inserted ${insertion}`);
                                        setTimeout(() => setTemplateMessage(''), 2000);
                                      } else {
                                        setEditHtml(prev => {
                                          const lastAnchorEnd = prev.lastIndexOf('</a>');
                                          if (lastAnchorEnd !== -1) {
                                            const insertPoint = prev.indexOf('</div>', lastAnchorEnd);
                                            if (insertPoint !== -1) {
                                              return prev.slice(0, insertPoint) + insertion + prev.slice(insertPoint);
                                            }
                                          }
                                          const lastIndex = prev.lastIndexOf('</div></div>');
                                          if (lastIndex === -1) return prev + insertion;
                                          return prev.slice(0, lastIndex) + insertion + prev.slice(lastIndex);
                                        });
                                        setTemplateMessage(`Inserted ${insertion} — click a field first to insert there`);
                                        setTimeout(() => setTemplateMessage(''), 3000);
                                      }
                                    }}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-mono cursor-pointer hover:bg-blue-200 transition-colors select-none"
                                    title={`Click to insert {${v}}`}
                                  >
                                    {`{${v}}`}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Subject */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                            Subject Line
                          </label>
                          <input
                            type="text"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          />
                        </div>

                        {/* HTML Editor */}
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                            {simpleMode && !showPreview ? 'Content Editor' : showPreview ? 'Preview' : 'HTML Content'}
                          </label>
                          {showPreview ? (
                            <div
                              className="flex-1 overflow-hidden bg-slate-100 rounded-xl flex flex-col"
                              style={{ minHeight: "300px" }}
                            >
                              <div className="px-3 py-1.5 text-xs text-slate-500 bg-slate-200 rounded-t-xl text-center font-medium">
                                📧 Email Preview — Rendered View
                              </div>
                              <iframe
                                srcDoc={editHtml}
                                className="w-full flex-1 border-0"
                                style={{ minHeight: "380px" }}
                                title="Email Preview"
                                sandbox="allow-same-origin"
                              />
                            </div>
                          ) : simpleMode ? (
                            <div className="space-y-3">
                              <p className="text-xs text-slate-500 font-medium">
                                Edit the text content below. Switch to HTML mode for advanced formatting.
                              </p>
                              {simpleFields.length === 0 && (
                                <p className="text-xs text-slate-400 italic">
                                  No editable text fields found in this template. Use HTML mode to edit.
                                </p>
                              )}
                              {simpleFields.map((field) => (
                                <div key={field.index}>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                      {field.label}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        try {
                                          const parser = new DOMParser();
                                          const doc = parser.parseFromString(editHtml, 'text/html');
                                          const elements = Array.from(
                                            doc.querySelectorAll('h1,h2,h3,h4,p')
                                          ).filter(el =>
                                            el.textContent !== null && el.textContent !== undefined
                                          );
                                          if (elements[field.index]) {
                                            elements[field.index].remove();
                                            const newHtml = doc.body.innerHTML;
                                            setEditHtml(newHtml);
                                            setSimpleFields(extractSimpleFields(newHtml));
                                          }
                                        } catch (e) {}
                                      }}
                                      className="text-xs text-red-400 hover:text-red-600 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                                      title="Remove this field"
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  {field.value.length > 60 ? (
                                    <textarea
                                      value={field.value}
                                      onChange={e => updateSimpleField(field.index, e.target.value)}
                                      onFocus={() => setFocusedFieldIndex(field.index)}
                                      rows={3}
                                      className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none font-medium"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={field.value}
                                      onChange={e => updateSimpleField(field.index, e.target.value)}
                                      onFocus={() => setFocusedFieldIndex(field.index)}
                                      className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
                                    />
                                  )}
                                </div>
                              ))}
                              <div className="pt-3 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Add Content</p>
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newHtml = insertBeforeClose(
                                        editHtml,
                                        '<h3 style="color:#1e293b;font-size:18px;font-weight:bold;margin:12px 0;">New Heading</h3>'
                                      );
                                      setEditHtml(newHtml);
                                      setSimpleFields(extractSimpleFields(newHtml));
                                    }}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition border border-blue-200"
                                  >
                                    + Heading
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newHtml = insertBeforeClose(
                                        editHtml,
                                        '<p style="color:#374151;font-size:14px;margin:8px 0;">New paragraph text here.</p>'
                                      );
                                      setEditHtml(newHtml);
                                      setSimpleFields(extractSimpleFields(newHtml));
                                    }}
                                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition border border-green-200"
                                  >
                                    + Paragraph
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowLinkInput(!showLinkInput)}
                                    className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                                  >
                                    + Link / Button
                                  </button>
                                </div>
                                {showLinkInput && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                    <p className="text-xs font-bold text-slate-600">Add Link or Button</p>
                                    <input
                                      type="text"
                                      placeholder="Link Text (e.g. View Property)"
                                      value={linkText}
                                      onChange={e => setLinkText(e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                      type="url"
                                      placeholder="URL (e.g. https://kingauction.com)"
                                      value={linkUrl}
                                      onChange={e => setLinkUrl(e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setLinkStyle('button')}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${linkStyle === 'button' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200'}`}
                                      >
                                        🔲 Button Style
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setLinkStyle('text')}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${linkStyle === 'text' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200'}`}
                                      >
                                        🔗 Text Link
                                      </button>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!linkText || !linkUrl) return;
                                          const linkHtml = linkStyle === 'button'
                                            ? `<div style="text-align:center;margin:16px 0;"><a href="${linkUrl}" style="background:linear-gradient(135deg,#f97316,#d97706);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;font-size:14px;">${linkText}</a></div>`
                                            : `<p style="text-align:center;margin:8px 0;"><a href="${linkUrl}" style="color:#2563eb;text-decoration:underline;font-weight:bold;font-size:14px;">${linkText}</a></p>`;
                                          const newHtml = insertBeforeClose(editHtml, linkHtml);
                                          setEditHtml(newHtml);
                                          setSimpleFields(extractSimpleFields(newHtml));
                                          setLinkText('');
                                          setLinkUrl('');
                                          setShowLinkInput(false);
                                        }}
                                        className="flex-1 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
                                      >
                                        Add to Email
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setShowLinkInput(false)}
                                        className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <textarea
                                value={editHtml}
                                onChange={(e) => setEditHtml(e.target.value)}
                                className="flex-1 w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
                                placeholder="HTML template content..."
                                style={{ minHeight: "300px" }}
                              />
                              <p className="text-xs text-slate-500 mt-1">
                                💡 Tip: Use the variable chips above to insert dynamic content. The HTML editor shows the raw template — use Preview to see how it looks.
                              </p>
                            </>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 pt-2 pb-4">
                          <button
                            onClick={async () => {
                              setTemplateSaving(true);
                              try {
                                const result = await apiClient.fetch(
                                  `/notifications/templates/${selectedTemplate}`,
                                  {
                                    method: "PUT",
                                    body: JSON.stringify({
                                      subject: editSubject,
                                      html: editHtml,
                                    }),
                                  },
                                );
                                if (result.success) {
                                  setTemplates((prev) => ({
                                    ...prev,
                                    [selectedTemplate]: {
                                      ...prev[selectedTemplate],
                                      subject: editSubject,
                                      html: editHtml,
                                    },
                                  }));
                                  setTemplateMessage("Template saved!");
                                } else {
                                  setTemplateMessage(
                                    "Error: " + result.message,
                                  );
                                }
                              } catch (e: any) {
                                setTemplateMessage("Error: " + e.message);
                              }
                              setTemplateSaving(false);
                              setTimeout(() => setTemplateMessage(""), 4000);
                            }}
                            disabled={templateSaving}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Save className="size-4" />
                            {templateSaving ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            onClick={handleResetTemplate}
                            className="px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-all"
                          >
                            Reset to Default
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

            {/* ─── AI Knowledge ─── */}
            {activeTab === "knowledge" && (
              <div className="flex gap-6" style={{ height: 560 }}>
                {/* Left: Entry List */}
                <div className="w-64 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedEntry({
                        _id: "new",
                        title: "",
                        content: "",
                        category: "custom",
                        isActive: true,
                      });
                      setEditTitle("");
                      setEditContent("");
                      setEditCategory("custom");
                      setKnowledgeMsg("");
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 flex-shrink-0"
                  >
                    <Brain className="size-4" /> New Entry
                  </button>
                  {knowledgeEntries.length === 0 && (
                    <p className="text-xs text-slate-400 text-center mt-4">
                      No knowledge entries yet.
                    </p>
                  )}
                  {knowledgeEntries.map((entry) => (
                    <button
                      key={entry._id}
                      onClick={() => handleSelectEntry(entry)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all flex-shrink-0 ${
                        selectedEntry?._id === entry._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {entry.title || "(Untitled)"}
                        </span>
                        <span
                          className={`size-2 rounded-full flex-shrink-0 ${entry.isActive ? "bg-green-500" : "bg-slate-300"}`}
                        />
                      </div>
                      <span className="text-xs text-slate-400 capitalize">
                        {entry.category}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right: Editor */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                  {!selectedEntry ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <Brain className="size-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Select an entry to edit</p>
                        <p className="text-sm mt-1">
                          or click New Entry to create one
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="Entry title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                            Category
                          </label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="company">Company</option>
                            <option value="process">Process</option>
                            <option value="fees">Fees</option>
                            <option value="legal">Legal</option>
                            <option value="faq">FAQ</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col min-h-0">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                          Content
                        </label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                          placeholder="Write knowledge content for the AI assistant..."
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleKnowledgeToggle(selectedEntry)}
                            disabled={selectedEntry._id === "new"}
                            className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition disabled:opacity-40 ${
                              selectedEntry.isActive
                                ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                            }`}
                          >
                            {selectedEntry.isActive ? "Active" : "Inactive"}
                          </button>
                          {selectedEntry._id !== "new" && (
                            <button
                              onClick={() => handleDeleteEntry(selectedEntry)}
                              className="px-3 py-2 text-xs font-bold rounded-lg border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-1"
                            >
                              <Trash2 className="size-3.5" /> Delete
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {knowledgeMsg && (
                            <span
                              className={`text-xs font-bold ${knowledgeMsg.includes("Error") ? "text-red-600" : "text-green-600"}`}
                            >
                              {knowledgeMsg}
                            </span>
                          )}
                          <button
                            onClick={handleSaveEntry}
                            disabled={
                              knowledgeSaving ||
                              !editTitle.trim() ||
                              !editContent.trim()
                            }
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                          >
                            <Save className="size-4" />
                            {knowledgeSaving ? "Saving..." : "Save Entry"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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
