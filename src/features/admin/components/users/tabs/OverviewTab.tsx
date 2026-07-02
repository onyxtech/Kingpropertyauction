// src\features\admin\components\users\tabs\OverviewTab.tsx
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Activity, House, FileText, CreditCard, 
  ChevronRight
} from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";

export function OverviewTab({ user, onTabChange }: { user: UserRecord; onTabChange?: (tabId: string) => void }) {
  const navigate = useNavigate();
  const { 
    useGetUserProperties, 
    useGetUserDocuments, 
    useGetUserPayments,
    useGetUserActivity 
  } = useUserApi();

  // ✅ Fetch all data - only userId required
  const { data: propertiesData } = useGetUserProperties(user._id);
  const { data: documentsData } = useGetUserDocuments(user._id);
  const { data: paymentsData } = useGetUserPayments(user._id);
  const { data: activityData } = useGetUserActivity(user._id);

  // ✅ Slice to get only recent items
  const properties = (propertiesData?.data || []).slice(0, 3);
  const documents = (documentsData?.data || []).slice(0, 3);
  const payments = (paymentsData?.data || []).slice(0, 3);
  const activities = (activityData?.data || []).slice(0, 5);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " " + new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      const tabButton = document.querySelector(`[data-tab="${tabId}"]`) as HTMLElement;
      if (tabButton) tabButton.click();
    }
  };

  const getDocIcon = (doc: any) => {
    if (doc.type === 'image' || doc.type === 'property_image') return '🖼️';
    if (doc.type === 'video') return '🎬';
    if (doc.type === 'floor_plan') return '📐';
    if (doc.type === 'legal' || doc.type === 'private_legal') return '⚖️';
    if (doc.source === 'user_kyc') return '🛡️';
    return '📄';
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ─── LEFT COLUMN ──────────────────────────────────────────────────── */}

        {/* Profile Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="size-4 text-slate-400" />
            <h3 className="font-black text-slate-900 text-sm">Profile</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-3.5 text-slate-400" />
              <span className="text-slate-600">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-3.5 text-slate-400" />
              <span className="text-slate-600">{user.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-3.5 text-slate-400" />
              <span className="text-slate-600">{user.location || user.address?.city || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-3.5 text-slate-400" />
              <span className="text-slate-600">Joined {formatDate(user.createdAt)}</span>
            </div>
            <button
              onClick={() => handleTabChange('profile')}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View full profile <ChevronRight className="size-3" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="size-4 text-slate-400" />
            <h3 className="font-black text-slate-900 text-sm">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No recent activity</p>
            ) : (
              activities.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-2.5 text-sm">
                  <span className="text-base flex-shrink-0 mt-0.5">
                    {activity.icon === 'bid' && '📈'}
                    {activity.icon === 'property' && '🏠'}
                    {activity.icon === 'payment' && '💰'}
                    {activity.icon === 'shield' && '🛡️'}
                    {activity.icon === 'user' && '👤'}
                    {!['bid','property','payment','shield','user'].includes(activity.icon) && '📌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 font-medium text-sm truncate">
                      {activity.description?.length > 60 
                        ? activity.description.substring(0, 60) + '...' 
                        : activity.description}
                    </p>
                    <p className="text-slate-400 text-xs">{formatDateTime(activity.date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => handleTabChange('activity')}
            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all activity <ChevronRight className="size-3" />
          </button>
        </div>

        {/* ─── RIGHT COLUMN ─────────────────────────────────────────────────── */}

        {/* Recent Properties */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <House className="size-4 text-slate-400" />
            <h3 className="font-black text-slate-900 text-sm">Recent Properties</h3>
          </div>
          <div className="space-y-3">
            {properties.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No properties</p>
            ) : (
              properties.slice(0, 3).map((prop: any) => (
                <div key={prop._id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/properties/${prop.slug || prop._id}`)}
                      className="font-semibold text-slate-800 hover:text-blue-600 text-sm truncate text-left"
                    >
                      {prop.propertyTitle || 'Untitled'}
                    </button>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{formatDate(prop.createdAt)}</span>
                      <span>·</span>
                      <span className="truncate">{prop.sellerInfo?.agentName || prop.createdBy?.name || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                      {formatPrice(prop.pricing?.startingAuctionPrice || 0)}
                    </span>
                    <StatusBadge status={prop._displayStatus || prop.propertyStatus || 'available'} />
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => handleTabChange('properties')}
            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all properties <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="size-4 text-slate-400" />
            <h3 className="font-black text-slate-900 text-sm">Recent Documents</h3>
          </div>
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No documents</p>
            ) : (
              documents.slice(0, 3).map((doc: any) => (
                <div key={doc._id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {getDocIcon(doc)} {doc.name || 'Untitled'}
                    </p>
                    <p className="text-slate-400 text-xs">{formatDate(doc.uploadedAt)}</p>
                  </div>
                  <div className="ml-2">
                    <StatusBadge status={doc.verificationStatus || 'available'} />
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => handleTabChange('documents')}
            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all documents <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="size-4 text-slate-400" />
            <h3 className="font-black text-slate-900 text-sm">Recent Payments</h3>
          </div>
          <div className="space-y-3">
            {payments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No payments</p>
            ) : (
              payments.slice(0, 3).map((payment: any) => (
                <div key={payment._id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {payment.description || payment.typeLabel || 'Payment'}
                    </p>
                    <p className="text-slate-400 text-xs">{formatDate(payment.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-sm whitespace-nowrap">
                      {formatPrice(payment.amount)}
                    </span>
                    <StatusBadge status={payment.status || 'pending'} />
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => handleTabChange('payments')}
            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all payments <ChevronRight className="size-3" />
          </button>
        </div>

      </div>
    </div>
  );
}