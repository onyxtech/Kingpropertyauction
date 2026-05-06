import {
  createPropertySchema,
  updatePropertySchema,
} from "./property.validation.js";
import * as propertyService from "./property.service.js";
import Property from './property.model.js';

export const create = async (req, res) => {
  console.log(
    "📸 Images received:",
    req.body.media?.propertyImages || req.body.propertyImages || "NONE",
  );
  try {
    // Map flat frontend data to nested backend structure
    const body = {
      propertyTitle: req.body.propertyTitle,
      propertyDescription: req.body.propertyDescription,
      propertyType: req.body.propertyType,
      propertyCategory: req.body.propertyCategory,
      listingType: req.body.listingType,
      propertyID: req.body.propertyID || undefined,
      propertyStatus: req.body.propertyStatus,

      location: {
        country: req.body.country || "United Kingdom",
        state: req.body.state,
        city: req.body.city,
        area: req.body.area,
        streetAddress: req.body.streetAddress,
        postalCode: req.body.postalCode,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },

      specifications: {
        totalArea: Number(req.body.totalArea) || 0,
        landArea: Number(req.body.landArea) || undefined,
        coveredArea: Number(req.body.coveredArea) || undefined,
        bedrooms: Number(req.body.bedrooms) || 0,
        bathrooms: Number(req.body.bathrooms) || 0,
        floors: Number(req.body.floors) || undefined,
        yearBuilt: Number(req.body.yearBuilt) || undefined,
        parkingSpaces: Number(req.body.parkingSpaces) || undefined,
        furnishedStatus: req.body.furnishedStatus || "unfurnished",
      },

      pricing: {
        currency: req.body.currency || "GBP",
        startingAuctionPrice: Number(req.body.startingAuctionPrice) || 0,
        reservePrice: Number(req.body.reservePrice) || 0,
        buyNowPrice: Number(req.body.buyNowPrice) || undefined,
        minimumBidIncrement: Number(req.body.minimumBidIncrement) || 0,
        estimatedMarketValue:
          Number(req.body.estimatedMarketValue) || undefined,
      },

      auctionDetails: {
        auctionStartDate: req.body.auctionStartDate || new Date(),
        auctionEndDate: req.body.auctionEndDate || new Date(),
        auctionStatus: req.body.auctionStatus || "upcoming",
        bidDepositAmount: Number(req.body.bidDepositAmount) || undefined,
        autoBidEnabled: req.body.autoBidEnabled || false,
        maximumBidLimit: Number(req.body.maximumBidLimit) || undefined,
        numberOfBidders: Number(req.body.numberOfBidders) || 0,
      },

      features: req.body.features || {},

      legalInfo: {
        ownershipType: req.body.ownershipType || "freehold",
        titleDeedNumber: req.body.titleDeedNumber,
        propertyTaxInfo: req.body.propertyTaxInfo,
        mortgageStatus: req.body.mortgageStatus || "clear",
        zoningType: req.body.zoningType,
      },

      sellerInfo: {
        sellerName: req.body.sellerName,
        sellerContact: req.body.sellerContact,
        sellerEmail: req.body.sellerEmail,
        agentName: req.body.agentName,
        agentContact: req.body.agentContact,
      },

      approvalStatus: req.body.approvalStatus || "pending",
      media: {
        propertyImages:
          req.body.media?.propertyImages || req.body.propertyImages || [],
        propertyVideo:
          req.body.media?.propertyVideo || req.body.propertyVideo || undefined,
        virtualTour:
          req.body.media?.virtualTour || req.body.virtualTour || undefined,
        floorPlan: req.body.media?.floorPlan || req.body.floorPlan || undefined,
        legalDocuments:
          req.body.media?.legalDocuments || req.body.legalDocuments || [],
      },
    };

    const { error, value } = createPropertySchema.validate(body, {
      allowUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const property = await propertyService.createProperty(value, req.user._id);
    res
      .status(201)
      .json({
        success: true,
        data: property,
        message: "Property created successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await propertyService.getProperties(req.query);

    res.status(200).json({
      success: true,
      data: result.properties,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;  // ← Changed from slug to id
    let property = await Property.findById(id).catch(() => null);
    if (!property) {
      property = await Property.findOne({ slug: id });
    }
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { error, value } = updatePropertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const property = await propertyService.updateProperty(req.params.id, value);

    res.status(200).json({
      success: true,
      data: property,
      message: "Property updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await propertyService.deleteProperty(req.params.id);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    const properties = await Property.find({ _id: { $in: ids } });
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approve = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use: pending, approved, or rejected",
      });
    }

    const property = await propertyService.approveProperty(
      req.params.id,
      status,
    );

    res.status(200).json({
      success: true,
      data: property,
      message: `Property ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
