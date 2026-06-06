import { useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerNotifications } from "../hooks/useCustomerNotifications";
import { apiClient } from "@/lib/apiClient";
import { showSuccess, showError } from "@/lib/toast";
import { Bell, Home, Trophy, Clock, CheckCircle, X } from "lucide-react";

export default function OffersTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { notifications, markAsRead } = useCustomerNotifications();
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, "accepted" | "declined">>({});

  const offerNotifications = notifications.filter((n: any) =>
    n.message?.toLowerCase().includes("opportunity") ||
    n.message?.toLowerCase().includes("offer") ||
    (n.type === "lead" && n.icon === "home")
  );

  const handleAccept = async (notif: any) => {
    setRespondingId(notif._id);
    try {
      await apiClient.fetch("/notifications/offer-response", {
        method: "POST",
        body: JSON.stringify({
          notificationId: notif._id,
          response: "accepted",
          propertyId: notif.propertyId || null,
        }),
      });
      markAsRead(notif._id);
      setResponses(prev => ({ ...prev, [notif._id]: "accepted" }));
      showSuccess("Offer accepted!", "Our team will be in touch shortly.");
      if (notif.link) navigate(notif.link);
    } catch (err: any) {
      showError("Response failed", err?.message);
    } finally {
      setRespondingId(null);
    }
  };

  const handleDecline = async (notifId: string) => {
    try {
      await apiClient.fetch("/notifications/offer-response", {
        method: "POST",
        body: JSON.stringify({ notificationId: notifId, response: "declined" }),
      });
      markAsRead(notifId);
      setResponses(prev => ({ ...prev, [notifId]: "declined" }));
      showSuccess("Offer declined");
    } catch (err: any) {
      showError("Response failed", err?.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Trophy className="size-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Offers & Negotiations</h2>
            <p className="text-white/80 text-sm mt-0.5">
              Properties you bid on that are now available
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Bell className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-bold mb-1">How this works:</p>
            <p className="font-medium">
              When a winning bidder withdraws from a property you bid on,
              King Property Auction may contact you with a special offer.
              You can accept to proceed or decline to pass.
            </p>
          </div>
        </div>
      </div>

      {/* Offers List */}
      {offerNotifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="size-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="size-10 text-amber-500" />
          </div>
          <h3 className="font-black text-slate-900 text-lg mb-2">No Offers Yet</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            When a property you bid on becomes available again,
            we'll notify you here with a special offer.
          </p>
          <button
            onClick={() => navigate("/auctions")}
            className={`mt-6 px-6 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg`}
          >
            Browse Auctions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {offerNotifications.map((notif: any) => {
            const response = responses[notif._id];
            const isResponded = !!response;

            return (
              <div
                key={notif._id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  isResponded
                    ? "border-slate-200 opacity-75"
                    : "border-amber-200 shadow-amber-100"
                }`}
              >
                {response === "accepted" && (
                  <div className="bg-emerald-500 px-5 py-2 flex items-center gap-2">
                    <CheckCircle className="size-4 text-white" />
                    <span className="text-white text-xs font-bold">
                      You accepted this offer — viewing property
                    </span>
                  </div>
                )}
                {response === "declined" && (
                  <div className="bg-slate-400 px-5 py-2 flex items-center gap-2">
                    <X className="size-4 text-white" />
                    <span className="text-white text-xs font-bold">Offer declined</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Home className="size-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900">Property Opportunity</p>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="size-3 text-slate-400" />
                            <p className="text-xs text-slate-400">
                              {new Date(notif.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        {!notif.isRead && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex-shrink-0">
                            New
                          </span>
                        )}
                      </div>

                      {!isResponded && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleAccept(notif)}
                            disabled={respondingId === notif._id}
                            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle className="size-4" />
                            View Property
                          </button>
                          <button
                            onClick={() => handleDecline(notif._id)}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                          >
                            <X className="size-4" />
                            Not Interested
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
