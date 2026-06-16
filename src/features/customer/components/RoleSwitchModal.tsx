import { useState } from "react";
import { X, Building2, Loader2, CheckCircle, Clock, Gavel } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";
import { useAuthStore } from "@/stores/authStore";
import { useCustomerRole } from "../hooks/useCustomerRole";
import { showSuccess, showError } from "@/lib/toast";

interface RoleSwitchModalProps {
  onClose: () => void;
}

export default function RoleSwitchModal({ onClose }: RoleSwitchModalProps) {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { useRequestRoleSwitch } = useCustomerApi();
  const requestRoleSwitch = useRequestRoleSwitch();
  const { canApplyToBid, canApplyToSell } = useCustomerRole();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const roleRequest = (user as any)?.roleRequest;
  const isPending = roleRequest?.status === "pending";

  const handleSubmit = async (requestedRole: "seller" | "buyer") => {
    try {
      await requestRoleSwitch.mutateAsync({ requestedRole, message });
      showSuccess("Request submitted! ⏳", "Admin will review your request.");
      setSubmitted(true);
    } catch (err: any) {
      showError("Request failed", err?.message || "Failed to submit request");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-white/60 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
              {canApplyToBid ? (
                <Gavel className="size-5 text-white" />
              ) : (
                <Building2 className="size-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-black text-slate-900">
                {canApplyToBid ? "Apply for Buyer Permissions" : "Become an Owner"}
              </h3>
              <p className="text-xs text-slate-500">
                {canApplyToBid ? "Request bidding access" : "Request owner access"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X className="size-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isPending && !submitted ? (
            <div className="text-center py-6">
              <Clock className="size-12 text-amber-500 mx-auto mb-3" />
              <h4 className="font-black text-slate-900 mb-2">Request Pending</h4>
              <p className="text-slate-600 text-sm">
                Your request is under review. We'll notify you once it's approved.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Requested on{" "}
                {roleRequest?.requestedAt
                  ? new Date(roleRequest.requestedAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          ) : submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="size-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-black text-slate-900 mb-2">Request Submitted!</h4>
              <p className="text-slate-600 text-sm">
                Our team will review your request shortly and notify you by email.
              </p>
            </div>
          ) : (
            <>
              {/* Seller section — for buyers */}
              {canApplyToSell && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <p className="text-sm font-medium text-blue-800">
                      As an Owner, you'll be able to list properties for auction and track
                      your listings. Your bidding permissions are kept.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Why do you want to become an Owner? (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your properties or selling experience..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                  {requestRoleSwitch.isError && (
                    <p className="text-sm font-bold text-red-600">
                      {(requestRoleSwitch.error as any)?.message ||
                        "Failed to submit request. Please try again."}
                    </p>
                  )}
                  <button
                    onClick={() => handleSubmit("seller")}
                    disabled={requestRoleSwitch.isPending}
                    className={`w-full px-4 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}
                  >
                    {requestRoleSwitch.isPending ? (
                      <><Loader2 className="size-4 animate-spin" /> Submitting...</>
                    ) : (
                      "Submit Owner Request"
                    )}
                  </button>
                </div>
              )}

              {/* Buyer section — For Owners/agents */}
              {canApplyToBid && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <p className="text-sm font-medium text-green-800">
                      Get bidding permissions to participate in auctions. You'll keep your
                      existing listing permissions. Requires admin approval.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Why do you want to place bids? (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us why you'd like to participate as a buyer..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                  {requestRoleSwitch.isError && (
                    <p className="text-sm font-bold text-red-600">
                      {(requestRoleSwitch.error as any)?.message ||
                        "Failed to submit request. Please try again."}
                    </p>
                  )}
                  <button
                    onClick={() => handleSubmit("buyer")}
                    disabled={requestRoleSwitch.isPending}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {requestRoleSwitch.isPending ? (
                      <><Loader2 className="size-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><Gavel className="size-4" /> Apply for Buyer Permissions</>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            {submitted || isPending ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
