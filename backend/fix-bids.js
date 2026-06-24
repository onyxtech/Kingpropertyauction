import mongoose from "mongoose";
import Bid from "./src/modules/bid/bid.model.js";
import Property from "./src/modules/property/property.model.js";
import Auction from "./src/modules/auction/auction.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/kingproperty");

// Get all current properties
const properties = await Property.find().select("_id propertyTitle").lean();
const villa = properties.find(p => p.propertyTitle.includes("Villa"));
const canal = properties.find(p => p.propertyTitle.includes("canal"));
const apartment = properties.find(p => p.propertyTitle.includes("2 Bed"));

console.log("New property IDs:");
console.log("Villa:", villa?._id);
console.log("Canal:", canal?._id);
console.log("Apartment:", apartment?._id);

// Get all bids
const bids = await Bid.find().lean();
console.log(`Found ${bids.length} bids`);

// Get current auctions
const auctions = await Auction.find().select("_id auctionTitle").lean();
const auction1 = auctions.find(a => a.auctionTitle.includes("Premium Properties Auction") && !a.auctionTitle.includes("New"));
const auction2 = auctions.find(a => a.auctionTitle.includes("New Premium"));

console.log("Auction 1:", auction1?._id);
console.log("Auction 2:", auction2?._id);

// Property title mapping (old title → new property)
// From your old data:
// Old: "6a26c57c61ae490406cc2b0b" = "Luxury Modern Villa in Glasgow" → villa
// Old: "6a26c8b6d36b93a52f1e5103" = "1 canal Luxury Modern House in London" → canal
// Old: "6a2aa61e12936599f8e8ffe8" = "2 Bed Apartment London" → apartment

const oldToNewMap = {
  "6a26c57c61ae490406cc2b0b": villa?._id,
  "6a26c8b6d36b93a52f1e5103": canal?._id,
  "6a2aa61e12936599f8e8ffe8": apartment?._id,
};

let updated = 0;
for (const bid of bids) {
  const oldPropId = bid.property?.toString();
  const newPropId = oldToNewMap[oldPropId];
  
  if (newPropId) {
    await Bid.updateOne(
      { _id: bid._id },
      { 
        property: newPropId,
        auction: bid.auction?.toString() === "6a27d460e681ffc5139cddb0" ? auction1?._id : auction2?._id
      }
    );
    updated++;
  }
}

console.log(`Updated ${updated} bids with new property references`);

// Update property bid counts
for (const [oldId, newId] of Object.entries(oldToNewMap)) {
  if (!newId) continue;
  const bidCount = await Bid.countDocuments({ property: newId, status: { $ne: "retracted" } });
  const highestBid = await Bid.findOne({ property: newId, status: { $ne: "retracted" } }).sort("-amount");
  const uniqueBidders = await Bid.distinct("bidder", { property: newId, status: { $ne: "retracted" } });
  
  await Property.findByIdAndUpdate(newId, {
    totalBids: bidCount,
    currentBid: highestBid?.amount || 0,
    winningBidder: highestBid?.bidder || null,
    totalBidders: uniqueBidders.length,
  });
  console.log(`Updated property ${newId}: ${bidCount} bids`);
}

// Update auction stats
for (const auction of [auction1, auction2]) {
  if (!auction) continue;
  const auctionBids = await Bid.countDocuments({ auction: auction._id, status: { $ne: "retracted" } });
  const auctionBidders = await Bid.distinct("bidder", { auction: auction._id, status: { $ne: "retracted" } });
  const highestAuctionBid = await Bid.findOne({ auction: auction._id, status: { $ne: "retracted" } }).sort("-amount");
  
  await Auction.findByIdAndUpdate(auction._id, {
    totalBids: auctionBids,
    totalBidders: auctionBidders.length,
    currentBid: highestAuctionBid?.amount || 0,
  });
  console.log(`Updated auction ${auction._id}: ${auctionBids} bids`);
}

console.log("Done! All bids remapped to new properties.");
process.exit(0);