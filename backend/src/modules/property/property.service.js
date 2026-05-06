import Property from "./property.model.js";

export const createProperty = async (propertyData, userId) => {
  const property = await Property.create({
    ...propertyData,
    createdBy: userId,
    currentBid: propertyData.pricing?.startingAuctionPrice || 0, // Initialize currentBid
  });
  return property;
};

export const getProperties = async (query = {}) => {
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
  } = query;

  const filter = {};

  if (status) filter.propertyStatus = status;
  if (type) filter.propertyType = type;
  // Public queries default to approved only; admins can override by passing approvalStatus explicitly
  if (query.approvalStatus) {
    filter.approvalStatus = query.approvalStatus;
  } else {
    filter.approvalStatus = "approved";
  }
  if (category) filter.propertyCategory = category;
  if (listingType) filter.listingType = listingType;
  if (city) filter["location.city"] = city;
  if (auctionStatus) filter["auctionDetails.auctionStatus"] = auctionStatus;

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
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email"),
    Property.countDocuments(filter),
  ]);

  return {
    properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getPropertyById = async (id) => {
  const property = await Property.findById(id).populate(
    "createdBy",
    "name email",
  );
  if (!property) throw new Error("Property not found");
  return property;
};

export const updateProperty = async (id, updateData) => {
  const property = await Property.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!property) throw new Error("Property not found");
  return property;
};

export const deleteProperty = async (id) => {
  const property = await Property.findByIdAndDelete(id);
  if (!property) throw new Error("Property not found");
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
