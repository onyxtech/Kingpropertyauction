// src\features\admin\components\users\tabs\PropertiesTab.tsx
import { House, MapPin, Eye, User, Gavel, ShoppingBag, Bookmark } from "lucide-react";
import { UserRecord } from "../UserActivityView";
import { useUserApi } from "@/features/admin/api/useUserApi";
import { useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";

export function PropertiesTab({ user }: { user: UserRecord }) {
  const navigate = useNavigate();
  const { useGetUserProperties } = useUserApi();
  const { data: properties, isLoading } = useGetUserProperties(user._id);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Generate Lot # from property ID (last 6 chars)
  const getLotNumber = (id: string) => {
    if (!id) return "N/A";
    return `LOT-${id.slice(-6).toUpperCase()}`;
  };

  // Build complete address
  const getFullAddress = (prop: any) => {
    const parts = [
      prop.location?.streetAddress,
      prop.location?.city,
      prop.location?.area,
      prop.location?.postalCode,
      prop.location?.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  // Get agent name - uses sellerInfo from property
  const getAgentName = (prop: any) => {
    // 1. Check if property has sellerInfo with agentName
    if (prop.sellerInfo?.agentName) return prop.sellerInfo.agentName;
    
    // 2. If created by current user, show "Self"
    if (prop.createdBy?._id === user?._id) return "Self";
    
    // 3. If created by someone else, show their name
    if (prop.createdBy?.name) return prop.createdBy.name;
    
    // 4. Fallback
    return "N/A";
  };

  // Get price
  const getPrice = (prop: any) => {
    if (prop.propertyStatus === "sold" && prop.soldPrice) {
      return formatPrice(prop.soldPrice);
    }
    return formatPrice(prop.pricing?.startingAuctionPrice || 0);
  };

  // Get status display
  const getStatusDisplay = (prop: any) => {
    if (prop._relation === 'watchlist') {
      return 'Watching';
    }
    if (prop._relation === 'active_bid') {
      return 'Bidding Active';
    }
    if (prop._relation === 'bid_lost') {
      return 'Lost Bid';
    }
    if (prop._relation === 'purchased') {
      return 'Purchased';
    }
    if (prop.propertyStatus === "sold") {
      const price = prop.soldPrice || prop.currentBid || prop.pricing?.startingAuctionPrice;
      return `Sold ${formatPrice(price)}`;
    }
    return prop.propertyStatus || "available";
  };

  // Get type/relation label
  const getTypeLabel = (prop: any) => {
    if (prop._relation === 'watchlist') return 'Watchlist';
    if (prop._relation === 'active_bid') return 'Active Bid';
    if (prop._relation === 'bid_lost') return 'Past Bid';
    if (prop._relation === 'purchased') return 'Purchase';
    if (prop._relation === 'listed') return 'Listing';
    return prop.listingType || 'N/A';
  };

  // Get relation icon
  const getRelationIcon = (prop: any) => {
    if (prop._relation === 'watchlist') return <Bookmark className="size-3 text-indigo-500" />;
    if (prop._relation === 'active_bid') return <Gavel className="size-3 text-red-500" />;
    if (prop._relation === 'bid_lost') return <Gavel className="size-3 text-orange-500" />;
    if (prop._relation === 'purchased') return <ShoppingBag className="size-3 text-green-500" />;
    return <User className="size-3 text-slate-400" />;
  };

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <House className="size-4 text-slate-400" /> Properties ({properties?.length || 0})
          </h3>
        </div>

        {!properties || properties.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <House className="size-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No properties</p>
            <p className="text-sm">This user has no properties</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Lot #", "Property", "Type", "Agent", "Price", "Status", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {properties.map((prop: any) => (
                  <tr key={prop._id} className="hover:bg-slate-50 transition-colors">
                    {/* Lot # */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-blue-600">
                        {getLotNumber(prop._id)}
                      </span>
                    </td>

                    {/* Property - with full address */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {prop.media?.propertyImages?.length > 0 ? (
                          <img
                            src={prop.media.propertyImages[0]}
                            alt={prop.propertyTitle}
                            className="size-10 rounded-lg object-cover bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <House className="size-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 truncate max-w-[200px]">
                            {prop.propertyTitle || "Untitled"}
                          </p>
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <MapPin className="size-3" />
                            {getFullAddress(prop)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type - shows relation type */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getRelationIcon(prop)}
                        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 capitalize">
                          {getTypeLabel(prop)}
                        </span>
                      </div>
                    </td>

                    {/* Agent - uses sellerInfo.agentName */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <User className="size-3 text-slate-400" />
                        <span className="text-slate-700 text-xs font-medium">
                          {getAgentName(prop)}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                      {getPrice(prop)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={getStatusDisplay(prop)} />
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {prop.createdAt ? new Date(prop.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) : "TBC"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/properties/${prop.slug || prop._id}`)}
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="View Property"
                      >
                        <Eye className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}