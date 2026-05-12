import { useState } from "react";
import { X, Save, Gavel, Search } from "lucide-react";
import { useTheme } from "../../../app/hooks/useTheme";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";

interface AuctionFormModalProps {
  onClose: () => void;
  onSave?: (auction: any) => void;
  editData?: any;
}

function formatForDateTimeLocal(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16); // "2026-05-15T10:00"
}

export default function AuctionFormModal({
  onClose,
  onSave,
  editData,
}: AuctionFormModalProps) {
  const theme = useTheme();
  const { useGetProperties } = usePropertyApi();
  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData } = useGetAuctions();
  const allAuctions = auctionsData?.data || [];

  const { data: propsData } = useGetProperties({
    approvalStatus: "approved",
    listingType: "auction",
    status: "available", // Only show available properties, not sold ones
  } as any);
  const allProperties = propsData?.data || [];
  // Build set of property IDs already in other auctions
  const propertiesInOtherAuctions = new Set();
  allAuctions.forEach((a: any) => {
    if (editData?._id && a._id === editData._id) return;
    // Only exclude properties from live or scheduled auctions (not completed/cancelled)
    if (a.status === "completed" || a.status === "cancelled") return;
    a.properties?.forEach((p: any) => {
      const id = typeof p === "object" ? p._id?.toString() : p?.toString();
      if (id) propertiesInOtherAuctions.add(id);
    });
  });

  // Filter out properties already in other auctions
  const availableProperties = allProperties.filter(
    (p: any) => !propertiesInOtherAuctions.has(p._id?.toString()),
  );
  const { useCreateAuction } = useAuctionApi();
  const createAuction = useCreateAuction();
  const { useUpdateAuction } = useAuctionApi();
  const updateAuction = useUpdateAuction();

  const [formData, setFormData] = useState({
    auctionTitle: editData?.auctionTitle || "",
    auctionType: editData?.auctionType || "live",
    selectedProperties:
      editData?.properties?.map((p: any) =>
        typeof p === "object" ? p._id?.toString() : p?.toString(),
      ) || [],
    startingBid: editData?.startingBid || "",
    bidIncrement: editData?.bidIncrement || "",
    startDateTime: formatForDateTimeLocal(editData?.startDateTime) || "",
    endDateTime: formatForDateTimeLocal(editData?.endDateTime) || "",
    description: editData?.description || "",
    venueName: editData?.venue?.name || "",
    venueAddress: editData?.venue?.address || "",
    venueCity: editData?.venue?.city || "",
    venuePostcode: editData?.venue?.postcode || "",
    registrationFee: editData?.registrationFee || "",
    depositRequired: editData?.depositRequired || "",
    status: editData?.status || "scheduled",
    auctionImage: editData?.auctionImage || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [propertySearch, setPropertySearch] = useState("");

  const filteredProperties = propertySearch
    ? availableProperties.filter(
        (p: any) =>
          p.propertyTitle
            ?.toLowerCase()
            .includes(propertySearch.toLowerCase()) ||
          p.location?.city
            ?.toLowerCase()
            .includes(propertySearch.toLowerCase()),
      )
    : availableProperties;

  const toggleProperty = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedProperties: prev.selectedProperties.includes(id)
        ? prev.selectedProperties.filter((p: string) => p !== id)
        : [...prev.selectedProperties, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedProperties.length === 0) {
      setError("Please select at least one property");
      return;
    }

    setLoading(true);
    setError("");

    const data = {
      auctionTitle: formData.auctionTitle,
      auctionType: formData.auctionType,
      properties: formData.selectedProperties,
      startingBid: Number(formData.startingBid),
      bidIncrement: Number(formData.bidIncrement),
      startDateTime: new Date(formData.startDateTime).toISOString(),
      endDateTime: new Date(formData.endDateTime).toISOString(),
      description: formData.description,
      venue: {
        name: formData.venueName,
        address: formData.venueAddress,
        city: formData.venueCity,
        postcode: formData.venuePostcode,
      },
      registrationFee: Number(formData.registrationFee) || 0,
      depositRequired: Number(formData.depositRequired) || 0,
      status: formData.status,
      auctionImage: formData.auctionImage || undefined,
      enableAutoBidding: false,
      sendEmailNotifications: false,
    };

    try {
      let result;
      if (editData?._id) {
        // Update existing
        result = await updateAuction.mutateAsync({ id: editData._id, data });
      } else {
        // Create new
        result = await createAuction.mutateAsync(data);
      }

      if (result.success) {
        if (onSave) onSave(result.data);
        onClose();
      } else {
        setError(result.message || "Failed to save auction");
      }
    } catch (err: any) {
      setError(err.message || "Error saving auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${theme.primary} p-6 flex items-center justify-between text-white sticky top-0 z-10 rounded-t-3xl`}
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Gavel className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">
                {editData ? "Edit" : "Create New"} Auction
              </h2>
              <p className="text-sm text-white/80 font-medium">
                Set up a new property auction event
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all"
          >
            <X className="size-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Auction Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Auction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Auction Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.auctionTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, auctionTitle: e.target.value })
                  }
                  placeholder="e.g., Premium Properties - March 2026"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Auction Type *
                </label>
                <select
                  required
                  value={formData.auctionType}
                  onChange={(e) =>
                    setFormData({ ...formData, auctionType: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="live">Live Auction</option>
                  <option value="online">Online Only</option>
                  <option value="hybrid">Hybrid (Live + Online)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Select Properties ({formData.selectedProperties.length} selected)
            </h3>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Selected badges */}
            {formData.selectedProperties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.selectedProperties.map((id: string) => {
                  const prop = allProperties.find((p: any) => p._id === id);
                  return prop ? (
                    <span
                      key={id}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-2"
                    >
                      {prop.propertyTitle?.slice(0, 25)}
                      {prop.propertyTitle?.length > 25 ? "..." : ""}
                      <button
                        type="button"
                        onClick={() => toggleProperty(id)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Property grid - 2 columns, scrollable, max 30 initially */}
            <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-3">
                {filteredProperties.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-8 col-span-2">
                    No properties found.
                  </p>
                )}
                {filteredProperties.map((prop: any) => (
                  <label
                    key={prop._id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all border-2 ${
                      formData.selectedProperties.includes(prop._id)
                        ? "bg-blue-50 border-blue-500"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedProperties.includes(prop._id)}
                      onChange={() => toggleProperty(prop._id)}
                      className="size-4 rounded accent-blue-600 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {prop.propertyTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {prop.location?.city || "N/A"} •{" "}
                        {prop.pricing?.currency}{" "}
                        {prop.pricing?.startingAuctionPrice?.toLocaleString()}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Load More button */}
              {allProperties.length >= 30 &&
                filteredProperties.length === allProperties.length && (
                  <div className="border-t-2 border-slate-100 p-2 text-center">
                    <button
                      type="button"
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Showing all {allProperties.length} properties
                    </button>
                  </div>
                )}
            </div>
          </div>

          {/* Bidding Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Bidding Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Starting Bid *
                </label>
                <input
                  type="number"
                  required
                  value={formData.startingBid}
                  onChange={(e) =>
                    setFormData({ ...formData, startingBid: e.target.value })
                  }
                  placeholder="e.g., 500000"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Bid Increment *
                </label>
                <input
                  type="number"
                  required
                  value={formData.bidIncrement}
                  onChange={(e) =>
                    setFormData({ ...formData, bidIncrement: e.target.value })
                  }
                  placeholder="e.g., 10000"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Registration Fee (£)
                </label>
                <input
                  type="number"
                  value={formData.registrationFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationFee: e.target.value,
                    })
                  }
                  placeholder="0"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Deposit Required (%)
                </label>
                <input
                  type="number"
                  value={formData.depositRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      depositRequired: e.target.value,
                    })
                  }
                  placeholder="10"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startDateTime: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endDateTime: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Venue Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) =>
                    setFormData({ ...formData, venueName: e.target.value })
                  }
                  placeholder="e.g., Grand Hotel London"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.venueCity}
                  onChange={(e) =>
                    setFormData({ ...formData, venueCity: e.target.value })
                  }
                  placeholder="e.g., London"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.venueAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, venueAddress: e.target.value })
                  }
                  placeholder="Full address"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formData.venuePostcode}
                  onChange={(e) =>
                    setFormData({ ...formData, venuePostcode: e.target.value })
                  }
                  placeholder="e.g., SW1A 1AA"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Auction Banner Image (Optional)
            </h3>
            <input
              type="text"
              value={formData.auctionImage}
              onChange={(e) =>
                setFormData({ ...formData, auctionImage: e.target.value })
              }
              placeholder="Paste image URL (or first property's image will be used)"
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Description</h3>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the auction event..."
              rows={4}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2`}
            >
              <Save className="size-5" />
              {loading ? "Creating..." : editData ? "Update" : "Create"} Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
