import { useState } from "react";
import { X, Save, Gavel, Calendar, DollarSign, Clock } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface AuctionFormModalProps {
  onClose: () => void;
  onSave: (auction: any) => void;
  editData?: any;
  properties: any[];
}

export default function AuctionFormModal({ onClose, onSave, editData, properties }: AuctionFormModalProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    propertyId: editData?.propertyId || "",
    type: editData?.type || "Reserve Auction",
    startBid: editData?.startBid || "",
    bidIncrement: editData?.bidIncrement || "",
    startDate: editData?.startDate || "",
    startTime: editData?.startTime || "",
    endDate: editData?.endDate || "",
    endTime: editData?.endTime || "",
    antiSnipingMinutes: editData?.antiSnipingMinutes || "5",
    description: editData?.description || "",
    status: editData?.status || "scheduled",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    onSave({
      ...formData,
      id: editData?.id || `AU${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      property: selectedProperty?.name || "Property",
      bids: 0,
      bidders: 0,
      currentBid: "N/A",
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
              <Gavel className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{editData ? 'Edit' : 'Create New'} Auction</h2>
              <p className="text-sm text-white/80 font-medium">Set up your auction details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all">
            <X className="size-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Property Selection */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Select Property</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Property *</label>
              <select
                required
                value={formData.propertyId}
                onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a property...</option>
                {properties.filter(p => p.status === "approved").map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auction Type & Bidding */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Auction Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Auction Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Reserve Auction">Reserve Auction</option>
                  <option value="Absolute Auction">Absolute Auction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Starting Bid *</label>
                <input
                  type="text"
                  required
                  value={formData.startBid}
                  onChange={(e) => setFormData({...formData, startBid: e.target.value})}
                  placeholder="e.g., £2,000,000"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bid Increment *</label>
                <input
                  type="text"
                  required
                  value={formData.bidIncrement}
                  onChange={(e) => setFormData({...formData, bidIncrement: e.target.value})}
                  placeholder="e.g., £50,000"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Anti-Sniping Timer (minutes) *</label>
                <input
                  type="number"
                  required
                  value={formData.antiSnipingMinutes}
                  onChange={(e) => setFormData({...formData, antiSnipingMinutes: e.target.value})}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Auction Schedule */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">End Time *</label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Auction Details</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Add any additional auction details or terms..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Status</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Auction Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
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
              {editData ? 'Update' : 'Create'} Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
