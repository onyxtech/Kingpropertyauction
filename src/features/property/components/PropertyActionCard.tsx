import { CheckCircle, Clock, Tag, Gavel, Phone, MessageSquare } from "lucide-react";

interface PropertyActionCardProps {
  property: any;
  matchingAuction: any;
  isLiveNow: boolean;
  isCompleted: boolean;
  isAuctionType: boolean;
  isInLiveAuction: boolean;
  isDirectSale: boolean;
  currentBid: number;
  startingPrice: number;
  buyNowPrice: number;
  formatPrice: (val: number) => string;
  onPlaceBid: () => void;
  onNavigate: (path: string) => void;
  onEnquire: () => void;
  isOwnProperty?: boolean;
}

export default function PropertyActionCard({
  property,
  matchingAuction,
  isLiveNow,
  isCompleted,
  isAuctionType,
  isInLiveAuction,
  isDirectSale,
  currentBid,
  startingPrice,
  buyNowPrice,
  formatPrice,
  onPlaceBid,
  onNavigate,
  onEnquire,
  isOwnProperty = false,
}: PropertyActionCardProps) {
  const handleDownloadBrochure = () => {
    const lines = [
      `PROPERTY BROCHURE`,
      `=================`,
      ``,
      `Title: ${property.propertyTitle || "N/A"}`,
      `Type: ${property.propertyType || "N/A"}`,
      `Category: ${property.propertyCategory || "N/A"}`,
      ``,
      `LOCATION`,
      `--------`,
      `Address: ${property.location?.streetAddress || "N/A"}`,
      `City: ${property.location?.city || "N/A"}`,
      `State: ${property.location?.state || "N/A"}`,
      `Postcode: ${property.location?.postalCode || "N/A"}`,
      `Country: ${property.location?.country || "United Kingdom"}`,
      ``,
      `SPECIFICATIONS`,
      `--------------`,
      `Bedrooms: ${property.specifications?.bedrooms ?? "N/A"}`,
      `Bathrooms: ${property.specifications?.bathrooms ?? "N/A"}`,
      `Floors: ${property.specifications?.floors ?? "N/A"}`,
      `Year Built: ${property.specifications?.yearBuilt ?? "N/A"}`,
      `Parking Spaces: ${property.specifications?.parkingSpaces ?? "N/A"}`,
      `Furnished: ${property.specifications?.furnishedStatus || "N/A"}`,
      ``,
      `PRICING`,
      `-------`,
      `Starting Price: £${(startingPrice || 0).toLocaleString()}`,
      `Current Bid: £${(currentBid || 0).toLocaleString()}`,
      buyNowPrice > 0 ? `Buy Now Price: £${buyNowPrice.toLocaleString()}` : "",
      ``,
      `LEGAL`,
      `-----`,
      `Ownership Type: ${property.legalInfo?.ownershipType || "N/A"}`,
      ``,
      `DESCRIPTION`,
      `-----------`,
      property.propertyDescription || "N/A",
    ].filter((l) => l !== undefined).join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(property.propertyTitle || "property").replace(/\s+/g, "-").toLowerCase()}-brochure.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Gradient Action Card */}
      <div
        className={`rounded-3xl p-8 shadow-2xl sticky top-24 z-10 ${
          isLiveNow
            ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"
            : isCompleted
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"
              : isAuctionType
                ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"
                : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
        }`}
      >
        <div className="text-center mb-6">
          {isLiveNow ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
              <span className="size-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-bold text-white">Live Auction</span>
            </div>
          ) : isCompleted ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
              <CheckCircle className="size-5 text-white" />
              <span className="text-sm font-bold text-white">
                Auction Completed
              </span>
            </div>
          ) : isAuctionType ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
              <Clock className="size-5 text-yellow-300" />
              <span className="text-sm font-bold text-white">
                Upcoming Auction
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full mb-4">
              <Tag className="size-5 text-white" />
              <span className="text-sm font-bold text-white">For Sale</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
            <div className="text-2xl font-black text-white">0</div>
            <div className="text-xs font-semibold text-white/80">Views</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
            <div className="text-2xl font-black text-white">0</div>
            <div className="text-xs font-semibold text-white/80">Saved</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
            <div className="text-2xl font-black text-white">
              {property.totalBids || 0}
            </div>
            <div className="text-xs font-semibold text-white/80">Bids</div>
          </div>
        </div>

        <div className="space-y-3">
          {isLiveNow ? (
            <>
              {isOwnProperty ? (
                <div className="w-full py-4 bg-white/10 border-2 border-white/30 rounded-xl text-center">
                  <p className="text-white/80 font-bold text-sm">🏠 This is your property</p>
                  <p className="text-white/60 text-xs mt-1">You cannot bid on your own listing</p>
                </div>
              ) : (
                <button
                  onClick={onPlaceBid}
                  className="w-full py-4 bg-white text-blue-600 rounded-xl font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <Gavel className="size-6" />
                  Place Bid
                </button>
              )}
            </>
          ) : isCompleted ? (
            <>
              {property.propertyStatus === "sold" ? (
                <div className="bg-white/20 rounded-2xl p-4 text-center text-white border-2 border-white/30">
                  <p className="text-sm text-white/80 mb-1">🎉 SOLD</p>
                  <p className="text-4xl font-black">
                    £
                    {(
                      property.soldPrice ||
                      property.currentBid ||
                      0
                    ).toLocaleString()}
                  </p>
                  {property.soldTo && (
                    <p className="text-xs text-white/70 mt-2">
                      Winner ID:{" "}
                      {typeof property.soldTo === "object"
                        ? property.soldTo.name
                        : property.soldTo.toString().slice(-6)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-white/20 rounded-2xl p-4 text-center text-white border-2 border-white/30">
                  <p className="text-sm text-white/80 mb-1">❌ UNSOLD</p>
                  <p className="text-lg font-bold">Reserve Not Met</p>
                  <p className="text-xs text-white/70 mt-2">
                    Highest Bid: £{(property.currentBid || 0).toLocaleString()}{" "}
                    | Reserve: £
                    {(property.pricing?.reservePrice || 0).toLocaleString()}
                  </p>
                </div>
              )}
              <button
                onClick={() =>
                  onNavigate(`/auctions/${matchingAuction.slug}`)
                }
                className="w-full py-4 bg-white/20 text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                View Auction Results
              </button>
            </>
          ) : isAuctionType ? (
            <>
              <p className="text-white/80 text-sm text-center py-2">
                This property is not currently in a live auction.
              </p>
              <button
                onClick={() => onNavigate("/auctions")}
                className="w-full py-4 bg-white/20 text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                View Live Auctions
              </button>
            </>
          ) : (
            <>
              <div className="bg-white/20 rounded-2xl p-4 text-center text-white">
                <p className="text-3xl font-black">{formatPrice(startingPrice)}</p>
                <p className="text-sm text-white/80">Asking Price</p>
              </div>
              {buyNowPrice > 0 && (
                <div className="bg-white/20 rounded-2xl p-4 text-center text-white">
                  <p className="text-3xl font-black">
                    {formatPrice(buyNowPrice)}
                  </p>
                  <p className="text-sm text-white/80">Buy Now Price</p>
                </div>
              )}
            </>
          )}
          <button
            onClick={handleDownloadBrochure}
            className="w-full py-4 bg-white/20 text-white border-2 border-white/40 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
          >
            Download Brochure
          </button>
        </div>
      </div>

      {/* Agent Contact Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-white/60">
        <h3 className="text-xl font-black text-slate-900 mb-4">
          Contact Agent
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xl">
            {(property.sellerInfo?.agentName || "A")?.charAt(0)}
          </div>
          <div>
            <div className="font-black text-slate-900 text-lg">
              {property.sellerInfo?.agentName || "Agent"}
            </div>
            <div className="text-sm text-slate-600 font-semibold">
              Property Agent
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {property.sellerInfo?.agentContact && (
            <a
              href={`tel:${property.sellerInfo.agentContact}`}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:scale-105 transition-all"
            >
              <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Phone className="size-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">
                {property.sellerInfo.agentContact}
              </span>
            </a>
          )}
          {/* Enquiry Button */}
          <button
            onClick={onEnquire}
            className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 rounded-xl transition-all hover:scale-105 group"
          >
            <div className="size-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare className="size-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-black text-slate-900 text-sm">Enquire About This Property</p>
              <p className="text-xs text-slate-500 font-medium">Get more details from the agent</p>
            </div>
          </button>
        </div>
      </div>

      {/* Property Information Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-white/60">
        <h3 className="text-xl font-black text-slate-900 mb-4">
          Property Information
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Tenure",
              value: property.legalInfo?.ownershipType || "N/A",
            },
            {
              label: "Property Type",
              value:
                property.propertyType?.charAt(0).toUpperCase() +
                  property.propertyType?.slice(1) || "N/A",
            },
            {
              label: "Category",
              value:
                property.propertyCategory?.charAt(0).toUpperCase() +
                  property.propertyCategory?.slice(1) || "N/A",
            },
            {
              label: "Year Built",
              value: property.specifications?.yearBuilt || "N/A",
            },
            {
              label: "Floors",
              value: property.specifications?.floors || "N/A",
            },
            {
              label: "Furnished",
              value: property.specifications?.furnishedStatus || "N/A",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0"
            >
              <span className="text-slate-600 font-semibold">{item.label}</span>
              <span className="font-bold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
