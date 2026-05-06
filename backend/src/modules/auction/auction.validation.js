import Joi from 'joi';

export const createAuctionSchema = Joi.object({
  auctionTitle: Joi.string().trim().required(),
  auctionType: Joi.string().valid('live', 'online', 'hybrid', 'reserve', 'absolute').required(),
  description: Joi.string().max(2000).optional(),
   properties: Joi.array().items(Joi.string()).min(1).required(),
  
  startingBid: Joi.number().min(0).required(),
  bidIncrement: Joi.number().min(1).required(),
  reservePrice: Joi.number().min(0).optional(),
  antiSnipingMinutes: Joi.number().min(1).max(60).default(5),
  enableAutoBidding: Joi.boolean().default(false),
  maxBidders: Joi.number().optional(),
  
  startDateTime: Joi.date().iso().required(),
  endDateTime: Joi.date().iso().greater(Joi.ref('startDateTime')).required(),
  
  venue: Joi.object({
    name: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    postcode: Joi.string().optional(),
  }).optional(),

  auctionImage: Joi.string().optional(),
  totalLots: Joi.number().default(0),
  
  registrationFee: Joi.number().min(0).default(0),
  depositRequired: Joi.number().min(0).default(0),
  
  status: Joi.string().valid('scheduled', 'live', 'completed', 'cancelled').default('scheduled'),
  sendEmailNotifications: Joi.boolean().default(false),
});

export const updateAuctionSchema = createAuctionSchema.fork(
  Object.keys(createAuctionSchema.describe().keys),
  (schema) => schema.optional()
);