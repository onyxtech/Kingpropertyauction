import { useState } from "react";
import { X, Save, Send, Users, Calendar } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface CampaignFormModalProps {
  onClose: () => void;
  onSave: (campaign: any) => void;
  editData?: any;
}

export default function CampaignFormModal({ onClose, onSave, editData }: CampaignFormModalProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    type: editData?.type || "Email",
    targetAudience: editData?.targetAudience || "All Users",
    subject: editData?.subject || "",
    message: editData?.message || "",
    scheduleType: editData?.scheduleType || "immediate",
    scheduleDate: editData?.scheduleDate || "",
    scheduleTime: editData?.scheduleTime || "",
    status: editData?.status || "draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: editData?.id || `C${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      sent: formData.status === "active" ? "Sending..." : "0",
      opened: "0",
      clicked: "0",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.primary} p-6 flex items-center justify-between text-white sticky top-0 z-10`}>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Send className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{editData ? 'Edit' : 'Create New'} Campaign</h2>
              <p className="text-sm text-white/80 font-medium">Set up your marketing campaign</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all">
            <X className="size-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Campaign Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., New Property Alert"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Push">Push Notification</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Target Audience</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select Audience *</label>
              <select
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Users">All Users</option>
                <option value="Buyers">Buyers Only</option>
                <option value="Sellers">Sellers Only</option>
                <option value="Investors">Investors Only</option>
                <option value="Active Bidders">Active Bidders</option>
                <option value="Inactive Users">Inactive Users</option>
              </select>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Estimated reach: <strong className="text-slate-900">4,523 users</strong>
              </p>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Message Content</h3>
            <div className="space-y-4">
              {(formData.type === "Email") && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g., Exclusive Property Auction - Limited Time"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Message {formData.type === "SMS" && "(max 160 characters)"} *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={
                    formData.type === "SMS" 
                      ? "Keep it short and sweet..." 
                      : "Write your message here..."
                  }
                  rows={formData.type === "SMS" ? 3 : 6}
                  maxLength={formData.type === "SMS" ? 160 : undefined}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.type === "SMS" && (
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    {formData.message.length}/160 characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">When to Send *</label>
                <select
                  required
                  value={formData.scheduleType}
                  onChange={(e) => setFormData({...formData, scheduleType: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Send Immediately</option>
                  <option value="scheduled">Schedule for Later</option>
                </select>
              </div>
              
              {formData.scheduleType === "scheduled" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date *</label>
                    <input
                      type="date"
                      required={formData.scheduleType === "scheduled"}
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Time *</label>
                    <input
                      type="time"
                      required={formData.scheduleType === "scheduled"}
                      value={formData.scheduleTime}
                      onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-black text-slate-900 mb-4">Preview</h3>
            <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
              {formData.type === "Email" && formData.subject && (
                <p className="text-sm font-black text-slate-900 mb-2">Subject: {formData.subject}</p>
              )}
              <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap">
                {formData.message || "Your message will appear here..."}
              </p>
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
              type="button"
              onClick={() => {
                setFormData({...formData, status: "draft"});
                handleSubmit(new Event('submit') as any);
              }}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2`}
            >
              <Send className="size-5" />
              {formData.scheduleType === "immediate" ? "Send Now" : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
