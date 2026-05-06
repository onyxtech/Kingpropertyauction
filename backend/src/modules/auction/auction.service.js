import Auction from './auction.model.js';

export const createAuction = async (data, userId) => {
  const auction = await Auction.create({
    ...data,
    createdBy: userId,
  });
  return auction.populate(['properties', 'createdBy', 'winningBidder']);
};

export const getAuctions = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    search,
    sortBy = '-createdAt',
  } = query;

  const filter = {};

  if (status) filter.status = status;
  if (type) filter.auctionType = type;

  const skip = (page - 1) * limit;

  const [auctions, total] = await Promise.all([
    Auction.find(filter)
      .populate('properties', 'propertyTitle propertyType location pricing media')
      .populate('createdBy', 'name email')
      .populate('winningBidder', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Auction.countDocuments(filter),
  ]);

  return {
    auctions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getAuctionById = async (id) => {
  const auction = await Auction.findById(id)
    .populate('properties')
    .populate('createdBy', 'name email')
    .populate('winningBidder', 'name email');
  
  if (!auction) throw new Error('Auction not found');
  return auction;
};

export const updateAuction = async (id, data) => {
  const auction = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(['properties', 'createdBy']);
  
  if (!auction) throw new Error('Auction not found');
  return auction;
};

export const deleteAuction = async (id) => {
  const auction = await Auction.findByIdAndDelete(id);
  if (!auction) throw new Error('Auction not found');
  return auction;
};

export const startAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: 'live' },
    { new: true }
  );
  if (!auction) throw new Error('Auction not found');
  return auction;
};

export const endAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: 'completed' },
    { new: true }
  );
  if (!auction) throw new Error('Auction not found');
  return auction;
};

export const cancelAuction = async (id) => {
  const auction = await Auction.findByIdAndUpdate(
    id,
    { status: 'cancelled' },
    { new: true }
  );
  if (!auction) throw new Error('Auction not found');
  return auction;
};