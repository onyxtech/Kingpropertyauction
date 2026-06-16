import { useState } from "react";
import { motion } from "motion/react";
import { X, Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  isLogin: boolean;
  onToggleLogin: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  authError: string;
  authLoading: boolean;
  formData: any;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  intent?: string;
}

const intentLabels: Record<string, { loginTitle: string; loginSubtitle: string; registerTitle: string; registerSubtitle: string; reason: string }> = {
  bid: { loginTitle: "Login to Place Bids 🏠", loginSubtitle: "Sign in to start bidding on properties", registerTitle: "Register to Start Bidding", registerSubtitle: "Create an account to place bids", reason: "buyer" },
  sell: { loginTitle: "Login to List Properties 🏢", loginSubtitle: "Sign in to manage your listings", registerTitle: "Register as an Owner", registerSubtitle: "Create an account to list properties", reason: "seller" },
  auction: { loginTitle: "Login to Join Auction 🔨", loginSubtitle: "Sign in to participate in auctions", registerTitle: "Register for Auctions", registerSubtitle: "Create an account to join auctions", reason: "buyer" },
};

export default function AuthModal({
  show, onClose, isLogin, onToggleLogin, showPassword, onTogglePassword,
  authError, authLoading, formData, onFormChange, onSubmit, intent,
}: AuthModalProps) {
  const navigate = useNavigate();
  const labels = intentLabels[intent || ""] || { loginTitle: "Welcome Back! 👋", loginSubtitle: "Sign in to place bids", registerTitle: "Create Account 🚀", registerSubtitle: "Register to start bidding", reason: "" };

  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
          <button onClick={onClose} className="absolute right-6 top-6 size-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl flex items-center justify-center transition-all">
            <X className="size-5 text-white" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">{isLogin ? labels.loginTitle : labels.registerTitle}</h3>
              <p className="text-white/80 text-sm">{isLogin ? labels.loginSubtitle : labels.registerSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Register CTA Banner - Shown when in Login mode with intent */}
        {isLogin && intent && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200 px-6 py-3 text-center">
            <p className="text-amber-800 font-bold text-sm">
              New here?{" "}
              <button type="button" onClick={() => {
                onClose();
                navigate(`/register?reason=${labels.reason}`);
              }} className="text-orange-600 font-black hover:underline">
                Create a {labels.reason} account →
              </button>
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {authError && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700 font-bold">
              <AlertCircle className="size-4 flex-shrink-0" />{authError}
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                <input type="text" required value={formData.firstName} onChange={e => onFormChange("firstName", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                <input type="text" required value={formData.lastName} onChange={e => onFormChange("lastName", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input type="tel" value={formData.phone} onChange={e => onFormChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+44 7700 900000" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input type="email" required value={formData.email} onChange={e => onFormChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={e => onFormChange("password", e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={e => onFormChange("confirmPassword", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              </div>
            </div>
          )}

          <button type="submit" disabled={authLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {authLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            <ArrowRight className="size-4" />
          </button>

          <p className="text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={onToggleLogin} className="text-blue-600 font-bold hover:underline">
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}