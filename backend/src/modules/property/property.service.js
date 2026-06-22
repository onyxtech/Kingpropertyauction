import Property from "./property.model.js";
import notificationService, {
  NotificationEvents,
} from "../notifications/trigger.service.js";
import Auction from "../auction/auction.model.js";
import cache from "../../utils/cache.js";

export const createProperty = async (propertyData, userId) => {
  const property = await Property.create({
    ...propertyData,
    createdBy: userId,
    currentBid: propertyData.pricing?.startingAuctionPrice || 0, // Initialize currentBid
  });
  // Notify admin
  notificationService
    .emit(NotificationEvents.PROPERTY_SUBMITTED, {
      propertyId: property._id,
      userId,
    })
    .catch((e) => console.error("Property submitted event failed:", e.message));

  await cache.delPattern("properties:*");
  return property;
};

export const getProperties = async (query = {}) => {
  const cacheKey = `properties:${JSON.stringify(query)}`;
  if (!query.noCache) {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
  }

  const {
    page = 1,
    limit = 10,
    status,
    type,
    category,
    listingType,
    city,
    auctionStatus,
    sortBy = "-createdAt",
    minPrice,
    maxPrice,
    minBeds,
    maxBeds,
  } = query;

    console.log("🔍 FILTER PARAMS:", { minPrice, maxPrice, minBeds, maxBeds, type: query.type, search: query.search });

  const filter = {};

  if (status)
    filter.propertyStatus = status.includes(",")
      ? { $in: status.split(",").map((s) => s.trim()) }
      : status;
  if (type) filter.propertyType = type;

  // If approvalStatus is 'all', don't add filter → shows all statuses
  if (query.approvalStatus && query.approvalStatus !== "all") {
    filter.approvalStatus = query.approvalStatus;
  } else if (!query.approvalStatus || query.approvalStatus === "") {
    filter.approvalStatus = "approved";
  }
  if (category) filter.propertyCategory = category;
  if (listingType) filter.listingType = listingType;
  if (city) filter["location.city"] = city;


  // Search filter
  if (query.search) {
    const searchWords = query.search.split(/[\s,]+/).filter(w => w.length > 1);
    const searchRegex = new RegExp(searchWords.join("|"), "i");
    filter.$or = [
      { "location.city": searchRegex },
      { "location.area": searchRegex },
      { "location.postalCode": searchRegex },
    ];
  }

  if (query.location) {
    filter["location.city"] = new RegExp(query.location, "i");
  }
  if (auctionStatus) filter["auctionDetails.auctionStatus"] = auctionStatus;
  if (query.excludeSold === "true") {
    filter.propertyStatus = { $ne: "sold" };
  }

  // Price filter - use currentBid only (not starting price)
  if (minPrice || maxPrice) {
    filter.currentBid = {};
    if (minPrice) filter.currentBid.$gte = parseInt(minPrice);
    if (maxPrice) filter.currentBid.$lte = parseInt(maxPrice);
  }

  // Beds filter
  if (minBeds || maxBeds) {
    filter["specifications.bedrooms"] = {};
    if (minBeds) filter["specifications.bedrooms"].$gte = parseInt(minBeds);
    if (maxBeds) filter["specifications.bedrooms"].$lte = parseInt(maxBeds);
  }



  if (query.auctionSlug) {
    // Find the auction by slug, then filter properties by its property IDs
    const Auction = (await import("../auction/auction.model.js")).default;
    const auction = await Auction.findOne({ slug: query.auctionSlug });
    if (auction) {
      filter._id = { $in: auction.properties };
    }
  }

  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .select(
        "propertyTitle slug propertyType listingType propertyStatus approvalStatus location pricing specifications media auctionDetails currentBid totalBids featured soldPrice soldTo createdBy winningBidder createdAt updatedAt legalInfo propertyID propertyDescription",
      )
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email phone agentDetails")
      .populate("winningBidder", "name email"),
    Property.countDocuments(filter),
  ]);

  const result = {
    properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };

  // Cache for 10 seconds (short TTL — bids and status change frequently)
  await cache.set(cacheKey, result, 10);

  return result;
};

export const getPropertyById = async (id) => {
  const cacheKey = `property:${id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const property = await Property.findById(id).populate(
    "createdBy",
    "name email phone address",
  );
  if (!property) throw new Error("Property not found");

  await cache.set(cacheKey, property, 10);
  return property;
};

export const updateProperty = async (id, updateData) => {
  // If starting price changed and no bids yet, sync currentBid
  if (updateData.pricing?.startingAuctionPrice) {
    const existing = await Property.findById(id);
    if (existing && (!existing.totalBids || existing.totalBids === 0)) {
      updateData.currentBid = Number(updateData.pricing.startingAuctionPrice);
    }
  }

  const property = await Property.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!property) throw new Error("Property not found");
  await cache.delPattern("properties:*");
  await cache.del(`property:${id}`);
  return property;
};

export const deleteProperty = async (id) => {
  const property = await Property.findByIdAndDelete(id);
  if (!property) throw new Error("Property not found");

  // Remove this property from all auctions that reference it
  await Auction.updateMany({ properties: id }, { $pull: { properties: id } });

  await cache.delPattern("properties:*");
  await cache.del(`property:${id}`);

  return property;
};

export const approveProperty = async (id, status) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { approvalStatus: status },
    { new: true },
  );
  if (!property) throw new Error("Property not found");
  return property;
};
