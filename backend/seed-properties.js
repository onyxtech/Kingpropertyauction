import mongoose from "mongoose";
import Property from "./src/modules/property/property.model.js";

await mongoose.connect("mongodb://127.0.0.1:27017/kingproperty");

const properties = [
  {
    propertyTitle: "Luxury Modern Villa in Glasgow",
    propertyDescription: "A stunning luxury villa located in the heart of Glasgow with modern amenities.",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyStatus: "sold",
    location: {
      country: "United Kingdom",
      state: "Northern Ireland",
      city: "Belfast",
      area: "Belfast",
      streetAddress: "123 York Street",
      postalCode: "BT15 1AS",
      latitude: 54.6057789,
      longitude: -5.9273152,
    },
    specifications: { bedrooms: 4, bathrooms: 3, floors: 2, yearBuilt: 2015, parkingSpaces: 2, furnishedStatus: "unfurnished" },
    pricing: { currency: "GBP", startingAuctionPrice: 500000, reservePrice: 600000, buyNowPrice: 750000, minimumBidIncrement: 10000, estimatedMarketValue: 900000 },
    features: { garden: true, swimmingPool: false, balcony: true, airConditioning: false, securitySystem: true },
    legalInfo: { ownershipType: "freehold", titleDeedNumber: "TD-12345", specialTerms: "" },
    media: { propertyImages: [], propertyVideos: [], floorPlans: [] },
    createdBy: "6a26c2ea61ae490406cc2a0b",
    currentBid: 600000,
    soldPrice: 600000,
    totalBids: 7,
    winningBidder: "6a27c48a4923171cb808b1b4",
    soldTo: "6a27c48a4923171cb808b1b4",
    approvalStatus: "approved",
    termsOfSale: { text: "", buyersFeePercent: 5, buyersFeeMin: 3500, depositPercent: 15, depositMin: 5000, vatPercent: 25, additionalFees: 0 },
  },
  {
    propertyTitle: "1 canal Luxury Modern House in London",
    propertyDescription: "A luxury modern house located by the canal in London.",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyStatus: "sold",
    location: {
      country: "United Kingdom",
      state: "England",
      city: "London",
      area: "Greater London",
      streetAddress: "1 Canal Street",
      postalCode: "EC3A 8BF",
      latitude: 51.514497,
      longitude: -0.0803325,
    },
    specifications: { bedrooms: 4, bathrooms: 3, floors: 2, yearBuilt: 2018, parkingSpaces: 1, furnishedStatus: "semi-furnished" },
    pricing: { currency: "GBP", startingAuctionPrice: 300000, reservePrice: 500000, buyNowPrice: 750000, minimumBidIncrement: 10000, estimatedMarketValue: 800000 },
    features: { garden: true, balcony: true, securitySystem: true },
    legalInfo: { ownershipType: "freehold", titleDeedNumber: "TD-67890", specialTerms: "" },
    media: { propertyImages: [], propertyVideos: [], floorPlans: [] },
    createdBy: "6a26c2ea61ae490406cc2a0b",
    currentBid: 500000,
    soldPrice: 500000,
    totalBids: 4,
    winningBidder: "6a26c927d36b93a52f1e5219",
    soldTo: "6a26c927d36b93a52f1e5219",
    approvalStatus: "approved",
    termsOfSale: { text: "", buyersFeePercent: null, buyersFeeMin: null, depositPercent: null, depositMin: null, vatPercent: null, additionalFees: null },
  },
  {
    propertyTitle: "2 Bed Apartment London",
    propertyDescription: "A modern 2-bedroom apartment in Northampton.",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyStatus: "sold",
    location: {
      country: "United Kingdom",
      state: "England",
      city: "Northampton",
      area: "West Northamptonshire",
      streetAddress: "Crow Lane",
      postalCode: "NN3 9DA",
      latitude: 52.2455461,
      longitude: -0.8112577,
    },
    specifications: { bedrooms: 2, bathrooms: 2, floors: 1, yearBuilt: 2020, parkingSpaces: 2, furnishedStatus: "fully-furnished" },
    pricing: { currency: "GBP", startingAuctionPrice: 400000, reservePrice: 600000, buyNowPrice: 700000, minimumBidIncrement: 10000, estimatedMarketValue: 800000 },
    features: { garden: false, balcony: true, securitySystem: true, elevator: true },
    legalInfo: { ownershipType: "leasehold", titleDeedNumber: "Td-324234", specialTerms: "" },
    media: { propertyImages: [], propertyVideos: [], floorPlans: [] },
    createdBy: "6a27c5614923171cb808b23c",
    currentBid: 600000,
    soldPrice: 600000,
    totalBids: 3,
    winningBidder: "6a26c927d36b93a52f1e5219",
    soldTo: "6a26c927d36b93a52f1e5219",
    approvalStatus: "approved",
    termsOfSale: { text: "", buyersFeePercent: null, buyersFeeMin: null, depositPercent: null, depositMin: null, vatPercent: null, additionalFees: null },
  },
];

for (const p of properties) {
  await Property.create(p);
  console.log("✅ Created:", p.propertyTitle);
}

console.log("Done! Created", properties.length, "properties");
process.exit(0);