import {
  CheckCircle,
  Clock,
  Tag,
  Gavel,
  Phone,
  MessageSquare,
} from "lucide-react";
import { jsPDF } from "jspdf";

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
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxY = pageHeight - margin;

    const line = (text: string, size = 11, bold = false) => {
      // Check if we need a new page
      if (y > maxY) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const split = doc.splitTextToSize(text || "N/A", 170);
      doc.text(split, 20, y);
      y += split.length * size * 0.5;
      y += 4;
    };

    const divider = () => {
      if (y > maxY) {
        doc.addPage();
        y = margin;
      }
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      doc.line(20, y, 190, y);
      y += 6;
    };

    const sectionTitle = (title: string) => {
      if (y + 15 > maxY) {
        doc.addPage();
        y = margin;
      }
      y += 2;
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(20, y - 2, 170, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, 25, y + 4);
      doc.setTextColor(0, 0, 0);
      y += 14;
    };

    // ─── HEADER ────────────────────────────────
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("KING PROPERTY AUCTION", 20, y);
    y += 8;
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text("Property Brochure", 20, y);
    y += 12;
    doc.setTextColor(0);
    divider();

    // ─── BASIC INFO ────────────────────────────
    sectionTitle("PROPERTY DETAILS");
    line(`Title: ${property?.propertyTitle || "N/A"}`, 13, true);
    line(
      `Property ID: ${property?.propertyID || property?._id?.slice(-6) || "N/A"}`,
    );
    line(
      `Type: ${property?.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : "N/A"}`,
    );
    line(
      `Category: ${property?.propertyCategory ? property.propertyCategory.charAt(0).toUpperCase() + property.propertyCategory.slice(1) : "N/A"}`,
    );
    line(
      `Listing Type: ${property?.listingType === "auction" ? "Auction" : "Direct Sale"}`,
    );
    line(
      `Status: ${property?.propertyStatus ? property.propertyStatus.charAt(0).toUpperCase() + property.propertyStatus.slice(1) : "N/A"}`,
    );
    divider();

    // ─── LOCATION ──────────────────────────────
    sectionTitle("LOCATION");
    const loc = property?.location || {};
    line(`Address: ${loc.streetAddress || "N/A"}`);
    line(`Area: ${loc.area || "N/A"}`);
    line(`City: ${loc.city || "N/A"}`);
    line(`State: ${loc.state || "N/A"}`);
    line(`Postcode: ${loc.postalCode || "N/A"}`);
    line(`Country: ${loc.country || "N/A"}`);
    if (loc.latitude && loc.longitude)
      line(`Coordinates: ${loc.latitude}, ${loc.longitude}`);
    divider();

    // ─── SPECIFICATIONS ────────────────────────
    sectionTitle("SPECIFICATIONS");
    const specs = property?.specifications || {};
    line(`Total Area: ${specs.totalArea ? specs.totalArea + " sq ft" : "N/A"}`);
    line(`Bedrooms: ${specs.bedrooms || "N/A"}`);
    line(`Bathrooms: ${specs.bathrooms || "N/A"}`);
    line(`Floors: ${specs.floors || "N/A"}`);
    line(`Year Built: ${specs.yearBuilt || "N/A"}`);
    line(`Parking: ${specs.parkingSpaces || "N/A"} spaces`);
    line(`Furnished: ${specs.furnishedStatus || "N/A"}`);
    divider();

    // ─── PRICING ───────────────────────────────
    sectionTitle("PRICING");
    const pricing = property?.pricing || {};
    line(`Currency: ${pricing.currency || "GBP"}`);
    line(
      `Starting Price: £${(pricing.startingAuctionPrice || 0).toLocaleString()}`,
    );
    line(`Reserve Price: £${(pricing.reservePrice || 0).toLocaleString()}`);
    if (pricing.buyNowPrice)
      line(`Buy Now Price: £${pricing.buyNowPrice.toLocaleString()}`);
    line(
      `Minimum Bid Increment: £${(pricing.minimumBidIncrement || 0).toLocaleString()}`,
    );
    if (pricing.estimatedMarketValue)
      line(
        `Est. Market Value: £${pricing.estimatedMarketValue.toLocaleString()}`,
      );
    divider();

    // ─── AUCTION DETAILS ───────────────────────
    const auction = property?.auctionDetails || {};
    if (auction.auctionStartDate || auction.auctionEndDate) {
      sectionTitle("AUCTION DETAILS");
      if (auction.auctionStartDate)
        line(
          `Start Date: ${new Date(auction.auctionStartDate).toLocaleString()}`,
        );
      if (auction.auctionEndDate)
        line(`End Date: ${new Date(auction.auctionEndDate).toLocaleString()}`);
      line(`Status: ${auction.auctionStatus || "N/A"}`);
      if (auction.bidDepositAmount)
        line(`Bid Deposit: £${auction.bidDepositAmount.toLocaleString()}`);
      line(`Auto Bidding: ${auction.autoBidEnabled ? "Enabled" : "Disabled"}`);
      divider();
    }

    // ─── FEATURES ──────────────────────────────
    const features = property?.features || {};
    const featureKeys = Object.keys(features);
    if (featureKeys.length > 0) {
      sectionTitle("FEATURES & AMENITIES");
      featureKeys.forEach((key) => {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase());
        line(`${features[key] ? "✔" : "✘"} ${label}`);
      });
      divider();
    }

    // ─── LEGAL INFO ────────────────────────────
    const legal = property?.legalInfo || {};
    if (legal.ownershipType || legal.titleDeedNumber) {
      sectionTitle("LEGAL INFORMATION");
      line(
        `Ownership: ${legal.ownershipType ? legal.ownershipType.charAt(0).toUpperCase() + legal.ownershipType.slice(1) : "N/A"}`,
      );
      line(`Title Deed: ${legal.titleDeedNumber || "N/A"}`);
      if (legal.propertyTaxInfo) line(`Tax Info: ${legal.propertyTaxInfo}`);
      line(`Mortgage Status: ${legal.mortgageStatus || "N/A"}`);
      if (legal.zoningType) line(`Zoning: ${legal.zoningType}`);
      divider();
    }

    // ─── SELLER/AGENT INFO ─────────────────────
    const seller = property?.sellerInfo || {};
    if (seller.sellerName || seller.agentName) {
      sectionTitle("CONTACT INFORMATION");
      if (seller.agentName) line(`Agent: ${seller.agentName}`);
      if (seller.agentContact) line(`Agent Contact: ${seller.agentContact}`);
      if (seller.sellerName) line(`Seller: ${seller.sellerName}`);
      if (seller.sellerEmail) line(`Seller Email: ${seller.sellerEmail}`);
      divider();
    }

    // ─── MEDIA ─────────────────────────────────
    const media = property?.media || {};
    const images = media.propertyImages || [];
    if (images.length > 0 || media.propertyVideo || media.floorPlan) {
      sectionTitle("MEDIA");
      if (images.length > 0) line(`Property Images: ${images.length} image(s)`);
      if (media.propertyVideo) line(`Video Tour: Available`);
      if (media.virtualTour) line(`Virtual Tour: ${media.virtualTour}`);
      if (media.floorPlan) line(`Floor Plan: Available`);
      const docs = media.legalDocuments
        ? Array.isArray(media.legalDocuments)
          ? media.legalDocuments
          : [media.legalDocuments]
        : [];
      if (docs.length > 0) line(`Legal Documents: ${docs.length} document(s)`);
      divider();
    }

    // ─── DESCRIPTION ───────────────────────────
    sectionTitle("DESCRIPTION");
    line(property?.propertyDescription || "No description provided.", 11);
    divider();

    // ─── BIDDING INFO ──────────────────────────
    sectionTitle("CURRENT BIDDING STATUS");
    line(`Current Bid: £${(property?.currentBid || 0).toLocaleString()}`);
    line(`Total Bids: ${property?.totalBids || 0}`);
    divider();

    // ─── FOOTER ────────────────────────────────
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text(
      "King Property Auction - kingpropertyauction.com",
      20,
      pageHeight - 15,
    );
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`,
      20,
      pageHeight - 10,
    );

    const filename = `${(property?.propertyTitle || "property").replace(/\s+/g, "-").toLowerCase()}-brochure.pdf`;
    doc.save(filename);
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
                  <p className="text-white/80 font-bold text-sm">
                    🏠 This is your property
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    You cannot bid on your own listing
                  </p>
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
                onClick={() => onNavigate(`/auctions/${matchingAuction.slug}`)}
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
                <p className="text-3xl font-black">
                  {formatPrice(startingPrice)}
                </p>
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
              <p className="font-black text-slate-900 text-sm">
                Enquire About This Property
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Get more details from the agent
              </p>
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
