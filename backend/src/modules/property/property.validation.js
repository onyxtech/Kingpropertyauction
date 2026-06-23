import Joi from "joi";

// Helper: allow empty strings for optional fields
const optionalString = () => Joi.string().allow("", null).optional();
const optionalNumber = () => Joi.number().allow("", null).optional();

export const createPropertySchema = Joi.object({
  propertyTitle: Joi.string().trim().max(200).required(),
  propertyDescription: Joi.string().max(5000).required(),
  propertyType: Joi.string()
    .valid("house", "apartment", "land", "commercial", "farmhouse", "villa")
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
  }).required(),

  specifications: Joi.object({
    bedrooms: Joi.number().integer().min(0).max(50).required(),
    bathrooms: Joi.number().integer().min(0).max(50).required(),
    floors: Joi.number().integer().min(0).max(200).allow("", null).optional(),
    yearBuilt: Joi.number()
      .integer()
      .min(1800)
      .max(new Date().getFullYear())
      .allow("", null)
      .optional(),
    parkingSpaces: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .allow("", null)
      .optional(),
    furnishedStatus: Joi.string()
      .valid("unfurnished", "semi-furnished", "fully-furnished")
      .default("unfurnished"),
  }).required(),

  media: Joi.object({
    propertyImages: Joi.array().items(Joi.string()).optional(),
    propertyVideos: Joi.array().items(Joi.string()).optional(),
    floorPlans: Joi.array().items(Joi.string()).optional(),
    virtualTour: Joi.string().optional().allow("", null),
    legalDocuments: Joi.array().items(Joi.string()).optional(),
  }).optional(),

  pricing: Joi.object({
    currency: Joi.string().valid("GBP", "USD", "EUR").default("GBP"),
    startingAuctionPrice: Joi.number().min(1).required(),
    reservePrice: Joi.number().min(1).required(),
    buyNowPrice: optionalNumber().min(1),
    minimumBidIncrement: Joi.number().min(100).required(),
    estimatedMarketValue: optionalNumber().min(1),
  }).required(),

  auctionDetails: Joi.object({
    auctionStatus: Joi.string()
      .valid("upcoming", "live", "closed")
      .default("upcoming"),
    bidDepositAmount: optionalNumber(),
    autoBidEnabled: Joi.boolean().default(false),
    maximumBidLimit: optionalNumber(),
  }).optional(),

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
    titleDeedNumber: Joi.string().allow("").optional(),
    solicitorDetails: Joi.object({
      name: Joi.string().allow("").optional(),
      firmName: Joi.string().allow("").optional(),
      address: Joi.string().allow("").optional(),
      postcode: Joi.string().allow("").optional(),
      phone: Joi.string().allow("").optional(),
      email: Joi.string().allow("").optional(),
    }).optional(),
    privateDocuments: Joi.array()
      .items(
        Joi.object({
          _id: Joi.any().optional(),
          docType: Joi.string().allow("").optional(),
          customLabel: Joi.string().allow("").optional(),
          url: Joi.string().allow("").optional(),
          originalName: Joi.string().allow("").optional(),
          uploadedAt: Joi.date().optional(),
        }),
      )
      .optional()
      .default([]),
    specialTerms: Joi.string().allow("").optional(),
  }).required(),

  termsOfSale: Joi.object({
    text: Joi.string().allow("").optional(),
    buyersFeePercent: optionalNumber(),
    buyersFeeMin: optionalNumber(),
    depositPercent: optionalNumber(),
    depositMin: optionalNumber(),
    vatPercent: optionalNumber(),
    additionalFees: optionalNumber(),
  }).optional(),

  sellerInfo: Joi.object({
    agentName: optionalString(),
    agentContact: optionalString(),
  }).optional(),

  approvalStatus: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
});

export const updatePropertySchema = createPropertySchema.fork(
  Object.keys(createPropertySchema.describe().keys),
  (schema) => schema.optional(),
);
