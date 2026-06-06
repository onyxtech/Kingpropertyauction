import { Award, Phone, Mail, MessageSquare, Gavel, CheckCircle, Bell, Home, Trophy, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { useCustomerNotifications } from "../hooks/useCustomerNotifications";

export default function PaymentsTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { canListProperties, canBid } = useCustomerRole();
  const { useMyBids } = useCustomerApi();
  const { data: bids = [] } = useMyBids();

  const { notifications } = useCustomerNotifications();
  const offerNotifications = notifications.filter((n: any) =>
    n.message?.toLowerCase().includes("opportunity") ||
    n.message?.toLowerCase().includes("offer")
  );

  const wonCount = canBid
    ? (Array.isArray(bids) ? bids.filter((b: any) => b.status === "won").length : 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900">Payments</h2>
        <p className="text-slate-600 font-medium">Manage your auction payments</p>
      </div>

      {/* Seller-only: how to get paid */}
      {canListProperties && !canBid && (
        <div className={`bg-gradient-to-r ${theme.primary} rounded-3xl p-6 text-white shadow-xl`}>
          <h3 className="text-xl font-black mb-2">Getting Paid for Your Properties</h3>
          <p className="text-white/90 leading-relaxed">
            When your property sells at auction, our team will contact
            you within 24-48 hours to arrange payment transfer and
            complete the legal handover process.
          </p>
        </div>
      )}

      {/* Buyer: How payments work banner */}
      {canBid && (
        <div className={`bg-gradient-to-r ${theme.primary} rounded-3xl p-6 text-white shadow-xl`}>
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Award className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">How Payments Work</h3>
              <p className="text-white/90 font-medium leading-relaxed">
                All payments at King Property Auction are processed manually by our team.
                After winning an auction, our team will contact you within 24-48 hours
                to arrange payment and complete the transaction securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buyer: Won auctions redirect card */}
      {canBid && (
        <button
          onClick={() => navigate("/dashboard/won-auctions")}
          className="w-full bg-white rounded-2xl border border-amber-200 shadow-sm p-5 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Trophy className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Won Auctions</h3>
                <p className="text-sm text-slate-500">View all won auctions and payment status</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {wonCount > 0 && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black">
                  {wonCount} won
                </span>
              )}
              <ExternalLink className="size-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
          </div>
        </button>
      )}

      {/* Offers Received */}
      {canBid && offerNotifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Bell className="size-5 text-amber-500" />
              Property Offers Received
            </h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black">
              {offerNotifications.length} offer{offerNotifications.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {offerNotifications.map((n: any) => (
              <div key={n._id} className="flex items-start gap-4 p-5 hover:bg-amber-50/30 transition-all">
                <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Home className="size-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
                {n.link && (
                  <button
                    onClick={() => navigate(n.link)}
                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-all flex-shrink-0"
                  >
                    View Property
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
          <Phone className="size-5 text-blue-600" />
          Contact Us About Payments
        </h3>
        <p className="text-slate-600 text-sm font-medium mb-5 leading-relaxed">
          Have questions about your payment or need to arrange completion?
          Our team is here to help. Contact us through any of the channels below.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="tel:+441234567890"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0">
              <Phone className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Call Us</p>
              <p className="text-sm font-black text-slate-900">+44 123 456 7890</p>
            </div>
          </a>
          <a
            href="mailto:payments@kingproperty.com"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center flex-shrink-0">
              <Mail className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">Email Us</p>
              <p className="text-sm font-black text-slate-900 truncate">
                payments@kingproperty.com
              </p>
            </div>
          </a>
          <button
            onClick={() => navigate("/dashboard/messages")}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all group"
          >
            <div className="size-10 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="size-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 font-bold">Message Us</p>
              <p className="text-sm font-black text-slate-900">Live Chat Support</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
