// src\features\admin\components\users\tabs\ActivityLogTab.tsx
import { 
  Activity, User, Shield, House, Gavel, TrendingUp, CreditCard, 
  FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye,
  Calendar, UserCheck, Building2, DollarSign, Receipt
} from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useState } from "react";
import { StatusBadge } from "../shared/StatusBadge";

// Icon mapping for activity types
const iconMap: Record<string, { icon: any; color: string }> = {
  user: { icon: User, color: "bg-blue-100 text-blue-600" },
  shield: { icon: Shield, color: "bg-violet-100 text-violet-600" },
  property: { icon: House, color: "bg-amber-100 text-amber-600" },
  auction: { icon: Gavel, color: "bg-rose-100 text-rose-600" },
  bid: { icon: TrendingUp, color: "bg-teal-100 text-teal-600" },
  payment: { icon: CreditCard, color: "bg-green-100 text-green-600" },
  document: { icon: FileText, color: "bg-blue-100 text-blue-600" },
  invoice: { icon: Receipt, color: "bg-indigo-100 text-indigo-600" },
  commission: { icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
};

const colorMap: Record<string, string> = {
  blue: "border-blue-500",
  green: "border-green-500",
  red: "border-red-500",
  amber: "border-amber-500",
  orange: "border-orange-500",
  teal: "border-teal-500",
  violet: "border-violet-500",
  rose: "border-rose-500",
  slate: "border-slate-500",
  indigo: "border-indigo-500",
  emerald: "border-emerald-500",
};

export function ActivityLogTab({ user }: { user: UserRecord }) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { useGetUserActivity } = useUserApi();
  const { data: activityData, isLoading } = useGetUserActivity(user._id, page, pageSize);

  const activities = activityData?.data || [];
  const totalActivities = activityData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalActivities / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Get icon component
  const getIcon = (iconName: string) => {
    const config = iconMap[iconName] || iconMap.user;
    const Icon = config.icon;
    return { Icon, color: config.color };
  };

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get activity emoji/label
  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      user_registered: '👤 Registered',
      kyc_uploaded: '📄 KYC Uploaded',
      kyc_verified: '✅ KYC Verified',
      property_created: '🏠 Property Listed',
      property_sold: '🎉 Property Sold',
      property_unsold: '📉 Property Unsold',
      auction_started: '🔴 Auction Started',
      auction_ended: '⏹️ Auction Ended',
      bid_placed: '📈 Bid Placed',
      invoice_created: '📄 Invoice Created',
      payment_made: '💰 Payment Made',
      commission_earned: '💵 Commission Earned',
    };
    return map[type] || type;
  };

  // Get status color for activity
  const getStatusColor = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      red: 'bg-red-100 text-red-700',
      amber: 'bg-amber-100 text-amber-700',
      orange: 'bg-orange-100 text-orange-700',
      teal: 'bg-teal-100 text-teal-700',
      violet: 'bg-violet-100 text-violet-700',
      rose: 'bg-rose-100 text-rose-700',
      slate: 'bg-slate-100 text-slate-600',
      indigo: 'bg-indigo-100 text-indigo-700',
      emerald: 'bg-emerald-100 text-emerald-700',
    };
    return map[color] || 'bg-slate-100 text-slate-600';
  };

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <Activity className="size-4 text-slate-400" /> Activity Log ({totalActivities})
          </h3>
        </div>

        {totalActivities === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Activity className="size-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No activity records</p>
            <p className="text-sm">No activity logged for this user</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {activities.map((activity: any) => {
                const { Icon, color } = getIcon(activity.icon || 'user');
                const borderColor = colorMap[activity.color] || 'border-slate-500';

                return (
                  <div key={activity._id || activity.date} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                    {/* Icon */}
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="size-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {activity.label || activity.type}
                          </p>
                          <p className="text-sm text-slate-600 mt-0.5">
                            {activity.description}
                          </p>
                          {activity.metadata && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activity.metadata.propertyTitle && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                  📄 {activity.metadata.propertyTitle}
                                </span>
                              )}
                              {activity.metadata.amount && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  £{activity.metadata.amount.toLocaleString()}
                                </span>
                              )}
                              {activity.metadata.status && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(activity.color)}`}>
                                  {activity.metadata.status}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalActivities)} of {totalActivities} activities
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}