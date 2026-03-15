import { useState } from "react";
import { X, Save, UserPlus, Mail, Phone, MapPin } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface UserFormModalProps {
  onClose: () => void;
  onSave: (user: any) => void;
  editData?: any;
}

export default function UserFormModal({ onClose, onSave, editData }: UserFormModalProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    role: editData?.role || "Buyer",
    address: editData?.address || "",
    kycStatus: editData?.kycStatus || "pending",
    status: editData?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: editData?.id || `U${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      joined: editData?.joined || new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.primary} p-6 flex items-center justify-between text-white sticky top-0 z-10`}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <UserPlus className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{editData ? 'Edit' : 'Add New'} User</h2>
              <p className="text-sm text-white/80 font-medium">Manage user account details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all">
            <X className="size-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g., john@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g., +44 20 1234 5678"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="e.g., 123 Main Street, London"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">User Role *</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Agent">Agent</option>
                  <option value="Investor">Investor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Account Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* KYC Status */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Verification</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">KYC Status</label>
              <select
                value={formData.kycStatus}
                onChange={(e) => setFormData({...formData, kycStatus: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="not-submitted">Not Submitted</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-black text-slate-900 mb-4">Permissions</h3>
            <div className="space-y-3">
              {[
                { id: "bid", label: "Can Place Bids", checked: true },
                { id: "list", label: "Can List Properties", checked: formData.role === "Seller" || formData.role === "Agent" },
                { id: "messages", label: "Can Send Messages", checked: true },
                { id: "reports", label: "Can View Reports", checked: formData.role === "Admin" },
              ].map((permission) => (
                <label key={permission.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={permission.checked}
                    className="size-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-slate-700">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2`}
            >
              <Save className="size-5" />
              {editData ? 'Update' : 'Create'} User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
