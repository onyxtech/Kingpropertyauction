import { motion } from "motion/react";
import { X, User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from "lucide-react";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  isLogin: boolean;
  onToggleLogin: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  authError: string;
  authLoading: boolean;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthModal({
  show, onClose, isLogin, onToggleLogin, showPassword, onTogglePassword,
  authError, authLoading, formData, onFormChange, onSubmit,
}: AuthModalProps) {
  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 size-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"><X className="size-4" /></button>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center"><User className="size-6" /></div>
            <div><h3 className="text-xl font-black">{isLogin ? "Welcome Back! 👋" : "Create Account 🚀"}</h3><p className="text-white/80 text-sm">{isLogin ? "Sign in to place bids" : "Register to start bidding"}</p></div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {authError && <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700 font-bold"><AlertCircle className="size-4 flex-shrink-0" />{authError}</div>}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold text-slate-700 mb-1">First Name</label><input type="text" required value={formData.firstName} onChange={e => onFormChange("firstName", e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label><input type="text" required value={formData.lastName} onChange={e => onFormChange("lastName", e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" /></div>
            </div>
          )}
          {!isLogin && (
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" /><input type="tel" value={formData.phone} onChange={e => onFormChange("phone", e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+44 7700 900000" /></div></div>
          )}
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" /><input type="email" required value={formData.email} onChange={e => onFormChange("email", e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" /></div></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" /><input type={showPassword ? "text" : "password"} required value={formData.password} onChange={e => onFormChange("password", e.target.value)} className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" /><button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
          {!isLogin && (
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" /><input type={showPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={e => onFormChange("confirmPassword", e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" /></div></div>
          )}
          <button type="submit" disabled={authLoading} className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50">{authLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</button>
          <p className="text-center text-sm text-slate-600">{isLogin ? "Don't have an account?" : "Already have an account?"} <button type="button" onClick={onToggleLogin} className="text-blue-600 font-bold hover:underline">{isLogin ? "Register" : "Sign In"}</button></p>
        </form>
      </motion.div>
    </motion.div>
  );
}