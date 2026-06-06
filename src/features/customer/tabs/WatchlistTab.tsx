import { useNavigate } from "react-router";
import { Heart, Building2, Eye, Gavel } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { useCustomerApi } from "../api/useCustomerApi";

export default function WatchlistTab() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { useMyWatchlist } = useCustomerApi();
  const { data: watchlist = [], isLoading } = useMyWatchlist();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Heart className="size-8 text-red-500" />
          My Watchlist
        </h2>
        <p className="text-slate-600 font-medium mt-1">Properties you're watching</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !Array.isArray(watchlist) || watchlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <Heart className="size-14 mx-auto mb-4 text-red-300 opacity-60" />
          <p className="text-lg font-black text-slate-700">No saved properties yet</p>
          <p className="text-slate-400 text-sm mt-1">Properties you save will appear here</p>
          <button
            onClick={() => navigate("/properties")}
            className={`mt-6 px-6 py-2.5 bg-gradient-to-r ${theme.primary} text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((property: any) => (
            <div
              key={property._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {property.media?.[0] ? (
                <img
                  src={property.media[0]}
                  alt={property.propertyTitle}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                  <Building2 className="size-10 text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-black text-slate-900 line-clamp-1">{property.propertyTitle}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{property.location || "Location TBC"}</p>
                {property.startingPrice && (
                  <p className="text-sm font-black text-green-700 mt-1">
                    From £{Number(property.startingPrice).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/properties/${property.slug || property._id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="size-3.5" /> View
                  </button>
                  {property.activeAuction && (
                    <button
                      onClick={() => navigate(`/auctions/${property.activeAuction}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                      <Gavel className="size-3.5" /> Bid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
