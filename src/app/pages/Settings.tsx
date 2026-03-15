import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Settings as SettingsIcon,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  GripVertical,
  Home,
  Building,
  Map,
  Gavel,
  Users,
  DollarSign,
  Briefcase,
  Shield,
  Sparkles,
  Save,
  ChevronRight,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../hooks/useTheme";
import { useSettingsApi, type SelectOption, type SelectOptionFormData, type OptionCategory } from "../hooks/api/useSettingsApi";

export default function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error, getOptionsByCategory, createOption, updateOption, deleteOption, toggleOptionStatus, getCategorySummary } = useSettingsApi();

  const [activeTab, setActiveTab] = useState<OptionCategory>("propertyType");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [categorySummary, setCategorySummary] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOption, setEditingOption] = useState<SelectOption | null>(null);
  const [formData, setFormData] = useState<SelectOptionFormData>({
    value: "",
    label: "",
    category: "propertyType",
    description: "",
    isActive: true,
    sortOrder: 1,
    color: "#3b82f6",
    icon: "",
  });

  // Load category summary on mount
  useEffect(() => {
    loadCategorySummary();
  }, []);

  // Load options when tab changes
  useEffect(() => {
    loadOptions();
  }, [activeTab]);

  const loadCategorySummary = async () => {
    const response = await getCategorySummary();
    if (response.success && response.data) {
      setCategorySummary(response.data);
    }
  };

  const loadOptions = async () => {
    const response = await getOptionsByCategory(activeTab);
    if (response.success && response.data) {
      setOptions(response.data);
    }
  };

  const handleAddOption = () => {
    setEditingOption(null);
    setFormData({
      value: "",
      label: "",
      category: activeTab,
      description: "",
      isActive: true,
      sortOrder: options.length + 1,
      color: "#3b82f6",
      icon: "",
    });
    setShowAddModal(true);
  };

  const handleEditOption = (option: SelectOption) => {
    setEditingOption(option);
    setFormData({
      value: option.value,
      label: option.label,
      category: option.category,
      description: option.description || "",
      isActive: option.isActive,
      sortOrder: option.sortOrder,
      color: option.color || "#3b82f6",
      icon: option.icon || "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOption) {
      // Update existing option
      const response = await updateOption(editingOption.id, formData);
      if (response.success) {
        alert(`✅ ${response.message}`);
        setShowAddModal(false);
        loadOptions();
      } else {
        alert(`❌ Error: ${response.error}`);
      }
    } else {
      // Create new option
      const response = await createOption(formData);
      if (response.success) {
        alert(`✅ ${response.message}\nOption ID: ${response.data?.id}`);
        setShowAddModal(false);
        loadOptions();
        loadCategorySummary();
      } else {
        alert(`❌ Error: ${response.error}`);
      }
    }
  };

  const handleDeleteOption = async (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete "${label}"?\n\nThis cannot be undone.`)) {
      const response = await deleteOption(id);
      if (response.success) {
        alert(`✅ ${response.message}`);
        loadOptions();
        loadCategorySummary();
      } else {
        alert(`❌ Error: ${response.error}`);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const response = await toggleOptionStatus(id);
    if (response.success) {
      loadOptions();
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  const categories = [
    { id: "propertyType", label: "Property Types", icon: Home, color: "from-blue-500 to-cyan-600" },
    { id: "propertyCategory", label: "Property Categories", icon: Building, color: "from-purple-500 to-pink-600" },
    { id: "listingType", label: "Listing Types", icon: Sparkles, color: "from-green-500 to-emerald-600" },
    { id: "propertyStatus", label: "Property Status", icon: Map, color: "from-orange-500 to-red-600" },
    { id: "furnishedStatus", label: "Furnished Status", icon: Home, color: "from-indigo-500 to-purple-600" },
    { id: "currency", label: "Currencies", icon: DollarSign, color: "from-green-500 to-teal-600" },
    { id: "auctionType", label: "Auction Types", icon: Gavel, color: "from-pink-500 to-rose-600" },
    { id: "userRole", label: "User Roles", icon: Users, color: "from-blue-500 to-indigo-600" },
    { id: "agentSpecialization", label: "Agent Specializations", icon: Briefcase, color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${theme.primary} py-12`}>
        <div className="container mx-auto px-6">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-all">
            <ArrowLeft className="size-5" />
            <span className="font-bold">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <SettingsIcon className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Select Field Settings</h1>
              <p className="text-white/90 font-medium text-lg">Manage dropdown options for all forms</p>
            </div>
          </div>

          {/* Category Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/30">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-white/30 flex items-center justify-center">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{categorySummary.length}</p>
                  <p className="text-white/90 font-medium text-sm">Categories</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/30">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-white/30 flex items-center justify-center">
                  <SettingsIcon className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{categorySummary.reduce((sum, cat) => sum + cat.totalOptions, 0)}</p>
                  <p className="text-white/90 font-medium text-sm">Total Options</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/30">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-white/30 flex items-center justify-center">
                  <Check className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{categorySummary.reduce((sum, cat) => sum + cat.activeOptions, 0)}</p>
                  <p className="text-white/90 font-medium text-sm">Active Options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Category Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl sticky top-6">
              <h3 className="text-lg font-black text-slate-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const summary = categorySummary.find((s) => s.category === cat.id);
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id as OptionCategory)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        activeTab === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-bold">{cat.label}</p>
                        {summary && (
                          <p className="text-xs opacity-80">
                            {summary.activeOptions}/{summary.totalOptions} active
                          </p>
                        )}
                      </div>
                      <ChevronRight className="size-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Options List */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-white/60 shadow-xl overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${categories.find((c) => c.id === activeTab)?.color} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">
                      {categories.find((c) => c.id === activeTab)?.label}
                    </h2>
                    <p className="text-white/90 font-medium">
                      {categorySummary.find((s) => s.category === activeTab)?.description}
                    </p>
                  </div>
                  <button
                    onClick={handleAddOption}
                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Plus className="size-5" />
                    Add Option
                  </button>
                </div>
              </div>

              {/* Options List */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin size-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading options...</p>
                  </div>
                ) : options.length === 0 ? (
                  <div className="text-center py-12">
                    <SettingsIcon className="size-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold text-lg mb-2">No options found</p>
                    <p className="text-slate-500 mb-6">Add your first option to get started</p>
                    <button
                      onClick={handleAddOption}
                      className={`px-6 py-3 bg-gradient-to-r ${categories.find((c) => c.id === activeTab)?.color} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2`}
                    >
                      <Plus className="size-5" />
                      Add First Option
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          option.isActive
                            ? "bg-white border-slate-200 hover:border-slate-300"
                            : "bg-slate-50 border-slate-200 opacity-60"
                        }`}
                      >
                        {/* Drag Handle */}
                        <div className="cursor-move text-slate-400 hover:text-slate-600">
                          <GripVertical className="size-5" />
                        </div>

                        {/* Color Badge */}
                        {option.color && (
                          <div
                            className="size-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: option.color }}
                          >
                            <span className="text-white font-black text-sm">{option.sortOrder}</span>
                          </div>
                        )}

                        {/* Option Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-slate-900">{option.label}</h4>
                            <code className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                              {option.value}
                            </code>
                            {!option.isActive && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                Inactive
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className="text-sm text-slate-600">{option.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(option.id)}
                            className={`p-2 rounded-lg transition-all ${
                              option.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                            }`}
                            title={option.isActive ? "Deactivate" : "Activate"}
                          >
                            {option.isActive ? <Check className="size-5" /> : <X className="size-5" />}
                          </button>

                          <button
                            onClick={() => handleEditOption(option)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                            title="Edit"
                          >
                            <Edit className="size-5" />
                          </button>

                          <button
                            onClick={() => handleDeleteOption(option.id, option.label)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              {editingOption ? "Edit Option" : "Add New Option"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Label */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Label (Display Name) *</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Luxury Villa"
                  required
                />
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Value (System ID) *</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
                  placeholder="e.g., luxury_villa"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Use lowercase letters, numbers, and underscores only</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Brief description of this option"
                  rows={3}
                />
              </div>

              {/* Color & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-12 border-2 border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="size-5 rounded border-2 border-slate-300"
                />
                <label htmlFor="isActive" className="font-bold text-slate-700">
                  Active (visible in forms)
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
                  <p className="font-bold">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-3 bg-gradient-to-r ${categories.find((c) => c.id === activeTab)?.color} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin size-5 border-2 border-white border-t-transparent rounded-full"></div>
                      {editingOption ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="size-5" />
                      {editingOption ? "Update Option" : "Create Option"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
