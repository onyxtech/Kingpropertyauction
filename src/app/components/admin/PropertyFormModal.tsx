import { useState } from "react";
import { X, Save, Upload, MapPin, Home, DollarSign, Image as ImageIcon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface PropertyFormModalProps {
  onClose: () => void;
  onSave: (property: any) => void;
  editData?: any;
}

export default function PropertyFormModal({ onClose, onSave, editData }: PropertyFormModalProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    seller: editData?.seller || "",
    type: editData?.type || "Residential",
    price: editData?.price || "",
    address: editData?.address || "",
    bedrooms: editData?.bedrooms || "",
    bathrooms: editData?.bathrooms || "",
    area: editData?.area || "",
    description: editData?.description || "",
    features: editData?.features || "",
    status: editData?.status || "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: editData?.id || `P${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
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
              <Home className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{editData ? 'Edit' : 'Add New'} Property</h2>
              <p className="text-sm text-white/80 font-medium">Fill in the property details below</p>
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
            <h3 className="text-lg font-black text-slate-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Modern Luxury Villa"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Seller Name *</label>
                <input
                  type="text"
                  required
                  value={formData.seller}
                  onChange={(e) => setFormData({...formData, seller: e.target.value})}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reserve Price *</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., £2,450,000"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Location</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="e.g., 123 Luxury Lane, Mayfair, London"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                  placeholder="e.g., 4"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Area (sq ft)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="e.g., 3500"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Description & Features</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the property in detail..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Key Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="e.g., Pool, Garden, Garage, Smart Home"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Images & Documents */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Images & Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                <Upload className="size-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700 mb-1">Upload Images</p>
                <p className="text-xs text-slate-500 font-medium">JPG, PNG up to 10MB</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                <Upload className="size-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700 mb-1">Upload Documents</p>
                <p className="text-xs text-slate-500 font-medium">PDF, DOC up to 20MB</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Status</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Listing Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
              {editData ? 'Update' : 'Create'} Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
