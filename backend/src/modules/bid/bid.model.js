import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.ObjectId,
      ref: 'Auction',
      required: true,
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: true,
    },
    bidder: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
    },
    maxBid: {
      type: Number, // For auto-bidding
      default: null,
    },
    isAutoBid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'outbid', 'winning', 'won', 'lost', 'retracted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ bidder: 1 });
bidSchema.index({ status: 1 });
bidSchema.index({ createdAt: -1 });
bidSchema.index({ auction: 1, createdAt: -1 });
bidSchema.index({ bidder: 1, createdAt: -1 });
bidSchema.index({ property: 1, createdAt: -1 });

// After saving a bid, update auction stats
bidSchema.post('save', async function () {
  const Bid = this.constructor;
  const auctionId = this.auction;

  const [stats] = await Bid.aggregate([
    { $match: { auction: auctionId, status: { $ne: 'retracted' } } },
    {
      $group: {
        _id: '$auction',
        totalBids: { $sum: 1 },
        totalBidders: { $addToSet: '$bidder' },
        currentBid: { $max: '$amount' },
      },
    },
  ]);

  if (stats) {
    await mongoose.model('Auction').findByIdAndUpdate(auctionId, {
      totalBids: stats.totalBids,
      totalBidders: stats.totalBidders.length,
      currentBid: stats.currentBid,
    });
  }
});

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;