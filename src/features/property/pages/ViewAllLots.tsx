import { mediaUrl } from "@/lib/mediaUrl";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Sparkles,
  Home,
  MapPin,
  Bed,
  Bath,
  Clock,
  Gavel,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Building2,
  Building,
  Car,
  Search,
  X,
} from "lucide-react";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { usePropertyApi } from "@/features/property/api/usePropertyApi";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import CountdownTimer from "@/features/shared/ui/CountdownTimer";
import AuctionTimer from "@/features/shared/components/AuctionTimer";

export default function ViewAllLots() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [urlParams] = useSearchParams();
  const urlSearch = urlParams.get("search") || "";
  const urlMinPrice = urlParams.get("minPrice") || "";
  const urlMaxPrice = urlParams.get("maxPrice") || "";
  const urlMinBeds = urlParams.get("minBeds") || "";
  const urlMaxBeds = urlParams.get("maxBeds") || "";

  const [lotsPage, setLotsPage] = useState(1);
  const [allLots, setAllLots] = useState<any[]>([]);

  const { useGetProperties } = usePropertyApi();
  const { data: lotsData, isLoading: loading } = useGetProperties({
    auctionSlug: slug || undefined,
    search: urlSearch || undefined,
    page: lotsPage,
    pageSize: 12,
    // Only exclude sold for general browsing, not when viewing a specific auction
    ...(slug ? {} : { excludeSold: "true" }),
  } as any);

  const lots: any[] = lotsData?.data || [];
  const lotsTotal = lotsData?.total || 0;
  const hasMoreLots = allLots.length < lotsTotal;

  // Append new lots
  useEffect(() => {
    if (lots.length > 0) {
      setAllLots((prev) => {
        const existingIds = new Set(prev.map((p: any) => p._id));
        const newOnes = lots.filter((p: any) => !existingIds.has(p._id));
        return [...prev, ...newOnes];
      });
    }
  }, [lots]);

  const handleLoadMoreLots = () => setLotsPage((prev) => prev + 1);

  // Client-side filtering
  const displayLots = allLots.length > 0 ? allLots : lots;
  const filteredLots = displayLots.filter((lot: any) => {
    const price = lot.pricing?.startingAuctionPrice || 0;
    if (urlMinPrice && price < parseInt(urlMinPrice)) return false;
    if (urlMaxPrice && price > parseInt(urlMaxPrice)) return false;
    if (
      urlMinBeds &&
      (lot.specifications?.bedrooms || 0) < parseInt(urlMinBeds)
    )
      return false;
    if (
      urlMaxBeds &&
      (lot.specifications?.bedrooms || 0) > parseInt(urlMaxBeds)
    )
      return false;
    return true;
  });

  // Get all auctions to match per-lot and show correct badges/timers
  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData } = useGetAuctions({});
  const auctions = auctionsData?.data || [];
  const auction = slug ? auctions.find((a: any) => a.slug === slug) : null;

  const formatPrice = (val: number, currency = "GBP") =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <PublicLayout>
      {/* Back Button */}
      {slug && (
        <div className="container mx-auto px-6 pt-6">
          <button
            onClick={() => navigate(`/auctions/${slug}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all shadow-sm"
          >
            <ArrowLeft className="size-4" />
            Back to Auction
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-95" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">
                📦 {filteredLots.length}{" "}
                {lots.length === 1 ? "Property" : "Properties"}{" "}
                {auction ? `in ${auction.auctionTitle}` : "Available"}
              </span>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {auction ? auction.auctionTitle : "All Properties"}
              <br />
              <span className="text-cyan-300">
                {auction?.status === "live" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-3 bg-red-500 rounded-full inline-block animate-pulse" />
                    Live Auction
                  </span>
                ) : auction ? (
                  "Browse Lots"
                ) : (
                  "Browse & Bid"
                )}
              </span>
            </h1>
            {auction && (
              <div className="flex items-center justify-center gap-3 text-white font-medium mt-4">
                <Clock className="size-5 text-white/80" />
                <span className="text-white/90">
                  {auction.status === "live" ? "Ends in:" : "Starts:"}
                </span>
                {auction.status === "live" && auction.endDateTime ? (
                  <span className="text-xl font-black text-yellow-300">
                    <CountdownTimer
                      endDate={new Date(auction.endDateTime)}
                      compact={true}
                      gradient="from-yellow-300 to-yellow-300"
                    />
                  </span>
                ) : (
                  <span className="text-lg font-bold text-white">
                    {new Date(auction.startDateTime).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {(urlSearch ||
          urlMinPrice ||
          urlMaxPrice ||
          urlMinBeds ||
          urlMaxBeds) && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <p className="text-blue-800 font-bold text-sm">
              Filters: {urlSearch && `"${urlSearch}"`}
              {urlMinPrice && ` Min £${parseInt(urlMinPrice).toLocaleString()}`}
              {urlMaxPrice && ` Max £${parseInt(urlMaxPrice).toLocaleString()}`}
              {urlMinBeds && ` ${urlMinBeds}+ beds`}
              {urlMaxBeds && ` Max ${urlMaxBeds} beds`}
            </p>
            <button
              onClick={() => navigate("/view-all-lots")}
              className="text-blue-600 font-bold text-sm hover:underline"
            >
              Clear All
            </button>
          </div>
        )}
        <p className="text-slate-600 text-lg font-medium mb-8">
          Showing{" "}
          <span className="font-black text-slate-900">
            {filteredLots.length}
          </span>{" "}
          {filteredLots.length === 1 ? "property" : "properties"}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 animate-pulse"
              >
                <div className="h-56 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="size-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              No properties found
            </h3>
            <p className="text-slate-500">
              {slug
                ? "This auction has no properties yet."
                : "Add properties from the admin panel!"}
            </p>
            {slug && (
              <button
                onClick={() => navigate(`/auctions/${slug}`)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold"
              >
                Back to Auction
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot) => {
              const isAuction = lot.listingType === "auction";
              const isSold = lot.propertyStatus === "sold";
              const isUnsold = lot.propertyStatus === "unsold";
              const currentBid =
                lot.currentBid || lot.pricing?.startingAuctionPrice || 0;
              const reservePrice = lot.pricing?.reservePrice || 0;
              const reserveMet = currentBid >= reservePrice;
              const nextMinBid =
                currentBid + (lot.pricing?.minimumBidIncrement || 1000);
              const displayBid = isSold
                ? lot.soldPrice || lot.currentBid || 0
                : lot.currentBid || lot.pricing?.startingAuctionPrice || 0;
              const bidLabel =
                lot.totalBids > 0 || isSold || isUnsold
                  ? "Current Bid"
                  : "Guide Price";

              // Find which auction this lot belongs to
              const lotAuction =
                auction ||
                auctions.find((a: any) =>
                  a.properties?.some(
                    (p: any) => (typeof p === "string" ? p : p._id) === lot._id,
                  ),
                ) ||
                null;

              return (
                <div
                  key={lot._id}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer group"
                  onClick={() => navigate(`/properties/${lot.slug || lot._id}`)}
                >
                  {/* Image */}
                  <div className="relative h-56 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    {lot.media?.propertyImages?.length > 0 ? (
                      <img
                        src={mediaUrl(lot.media.propertyImages[0])}
                        alt={lot.propertyTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Home className="size-16 text-slate-400" />
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm shadow-xl capitalize">
                        {lot.propertyType}
                      </div>
                      {isAuction && lotAuction?.status === "live" && (
                        <div className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                          <span className="size-1.5 bg-white rounded-full" />{" "}
                          LIVE
                        </div>
                      )}
                      {lot.propertyStatus === "sold" && (
                        <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          🎉 Sold
                        </div>
                      )}
                      {lot.propertyStatus === "unsold" && (
                        <div className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                          ❌ Unsold
                        </div>
                      )}
                    </div>
                    {/* Auction type badge */}
                    {lotAuction?.auctionType === "online" && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full shadow-md">
                          🖥️ Online
                        </span>
                      </div>
                    )}

                    {/* Countdown */}
                    {isAuction &&
                      auction?.status === "live" &&
                      auction?.endDateTime && (
                        <div className="absolute bottom-4 right-4">
                          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full">
                            <CountdownTimer
                              endDate={new Date(auction.endDateTime)}
                              compact={true}
                              gradient="from-red-500 to-orange-500"
                            />
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {lot.propertyTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-4 font-medium">
                      <MapPin className="size-4 text-emerald-600" />
                      {lot.location?.streetAddress
                        ? `${lot.location.streetAddress}, `
                        : ""}
                      {lot.location?.city}, {lot.location?.area}
                    </div>

                    {/* Specs */}
                    <div className="flex items-center flex-wrap gap-3 mb-4 pb-4 border-b-2 border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bed className="size-4 text-blue-600" />
                        <span className="font-bold text-slate-900">
                          {lot.specifications?.bedrooms ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="size-4 text-purple-600" />
                        <span className="font-bold text-slate-900">
                          {lot.specifications?.bathrooms ?? "-"}
                        </span>
                      </div>
                      {(lot.specifications?.floors ?? 0) > 0 && (
                        <div className="flex items-center gap-2">
                          <Building className="size-4 text-green-600" />
                          <span className="font-bold text-slate-900">
                            {lot.specifications.floors} fl
                          </span>
                        </div>
                      )}
                      {(lot.specifications?.parkingSpaces ?? 0) > 0 && (
                        <div className="flex items-center gap-2">
                          <Car className="size-4 text-slate-600" />
                          <span className="font-bold text-slate-900">
                            {lot.specifications.parkingSpaces}P
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pricing */}
                    {isAuction && auction ? (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-600">
                            {lot.totalBids > 0 ? "Current Bid" : "Guide Price"}
                          </p>
                          <p className="text-lg font-black text-emerald-600">
                            {formatPrice(currentBid, lot.pricing?.currency)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Next Min Bid</span>
                          <span className="font-bold text-slate-700">
                            {formatPrice(nextMinBid, lot.pricing?.currency)}
                          </span>
                        </div>
                        {reservePrice > 0 && (
                          <div
                            className={`flex items-center gap-1 text-xs font-bold ${reserveMet ? "text-green-600" : "text-amber-600"}`}
                          >
                            {reserveMet ? (
                              <CheckCircle className="size-3" />
                            ) : (
                              <AlertCircle className="size-3" />
                            )}
                            {reserveMet ? "Reserve Met" : "Reserve Not Met"}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Bids</span>
                          <span className="font-bold text-slate-700">
                            {lot.totalBids || 0}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-semibold">
                            {bidLabel}
                          </span>
                          <span className="font-black text-emerald-600">
                            {formatPrice(displayBid, lot.pricing?.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Reserve</span>
                          <span className="font-bold text-slate-700">
                            {formatPrice(reservePrice, lot.pricing?.currency)}
                          </span>
                        </div>
                        {(isSold || isUnsold || lot.currentBid > 0) && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Reserve Met</span>
                            <span
                              className={`font-bold ${isSold ? "text-green-600" : "text-red-500"}`}
                            >
                              {isSold ? "✅ Yes" : "❌ No"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {lotAuction && (
                      <div className="mb-3">
                        <AuctionTimer
                          startDateTime={lotAuction.startDateTime}
                          endDateTime={lotAuction.endDateTime}
                          status={lotAuction.status}
                          className="mt-1"
                        />
                      </div>
                    )}

                    <button
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/properties/${lot.slug || lot._id}`);
                      }}
                    >
                      {isAuction && lotAuction?.status === "live" ? (
                        <>
                          <Gavel className="size-4" /> View & Bid
                        </>
                      ) : (
                        <>View Details</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMoreLots && (
          <div className="text-center mt-10 pb-6">
            <button
              onClick={handleLoadMoreLots}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Properties"}
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
