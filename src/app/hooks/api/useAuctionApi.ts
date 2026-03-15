import { useState } from "react";
import { Auction, AuctionFormData, ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let mockAuctions: Auction[] = [
  {
    id: "AUC-001",
    auctionTitle: "Premium Properties - March 2026",
    auctionType: "hybrid",
    startDateTime: "2026-03-20T10:00:00Z",
    endDateTime: "2026-03-20T18:00:00Z",
    description: "Exclusive collection of premium properties in London",
    venueName: "Grand Hotel London",
    venueAddress: "123 Strand, London WC2R 0EU",
    registrationFee: 500,
    depositRequired: 10,
    maxBidders: 100,
    enableAutoBidding: true,
    sendEmailNotifications: true,
    status: "scheduled",
    totalBids: 0,
    totalBidders: 0,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "AUC-002",
    auctionTitle: "Luxury Estates Auction",
    auctionType: "live",
    startDateTime: "2026-03-15T14:00:00Z",
    endDateTime: "2026-03-15T20:00:00Z",
    description: "High-value luxury properties and estates",
    venueName: "Auction House Central",
    venueAddress: "456 Oxford Street, London W1D 1BS",
    registrationFee: 1000,
    depositRequired: 15,
    enableAutoBidding: false,
    sendEmailNotifications: true,
    status: "live",
    totalBids: 47,
    totalBidders: 23,
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-03-15T14:00:00Z",
  },
];

let nextAuctionId = 3;

export const useAuctionApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new auction
   */
  const createAuction = async (data: AuctionFormData): Promise<ApiResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const newAuction: Auction = {
        ...data,
        id: `AUC-${String(nextAuctionId).padStart(3, "0")}`,
        status: "scheduled",
        totalBids: 0,
        totalBidders: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockAuctions.push(newAuction);
      nextAuctionId++;

      setLoading(false);
      return {
        success: true,
        data: newAuction,
        message: "Auction created successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create auction";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all auctions with pagination and filters
   */
  const getAuctions = async (params?: QueryParams): Promise<PaginatedResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      let filteredAuctions = [...mockAuctions];

      // Apply filters
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredAuctions = filteredAuctions.filter(
          (a) =>
            a.auctionTitle.toLowerCase().includes(searchLower) ||
            a.description?.toLowerCase().includes(searchLower) ||
            a.venueName?.toLowerCase().includes(searchLower)
        );
      }

      if (params?.status) {
        filteredAuctions = filteredAuctions.filter((a) => a.status === params.status);
      }

      if (params?.type) {
        filteredAuctions = filteredAuctions.filter((a) => a.auctionType === params.type);
      }

      // Apply sorting
      if (params?.sortBy) {
        filteredAuctions.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Auction];
          const bValue = b[params.sortBy as keyof Auction];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return params.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          return 0;
        });
      }

      // Pagination
      const total = filteredAuctions.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredAuctions.slice(startIndex, endIndex);

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
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch auctions";
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
   * Get a single auction by ID
   */
  const getAuctionById = async (id: string): Promise<ApiResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const auction = mockAuctions.find((a) => a.id === id);

      if (!auction) {
        throw new Error("Auction not found");
      }

      setLoading(false);
      return {
        success: true,
        data: auction,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch auction";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update an existing auction
   */
  const updateAuction = async (
    id: string,
    data: Partial<AuctionFormData>
  ): Promise<ApiResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const index = mockAuctions.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Auction not found");
      }

      const updatedAuction: Auction = {
        ...mockAuctions[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockAuctions[index] = updatedAuction;

      setLoading(false);
      return {
        success: true,
        data: updatedAuction,
        message: "Auction updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update auction";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete an auction
   */
  const deleteAuction = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAuctions.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Auction not found");
      }

      mockAuctions.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Auction deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete auction";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Start an auction (change status to live)
   */
  const startAuction = async (id: string): Promise<ApiResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAuctions.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Auction not found");
      }

      mockAuctions[index] = {
        ...mockAuctions[index],
        status: "live",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockAuctions[index],
        message: "Auction started successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start auction";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * End an auction (change status to completed)
   */
  const endAuction = async (id: string): Promise<ApiResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAuctions.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Auction not found");
      }

      mockAuctions[index] = {
        ...mockAuctions[index],
        status: "completed",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockAuctions[index],
        message: "Auction ended successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to end auction";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Cancel an auction
   */
  const cancelAuction = async (id: string, reason?: string): Promise<ApiResponse<Auction>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAuctions.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Auction not found");
      }

      mockAuctions[index] = {
        ...mockAuctions[index],
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockAuctions[index],
        message: `Auction cancelled${reason ? `: ${reason}` : ""}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel auction";
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
    createAuction,
    getAuctions,
    getAuctionById,
    updateAuction,
    deleteAuction,
    startAuction,
    endAuction,
    cancelAuction,
  };
};
