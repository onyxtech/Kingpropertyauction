import { useEffect } from "react";
import { mediaUrl } from "@/lib/mediaUrl";
import { Building2, Gavel, MessageSquare, TrendingUp, Plus, ArrowRight, MapPin, Trophy, Clock, Eye, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "@/app/hooks/useTheme";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { useCustomerApi } from "../api/useCustomerApi";
import { useCustomerNotifications } from "../hooks/useCustomerNotifications";

interface OverviewTabProps {
  onTabChange: (tab: string) => void;
}

export default function OverviewTab({ onTabChange }: OverviewTabProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { canAddProperty, showSellerView, showBuyerView, role, getCombinedRoleLabel } = useCustomerRole();
  const { useMyProperties, useMyBids, useMyMessages, useMyPropertyStats } = useCustomerApi();
  const { data: myProperties = [] } = useMyProperties();
  const { data: myBids = [] } = useMyBids();
  const { data: conversations = [] } = useMyMessages();
  const { data: myPropertyStats } = useMyPropertyStats();
  const { notifications } = useCustomerNotifications();

  const enquiryCount = Array.isArray(conversations)
    ? conversations.filter((c: any) => c.source === "property_inquiry").length
    : 0;

  const offerCount = Array.isArray(notifications)
    ? notifications.filter((n: any) =>
        n.message?.toLowerCase().includes("opportunity") ||
        n.message?.toLowerCase().includes("offer") ||
        (n.type === "lead" && n.icon === "home")
      ).length
    : 0;

  useEffect(() => {
    const socket = getSocket();
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    };
    socket.on("bid_update", refresh);
    socket.on("auction_status_update", refresh);
    return () => {
      socket.off("bid_update", refresh);
      socket.off("auction_status_update", refresh);
    };
  }, [queryClient]);

  const activeBids = Array.isArray(myBids)
    ? myBids.filter((b: any) => ["active", "winning"].includes(b.status)) : [];
  const wonBids = Array.isArray(myBids)
    ? myBids.filter((b: any) => b.status === "won") : [];
  const outbidBids = Array.isArray(myBids)
    ? myBids.filter((b: any) => b.status === "outbid") : [];
  const unreadCount = Array.isArray(conversations)
    ? conversations.filter((c: any) => (c.unreadCount?.user || 0) > 0).length : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`bg-gradient-to-r ${showSellerView ? "from-blue-600 to-indigo-700" : "from-green-600 to-emerald-700"} rounded-2xl lg:rounded-3xl p-4 sm:p-6 text-white shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black mb-1">
              {showSellerView
                ? role === "agent"
                  ? "Agent Dashboard"
                  : "Seller Dashboard"
                : "Buyer Dashboard"}
            </h2>
            <p className="text-white/80 font-medium text-sm">
              {showSellerView
                ? role === "agent"
                  ? "Manage your listings and track client properties"
                  : "Manage your properties and track auction performance"
                : "Track your bids and discover new properties"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {showSellerView && (
              <button
                onClick={() => navigate("/add-property")}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <Plus className="size-4" /> Add Property
              </button>
            )}
            {showBuyerView && (
              <button
                onClick={() => navigate("/auctions")}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-white/90 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <Gavel className="size-4" /> Browse Auctions
              </button>
            )}
            {!showSellerView && !showBuyerView && canAddProperty && (
              <button
                onClick={() => navigate("/add-property")}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Plus className="size-4" /> Add Property
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Seller stats */}
        {showSellerView && canAddProperty && (
          <button
            onClick={() => onTabChange("my-properties")}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-blue-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Building2 className="size-5 text-white" />
              </div>
              <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{myProperties.length}</p>
            <p className="text-sm text-white/80 font-medium mt-0.5">My Properties</p>
          </button>
        )}
        {/* Seller additional stats */}
        {showSellerView && (
          <button
            onClick={() => onTabChange("my-auctions")}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-amber-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="size-5 text-white" />
              </div>
              <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{myPropertyStats?.liveAuctions || 0}</p>
            <p className="text-sm text-white/80 font-medium mt-0.5">Live Auctions</p>
          </button>
        )}
        {showSellerView && (
          <button
            onClick={() => onTabChange("property-bidders")}
            className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-purple-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="size-5 text-white" />
              </div>
              <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{myPropertyStats?.totalBidsReceived || 0}</p>
            <p className="text-sm text-white/80 font-medium mt-0.5">Bids Received</p>
          </button>
        )}
        {showSellerView && (
          <button
            onClick={() => onTabChange("messages")}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-emerald-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="size-5 text-white" />
              </div>
              <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{enquiryCount}</p>
            <p className="text-sm text-white/80 font-medium mt-0.5">Customer Enquiries</p>
          </button>
        )}
        {/* Buyer stats */}
        {showBuyerView && (
          <>
            <button
              onClick={() => onTabChange("my-bids")}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-green-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Gavel className="size-5 text-white" />
                </div>
                <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{activeBids.length}</p>
              <p className="text-sm text-white/80 font-medium mt-0.5">Active Bids</p>
              {outbidBids.length > 0 && (
                <p className="text-xs text-white/70 font-bold mt-1">⚠️ {outbidBids.length} outbid</p>
              )}
            </button>
            <button
              onClick={() => onTabChange("my-bids")}
              className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-amber-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="size-5 text-white" />
                </div>
                <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{wonBids.length}</p>
              <p className="text-sm text-white/80 font-medium mt-0.5">Auctions Won</p>
            </button>
            {showBuyerView && offerCount > 0 && (
              <button
                onClick={() => onTabChange("offers")}
                className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-amber-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Trophy className="size-5 text-white" />
                  </div>
                  <span className="size-5 bg-white text-amber-600 rounded-full text-xs font-black flex items-center justify-center">
                    {offerCount}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white">{offerCount}</p>
                <p className="text-sm text-white/80 font-medium mt-0.5">Property Offers</p>
              </button>
            )}
          </>
        )}
        {/* Always show messages */}
        <button
          onClick={() => onTabChange("messages")}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 sm:p-5 text-left hover:shadow-xl hover:scale-105 transition-all group shadow-lg shadow-violet-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="size-5 text-white" />
            </div>
            <ArrowRight className="size-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{unreadCount}</p>
          <p className="text-sm text-white/80 font-medium mt-0.5">Unread Messages</p>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Properties - seller view */}
        {showSellerView && canAddProperty && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Building2 className="size-5 text-blue-600" />
                Recent Properties
              </h3>
              <button
                onClick={() => onTabChange("my-properties")}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all <ArrowRight className="size-3" />
              </button>
            </div>
            {myProperties.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Building2 className="size-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-medium mb-3">No properties listed yet</p>
                <button
                  onClick={() => navigate("/add-property")}
                  className={`px-4 py-2 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold text-sm`}
                >
                  Add First Property
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myProperties.slice(0, 3).map((p: any) => (
                  <div key={p._id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-all">
                    {p.media?.propertyImages?.[0] ? (
                      <img src={mediaUrl(p.media.propertyImages[0])} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="size-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{p.propertyTitle}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="size-3" />{p.location?.city || "N/A"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-green-600 text-sm">£{p.pricing?.startingAuctionPrice?.toLocaleString() || "TBD"}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.approvalStatus === "approved" ? "bg-green-100 text-green-700" :
                        p.approvalStatus === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>{p.approvalStatus || "pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Bids - buyer view */}
        {showBuyerView && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Gavel className="size-5 text-green-600" />
                Recent Bids
              </h3>
              <button
                onClick={() => onTabChange("my-bids")}
                className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                View all <ArrowRight className="size-3" />
              </button>
            </div>
            {myBids.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Gavel className="size-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-medium mb-3">No bids placed yet</p>
                <button
                  onClick={() => navigate("/auctions")}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm"
                >
                  Browse Live Auctions
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myBids.slice(0, 3).map((bid: any) => (
                  <button
                    key={bid._id}
                    onClick={() => navigate(`/auctions/${bid.auction?.slug || bid.auction?._id}`)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all text-left"
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      bid.status === "winning" ? "bg-green-100" :
                      bid.status === "won" ? "bg-amber-100" :
                      bid.status === "outbid" ? "bg-orange-100" : "bg-blue-100"
                    }`}>
                      {bid.status === "winning" ? <Trophy className="size-5 text-green-600" /> :
                       bid.status === "won" ? <Trophy className="size-5 text-amber-600" /> :
                       bid.status === "outbid" ? <TrendingUp className="size-5 text-orange-600" /> :
                       <Gavel className="size-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {bid.property?.propertyTitle || bid.auction?.auctionTitle || "Property"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {bid.auction?.auctionTitle} · My bid: £{bid.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className={`text-xs font-black px-2 py-1 rounded-full ${
                        bid.status === "winning" ? "bg-green-100 text-green-700" :
                        bid.status === "won" ? "bg-amber-100 text-amber-700" :
                        bid.status === "outbid" ? "bg-orange-100 text-orange-700" :
                        bid.status === "lost" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {bid.status === "winning" ? "🏆 Winning" :
                         bid.status === "won" ? "✅ Won" :
                         bid.status === "outbid" ? "⚠️ Outbid" :
                         bid.status === "lost" ? "Lost" :
                         bid.status || "Active"}
                      </span>
                      {bid.auction?.status === "live" && (
                        <p className="text-xs text-red-500 font-bold animate-pulse mt-0.5">🔴 Live</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-black text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {showSellerView && (
              <>
                <button
                  onClick={() => navigate("/add-property")}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group"
                >
                  <Plus className="size-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700">Add Property</span>
                </button>
                <button
                  onClick={() => navigate("/properties")}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
                >
                  <Eye className="size-6 text-slate-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700">Browse Properties</span>
                </button>
              </>
            )}
            {showBuyerView && (
              <>
                <button
                  onClick={() => navigate("/auctions")}
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all group"
                >
                  <Gavel className="size-6 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700">Live Auctions</span>
                </button>
                <button
                  onClick={() => navigate("/properties")}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
                >
                  <Eye className="size-6 text-slate-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-700">Browse Properties</span>
                </button>
              </>
            )}
            <button
              onClick={() => onTabChange("messages")}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all group relative"
            >
              <MessageSquare className="size-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-700">Messages</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 size-4 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange("profile")}
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all group"
            >
              <User className="size-6 text-orange-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-700">My Profile</span>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Clock className="size-5 text-slate-500" />
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {(() => {
              const activities: any[] = [];

              if (showBuyerView) {
                myBids.slice(0, 3).forEach((bid: any) => {
                  activities.push({
                    id: bid._id,
                    icon: Gavel,
                    iconBg: "bg-green-100",
                    iconColor: "text-green-600",
                    text: `Bid £${bid.amount?.toLocaleString()} on ${bid.property?.propertyTitle || "property"}`,
                    time: bid.createdAt,
                    link: `/auctions/${bid.auction?.slug || bid.auction?._id}`,
                  });
                });
              }

              if (showSellerView) {
                myProperties.slice(0, 2).forEach((p: any) => {
                  activities.push({
                    id: p._id,
                    icon: Building2,
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600",
                    text: `Listed ${p.propertyTitle}`,
                    sub: p.approvalStatus === "approved" ? "✅ Approved" :
                         p.approvalStatus === "pending" ? "⏳ Pending review" : "❌ Rejected",
                    time: p.createdAt,
                  });
                });
              }

              const buyerNotifTypes = ["bid", "bid_won", "offer", "auction", "auction_live"];
              const sellerNotifTypes = ["property_sold", "system", "property"];
              const isNeutralType = (t: string) =>
                !buyerNotifTypes.includes(t) && !sellerNotifTypes.includes(t);
              const viewFilteredNotifs = notifications.filter((notif: any) => {
                const t = notif.type;
                if (isNeutralType(t)) return true;
                if (showBuyerView && buyerNotifTypes.includes(t)) return true;
                if (showSellerView && sellerNotifTypes.includes(t)) return true;
                return false;
              });

              viewFilteredNotifs.slice(0, 3).forEach((notif: any) => {
                activities.push({
                  id: notif._id + "-notif",
                  icon: notif.type === "bid_won" ? Trophy :
                        notif.type === "bid" ? Gavel : MessageSquare,
                  iconBg: notif.color === "green" ? "bg-green-100" :
                          notif.color === "orange" ? "bg-orange-100" :
                          notif.color === "red" ? "bg-red-100" : "bg-blue-100",
                  iconColor: notif.color === "green" ? "text-green-600" :
                             notif.color === "orange" ? "text-orange-600" :
                             notif.color === "red" ? "text-red-600" : "text-blue-600",
                  text: notif.message,
                  time: notif.createdAt,
                  link: notif.link,
                });
              });

              activities.sort((a, b) =>
                new Date(b.time).getTime() - new Date(a.time).getTime()
              );

              if (activities.length === 0) {
                return (
                  <div className="text-center py-8">
                    <Clock className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No recent activity</p>
                  </div>
                );
              }

              return activities.slice(0, 5).map((activity: any) => {
                const Icon = activity.icon;
                const content = (
                  <div className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-all">
                    <div className={`size-9 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className={`size-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 leading-snug">{activity.text}</p>
                      {activity.sub && (
                        <p className="text-xs text-slate-500 mt-0.5">{activity.sub}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
                return activity.link ? (
                  <button key={activity.id} onClick={() => navigate(activity.link)} className="w-full text-left">
                    {content}
                  </button>
                ) : (
                  <div key={activity.id}>{content}</div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
