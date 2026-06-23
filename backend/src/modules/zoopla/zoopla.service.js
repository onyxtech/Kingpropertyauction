import { getSetting } from "../settings/settings.service.js";

const ZOOPLA_API_URL = "https://api.zoopla.co.uk/v1";

// Get Zoopla credentials from settings
const getZooplaConfig = async () => {
  const integrations = await getSetting("api_integrations");
  if (!integrations?.zooplaEnabled) {
    throw new Error("Zoopla integration is not enabled");
  }
  return {
    apiKey: integrations.zooplaApiKey,
    apiSecret: integrations.zooplaApiSecret,
    branchId: integrations.zooplaBranchId,
    agentId: integrations.zooplaAgentId,
    testMode: integrations.zooplaTestMode !== false,
  };
};

// Submit a property listing to Zoopla
export const createListing = async (propertyData) => {
  const config = await getZooplaConfig();
  
  const listing = {
    branch_id: config.branchId,
    agent_id: config.agentId || config.branchId,
    listing_type: mapPropertyType(propertyData.propertyType),
    listing_status: "for_sale",
    price: propertyData.pricing?.startingAuctionPrice || 0,
    address: {
      line_1: propertyData.location?.streetAddress || "",
      line_2: propertyData.location?.area || "",
      city: propertyData.location?.city || "",
      postcode: propertyData.location?.postalCode || "",
      country: "GB",
    },
    bedrooms: propertyData.specifications?.bedrooms || 0,
    bathrooms: propertyData.specifications?.bathrooms || 0,
    description: propertyData.propertyDescription || "",
    title: propertyData.propertyTitle || "",
    images: (propertyData.media?.propertyImages || []).map(url => ({ url })),
    floor_plans: (propertyData.media?.floorPlans || []).map(url => ({ url })),
    features: getFeatures(propertyData.features),
    tenure: propertyData.legalInfo?.ownershipType || "freehold",
  };

  const endpoint = config.testMode ? "sandbox" : "live";
  
  try {
    const response = await fetch(`${ZOOPLA_API_URL}/${endpoint}/listings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Zoopla API error");
    }

    return {
      success: true,
      zooplaId: result.listing_id || result.id,
      status: "active",
      response: result,
    };
  } catch (error) {
    console.error("[Zoopla] Failed to create listing:", error.message);
    return {
      success: false,
      status: "failed",
      error: error.message,
    };
  }
};

// Update a listing on Zoopla
export const updateListing = async (zooplaId, propertyData) => {
  const config = await getZooplaConfig();
  const endpoint = config.testMode ? "sandbox" : "live";
  
  try {
    const response = await fetch(`${ZOOPLA_API_URL}/${endpoint}/listings/${zooplaId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: propertyData.pricing?.startingAuctionPrice || 0,
        status: propertyData.propertyStatus === "sold" ? "sold" : "for_sale",
        description: propertyData.propertyDescription || "",
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Zoopla API error");
    }

    return { success: true, response: result };
  } catch (error) {
    console.error("[Zoopla] Failed to update listing:", error.message);
    return { success: false, error: error.message };
  }
};

// Remove a listing from Zoopla
export const removeListing = async (zooplaId) => {
  const config = await getZooplaConfig();
  const endpoint = config.testMode ? "sandbox" : "live";
  
  try {
    const response = await fetch(`${ZOOPLA_API_URL}/${endpoint}/listings/${zooplaId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Zoopla API error");
    }

    return { success: true };
  } catch (error) {
    console.error("[Zoopla] Failed to remove listing:", error.message);
    return { success: false, error: error.message };
  }
};

// Check Zoopla connection status
export const testConnection = async () => {
  try {
    const config = await getZooplaConfig();
    const endpoint = config.testMode ? "sandbox" : "live";
    
    const response = await fetch(`${ZOOPLA_API_URL}/${endpoint}/branches/${config.branchId}`, {
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
      },
    });

    if (response.ok) {
      return { success: true, message: "Zoopla connection successful" };
    }
    
    const result = await response.json();
    return { success: false, message: result.message || "Connection failed" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Helper: Map our property types to Zoopla's
const mapPropertyType = (type) => {
  const typeMap = {
    house: "house",
    apartment: "flat",
    land: "land",
    commercial: "commercial",
    farmhouse: "house",
  };
  return typeMap[type] || "house";
};

// Helper: Extract features
const getFeatures = (features) => {
  if (!features) return [];
  const list = [];
  if (features.garden) list.push("Garden");
  if (features.swimmingPool) list.push("Swimming Pool");
  if (features.balcony) list.push("Balcony");
  if (features.parkingSpaces) list.push("Parking");
  return list;
};