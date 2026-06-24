import mongoose from "mongoose";
import Auction from "./src/modules/auction/auction.model.js";
import Property from "./src/modules/property/property.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/kingproperty");

const properties = await Property.find().select("_id propertyTitle").lean();
const villa = properties.find(p => p.propertyTitle.includes("Villa"));
const canal = properties.find(p => p.propertyTitle.includes("canal"));
const apartment = properties.find(p => p.propertyTitle.includes("2 Bed"));

console.log("Villa:", villa?._id);
console.log("Canal:", canal?._id);
console.log("Apartment:", apartment?._id);

// Update first auction (had 2 properties)
await Auction.updateOne(
  { auctionTitle: /Premium Properties Auction/i },
  { properties: [villa?._id, canal?._id].filter(Boolean) }
);

// Update second auction (had 2 properties)
await Auction.updateOne(
  { auctionTitle: /New Premium Properties/i },
  { properties: [apartment?._id, canal?._id].filter(Boolean) }
);

console.log("Auctions updated!");
process.exit(0);