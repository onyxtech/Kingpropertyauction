import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  Save,
  Loader2,
  Building2,
  AlertCircle,
  FileText,
} from "lucide-react";
import AddressAutocomplete from "@/features/shared/components/AddressAutocomplete";
import { useTheme } from "@/app/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { useCustomerApi } from "../api/useCustomerApi";
import { apiClient } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import {
  showSuccess as toastSuccess,
  showError as toastError,
} from "@/lib/toast";

export default function ProfileTab() {
  const theme = useTheme();
  const { user, login, token } = useAuthStore();
  const { role, getCombinedRoleLabel, canBid, canListProperties } =
    useCustomerRole();
  const { useUpdateProfile, useMyProfile } = useCustomerApi();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  const { data: freshProfile } = useMyProfile();

  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const [selectedDocType, setSelectedDocType] = useState("");
  const [pendingFiles, setPendingFiles] = useState<
    { file: File; docType: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);

  const docs = useMemo(() => {
    if (!freshProfile) return [];
    const agentDocs = (freshProfile as any)?.agentDetails?.idDocuments || [];
    const ownerDocs = (freshProfile as any)?.ownerDocuments || [];
    return [...agentDocs, ...ownerDocs];
  }, [freshProfile]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.agentDetails?.companyName || "",
    licenseNumber: user?.agentDetails?.licenseNumber || "",
    companyAddress: user?.agentDetails?.companyAddress || "",
  });

  const [bankForm, setBankForm] = useState({
    accountHolderName: user?.bankDetails?.accountHolderName || "",
    bankName: user?.bankDetails?.bankName || "",
    accountNumber: user?.bankDetails?.accountNumber || "",
    sortCode: user?.bankDetails?.sortCode || "",
    iban: user?.bankDetails?.iban || "",
    bankAddress: user?.bankDetails?.bankAddress || "",
  });

  const defaultNotifSettings = {
    bidPlaced: true,
    outbid: true,
    auctionWon: true,
    auctionLost: true,
    auctionStarted: true,
    auctionEnded: true,
    propertyApproved: true,
    propertyRejected: true,
    propertySold: true,
    newBidOnProperty: true,
    newEnquiry: true,
    messageReceived: true,
    offerReceived: true,
    paymentDue: true,
    paymentOverdue: true,
    commissionEarned: true,
    withdrawalUpdate: true,
    fundsTransferred: true,
  };
  const [notifSettings, setNotifSettings] = useState({
    ...defaultNotifSettings,
    ...user?.notificationSettings,
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [bankError, setBankError] = useState("");
  const [notifError, setNotifError] = useState("");

  // Sync fresh profile data from server after mount
  useEffect(() => {
    if (!freshProfile) return;
    if (freshProfile.notificationSettings) {
      setNotifSettings((s) => ({ ...s, ...freshProfile.notificationSettings }));
    }
    if (freshProfile.bankDetails) {
      setBankForm((f) => ({ ...f, ...freshProfile.bankDetails }));
    }
    if (freshProfile.agentDetails) {
      setFormData((f) => ({
        ...f,
        companyName: freshProfile.agentDetails?.companyName || f.companyName,
        licenseNumber:
          freshProfile.agentDetails?.licenseNumber || f.licenseNumber,
        companyAddress:
          freshProfile.agentDetails?.companyAddress || f.companyAddress,
      }));
    }
  }, [freshProfile]);

  const showSuccess = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = async () => {
    setSaveError("");
    try {
      const agentDetails =
        role === "agent" || role === "seller"
          ? {
              companyName: formData.companyName,
              licenseNumber: formData.licenseNumber,
              companyAddress: formData.companyAddress,
            }
          : undefined;
      const payload = {
        name: formData.name,
        phone: formData.phone,
        ...(agentDetails ? { agentDetails } : {}),
      };
      await updateProfile.mutateAsync(payload);
      login(token!, {
        ...user!,
        name: formData.name,
        phone: formData.phone,
        ...(agentDetails ? { agentDetails } : {}),
      });
      showSuccess();
      toastSuccess("Profile saved!", "Your changes have been saved.");
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save profile. Please try again.");
      toastError("Save failed", err?.message || "Failed to save profile.");
      console.warn("Profile update failed:", err);
    }
  };

  const handleBankSave = async () => {
    setBankError("");
    if (!bankForm.accountHolderName.trim()) {
      setBankError("Account holder name is required");
      return;
    }
    if (!bankForm.bankName.trim()) {
      setBankError("Bank name is required");
      return;
    }
    if (!bankForm.accountNumber.trim()) {
      setBankError("Account number is required");
      return;
    }
    if (bankForm.accountNumber.replace(/\s/g, "").length < 6) {
      setBankError("Please enter a valid account number");
      return;
    }
    if (!bankForm.sortCode.trim()) {
      setBankError("Sort code is required");
      return;
    }
    try {
      await updateProfile.mutateAsync({ bankDetails: bankForm });
      login(token!, { ...user!, bankDetails: bankForm });
      showSuccess();
      toastSuccess("Bank details saved!");
    } catch (err: any) {
      setBankError(
        err?.message || "Failed to save bank details. Please try again.",
      );
      toastError("Save failed", err?.message || "Failed to save bank details.");
      console.warn("Bank details save failed:", err);
    }
  };

  const handleNotifSave = async () => {
    setNotifError("");
    try {
      await updateProfile.mutateAsync({ notificationSettings: notifSettings });
      login(token!, { ...user!, notificationSettings: notifSettings });
      showSuccess();
      toastSuccess("Settings saved!");
    } catch (err: any) {
      setNotifError(
        err?.message || "Failed to save settings. Please try again.",
      );
      toastError("Save failed", err?.message || "Failed to save settings.");
      console.warn("Notification settings save failed:", err);
    }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Passwords don't match");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    try {
      const result = await apiClient.fetch("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      if (result.success) {
        setPwSaved(true);
        toastSuccess("Password changed!", "Your password has been updated.");
        setPwForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPwSaved(false), 3000);
      } else {
        setPwError(result.message || "Failed to change password");
        toastError(
          "Password change failed",
          result.message || "Failed to change password",
        );
      }
    } catch {
      setPwError("Failed to change password");
      toastError("Password change failed", "Please try again.");
    }
  };

  const isSellerOrAgent = role === "agent" || role === "seller";

  const sections = [
    { id: "profile", label: isSellerOrAgent ? "Owner Profile" : "My Profile" },
    ...(isSellerOrAgent ? [{ id: "company", label: "Company Details" }] : []),
    ...(isSellerOrAgent ? [{ id: "bank", label: "Bank Details" }] : []),
    ...(isSellerOrAgent ? [{ id: "documents", label: "ID Documents" }] : []),
    { id: "notifications", label: "Notification Settings" },
    { id: "password", label: "Password Change" },
  ];

  const roleBadgeColor = () => {
    switch (role) {
      case "agent":
        return "bg-purple-100 text-purple-700";
      case "seller":
        return "bg-blue-100 text-blue-700";
      case "buyer":
        return "bg-green-100 text-green-700";
      case "admin":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const SaveButton = ({
    onClick,
    label = "Save Changes",
  }: {
    onClick: () => void;
    label?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={updateProfile.isPending}
      className={`flex-1 px-6 py-4 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}
    >
      {updateProfile.isPending ? (
        <>
          <Loader2 className="size-5 animate-spin" /> Saving...
        </>
      ) : (
        <>
          <Save className="size-5" /> {label}
        </>
      )}
    </button>
  );

  const SavedBanner = () =>
    saved ? (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
        <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
        <p className="text-green-700 font-bold text-sm">Saved successfully!</p>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900">
          Profile & Settings
        </h2>
        <p className="text-slate-600 font-medium">
          Manage your account information
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-slate-200 pb-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSection === s.id
                ? `bg-gradient-to-r ${theme.primary} text-white shadow-md`
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* PROFILE SECTION */}
      {activeSection === "profile" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-start gap-6">
            <div
              className={`size-20 rounded-2xl bg-gradient-to-br ${theme.primary} flex items-center justify-center shadow-lg flex-shrink-0`}
            >
              <span className="text-white font-black text-3xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">
                {user?.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-slate-600 font-medium text-sm">
                  Verified Member
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${roleBadgeColor()}`}
              >
                {getCombinedRoleLabel()}
              </span>
              <p className="text-xs text-slate-400 mt-2">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Recently"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl font-medium text-slate-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+44 7700 900000"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Account Role
              </label>
              <input
                type="text"
                value={getCombinedRoleLabel()}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl font-medium text-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <SaveButton onClick={handleSave} />
            <button
              onClick={() =>
                setFormData({
                  name: user?.name || "",
                  email: user?.email || "",
                  phone: user?.phone || "",
                  companyName: user?.agentDetails?.companyName || "",
                  licenseNumber: user?.agentDetails?.licenseNumber || "",
                  companyAddress: user?.agentDetails?.companyAddress || "",
                })
              }
              className="px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
          </div>
          <SavedBanner />
          {saveError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-bold">❌ {saveError}</p>
            </div>
          )}
        </div>
      )}

      {/* COMPANY DETAILS SECTION */}
      {activeSection === "company" && isSellerOrAgent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, companyName: e.target.value }))
                }
                placeholder="Your company or agency name"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                License Number
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, licenseNumber: e.target.value }))
                }
                placeholder="Professional license number"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <AddressAutocomplete
                value={formData.companyAddress}
                onChange={(value) =>
                  setFormData((f) => ({ ...f, companyAddress: value }))
                }
                onAddressSelect={(parsed) => {
                  const parts = [
                    parsed.streetAddress,
                    parsed.city,
                    parsed.state,
                    parsed.postalCode,
                    parsed.country,
                  ].filter(Boolean);
                  setFormData((f) => ({
                    ...f,
                    companyAddress: parts.join(", "),
                  }));
                }}
                placeholder="Search company address..."
                label="Company Address"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <SaveButton onClick={handleSave} label="Save Company Details" />
          </div>
          <SavedBanner />
          {saveError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-bold">❌ {saveError}</p>
            </div>
          )}
        </div>
      )}

      {/* BANK DETAILS SECTION */}
      {activeSection === "bank" && isSellerOrAgent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm font-bold text-amber-700">
              Your bank details are stored securely and only used for property
              sale payments.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={bankForm.accountHolderName}
                onChange={(e) =>
                  setBankForm((f) => ({
                    ...f,
                    accountHolderName: e.target.value,
                  }))
                }
                placeholder="Full name on bank account"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankForm.bankName}
                onChange={(e) =>
                  setBankForm((f) => ({ ...f, bankName: e.target.value }))
                }
                placeholder="e.g. Barclays, HSBC, Lloyds"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankForm.accountNumber}
                onChange={(e) =>
                  setBankForm((f) => ({ ...f, accountNumber: e.target.value }))
                }
                placeholder="8 digit account number"
                maxLength={8}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Sort Code
              </label>
              <input
                type="text"
                value={bankForm.sortCode}
                onChange={(e) =>
                  setBankForm((f) => ({ ...f, sortCode: e.target.value }))
                }
                placeholder="XX-XX-XX"
                maxLength={8}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                IBAN (Optional)
              </label>
              <input
                type="text"
                value={bankForm.iban}
                onChange={(e) =>
                  setBankForm((f) => ({ ...f, iban: e.target.value }))
                }
                placeholder="International bank account number"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Bank Address (Optional)
              </label>
              <input
                type="text"
                value={bankForm.bankAddress}
                onChange={(e) =>
                  setBankForm((f) => ({ ...f, bankAddress: e.target.value }))
                }
                placeholder="Bank branch address"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <SaveButton onClick={handleBankSave} label="Save Bank Details" />
          </div>
          <SavedBanner />
          {bankError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-bold">❌ {bankError}</p>
            </div>
          )}
        </div>
      )}

      {/* NOTIFICATION SETTINGS SECTION */}
      {activeSection === "notifications" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <p className="text-slate-600 font-medium">
            Control which notifications you receive in your bell.
          </p>
          <div className="space-y-3">
            {[
              ...(canBid
                ? [
                    {
                      key: "bidPlaced",
                      label: "Bid Placed Confirmation",
                      desc: "When you successfully place a bid",
                    },
                    {
                      key: "outbid",
                      label: "Outbid Alert",
                      desc: "When someone outbids you",
                    },
                    {
                      key: "auctionWon",
                      label: "Auction Won",
                      desc: "When you win an auction",
                    },
                    {
                      key: "auctionLost",
                      label: "Auction Lost",
                      desc: "When auction ends and you didn't win",
                    },
                    {
                      key: "auctionEnded",
                      label: "Auction Ended",
                      desc: "When an auction you bid in ends",
                    },
                    {
                      key: "offerReceived",
                      label: "Property Offer Received",
                      desc: "When admin sends you a post-auction property offer",
                    },
                  ]
                : []),
              ...(canListProperties
                ? [
                    {
                      key: "propertyApproved",
                      label: "Property Approved",
                      desc: "When admin approves your property",
                    },
                    {
                      key: "propertyRejected",
                      label: "Property Rejected",
                      desc: "When admin rejects your property",
                    },
                    {
                      key: "propertySold",
                      label: "Property Sold",
                      desc: "When your property sells at auction",
                    },
                    {
                      key: "newBidOnProperty",
                      label: "New Bid on Property",
                      desc: "When someone bids on your property",
                    },
                    {
                      key: "auctionStarted",
                      label: "Auction Started",
                      desc: "When auction with your property goes live",
                    },
                    {
                      key: "auctionEnded",
                      label: "Auction Ended",
                      desc: "When auction containing your property ends",
                    },
                    ...(role !== "seller"
                      ? [
                          {
                            key: "newEnquiry",
                            label: "New Property Enquiry",
                            desc: "When someone enquires about your property",
                          },
                        ]
                      : []),
                  ]
                : []),
              {
                key: "messageReceived",
                label: "New Message",
                desc: "When you receive a new message",
              },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifSettings((s) => ({
                      ...s,
                      [key]: !s[key as keyof typeof s],
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-4 ${
                    notifSettings[key as keyof typeof notifSettings]
                      ? "bg-blue-500"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block size-4 bg-white rounded-full shadow transition-transform ${
                      notifSettings[key as keyof typeof notifSettings]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          {/* Payment Bell Notifications - buyers (not sellers) */}
          {canBid && role !== "seller" && (
            <div className="border-t border-slate-100 pt-4 mt-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
                Payment Alerts
              </p>
              {[
                {
                  key: "paymentDue",
                  label: "Payment Due Reminders",
                  desc: "Bell alert when payment is due",
                },
                {
                  key: "paymentOverdue",
                  label: "Overdue Payment Alerts",
                  desc: "Bell alert when payment is overdue",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifSettings((s: any) => ({
                        ...s,
                        [item.key]: !s[item.key],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifSettings[item.key as keyof typeof notifSettings] !==
                      false
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        notifSettings[
                          item.key as keyof typeof notifSettings
                        ] !== false
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Commission Bell Notifications - agents only */}
          {canListProperties && role !== "seller" && (
            <div className="border-t border-slate-100 pt-4 mt-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
                Commission Alerts
              </p>
              {[
                {
                  key: "commissionEarned",
                  label: "Commission Earned",
                  desc: "Bell alert when commission is generated",
                },
                {
                  key: "withdrawalUpdate",
                  label: "Withdrawal Updates",
                  desc: "Bell alert on withdrawal status changes",
                },
                {
                  key: "fundsTransferred",
                  label: "Funds Transferred",
                  desc: "Bell alert when payment sent to bank",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifSettings((s: any) => ({
                        ...s,
                        [item.key]: !s[item.key],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifSettings[item.key as keyof typeof notifSettings] !==
                      false
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        notifSettings[
                          item.key as keyof typeof notifSettings
                        ] !== false
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <SaveButton onClick={handleNotifSave} label="Save Settings" />
          </div>
          <SavedBanner />
          {notifError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-bold">❌ {notifError}</p>
            </div>
          )}
        </div>
      )}

      {/* ID DOCUMENTS SECTION */}
      {activeSection === "documents" && isSellerOrAgent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-lg">
            🪪 ID Verification Documents
          </h3>
          <p className="text-sm text-slate-500">
            Upload your driving license, passport, or other government-issued ID
            for verification.
          </p>

          {/* Upload Section */}
          <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
            <p className="text-sm font-bold text-slate-700 mb-3">
              Add Document
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Document Type *
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select type...</option>
                  <option value="driving_license">🚗 UK Driving License</option>
                  <option value="passport">📷 Photo ID — Passport</option>
                  <option value="proof_of_address">🏠 Proof of Address</option>
                  <option value="other_id">🆔 Other ID</option>
                </select>
                {selectedDocType && (
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedDocType === "driving_license"
                      ? "Full or provisional UK driving license"
                      : selectedDocType === "passport"
                        ? "Government-issued photo identification"
                        : selectedDocType === "proof_of_address"
                          ? "Utility bill, bank statement or council tax letter (dated within 3 months)"
                          : "Any other government-issued identification"}
                  </p>
                )}
              </div>

              {/* File Picker */}
              <label
                className={`flex py-3 px-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${selectedDocType ? "border-blue-300 hover:border-blue-400 hover:bg-blue-50" : "border-slate-200 opacity-50"}`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0 && selectedDocType) {
                      const newFiles = Array.from(files).map((file) => ({
                        file,
                        docType: selectedDocType,
                      }));
                      setPendingFiles((prev) => [...prev, ...newFiles]);
                      setSelectedDocType("");
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                  disabled={!selectedDocType}
                />
                <span className="text-sm font-semibold text-blue-600">
                  {selectedDocType
                    ? "+ Add Files"
                    : "Select a document type first"}
                </span>
              </label>

              {/* Pending files list */}
              {pendingFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500">
                    {pendingFiles.length} file(s) ready to upload
                  </p>
                  {pendingFiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <span>📄</span>
                        <div>
                          <p className="text-xs font-bold text-blue-600">
                            {item.docType === "driving_license"
                              ? "🚗 UK Driving License"
                              : item.docType === "passport"
                                ? "📷 Photo ID — Passport"
                                : item.docType === "proof_of_address"
                                  ? "🏠 Proof of Address"
                                  : "🆔 Other ID"}
                          </p>
                          <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                            {item.file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(item.file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingFiles((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {pendingFiles.length > 0 && (
                <button
                  onClick={async () => {
                    if (pendingFiles.length === 0) return;
                    setUploading(true);
                    let successCount = 0;
                    for (const item of pendingFiles) {
                      const fd = new FormData();
                      fd.append("idDocument", item.file);
                      fd.append("docType", item.docType);
                      try {
                        const res = await apiClient.upload(
                          "/users/upload-id-document",
                          fd,
                        );
                        if (res.success) successCount++;
                      } catch {}
                    }
                    if (successCount > 0) {
                      toastSuccess(
                        `${successCount} document(s) uploaded successfully! 🎉`,
                      );
                      setPendingFiles([]);
                      queryClient.invalidateQueries({
                        queryKey: ["my-profile"],
                      });
                      queryClient.refetchQueries({ queryKey: ["my-profile"] });
                    } else {
                      toastError("Upload failed", "Please try again");
                    }
                    setUploading(false);
                  }}
                  disabled={uploading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" /> Upload {pendingFiles.length}{" "}
                      Document(s)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Existing Documents */}
          {docs.length > 0 ? (
            <div className="space-y-3">
              {docs.map((doc: any, idx: number) => {
                const docLabel =
                  doc.docType === "driving_license"
                    ? "🚗 UK Driving License"
                    : doc.docType === "passport"
                      ? "📷 Photo ID — Passport"
                      : doc.docType === "proof_of_address"
                        ? "🏠 Proof of Address"
                        : doc.docType === "other_id"
                          ? "🆔 Other ID"
                          : doc.docType === "photo_id"
                            ? "📷 Photo ID — Passport / Driving Licence"
                            : (doc.docType || "").replace(/_/g, " ");

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="size-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            {docLabel}
                          </span>
                          <span className="text-xs text-slate-400">
                            {(doc.fileSize / 1024).toFixed(0)} KB
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                          {doc.originalName || doc.fileName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(doc.uploadedAt).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all"
                      >
                        View
                      </a>
                      <a
                        href={doc.fileUrl}
                        download={doc.originalName || doc.fileName}
                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                      >
                        ⬇ Download
                      </a>
                      <button
                        onClick={async () => {
                          if (!confirm("Remove this document?")) return;
                          try {
                            const res = await apiClient.fetch(
                              "/users/delete-id-document",
                              {
                                method: "DELETE",
                                body: JSON.stringify({ docIndex: idx }),
                              },
                            );
                            if (res.success) {
                              toastSuccess("Document removed!");
                              queryClient.invalidateQueries({
                                queryKey: ["my-profile"],
                              });
                              queryClient.refetchQueries({
                                queryKey: ["my-profile"],
                              });
                            } else {
                              toastError("Delete failed", res.message);
                            }
                          } catch {
                            toastError(
                              "Delete failed",
                              "Cannot connect to server",
                            );
                          }
                        }}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="size-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-bold">
                No documents uploaded yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Upload your ID for verification
              </p>
            </div>
          )}
        </div>
      )}

      {/* PASSWORD SECTION */}
      {activeSection === "password" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          {pwError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-bold text-red-700">{pwError}</p>
            </div>
          )}
          {pwSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <CheckCircle className="size-4 text-green-600" />
              <p className="text-sm font-bold text-green-700">
                Password changed successfully!
              </p>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => {
                  setPwError("");
                  setPwForm((f) => ({ ...f, currentPassword: e.target.value }));
                }}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => {
                  setPwError("");
                  setPwForm((f) => ({ ...f, newPassword: e.target.value }));
                }}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) => {
                  setPwError("");
                  setPwForm((f) => ({ ...f, confirmPassword: e.target.value }));
                }}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
          >
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
