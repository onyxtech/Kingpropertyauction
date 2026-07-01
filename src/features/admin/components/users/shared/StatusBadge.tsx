// src\features\admin\components\users\shared\StatusBadge.tsx
import { ReactNode } from "react";

const statusMap: Record<string, { className: string; label?: string }> = {
  // ─── User Statuses ──────────────────────────────────────────────────────
  active: { className: "bg-green-100 text-green-700" },
  pending: { className: "bg-amber-100 text-amber-700" },
  suspended: { className: "bg-red-100 text-red-700" },
  
  // ─── KYC Statuses ──────────────────────────────────────────────────────
  Verified: { className: "bg-green-100 text-green-700", label: "Verified" },
  "Not Verified": { className: "bg-red-100 text-red-700", label: "Not Verified" },
  
  // ─── Property Statuses ────────────────────────────────────────────────
  sold: { className: "bg-red-100 text-red-700", label: "Sold" },
  unsold: { className: "bg-orange-100 text-orange-700", label: "Unsold" },
  available: { className: "bg-green-100 text-green-700", label: "Available" },
  purchased: { className: "bg-green-100 text-green-700", label: "Purchased" },
  watching: { className: "bg-indigo-100 text-indigo-700", label: "Watching" },
  
  // ─── Approval Statuses ────────────────────────────────────────────────
  approved: { className: "bg-green-100 text-green-700", label: "Approved" },
  pending_approval: { className: "bg-amber-100 text-amber-700", label: "Pending" },
  rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },
  
  // ─── Auction Statuses ──────────────────────────────────────────────────
  live: { className: "bg-red-100 text-red-700", label: "Live" },
  upcoming: { className: "bg-blue-100 text-blue-700", label: "Upcoming" },
  scheduled: { className: "bg-amber-100 text-amber-700", label: "Scheduled" },
  completed: { className: "bg-slate-100 text-slate-600", label: "Completed" },
  withdrawn: { className: "bg-slate-100 text-slate-600", label: "Withdrawn" },
  auction_active: { className: "bg-red-100 text-red-700", label: "Active" },
  
  // ─── Bid Statuses ──────────────────────────────────────────────────────
  Won: { className: "bg-green-100 text-green-700", label: "Won" },
  Winning: { className: "bg-teal-100 text-teal-700", label: "Winning" },
  Outbid: { className: "bg-orange-100 text-orange-700", label: "Outbid" },
  Bidding: { className: "bg-blue-100 text-blue-700", label: "Bidding" },
  Lost: { className: "bg-red-100 text-red-700", label: "Lost" },
  Registered: { className: "bg-slate-100 text-slate-600", label: "Registered" },
  
  // ─── Document Statuses ─────────────────────────────────────────────────
  Signed: { className: "bg-green-100 text-green-700" },
  Received: { className: "bg-green-100 text-green-700" },
  Paid: { className: "bg-green-100 text-green-700" },
  "Paid Out": { className: "bg-blue-100 text-blue-700" },
  
  // ─── Payment Statuses ──────────────────────────────────────────────────
  paid: { className: "bg-green-100 text-green-700", label: "Paid" },
  unpaid: { className: "bg-red-100 text-red-700", label: "Unpaid" },
  pending_payment: { className: "bg-amber-100 text-amber-700", label: "Pending" },
  
  // ─── Commission Statuses ──────────────────────────────────────────────
  commission_paid: { className: "bg-green-100 text-green-700", label: "Paid" },
  commission_pending: { className: "bg-amber-100 text-amber-700", label: "Pending" },
  
  // ─── Additional Statuses ──────────────────────────────────────────────
  "Bidding Active": { className: "bg-red-100 text-red-700", label: "Bidding Active" },
  "Lost Bid": { className: "bg-orange-100 text-orange-700", label: "Lost Bid" },
  "Past Bid": { className: "bg-slate-100 text-slate-600", label: "Past Bid" },
  "Active Bid": { className: "bg-red-100 text-red-700", label: "Active Bid" },
  Watchlist: { className: "bg-indigo-100 text-indigo-700", label: "Watchlist" },
  Listing: { className: "bg-slate-100 text-slate-600", label: "Listing" },
  Purchase: { className: "bg-green-100 text-green-700", label: "Purchase" },
  Sale: { className: "bg-blue-100 text-blue-700", label: "Sale" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  icon?: ReactNode;
}

export function StatusBadge({ status, className = "", icon }: StatusBadgeProps) {
  const config = statusMap[status];
  if (!config) {
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 ${className}`}>
        {status}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${config.className} ${className}`}>
      {icon}
      {config.label || status}
    </span>
  );
}