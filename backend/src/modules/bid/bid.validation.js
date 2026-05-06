import Joi from 'joi';

export const placeBidSchema = Joi.object({
  auction: Joi.string().required(),
  property: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  maxBid: Joi.number().min(Joi.ref('amount')).allow(null).optional().default(null),
  isAutoBid: Joi.boolean().default(false),
});

export const updateBidSchema = Joi.object({
  amount: Joi.number().min(1).optional(),
  maxBid: Joi.number().optional(),
  status: Joi.string().valid('active', 'outbid', 'winning', 'won', 'lost', 'retracted').optional(),
});