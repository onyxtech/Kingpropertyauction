import { useState } from "react";
import {
  Property,
  PropertyFormData,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  FileUploadResponse,
} from "../../types/api";

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let mockProperties: Property[] = [
  {
    id: "PROP-001",
    propertyTitle: "Luxury Modern Villa in Mayfair",
    propertyDescription: "Stunning 5-bedroom villa with modern amenities",
    propertyType: "house",
    propertyCategory: "residential",
    listingType: "auction",
    propertyStatus: "available",
    country: "United Kingdom",
    state: "England",
    city: "London",
    area: "Mayfair",
    streetAddress: "123 Park Lane",
    postalCode: "W1K 1AA",
    totalArea: "5000",
    bedrooms: "5",
    bathrooms: "4",
    furnishedStatus: "fully-furnished",
    startingAuctionPrice: "1500000",
    reservePrice: "1800000",
    minimumBidIncrement: "50000",
    currency: "GBP",
    auctionStartDate: "2026-04-01T10:00",
    auctionEndDate: "2026-04-15T18:00",
    auctionStatus: "upcoming",
    autoBidEnabled: true,
    features: {
      garden: true,
      swimmingPool: true,
      balcony: true,
      airConditioning: true,
      securitySystem: true,
      elevator: true,
      gym: false,
      solarSystem: true,
    },
    ownershipType: "freehold",
    mortgageStatus: "clear",
    sellerName: "John Smith",
    sellerContact: "+44 7700 900000",
    sellerEmail: "john.smith@example.com",
    createdBy: "Admin",
    approvalStatus: "approved",
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
];

let nextPropertyId = 2;

export const usePropertyApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new property
   */
  const createProperty = async (data: PropertyFormData): Promise<ApiResponse<Property>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000); // Simulate API delay

      const newProperty: Property = {
        ...data,
        id: `PROP-${String(nextPropertyId).padStart(3, "0")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalStatus: data.approvalStatus || "pending",
      };

      mockProperties.push(newProperty);
      nextPropertyId++;

      setLoading(false);
      return {
        success: true,
        data: newProperty,
        message: "Property created successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create property";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all properties with pagination and filters
   */
  const getProperties = async (params?: QueryParams): Promise<PaginatedResponse<Property>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      let filteredProperties = [...mockProperties];

      // Apply filters
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredProperties = filteredProperties.filter(
          (p) =>
            p.propertyTitle.toLowerCase().includes(searchLower) ||
            p.propertyDescription.toLowerCase().includes(searchLower) ||
            p.area.toLowerCase().includes(searchLower) ||
            p.city.toLowerCase().includes(searchLower)
        );
      }

      if (params?.status) {
        filteredProperties = filteredProperties.filter((p) => p.propertyStatus === params.status);
      }

      if (params?.type) {
        filteredProperties = filteredProperties.filter((p) => p.propertyType === params.type);
      }

      if (params?.category) {
        filteredProperties = filteredProperties.filter((p) => p.propertyCategory === params.category);
      }

      // Apply sorting
      if (params?.sortBy) {
        filteredProperties.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Property];
          const bValue = b[params.sortBy as keyof Property];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return params.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          return 0;
        });
      }

      // Pagination
      const total = filteredProperties.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredProperties.slice(startIndex, endIndex);

      setLoading(false);
      return {
        success: true,
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch properties";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };
    }
  };

  /**
   * Get a single property by ID
   */
  const getPropertyById = async (id: string): Promise<ApiResponse<Property>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const property = mockProperties.find((p) => p.id === id);

      if (!property) {
        throw new Error("Property not found");
      }

      setLoading(false);
      return {
        success: true,
        data: property,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch property";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update an existing property
   */
  const updateProperty = async (
    id: string,
    data: Partial<PropertyFormData>
  ): Promise<ApiResponse<Property>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const index = mockProperties.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error("Property not found");
      }

      const updatedProperty: Property = {
        ...mockProperties[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockProperties[index] = updatedProperty;

      setLoading(false);
      return {
        success: true,
        data: updatedProperty,
        message: "Property updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update property";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete a property
   */
  const deleteProperty = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockProperties.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error("Property not found");
      }

      mockProperties.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Property deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete property";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Upload property images
   */
  const uploadPropertyImages = async (files: File[]): Promise<ApiResponse<FileUploadResponse[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1500);

      const uploadedFiles: FileUploadResponse[] = files.map((file, index) => ({
        success: true,
        fileUrl: `/uploads/properties/${Date.now()}-${index}-${file.name}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }));

      setLoading(false);
      return {
        success: true,
        data: uploadedFiles,
        message: "Images uploaded successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload images";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Approve a property
   */
  const approveProperty = async (id: string): Promise<ApiResponse<Property>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockProperties.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error("Property not found");
      }

      mockProperties[index] = {
        ...mockProperties[index],
        approvalStatus: "approved",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockProperties[index],
        message: "Property approved successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve property";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Reject a property
   */
  const rejectProperty = async (id: string, reason?: string): Promise<ApiResponse<Property>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockProperties.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error("Property not found");
      }

      mockProperties[index] = {
        ...mockProperties[index],
        approvalStatus: "rejected",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockProperties[index],
        message: `Property rejected${reason ? `: ${reason}` : ""}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject property";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    loading,
    error,
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    uploadPropertyImages,
    approveProperty,
    rejectProperty,
  };
};
