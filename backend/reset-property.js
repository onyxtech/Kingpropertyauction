import mongoose from "mongoose";
import Property from "./src/modules/property/property.model.js";
import Auction from "./src/modules/auction/auction.model.js";
import Bid from "./src/modules/bid/bid.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/kingproperty");

// Reset Luxury Modern Villa
await Property.updateOne(
  { propertyTitle: /Luxury/i },
  { propertyStatus: "available", currentBid: 500000, totalBids: 0, winningBidder: null, soldTo: null, soldPrice: null }
);

const prop = await Property.findOne({ propertyTitle: /Luxury/i }).select("_id").lean();

// Remove from auctions
await Auction.updateMany({ properties: prop._id }, { $pull: { properties: prop._id } });

// Delete bids
await Bid.deleteMany({ property: prop._id });

console.log("Luxury Modern Villa is now fresh and available!");
process.exit(0);