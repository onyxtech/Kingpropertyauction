import mongoose from "mongoose";
import Property from "./src/modules/property/property.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/kingproperty");

const props = await Property.find({
  approvalStatus: "approved",
  $or: [
    { currentBid: { $gte: 300000, $lte: 500000 } },
    { "pricing.startingAuctionPrice": { $gte: 300000, $lte: 500000 } },
  ],
})
  .select("propertyTitle currentBid pricing.startingAuctionPrice")
  .lean();

console.log("Found:", props.length);
props.forEach((p) =>
  console.log(p.propertyTitle, "| currentBid:", p.currentBid, "| start:", p.pricing?.startingAuctionPrice),
);
process.exit(0);