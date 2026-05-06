import { useState } from "react";
import { X, Users, Lock, Shield, Mail, Phone, User } from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";

export default function AddUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }

    const data = {
      name: `${formData.get('firstName')} ${formData.get('lastName')}`,
      email: formData.get('email') as string,
      password: password,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string || 'user',
      isActive: true, // Admin-created users are active by default
    };
    
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
        setSuccess('✅ User created successfully!');
        if (onSuccess) onSuccess();
        setTimeout(() => { setSuccess(''); onClose(); }, 1500);
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (err) { setError('Cannot connect to server'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-white/60 animate-in zoom-in-95 duration-300">
        <div className={`sticky top-0 bg-gradient-to-br ${theme.primary} px-8 py-6 rounded-t-3xl border-b-2 border-white/20`}>
          <div className="flex items-center justify-between">
            <div><h2 className="text-3xl font-black text-white mb-2">Add New User</h2><p className="text-white/90 font-medium">Create a new user account</p></div>
            <button onClick={onClose} className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30 hover:scale-110"><X className="size-5 text-white" /></button>
          </div>
        </div>
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {success && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">{success}</div>}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">{error}</div>}
          
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Users className="size-6 text-blue-600" />Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">First Name *</label><div className="relative"><User className="absolute left-3 top-3.5 size-5 text-slate-400" /><input name="firstName" type="text" placeholder="John" className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label><div className="relative"><User className="absolute left-3 top-3.5 size-5 text-slate-400" /><input name="lastName" type="text" placeholder="Smith" className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Email *</label><div className="relative"><Mail className="absolute left-3 top-3.5 size-5 text-slate-400" /><input name="email" type="email" placeholder="john@example.com" className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Phone *</label><div className="relative"><Phone className="absolute left-3 top-3.5 size-5 text-slate-400" /><input name="phone" type="tel" placeholder="+44 7700 900000" className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Lock className="size-6 text-purple-600" />Account Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">User Role *</label><select name="role" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required><option value="buyer">Buyer</option><option value="seller">Seller</option><option value="investor">Investor</option><option value="agent">Agent</option><option value="admin">Administrator</option></select></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Account Status</label><select name="status" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="active">Active</option><option value="pending">Pending Verification</option></select></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Password *</label><input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password *</label><input name="confirmPassword" type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Shield className="size-6 text-green-600" />Permissions</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"><input type="checkbox" defaultChecked className="size-5 rounded accent-blue-600" /><span className="text-sm font-bold text-slate-700">Can Bid in Auctions</span></label>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"><input type="checkbox" className="size-5 rounded accent-blue-600" /><span className="text-sm font-bold text-slate-700">Can List Properties</span></label>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"><input type="checkbox" defaultChecked className="size-5 rounded accent-blue-600" /><span className="text-sm font-bold text-slate-700">Email Notifications</span></label>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"><input type="checkbox" className="size-5 rounded accent-blue-600" /><span className="text-sm font-bold text-slate-700">SMS Alerts</span></label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t-2 border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className={`flex-1 px-6 py-4 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50`}>{loading ? "Creating..." : "Create User"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}