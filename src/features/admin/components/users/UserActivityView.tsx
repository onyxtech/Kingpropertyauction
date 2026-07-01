// src\features\admin\components\users\UserActivityView.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  NotepadText,
  House,
  Gavel,
  TrendingUp,
  FileSignature,
  CreditCard,
  CircleCheck,
  Clock,
  CircleX,
  Shield,
  Star,
  Layers,
  UserCheck,
} from "lucide-react";
import { StatusBadge } from "./shared/StatusBadge";
import { UserAvatar } from "./shared/UserAvatar";
import {
  ProfileTab,
  PropertiesTab,
  AuctionsTab,
  BidsTab,
  DocumentsTab,
  PaymentsTab,
  ActivityLogTab,
} from "./tabs";

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  isSuperAdmin?: boolean;
  approvalStatus?: string;
  location?: string;
  address?: {
    street?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  agentDetails?: {
    companyName?: string;
    licenseNumber?: string;
    companyAddress?: string;
    specialization?: string;
  };
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    sortCode?: string;
  };
  permissions?: {
    canBid?: boolean;
    canListProperties?: boolean;
  };
  stats?: {
    totalProperties: number;
    listedProperties?: number;
    purchasedProperties?: number;
    totalAuctions?: number;
    bidAuctionsCount?: number;
    listedAuctionsCount?: number;
    totalBids: number;
    wonBids: number;
    totalCommissions: number;
    pendingCommission: number;
    paidCommission: number;
  };
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "properties", label: "Properties", icon: House },
  { id: "auctions", label: "Auctions", icon: Gavel },
  { id: "bids", label: "Bids", icon: TrendingUp },
  { id: "documents", label: "Documents", icon: FileSignature },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "activity", label: "Activity Log", icon: NotepadText },
];

const roleConfig: Record<string, { gradient: string; text: string }> = {
  buyer: { gradient: "from-blue-600 to-indigo-600", text: "Buyer" },
  seller: { gradient: "from-emerald-600 to-teal-600", text: "Owner" }, // ✅ Changed from "Seller" to "Owner"
  agent: { gradient: "from-violet-600 to-purple-600", text: "Agent" },
  investor: { gradient: "from-amber-600 to-orange-500", text: "Investor" },
  admin: { gradient: "from-rose-600 to-pink-600", text: "Admin" },
  user: { gradient: "from-slate-600 to-slate-800", text: "User" },
};

export function UserActivityView({
  user,
  onClose,
}: {
  user: UserRecord;
  onClose: () => void;
}) {
  const [tab, setTab] = useState("profile");

  const cfg = roleConfig[user.role] || roleConfig.user;

  // ─── Role Formatting (Matches Profile Tab) ──────────────────────────────
  const getFormattedRole = () => {
    // Admin / Super Admin
    if (user.role === "admin") {
      return user.isSuperAdmin ? "Super Admin" : "Administrator";
    }

    // Agent
    if (user.role === "agent") {
      return user.permissions?.canBid ? "Agent & Buyer" : "Agent";
    }

    // Seller (Owner)
    if (user.role === "seller") {
      if (user.permissions?.canBid) {
        return "Owner & Buyer";
      }
      return "Owner";
    }

    // Buyer
    if (user.role === "buyer") {
      if (user.permissions?.canListProperties) {
        return "Buyer & Owner";
      }
      return "Buyer";
    }

    return user.role || "User";
  };

// ─── Stats based on user role ──────────────────────────────────────────
const stats = [
  { 
    label: "Properties", 
    value: user.stats?.totalProperties || 0,
    icon: House,
    color: "text-blue-500"
  },
  { 
    label: "Auctions", 
    value: user.stats?.totalAuctions || 0,
    icon: Gavel,
    color: "text-rose-500"
  },
  { 
    label: "Bids", 
    value: user.stats?.totalBids || 0,
    icon: TrendingUp,
    color: "text-emerald-500"
  },
];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* ── Hero Header ── */}
        <div
          className={`bg-gradient-to-r ${cfg.gradient} px-6 pt-6 pb-0 text-white relative overflow-hidden shrink-0`}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: 60 + i * 40,
                height: 60 + i * 40,
                top: -20 + i * 10,
                right: -10 + i * 30,
              }}
            />
          ))}

          <div className="relative flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <UserAvatar name={user.name} size="lg" />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {/* ✅ Updated to use getFormattedRole() */}
                  <span className="bg-white/20 backdrop-blur text-xs font-black px-2.5 py-1 rounded-full uppercase">
                    {getFormattedRole()}
                  </span>
                  <StatusBadge
                    status={user.isActive ? "active" : "suspended"}
                  />
                  {user.approvalStatus && (
                    <StatusBadge status={user.approvalStatus} />
                  )}
                </div>
                <h2 className="text-2xl font-black">{user.name}</h2>
                <p className="text-white/70 text-sm mt-0.5">
                  {user.email} · {user.phone || "No phone"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClose}
                className="size-9 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl flex items-center justify-center transition-all"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/10 rounded-t-2xl overflow-hidden">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur px-4 py-3 text-center"
              >
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-white/60 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-slate-100 overflow-x-auto shrink-0 bg-slate-50 px-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-black whitespace-nowrap border-b-2 transition-all ${
                  tab === t.id
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="size-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          {tab === "profile" && <ProfileTab user={user} />}
          {tab === "properties" && <PropertiesTab user={user} />}
          {tab === "auctions" && <AuctionsTab user={user} />}
          {tab === "bids" && <BidsTab user={user} />}
          {tab === "documents" && <DocumentsTab user={user} />}
          {tab === "payments" && <PaymentsTab user={user} />}
          {tab === "activity" && <ActivityLogTab user={user} />}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            User ID: <strong className="text-slate-600">{user._id}</strong> ·
            Created: {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
