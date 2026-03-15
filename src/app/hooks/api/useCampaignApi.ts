import { useState } from "react";
import { Campaign, CampaignFormData, ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let mockCampaigns: Campaign[] = [
  {
    id: "CMP-001",
    campaignName: "New Property Listings - March 2026",
    campaignType: "property",
    targetAudience: "all",
    emailSubject: "Check out our latest property listings!",
    emailBody: "We have exciting new properties available this month...",
    emailTemplate: "modern",
    scheduleType: "later",
    scheduleDateTime: "2026-03-20T09:00:00Z",
    status: "scheduled",
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: "2026-03-13T10:00:00Z",
    updatedAt: "2026-03-13T10:00:00Z",
  },
  {
    id: "CMP-002",
    campaignName: "Monthly Newsletter - February",
    campaignType: "newsletter",
    targetAudience: "all",
    emailSubject: "Your Monthly Property Market Update",
    emailBody: "Here's what's happening in the property market...",
    emailTemplate: "classic",
    scheduleType: "now",
    status: "sent",
    sentCount: 4523,
    openRate: 68.5,
    clickRate: 12.3,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:30:00Z",
  },
];

let nextCampaignId = 3;

export const useCampaignApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new campaign
   */
  const createCampaign = async (data: CampaignFormData): Promise<ApiResponse<Campaign>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      const newCampaign: Campaign = {
        ...data,
        id: `CMP-${String(nextCampaignId).padStart(3, "0")}`,
        status: data.scheduleType === "now" ? "sent" : "scheduled",
        sentCount: data.scheduleType === "now" ? 0 : undefined,
        openRate: 0,
        clickRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockCampaigns.push(newCampaign);
      nextCampaignId++;

      setLoading(false);
      return {
        success: true,
        data: newCampaign,
        message: data.scheduleType === "now" ? "Campaign sent successfully" : "Campaign scheduled successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create campaign";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all campaigns with pagination and filters
   */
  const getCampaigns = async (params?: QueryParams): Promise<PaginatedResponse<Campaign>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      let filteredCampaigns = [...mockCampaigns];

      // Apply filters
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(
          (c) =>
            c.campaignName.toLowerCase().includes(searchLower) ||
            c.emailSubject.toLowerCase().includes(searchLower)
        );
      }

      if (params?.status) {
        filteredCampaigns = filteredCampaigns.filter((c) => c.status === params.status);
      }

      if (params?.type) {
        filteredCampaigns = filteredCampaigns.filter((c) => c.campaignType === params.type);
      }

      // Apply sorting
      if (params?.sortBy) {
        filteredCampaigns.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Campaign];
          const bValue = b[params.sortBy as keyof Campaign];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return params.sortOrder === "desc"
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return params.sortOrder === "desc" ? bValue - aValue : aValue - bValue;
          }

          return 0;
        });
      }

      // Pagination
      const total = filteredCampaigns.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredCampaigns.slice(startIndex, endIndex);

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
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch campaigns";
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
   * Get a single campaign by ID
   */
  const getCampaignById = async (id: string): Promise<ApiResponse<Campaign>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const campaign = mockCampaigns.find((c) => c.id === id);

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      setLoading(false);
      return {
        success: true,
        data: campaign,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch campaign";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update an existing campaign
   */
  const updateCampaign = async (
    id: string,
    data: Partial<CampaignFormData>
  ): Promise<ApiResponse<Campaign>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const index = mockCampaigns.findIndex((c) => c.id === id);

      if (index === -1) {
        throw new Error("Campaign not found");
      }

      // Prevent editing sent campaigns
      if (mockCampaigns[index].status === "sent") {
        throw new Error("Cannot edit a campaign that has already been sent");
      }

      const updatedCampaign: Campaign = {
        ...mockCampaigns[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockCampaigns[index] = updatedCampaign;

      setLoading(false);
      return {
        success: true,
        data: updatedCampaign,
        message: "Campaign updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update campaign";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete a campaign
   */
  const deleteCampaign = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockCampaigns.findIndex((c) => c.id === id);

      if (index === -1) {
        throw new Error("Campaign not found");
      }

      mockCampaigns.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Campaign deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete campaign";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Send a draft campaign immediately
   */
  const sendCampaignNow = async (id: string): Promise<ApiResponse<Campaign>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1500);

      const index = mockCampaigns.findIndex((c) => c.id === id);

      if (index === -1) {
        throw new Error("Campaign not found");
      }

      if (mockCampaigns[index].status === "sent") {
        throw new Error("Campaign has already been sent");
      }

      // Simulate sending to audience
      const audienceSizes = {
        all: 4523,
        buyers: 2134,
        sellers: 892,
        investors: 342,
        agents: 156,
      };

      const sentCount = audienceSizes[mockCampaigns[index].targetAudience] || 0;

      mockCampaigns[index] = {
        ...mockCampaigns[index],
        status: "sent",
        sentCount,
        scheduleType: "now",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockCampaigns[index],
        message: `Campaign sent to ${sentCount} recipients`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send campaign";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get campaign statistics
   */
  const getCampaignStats = async (id: string): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const campaign = mockCampaigns.find((c) => c.id === id);

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      const stats = {
        sent: campaign.sentCount || 0,
        opened: campaign.sentCount ? Math.floor((campaign.sentCount * (campaign.openRate || 0)) / 100) : 0,
        clicked: campaign.sentCount ? Math.floor((campaign.sentCount * (campaign.clickRate || 0)) / 100) : 0,
        bounced: campaign.sentCount ? Math.floor(campaign.sentCount * 0.02) : 0,
        openRate: campaign.openRate || 0,
        clickRate: campaign.clickRate || 0,
        bounceRate: 2.0,
      };

      setLoading(false);
      return {
        success: true,
        data: stats,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch campaign stats";
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
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    sendCampaignNow,
    getCampaignStats,
  };
};
