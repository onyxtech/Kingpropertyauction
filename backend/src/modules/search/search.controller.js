import Property from "../property/property.model.js";
import Auction from "../auction/auction.model.js";

export const universalSearch = async (req, res) => {
  try {
    const { q, type, minPrice, maxPrice, minBeds, maxBeds, location, status } =
      req.query;
    const results = { properties: [], auctions: [] };

    // Exclude sold properties from public search
    const propertyFilter = {
      approvalStatus: "approved",
      propertyStatus: { $ne: "sold" },
    };
    if (q) {
      const regex = new RegExp(q, "i");
      propertyFilter.$or = [
        { propertyTitle: regex },
        { propertyDescription: regex },
        { propertyType: regex },
        { "location.city": regex },
        { "location.area": regex },
        { "location.postalCode": regex },
        { "location.streetAddress": regex },
        { propertyID: regex },
      ];
    }
    if (location) propertyFilter["location.city"] = new RegExp(location, "i");
    if (minPrice || maxPrice) {
      const minP = minPrice ? parseInt(minPrice) : 0;
      const maxP = maxPrice ? parseInt(maxPrice) : 999999999;
      propertyFilter.$or = [
        { currentBid: { $gte: minP, $lte: maxP } },
        { soldPrice: { $gte: minP, $lte: maxP } },
        {
          $and: [
            { currentBid: { $exists: false } },
            { soldPrice: { $exists: false } },
            { "pricing.startingAuctionPrice": { $gte: minP, $lte: maxP } },
          ],
        },
      ];
    }
    if (minBeds || maxBeds) {
      propertyFilter["specifications.bedrooms"] = {};
      if (minBeds) {
        const min = minBeds === "6plus" ? 6 : parseInt(minBeds);
        propertyFilter["specifications.bedrooms"].$gte = min;
      }
      if (maxBeds) {
        const max = maxBeds === "6plus" ? 999 : parseInt(maxBeds);
        propertyFilter["specifications.bedrooms"].$lte = max;
      }
    }

    // ─── AUCTION FILTER (text + status only, no price/beds) ───
    const auctionFilter = {};
    // Default: exclude completed auctions unless user specifically selected a status
    if (!status || status === "all") {
      auctionFilter.status = { $in: ["live", "scheduled"] };
    }
    if (q) {
      const regex = new RegExp(q, "i");
      auctionFilter.$or = [
        { auctionTitle: regex },
        { auctionType: regex },
        { "venue.city": regex },
        { "venue.name": regex },
      ];
    }
    if (status && status !== "all") {
      auctionFilter.status = status;
    }

    // ─── Run queries ───
    if (!type || type === "all") {
      const [properties, auctions] = await Promise.all([
        Property.find(propertyFilter)
          .select(
            "propertyTitle slug propertyType pricing location media.propertyImages propertyStatus currentBid soldPrice specifications",
          )
          .sort("-createdAt")
          .limit(5)
          .lean(),
        Auction.find(auctionFilter)
          .select(
            "auctionTitle slug auctionType status startDateTime endDateTime totalLots totalBids totalBidders venue startingBid properties",
          )
          .sort("-startDateTime")
          .limit(5)
          .lean(),
      ]);
      results.properties = properties;
      results.auctions = auctions;
    } else if (type === "properties") {
      results.properties = await Property.find(propertyFilter)
        .select(
          "propertyTitle slug propertyType pricing location media.propertyImages propertyStatus currentBid soldPrice specifications",
        )
        .sort("-createdAt")
        .limit(8)
        .lean();
    } else if (type === "auctions") {
      results.auctions = await Auction.find(auctionFilter)
        .select(
          "auctionTitle slug auctionType status startDateTime endDateTime totalLots totalBids totalBidders venue startingBid properties",
        )
        .sort("-startDateTime")
        .limit(8)
        .lean();
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
