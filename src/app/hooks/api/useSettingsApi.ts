import { useState } from "react";
import { ApiResponse, PaginatedResponse } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Settings Types
export interface SelectOption {
  id: string;
  value: string;
  label: string;
  category: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOptionFormData {
  value: string;
  label: string;
  category: string;
  description?: string;
  isActive: boolean;
  sortOrder?: number;
  color?: string;
  icon?: string;
}

export type OptionCategory =
  | "propertyType"
  | "propertyCategory"
  | "listingType"
  | "propertyStatus"
  | "furnishedStatus"
  | "currency"
  | "auctionType"
  | "auctionStatus"
  | "ownershipType"
  | "mortgageStatus"
  | "campaignType"
  | "targetAudience"
  | "emailTemplate"
  | "scheduleType"
  | "reportType"
  | "reportFormat"
  | "userRole"
  | "accountStatus"
  | "kycStatus"
  | "agentSpecialization"
  | "agentStatus";

// Mock database of select options
let mockSelectOptions: SelectOption[] = [
  // Property Types
  {
    id: "PT-001",
    value: "house",
    label: "House",
    category: "propertyType",
    description: "Single family detached house",
    isActive: true,
    sortOrder: 1,
    color: "#3b82f6",
    icon: "home",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PT-002",
    value: "apartment",
    label: "Apartment",
    category: "propertyType",
    description: "Apartment or flat",
    isActive: true,
    sortOrder: 2,
    color: "#8b5cf6",
    icon: "building",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PT-003",
    value: "land",
    label: "Land",
    category: "propertyType",
    description: "Empty land or plot",
    isActive: true,
    sortOrder: 3,
    color: "#10b981",
    icon: "map",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PT-004",
    value: "commercial",
    label: "Commercial",
    category: "propertyType",
    description: "Commercial property",
    isActive: true,
    sortOrder: 4,
    color: "#f59e0b",
    icon: "building-2",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PT-005",
    value: "farmhouse",
    label: "Farmhouse",
    category: "propertyType",
    description: "Farm or agricultural property",
    isActive: true,
    sortOrder: 5,
    color: "#84cc16",
    icon: "tractor",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Property Categories
  {
    id: "PC-001",
    value: "residential",
    label: "Residential",
    category: "propertyCategory",
    isActive: true,
    sortOrder: 1,
    color: "#3b82f6",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PC-002",
    value: "commercial",
    label: "Commercial",
    category: "propertyCategory",
    isActive: true,
    sortOrder: 2,
    color: "#8b5cf6",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PC-003",
    value: "industrial",
    label: "Industrial",
    category: "propertyCategory",
    isActive: true,
    sortOrder: 3,
    color: "#f59e0b",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Listing Types
  {
    id: "LT-001",
    value: "auction",
    label: "Auction",
    category: "listingType",
    isActive: true,
    sortOrder: 1,
    color: "#ec4899",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "LT-002",
    value: "direct_sale",
    label: "Direct Sale",
    category: "listingType",
    isActive: true,
    sortOrder: 2,
    color: "#10b981",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Property Status
  {
    id: "PS-001",
    value: "available",
    label: "Available",
    category: "propertyStatus",
    isActive: true,
    sortOrder: 1,
    color: "#10b981",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PS-002",
    value: "sold",
    label: "Sold",
    category: "propertyStatus",
    isActive: true,
    sortOrder: 2,
    color: "#ef4444",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "PS-003",
    value: "pending",
    label: "Pending",
    category: "propertyStatus",
    isActive: true,
    sortOrder: 3,
    color: "#f59e0b",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Furnished Status
  {
    id: "FS-001",
    value: "unfurnished",
    label: "Unfurnished",
    category: "furnishedStatus",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "FS-002",
    value: "semi-furnished",
    label: "Semi-Furnished",
    category: "furnishedStatus",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "FS-003",
    value: "fully-furnished",
    label: "Fully Furnished",
    category: "furnishedStatus",
    isActive: true,
    sortOrder: 3,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Currency
  {
    id: "CUR-001",
    value: "GBP",
    label: "British Pound (£)",
    category: "currency",
    isActive: true,
    sortOrder: 1,
    icon: "pound-sterling",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "CUR-002",
    value: "USD",
    label: "US Dollar ($)",
    category: "currency",
    isActive: true,
    sortOrder: 2,
    icon: "dollar-sign",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "CUR-003",
    value: "EUR",
    label: "Euro (€)",
    category: "currency",
    isActive: true,
    sortOrder: 3,
    icon: "euro",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Auction Type
  {
    id: "AT-001",
    value: "live",
    label: "Live Auction",
    category: "auctionType",
    description: "In-person auction event",
    isActive: true,
    sortOrder: 1,
    color: "#ef4444",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "AT-002",
    value: "online",
    label: "Online Auction",
    category: "auctionType",
    description: "Virtual online auction",
    isActive: true,
    sortOrder: 2,
    color: "#3b82f6",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "AT-003",
    value: "hybrid",
    label: "Hybrid Auction",
    category: "auctionType",
    description: "Both live and online",
    isActive: true,
    sortOrder: 3,
    color: "#8b5cf6",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // User Roles
  {
    id: "UR-001",
    value: "buyer",
    label: "Buyer",
    category: "userRole",
    description: "Property buyer",
    isActive: true,
    sortOrder: 1,
    color: "#3b82f6",
    icon: "user",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "UR-002",
    value: "seller",
    label: "Seller",
    category: "userRole",
    description: "Property seller",
    isActive: true,
    sortOrder: 2,
    color: "#10b981",
    icon: "home",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "UR-003",
    value: "investor",
    label: "Investor",
    category: "userRole",
    description: "Property investor",
    isActive: true,
    sortOrder: 3,
    color: "#f59e0b",
    icon: "trending-up",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "UR-004",
    value: "agent",
    label: "Agent",
    category: "userRole",
    description: "Property agent",
    isActive: true,
    sortOrder: 4,
    color: "#8b5cf6",
    icon: "briefcase",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "UR-005",
    value: "admin",
    label: "Admin",
    category: "userRole",
    description: "System administrator",
    isActive: true,
    sortOrder: 5,
    color: "#ef4444",
    icon: "shield",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },

  // Agent Specialization
  {
    id: "AS-001",
    value: "residential",
    label: "Residential",
    category: "agentSpecialization",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "AS-002",
    value: "commercial",
    label: "Commercial",
    category: "agentSpecialization",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "AS-003",
    value: "luxury",
    label: "Luxury",
    category: "agentSpecialization",
    isActive: true,
    sortOrder: 3,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "AS-004",
    value: "all",
    label: "All Types",
    category: "agentSpecialization",
    isActive: true,
    sortOrder: 4,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

let nextOptionId = mockSelectOptions.length + 1;

export const useSettingsApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get all options for a specific category
   */
  const getOptionsByCategory = async (category: OptionCategory): Promise<ApiResponse<SelectOption[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const options = mockSelectOptions
        .filter((opt) => opt.category === category)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      setLoading(false);
      return {
        success: true,
        data: options,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch options";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all active options for a category (for use in forms)
   */
  const getActiveOptions = async (category: OptionCategory): Promise<ApiResponse<SelectOption[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const options = mockSelectOptions
        .filter((opt) => opt.category === category && opt.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      setLoading(false);
      return {
        success: true,
        data: options,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch active options";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Create new select option
   */
  const createOption = async (data: SelectOptionFormData): Promise<ApiResponse<SelectOption>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      // Check if value already exists in category
      const exists = mockSelectOptions.some(
        (opt) => opt.category === data.category && opt.value === data.value
      );

      if (exists) {
        throw new Error(`Option with value "${data.value}" already exists in this category`);
      }

      const prefix = data.category.substring(0, 2).toUpperCase();
      const newOption: SelectOption = {
        id: `${prefix}-${String(nextOptionId).padStart(3, "0")}`,
        ...data,
        sortOrder: data.sortOrder || mockSelectOptions.filter((o) => o.category === data.category).length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockSelectOptions.push(newOption);
      nextOptionId++;

      setLoading(false);
      return {
        success: true,
        data: newOption,
        message: "Option created successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create option";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update existing option
   */
  const updateOption = async (id: string, data: Partial<SelectOptionFormData>): Promise<ApiResponse<SelectOption>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(600);

      const index = mockSelectOptions.findIndex((opt) => opt.id === id);

      if (index === -1) {
        throw new Error("Option not found");
      }

      // Check for duplicate value if updating value
      if (data.value && data.value !== mockSelectOptions[index].value) {
        const exists = mockSelectOptions.some(
          (opt) => opt.category === mockSelectOptions[index].category && opt.value === data.value && opt.id !== id
        );

        if (exists) {
          throw new Error(`Option with value "${data.value}" already exists`);
        }
      }

      const updatedOption: SelectOption = {
        ...mockSelectOptions[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      mockSelectOptions[index] = updatedOption;

      setLoading(false);
      return {
        success: true,
        data: updatedOption,
        message: "Option updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update option";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete option
   */
  const deleteOption = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockSelectOptions.findIndex((opt) => opt.id === id);

      if (index === -1) {
        throw new Error("Option not found");
      }

      mockSelectOptions.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Option deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete option";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Reorder options within a category
   */
  const reorderOptions = async (category: OptionCategory, optionIds: string[]): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      optionIds.forEach((id, index) => {
        const option = mockSelectOptions.find((opt) => opt.id === id);
        if (option) {
          option.sortOrder = index + 1;
          option.updatedAt = new Date().toISOString();
        }
      });

      setLoading(false);
      return {
        success: true,
        message: "Options reordered successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reorder options";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Toggle option active status
   */
  const toggleOptionStatus = async (id: string): Promise<ApiResponse<SelectOption>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(400);

      const option = mockSelectOptions.find((opt) => opt.id === id);

      if (!option) {
        throw new Error("Option not found");
      }

      option.isActive = !option.isActive;
      option.updatedAt = new Date().toISOString();

      setLoading(false);
      return {
        success: true,
        data: option,
        message: `Option ${option.isActive ? "activated" : "deactivated"} successfully`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle option status";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all categories with option counts
   */
  const getCategorySummary = async (): Promise<
    ApiResponse<
      Array<{
        category: OptionCategory;
        label: string;
        totalOptions: number;
        activeOptions: number;
        description: string;
      }>
    >
  > => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const categories: Array<{
        category: OptionCategory;
        label: string;
        totalOptions: number;
        activeOptions: number;
        description: string;
      }> = [
        {
          category: "propertyType",
          label: "Property Types",
          totalOptions: mockSelectOptions.filter((o) => o.category === "propertyType").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "propertyType" && o.isActive).length,
          description: "Types of properties (House, Apartment, etc.)",
        },
        {
          category: "propertyCategory",
          label: "Property Categories",
          totalOptions: mockSelectOptions.filter((o) => o.category === "propertyCategory").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "propertyCategory" && o.isActive).length,
          description: "Property usage categories",
        },
        {
          category: "listingType",
          label: "Listing Types",
          totalOptions: mockSelectOptions.filter((o) => o.category === "listingType").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "listingType" && o.isActive).length,
          description: "Property listing methods",
        },
        {
          category: "propertyStatus",
          label: "Property Status",
          totalOptions: mockSelectOptions.filter((o) => o.category === "propertyStatus").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "propertyStatus" && o.isActive).length,
          description: "Property availability status",
        },
        {
          category: "furnishedStatus",
          label: "Furnished Status",
          totalOptions: mockSelectOptions.filter((o) => o.category === "furnishedStatus").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "furnishedStatus" && o.isActive).length,
          description: "Property furnishing levels",
        },
        {
          category: "currency",
          label: "Currencies",
          totalOptions: mockSelectOptions.filter((o) => o.category === "currency").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "currency" && o.isActive).length,
          description: "Supported currencies",
        },
        {
          category: "auctionType",
          label: "Auction Types",
          totalOptions: mockSelectOptions.filter((o) => o.category === "auctionType").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "auctionType" && o.isActive).length,
          description: "Types of auction events",
        },
        {
          category: "userRole",
          label: "User Roles",
          totalOptions: mockSelectOptions.filter((o) => o.category === "userRole").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "userRole" && o.isActive).length,
          description: "User role types",
        },
        {
          category: "agentSpecialization",
          label: "Agent Specializations",
          totalOptions: mockSelectOptions.filter((o) => o.category === "agentSpecialization").length,
          activeOptions: mockSelectOptions.filter((o) => o.category === "agentSpecialization" && o.isActive).length,
          description: "Agent specialization areas",
        },
      ];

      setLoading(false);
      return {
        success: true,
        data: categories,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch category summary";
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
    getOptionsByCategory,
    getActiveOptions,
    createOption,
    updateOption,
    deleteOption,
    reorderOptions,
    toggleOptionStatus,
    getCategorySummary,
  };
};
