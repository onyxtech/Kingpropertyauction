import { Heart, MapPin, Bed, Bath, Maximize, Clock, Video, Share2, Award, ChevronRight, CheckCircle, AlertCircle, Gavel } from "lucide-react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import CountdownTimer from "../../shared/ui/CountdownTimer";

interface PropertyCardProps {
  property: any;
  auctionInfo: any;
  wishlisted: string[];
  onBid: (property: any) => void;
  onWishlist: (e: React.MouseEvent, id: string) => void;
  onShare: (e: React.MouseEvent, property: any) => void;
  onTour: (property: any) => void;
  onNavigate: (path: string) => void;
  onAuctionEnded: () => void;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

const getPropertyImage = (property: any) => {
  if (property.media?.propertyImages?.length > 0) {
    const img = property.media.propertyImages[0];
    if (img.startsWith("http")) return img;
    return img.startsWith("/uploads") ? img : `/uploads/properties/${img}`;
  }
  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600";
};

export default function PropertyCard({ property, auctionInfo, wishlisted, onBid, onWishlist, onShare, onTour, onNavigate, onAuctionEnded }: PropertyCardProps) {
  const isLiveRoomAuction = auctionInfo?.auctionType === "live";
  const isAuction = property.listingType === "auction" && auctionInfo !== null && auctionInfo?.status === "live" && !isLiveRoomAuction;
  const isScheduledAuction = property.listingType === "auction" && auctionInfo !== null && auctionInfo?.status === "scheduled";
  const auctionEndDate = isAuction && auctionInfo ? auctionInfo.endDateTime : null;
  const gradient = isAuction ? "from-red-500 to-orange-500" : "from-blue-500 to-cyan-500";
  const displayPrice = isAuction
    ? formatPrice(property.currentBid || property.pricing?.startingAuctionPrice || 0)
    : formatPrice(property.pricing?.reservePrice || property.pricing?.startingAuctionPrice || 0);
  const nextMinBid = isAuction
    ? (property.currentBid || property.pricing?.startingAuctionPrice || 0) + (property.pricing?.minimumBidIncrement || 1000)
    : 0;
  const reserveMet = isAuction ? (property.currentBid || 0) >= (property.pricing?.reservePrice || 0) : false;
  const reservePrice = property.pricing?.reservePrice || 0;
  const imageUrl = getPropertyImage(property);

  return (
    <div
      onClick={() => onNavigate(`/properties/${property.slug || property._id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-slate-200 hover:border-transparent group cursor-pointer hover:scale-[1.02] relative"
    >
      {property.featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      )}

      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={property.propertyTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {property.featured && (
          <div className="absolute top-4 left-4">
            <div className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black rounded-full flex items-center gap-1.5 shadow-xl">
              <Award className="size-4" />
              FEATURED
            </div>
          </div>
        )}

        {!property.featured && (
          <div className="absolute top-4 left-4">
            {property.listingType === "auction" ? (
              isLiveRoomAuction && auctionInfo?.status === "live" ? (
                <div className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl animate-pulse">
                  🏛️ Live Room
                </div>
              ) : isLiveRoomAuction && auctionInfo?.status === "scheduled" ? (
                <div className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl">
                  🏛️ Upcoming Live Room
                </div>
              ) : isAuction ? (
                <div className="px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl animate-pulse">
                  <Clock className="size-3" /> Live Auction
                </div>
              ) : isScheduledAuction ? (
                <div className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl">
                  <Clock className="size-3" /> Starts Soon
                </div>
              ) : auctionInfo && auctionInfo.status === "completed" ? (
                property.propertyStatus === "sold" ? (
                  <div className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-xl">🎉 Sold</div>
                ) : (
                  <div className="px-3 py-2 bg-gradient-to-r from-slate-500 to-slate-700 text-white text-xs font-bold rounded-full shadow-xl">Unsold</div>
                )
              ) : (
                <div className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl">
                  <Clock className="size-3" /> Upcoming Auction
                </div>
              )
            ) : (
              <div className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-xl">For Sale</div>
            )}
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => onWishlist(e, property._id)} className="size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all">
            <Heart className={`size-5 ${wishlisted.includes(property._id) ? "fill-red-500 text-red-500" : "text-red-500"}`} />
          </button>
          <button onClick={(e) => onShare(e, property)} className="size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all">
            <Share2 className="size-5 text-blue-600" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={(e) => { e.stopPropagation(); onTour(property); }}
            className="px-3 py-2 bg-black/70 backdrop-blur-md hover:bg-black/90 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xl transition-all hover:scale-110 cursor-pointer"
          >
            <Video className="size-4" /> 360° Virtual Tour
          </button>
        </div>

        {auctionEndDate && (
          <div className="absolute bottom-4 right-4">
            <CountdownTimer endDate={new Date(auctionEndDate)} compact={true} gradient={gradient} onEnded={onAuctionEnded} />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
            {property.propertyTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <MapPin className="size-4 text-blue-600" />
          <span className="text-sm font-medium">
            {property.location?.city || property.location?.area || "Location TBD"}, {property.location?.state || "UK"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Bed className="size-4 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-slate-900">{property.specifications?.bedrooms || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Bath className="size-4 text-purple-600" />
            </div>
            <span className="text-sm font-bold text-slate-900">{property.specifications?.bathrooms || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Maximize className="size-4 text-emerald-600" />
            </div>
            <span className="text-sm font-bold text-slate-900">{property.specifications?.totalArea?.toLocaleString() || "N/A"} sqft</span>
          </div>
        </div>

        {property.listingType === "auction" ? (
          isLiveRoomAuction ? (
            <div className="space-y-3">
              <p className="text-xs text-purple-600 font-semibold flex items-center gap-1">
                🏛️ {auctionInfo?.status === "live" ? "Live Room Auction — In Progress" : auctionInfo?.status === "completed" ? "Auction Completed" : "Upcoming Live Room Auction"}
              </p>
              {auctionInfo?.venue?.name && <p className="text-xs text-slate-600 font-medium">📍 {auctionInfo.venue.name}</p>}
              {(auctionInfo?.status === "scheduled" || auctionInfo?.status === "live") && auctionInfo && (
                <AuctionTimer startDateTime={auctionInfo.startDateTime} endDateTime={auctionInfo.endDateTime} status={auctionInfo.status} />
              )}
              {auctionInfo?.status === "scheduled" ? (
                <a href="/view-live-locations" onClick={(e) => e.stopPropagation()} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                  Register to Attend
                </a>
              ) : auctionInfo?.status === "live" ? (
                <div className="w-full py-3.5 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse">🔴 Live at Venue</div>
              ) : auctionInfo?.status === "completed" ? (
                property.propertyStatus === "sold" ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-green-600">🎉 Sold — £{(property.soldPrice || property.currentBid || 0).toLocaleString()}</p>
                    <button onClick={(e) => { e.stopPropagation(); onNavigate(`/properties/${property.slug || property._id}`); }} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">View Results</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500">❌ Unsold</p>
                    <button onClick={(e) => { e.stopPropagation(); onNavigate(`/properties/${property.slug || property._id}`); }} className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-all">View Details</button>
                  </div>
                )
              ) : null}
            </div>
          ) : isAuction ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Current Bid</span>
                {property.totalBids > 0 && <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{property.totalBids} bids</span>}
              </div>
              <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{displayPrice}</p>
              {reservePrice > 0 && (
                <div className={`flex items-center gap-1.5 text-xs font-bold ${reserveMet ? "text-green-600" : "text-amber-600"}`}>
                  {reserveMet ? <CheckCircle className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                  {reserveMet ? "Reserve Met" : "Reserve Not Met"}
                </div>
              )}
              {nextMinBid > 0 && <p className="text-xs text-slate-500">Next min bid: <span className="font-bold text-slate-700">£{nextMinBid.toLocaleString()}</span></p>}
              <button className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2" onClick={(e) => { e.stopPropagation(); onBid(property); }}>
                <Gavel className="size-4" /> Place Bid
              </button>
            </div>
          ) : isScheduledAuction ? (
            <div className="space-y-3">
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1"><Clock className="size-3" /> Auction Starting Soon</p>
              <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(property.pricing?.startingAuctionPrice || 0)}</p>
              {auctionInfo && <AuctionTimer startDateTime={auctionInfo.startDateTime} endDateTime={auctionInfo.endDateTime} status={auctionInfo.status} />}
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2" onClick={(e) => { e.stopPropagation(); onNavigate(`/properties/${property.slug || property._id}`); }}>
                View Details <ChevronRight className="size-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-amber-600 font-semibold">⏳ This property is not yet in a live auction</p>
              <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(property.pricing?.startingAuctionPrice || 0)}</p>
              <button className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2" onClick={(e) => { e.stopPropagation(); onNavigate(`/properties/${property.slug || property._id}`); }}>
                View Details <ChevronRight className="size-4" />
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{displayPrice}</p>
            <button
              className="w-full py-3.5 border-gradient bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-border text-slate-900 rounded-xl font-bold hover:bg-gradient-to-r hover:text-white transition-all flex items-center justify-center gap-2 border-2"
              onClick={(e) => { e.stopPropagation(); onNavigate(`/properties/${property.slug || property._id}`); }}
            >
              View Details <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
