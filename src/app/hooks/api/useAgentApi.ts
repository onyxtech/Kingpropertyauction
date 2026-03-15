import { useState } from "react";
import { Agent, AgentFormData, ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let mockAgents: Agent[] = [
  {
    id: "AGT-001",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@premiumproperties.com",
    phoneNumber: "+44 7700 900101",
    companyName: "Premium Property Agency",
    licenseNumber: "LIC-2023-45678",
    officeAddress: "123 Business Street, London, W1A 1AA",
    commissionRate: 2.5,
    specialization: "luxury",
    status: "active",
    totalListings: 47,
    totalSales: 23,
    rating: 4.8,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2026-03-13T10:00:00Z",
  },
  {
    id: "AGT-002",
    firstName: "David",
    lastName: "Thompson",
    fullName: "David Thompson",
    email: "david.thompson@cityestates.com",
    phoneNumber: "+44 7700 900102",
    companyName: "City Estates Ltd",
    licenseNumber: "LIC-2022-12345",
    officeAddress: "456 High Street, Manchester, M1 1AD",
    commissionRate: 3.0,
    specialization: "residential",
    status: "active",
    totalListings: 89,
    totalSales: 56,
    rating: 4.6,
    createdAt: "2024-06-20T10:00:00Z",
    updatedAt: "2026-03-12T10:00:00Z",
  },
  {
    id: "AGT-003",
    firstName: "Emily",
    lastName: "Roberts",
    fullName: "Emily Roberts",
    email: "emily.roberts@commercialpro.com",
    phoneNumber: "+44 7700 900103",
    companyName: "Commercial Pro Realty",
    licenseNumber: "LIC-2023-98765",
    officeAddress: "789 Market Road, Birmingham, B2 4QA",
    commissionRate: 4.0,
    specialization: "commercial",
    status: "active",
    totalListings: 34,
    totalSales: 18,
    rating: 4.9,
    createdAt: "2025-03-10T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
  },
];

let nextAgentId = 4;

export const useAgentApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new agent
   */
  const createAgent = async (data: AgentFormData): Promise<ApiResponse<Agent>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      // Check if email already exists
      const existingAgent = mockAgents.find((a) => a.email === data.email);
      if (existingAgent) {
        throw new Error("Email already exists");
      }

      const newAgent: Agent = {
        id: `AGT-${String(nextAgentId).padStart(3, "0")}`,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        licenseNumber: data.licenseNumber,
        officeAddress: data.officeAddress,
        commissionRate: data.commissionRate,
        specialization: data.specialization,
        status: "active",
        totalListings: 0,
        totalSales: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockAgents.push(newAgent);
      nextAgentId++;

      setLoading(false);
      return {
        success: true,
        data: newAgent,
        message: "Agent created successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create agent";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all agents with pagination and filters
   */
  const getAgents = async (params?: QueryParams): Promise<PaginatedResponse<Agent>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      let filteredAgents = [...mockAgents];

      // Apply filters
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredAgents = filteredAgents.filter(
          (a) =>
            a.fullName.toLowerCase().includes(searchLower) ||
            a.email.toLowerCase().includes(searchLower) ||
            a.companyName.toLowerCase().includes(searchLower) ||
            a.licenseNumber?.toLowerCase().includes(searchLower)
        );
      }

      if (params?.status) {
        filteredAgents = filteredAgents.filter((a) => a.status === params.status);
      }

      if (params?.type) {
        filteredAgents = filteredAgents.filter((a) => a.specialization === params.type);
      }

      // Apply sorting
      if (params?.sortBy) {
        filteredAgents.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Agent];
          const bValue = b[params.sortBy as keyof Agent];

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
      const total = filteredAgents.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredAgents.slice(startIndex, endIndex);

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
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agents";
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
   * Get a single agent by ID
   */
  const getAgentById = async (id: string): Promise<ApiResponse<Agent>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const agent = mockAgents.find((a) => a.id === id);

      if (!agent) {
        throw new Error("Agent not found");
      }

      setLoading(false);
      return {
        success: true,
        data: agent,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update an existing agent
   */
  const updateAgent = async (id: string, data: Partial<AgentFormData>): Promise<ApiResponse<Agent>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const index = mockAgents.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Agent not found");
      }

      // Check email uniqueness if email is being changed
      if (data.email && data.email !== mockAgents[index].email) {
        const existingAgent = mockAgents.find((a) => a.email === data.email);
        if (existingAgent) {
          throw new Error("Email already exists");
        }
      }

      const updatedAgent: Agent = {
        ...mockAgents[index],
        ...data,
        fullName:
          data.firstName || data.lastName
            ? `${data.firstName || mockAgents[index].firstName} ${data.lastName || mockAgents[index].lastName}`
            : mockAgents[index].fullName,
        updatedAt: new Date().toISOString(),
      };

      mockAgents[index] = updatedAgent;

      setLoading(false);
      return {
        success: true,
        data: updatedAgent,
        message: "Agent updated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update agent";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete an agent
   */
  const deleteAgent = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAgents.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Agent not found");
      }

      mockAgents.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Agent deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete agent";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Suspend an agent
   */
  const suspendAgent = async (id: string, reason?: string): Promise<ApiResponse<Agent>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAgents.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Agent not found");
      }

      mockAgents[index] = {
        ...mockAgents[index],
        status: "suspended",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockAgents[index],
        message: `Agent suspended${reason ? `: ${reason}` : ""}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to suspend agent";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Activate an agent
   */
  const activateAgent = async (id: string): Promise<ApiResponse<Agent>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockAgents.findIndex((a) => a.id === id);

      if (index === -1) {
        throw new Error("Agent not found");
      }

      mockAgents[index] = {
        ...mockAgents[index],
        status: "active",
        updatedAt: new Date().toISOString(),
      };

      setLoading(false);
      return {
        success: true,
        data: mockAgents[index],
        message: "Agent activated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to activate agent";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get agent performance statistics
   */
  const getAgentPerformance = async (id: string): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const agent = mockAgents.find((a) => a.id === id);

      if (!agent) {
        throw new Error("Agent not found");
      }

      const performance = {
        totalListings: agent.totalListings || 0,
        totalSales: agent.totalSales || 0,
        conversionRate: agent.totalListings ? ((agent.totalSales || 0) / agent.totalListings) * 100 : 0,
        rating: agent.rating || 0,
        totalCommissionEarned: (agent.totalSales || 0) * (agent.commissionRate || 0) * 10000, // Mock calculation
        activeListings: Math.floor((agent.totalListings || 0) * 0.3),
        averageSalePrice: 485000,
        monthlyPerformance: [
          { month: "Jan", sales: 3, revenue: 1455000 },
          { month: "Feb", sales: 4, revenue: 1940000 },
          { month: "Mar", sales: 2, revenue: 970000 },
        ],
      };

      setLoading(false);
      return {
        success: true,
        data: performance,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent performance";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get agent statistics
   */
  const getAgentStats = async (): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const stats = {
        total: mockAgents.length,
        active: mockAgents.filter((a) => a.status === "active").length,
        inactive: mockAgents.filter((a) => a.status === "inactive").length,
        suspended: mockAgents.filter((a) => a.status === "suspended").length,
        bySpecialization: {
          residential: mockAgents.filter((a) => a.specialization === "residential").length,
          commercial: mockAgents.filter((a) => a.specialization === "commercial").length,
          luxury: mockAgents.filter((a) => a.specialization === "luxury").length,
          all: mockAgents.filter((a) => a.specialization === "all").length,
        },
        totalListings: mockAgents.reduce((sum, a) => sum + (a.totalListings || 0), 0),
        totalSales: mockAgents.reduce((sum, a) => sum + (a.totalSales || 0), 0),
        averageRating:
          mockAgents.reduce((sum, a) => sum + (a.rating || 0), 0) / mockAgents.length,
      };

      setLoading(false);
      return {
        success: true,
        data: stats,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent stats";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Assign property to agent
   */
  const assignPropertyToAgent = async (
    agentId: string,
    propertyId: string
  ): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const agent = mockAgents.find((a) => a.id === agentId);

      if (!agent) {
        throw new Error("Agent not found");
      }

      setLoading(false);
      return {
        success: true,
        message: `Property ${propertyId} assigned to agent ${agent.fullName}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign property";
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
    createAgent,
    getAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
    suspendAgent,
    activateAgent,
    getAgentPerformance,
    getAgentStats,
    assignPropertyToAgent,
  };
};
