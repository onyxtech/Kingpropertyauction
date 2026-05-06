import Joi from "joi";

// Helper: allow empty strings for optional fields
const optionalString = () => Joi.string().allow("", null).optional();
const optionalNumber = () => Joi.number().allow("", null).optional();

export const createPropertySchema = Joi.object({
  propertyTitle: Joi.string().trim().max(200).required(),
  propertyDescription: Joi.string().max(5000).required(),
  propertyType: Joi.string()
    .valid("house", "apartment", "land", "commercial", "farmhouse")
    .required(),
  propertyCategory: Joi.string()
    .valid("residential", "commercial", "industrial")
    .required(),
  listingType: Joi.string().valid("auction", "direct_sale").default("auction"),
  propertyStatus: Joi.string()
    .valid("available", "sold", "pending")
    .default("available"),
  propertyID: optionalString(),

  location: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    area: Joi.string().required(),
    streetAddress: Joi.string().required(),
    postalCode: Joi.string().required(),
    latitude: optionalString(),
    longitude: optionalString(),
  }).required(),

  specifications: Joi.object({
    totalArea: Joi.number().required(),
    landArea: optionalNumber(),
    coveredArea: optionalNumber(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    floors: optionalNumber(),
    yearBuilt: optionalNumber(),
    parkingSpaces: optionalNumber(),
    furnishedStatus: Joi.string()
      .valid("unfurnished", "semi-furnished", "fully-furnished")
      .default("unfurnished"),
  }).required(),

  media: Joi.object({
    propertyImages: Joi.array().items(Joi.string()).optional(),
    propertyVideo: Joi.string().optional(),
    virtualTour: Joi.string().optional(),
    floorPlan: Joi.string().optional(),
    legalDocuments: Joi.array().items(Joi.string()).optional(),
  }).optional(),

  pricing: Joi.object({
    currency: Joi.string().valid("GBP", "USD", "EUR").default("GBP"),
    startingAuctionPrice: Joi.number().required(),
    reservePrice: Joi.number().required(),
    buyNowPrice: optionalNumber(),
    minimumBidIncrement: Joi.number().required(),
    estimatedMarketValue: optionalNumber(),
  }).required(),

  auctionDetails: Joi.object({
    auctionStartDate: Joi.date().iso().required(),
    auctionEndDate: Joi.date().iso().required(),
    auctionStatus: Joi.string()
      .valid("upcoming", "live", "closed")
      .default("upcoming"),
    bidDepositAmount: optionalNumber(),
    autoBidEnabled: Joi.boolean().default(false),
    maximumBidLimit: optionalNumber(),
    numberOfBidders: Joi.number().default(0),
  }).required(),

  features: Joi.object({
    garden: Joi.boolean().default(false),
    swimmingPool: Joi.boolean().default(false),
    balcony: Joi.boolean().default(false),
    airConditioning: Joi.boolean().default(false),
    securitySystem: Joi.boolean().default(false),
    elevator: Joi.boolean().default(false),
    gym: Joi.boolean().default(false),
    solarSystem: Joi.boolean().default(false),
  }).default(),

  legalInfo: Joi.object({
    ownershipType: Joi.string()
      .valid("freehold", "leasehold", "shared")
      .required(),
    titleDeedNumber: optionalString(),
    propertyTaxInfo: optionalString(),
    mortgageStatus: Joi.string()
      .valid("clear", "mortgaged", "partially_paid")
      .default("clear"),
    zoningType: optionalString(),
  }).required(),

  sellerInfo: Joi.object({
    sellerName: Joi.string().required(),
    sellerContact: Joi.string().required(),
    sellerEmail: Joi.string().email().required(),
    agentName: optionalString(),
    agentContact: optionalString(),
  }).required(),

  approvalStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
});

export const updatePropertySchema = createPropertySchema.fork(
  Object.keys(createPropertySchema.describe().keys),
  (schema) => schema.optional(),
);
