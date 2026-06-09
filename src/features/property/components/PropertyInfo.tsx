import { mediaUrl } from "@/lib/mediaUrl";
import {
  MapPin,
  Bed,
  Bath,
  Calendar,
  Heart,
  Share2,
  CheckCircle,
  Home,
  Car,
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { formatUKDateTime } from "@/features/shared/utils/dateUtils";
import BidHistorySection from "@/features/property/components/BidHistorySection";

interface PropertyInfoProps {
  property: any;
  matchingAuction: any;
  isLiveNow: boolean;
  isCompleted: boolean;
  isAuctionType: boolean;
  isInLiveAuction: boolean;
  isDirectSale: boolean;
  currentBid: number;
  startingPrice: number;
  reservePrice: number;
  bidIncrement: number;
  nextMinBid: number;
  reserveMet: boolean;
  buyNowPrice: number;
  features: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  formatPrice: (val: number) => string;
  showBidHistory: boolean;
  bidHistory: any;
  loadingHistory: boolean;
  onToggleBidHistory: () => void;
}

export default function PropertyInfo({
  property,
  matchingAuction,
  isLiveNow,
  isCompleted,
  isAuctionType,
  isInLiveAuction,
  isDirectSale,
  currentBid,
  startingPrice,
  reservePrice,
  bidIncrement,
  nextMinBid,
  reserveMet,
  buyNowPrice,
  features,
  isFavorite,
  onToggleFavorite,
  formatPrice,
  showBidHistory,
  bidHistory,
  loadingHistory,
  onToggleBidHistory,
}: PropertyInfoProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Property Title + Specs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {isLiveNow ? (
                <span className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-sm flex items-center gap-1.5">
                  <span className="size-2 bg-white rounded-full animate-pulse" />{" "}
                  Live Auction
                </span>
              ) : isCompleted ? (
                <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm">
                  Completed
                </span>
              ) : isAuctionType ? (
                <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-bold text-sm">
                  Upcoming Auction
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold text-sm">
                  For Sale
                </span>
              )}
              <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm">
                {property.legalInfo?.ownershipType || "Freehold"}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3">
              {property.propertyTitle}
            </h1>
            <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
              <MapPin className="size-5 text-blue-600" />
              {property.location?.streetAddress ||
                property.location?.city}, {property.location?.area}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleFavorite}
              className={`size-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isFavorite
                  ? "bg-gradient-to-br from-red-500 to-pink-500"
                  : "bg-white/90"
              }`}
            >
              <Heart
                className={`size-5 ${
                  isFavorite ? "text-white fill-white" : "text-slate-600"
                }`}
              />
            </button>
            <button className="size-12 bg-white/90 rounded-full flex items-center justify-center transition-all shadow-lg">
              <Share2 className="size-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 pb-6 border-b-2 border-slate-100">
          {[
            {
              icon: Bed,
              gradient: "from-blue-500 to-indigo-600",
              value: property.specifications?.bedrooms || 0,
              label: "Bedrooms",
            },
            {
              icon: Bath,
              gradient: "from-purple-500 to-pink-600",
              value: property.specifications?.bathrooms || 0,
              label: "Bathrooms",
            },
            {
              icon: Car,
              gradient: "from-orange-500 to-amber-600",
              value: property.specifications?.parkingSpaces || 0,
              label: "Parking",
            },
            {
              icon: Home,
              gradient: "from-rose-500 to-red-600",
              value: property.specifications?.yearBuilt || "N/A",
              label: "Built",
            },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`size-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className="size-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="text-sm font-bold text-blue-900 mb-2">
              {isDirectSale ? "Asking Price" : "Starting Price"}
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {formatPrice(startingPrice)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
            <div className="text-sm font-bold text-emerald-900 mb-2">
              {isDirectSale
                ? "Buy Now Price"
                : isAuctionType && !isInLiveAuction
                  ? "Starting Bid"
                  : "Current Bid"}
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {isDirectSale
                ? formatPrice(buyNowPrice || startingPrice)
                : formatPrice(currentBid)}
            </div>
          </div>
        </div>

        {isAuctionType && (
          <div className="mt-6 space-y-4">
            {matchingAuction && matchingAuction.status === "scheduled" && (
              <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-xs font-bold text-amber-700 mb-1">
                  Auction Starts
                </p>
                <p className="text-sm font-bold text-slate-900 mb-2">
                  {formatUKDateTime(matchingAuction.startDateTime)}
                </p>
                <AuctionTimer
                  startDateTime={matchingAuction.startDateTime}
                  endDateTime={matchingAuction.endDateTime}
                  status={matchingAuction.status}
                  className="mt-1"
                />
              </div>
            )}
            {matchingAuction && matchingAuction.status === "live" && (
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <p className="text-xs font-bold text-red-700 mb-1">
                  Auction Ends
                </p>
                <p className="text-sm font-bold text-slate-900 mb-2">
                  {formatUKDateTime(matchingAuction.endDateTime)}
                </p>
                <AuctionTimer
                  startDateTime={matchingAuction.startDateTime}
                  endDateTime={matchingAuction.endDateTime}
                  status={matchingAuction.status}
                  className="mt-1"
                />
              </div>
            )}
            {matchingAuction && matchingAuction.status === "completed" && (
              <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                <AuctionTimer
                  startDateTime={matchingAuction.startDateTime}
                  endDateTime={matchingAuction.endDateTime}
                  status={matchingAuction.status}
                />
              </div>
            )}
            {isAuctionType &&
              !isInLiveAuction &&
              property.auctionDetails?.auctionEndDate && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-700">
                    📅 Auction Date:
                  </span>
                  <span className="font-bold text-amber-900">
                    {new Date(
                      property.auctionDetails.auctionEndDate,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-600">Next Min Bid</span>
                <span className="text-slate-900 font-bold">
                  {formatPrice(nextMinBid)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-600">Bid Increment</span>
                <span className="text-slate-900 font-bold">
                  {formatPrice(bidIncrement)}
                </span>
              </div>
              {reservePrice > 0 && (
                <div
                  className={`flex items-center gap-1.5 text-sm font-bold ${
                    reserveMet ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {reserveMet ? (
                    <CheckCircle className="size-4" />
                  ) : (
                    <AlertCircle className="size-4" />
                  )}
                  {reserveMet
                    ? `Reserve Met (${formatPrice(reservePrice)})`
                    : `Reserve Not Met (${formatPrice(reservePrice)})`}
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-600">Total Bids</span>
                <span className="text-slate-900 font-bold">
                  {property.totalBids || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-600">Status</span>
                <span
                  className={`font-bold ${
                    isLiveNow
                      ? "text-green-600"
                      : isCompleted
                        ? "text-slate-600"
                        : "text-amber-600"
                  }`}
                >
                  {isLiveNow
                    ? "🟢 Live"
                    : isCompleted
                      ? "✅ Completed"
                      : "🟡 Not in live auction"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
          <FileText className="size-6 text-blue-600" />
          Property Description
        </h2>
        <p className="text-slate-700 leading-relaxed text-lg">
          {property.propertyDescription || "No description available."}
        </p>
      </div>

      {/* Key Features */}
      {features.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Sparkles className="size-6 text-purple-600" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
              >
                <CheckCircle className="size-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property Videos */}
      {(property?.media?.propertyVideos?.length > 0 || property?.media?.propertyVideo) && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="size-6 text-blue-600" />
            Property Videos
          </h2>
          <div className="space-y-4">
            {(property.media?.propertyVideos || (property.media?.propertyVideo ? [property.media.propertyVideo] : [])).map((vid: string, i: number) => (
              <div
                key={i}
                className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200"
              >
                {/* Video player */}
                <video
                  src={mediaUrl(vid)}
                  controls
                  className="w-full"
                />

                {/* Watermark overlay - bottom right */}
                {/* Pointer events none so video controls work */}
                <div
                  className="absolute bottom-12 right-4 pointer-events-none select-none z-10"
                >
                  <div
                    className="flex flex-col items-end"
                    style={{ opacity: 0.75 }}
                  >
                    {/* Main text with dark shadow for readability */}
                    <span
                      style={{
                        fontFamily: "'Arial Black', Arial, sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(10px, 1.8vw, 18px)",
                        color: "rgba(255,255,255,0.90)",
                        letterSpacing: "2px",
                        textShadow:
                          "1px 1px 3px rgba(0,0,0,0.8), " +
                          "-1px -1px 3px rgba(0,0,0,0.8), " +
                          "1px -1px 3px rgba(0,0,0,0.8), " +
                          "-1px 1px 3px rgba(0,0,0,0.8)",
                        lineHeight: 1.2,
                      }}
                    >
                      ♛ KING PROPERTY AUCTION
                    </span>
                    {/* Website URL below */}
                    <span
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(8px, 1.2vw, 13px)",
                        color: "rgba(255,215,0,0.90)",
                        letterSpacing: "1px",
                        textShadow:
                          "1px 1px 2px rgba(0,0,0,0.8), " +
                          "-1px -1px 2px rgba(0,0,0,0.8)",
                        lineHeight: 1.2,
                      }}
                    >
                      kingpropertyauction.com
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor Plans */}
      {(property?.media?.floorPlans?.length > 0 || property?.media?.floorPlan) && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="size-6 text-green-600" />
            Floor Plans
          </h2>
          <div className="space-y-4">
            {(property.media?.floorPlans || (property.media?.floorPlan ? [property.media.floorPlan] : [])).map((fp: string, i: number) => (
              fp.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  key={i}
                  src={mediaUrl(fp)}
                  alt={`Floor Plan ${i + 1}`}
                  className="w-full rounded-2xl border-2 border-slate-200"
                />
              ) : (
                <a
                  key={i}
                  href={mediaUrl(fp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 font-bold hover:bg-green-100 transition-colors w-fit"
                >
                  <FileText className="size-5" /> Floor Plan {i + 1}
                </a>
              )
            ))}
          </div>
        </div>
      )}

      {/* Legal Documents */}
      {property?.media?.legalDocuments?.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="size-6 text-purple-600" />
            Legal Documents
          </h2>
          <p className="text-slate-600 font-medium mb-4">
            Review the legal documents before bidding.
          </p>
          <div className="space-y-3">
            {(Array.isArray(property.media.legalDocuments)
              ? property.media.legalDocuments
              : property.media.legalDocuments
                ? [property.media.legalDocuments]
                : []
            ).map((doc: string, i: number) => (
              <a
                key={i}
                href={mediaUrl(doc)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-purple-50 border-2 border-purple-200 rounded-2xl text-purple-700 font-bold hover:bg-purple-100 transition-colors"
              >
                <FileText className="size-5 flex-shrink-0" />
                <span className="truncate">
                  Document {i + 1} — {doc.split("/").pop()}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bid History */}
      {isInLiveAuction && (
        <BidHistorySection
          show={showBidHistory}
          history={bidHistory}
          loading={loadingHistory}
          onToggle={onToggleBidHistory}
        />
      )}
    </div>
  );
}
