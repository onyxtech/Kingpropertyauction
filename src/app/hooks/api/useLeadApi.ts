import { useState } from "react";
import { ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lead Types
export interface LeadFormData {
  leadType:
    | "valuation"
    | "contact"
    | "newsletter"
    | "buying_pack"
    | "referral"
    | "survey_booking"
    | "faq"
    | "general";
  
  // Personal Information
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;

  // Lead-specific fields
  propertyAddress?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  approximateSize?: string;
  message?: string;
  department?: string;
  budgetRange?: string;
  buyerType?: string;
  
  // Referral fields
  refereeName?: string;
  refereeEmail?: string;
  refereePhone?: string;
  relationship?: string;
  
  // Survey booking fields
  surveyType?: string;
  preferredDate?: string;
  specialRequirements?: string;
  
  // Metadata
  source?: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
}

export interface Lead {
  id: string;
  leadType: LeadFormData["leadType"];
  fullName: string;
  email: string;
  phoneNumber?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed" | "spam";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  source?: string;
  formData: any; // Complete form data
  createdAt: string;
  updatedAt: string;
  contactedAt?: string;
  convertedAt?: string;
  notes?: string[];
}

// Mock leads data
let mockLeads: Lead[] = [
  {
    id: "LEAD-001",
    leadType: "valuation",
    fullName: "Emma Thompson",
    email: "emma.t@example.com",
    phoneNumber: "+44 7700 900001",
    status: "new",
    priority: "high",
    source: "website",
    formData: {
      propertyAddress: "123 High Street, London",
      propertyType: "house",
      bedrooms: 3,
      bathrooms: 2,
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "LEAD-002",
    leadType: "contact",
    fullName: "James Wilson",
    email: "james.w@example.com",
    phoneNumber: "+44 7700 900002",
    status: "contacted",
    priority: "medium",
    source: "website",
    formData: {
      department: "sales",
      message: "Interested in selling my property",
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    contactedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

let nextLeadId = 3;

export const useLeadApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit a new lead
   */
  const submitLead = async (data: LeadFormData): Promise<ApiResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      // Validate required fields
      if (!data.email) {
        throw new Error("Email is required");
      }

      // Determine priority based on lead type
      let priority: Lead["priority"] = "medium";
      if (data.leadType === "valuation" || data.leadType === "referral") {
        priority = "high";
      } else if (data.leadType === "newsletter") {
        priority = "low";
      }

      // Create new lead
      const newLead: Lead = {
        id: `LEAD-${String(nextLeadId).padStart(3, "0")}`,
        leadType: data.leadType,
        fullName: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown",
        email: data.email,
        phoneNumber: data.phoneNumber,
        status: "new",
        priority,
        source: data.source || "website",
        formData: data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [],
      };

      mockLeads.push(newLead);
      nextLeadId++;

      setLoading(false);
      return {
        success: true,
        data: newLead,
        message: getSuccessMessage(data.leadType),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit lead";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all leads with pagination and filters
   */
  const getLeads = async (params?: QueryParams & {
    leadType?: string;
    status?: string;
    priority?: string;
  }): Promise<PaginatedResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      let filteredLeads = [...mockLeads];

      // Apply filters
      if (params?.leadType) {
        filteredLeads = filteredLeads.filter((l) => l.leadType === params.leadType);
      }
      if (params?.status) {
        filteredLeads = filteredLeads.filter((l) => l.status === params.status);
      }
      if (params?.priority) {
        filteredLeads = filteredLeads.filter((l) => l.priority === params.priority);
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredLeads = filteredLeads.filter(
          (l) =>
            l.fullName.toLowerCase().includes(search) ||
            l.email.toLowerCase().includes(search) ||
            l.phoneNumber?.toLowerCase().includes(search)
        );
      }

      // Sort
      const sortBy = params?.sortBy || "createdAt";
      const sortOrder = params?.sortOrder || "desc";
      filteredLeads.sort((a, b) => {
        const aVal = a[sortBy as keyof Lead];
        const bVal = b[sortBy as keyof Lead];
        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });

      // Pagination
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

      setLoading(false);
      return {
        success: true,
        data: paginatedLeads,
        total: filteredLeads.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredLeads.length / pageSize),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch leads";
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
   * Get single lead by ID
   */
  const getLeadById = async (id: string): Promise<ApiResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const lead = mockLeads.find((l) => l.id === id);

      if (!lead) {
        throw new Error("Lead not found");
      }

      setLoading(false);
      return {
        success: true,
        data: lead,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch lead";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update lead status
   */
  const updateLeadStatus = async (
    id: string,
    status: Lead["status"]
  ): Promise<ApiResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(600);

      const lead = mockLeads.find((l) => l.id === id);

      if (!lead) {
        throw new Error("Lead not found");
      }

      lead.status = status;
      lead.updatedAt = new Date().toISOString();

      if (status === "contacted" && !lead.contactedAt) {
        lead.contactedAt = new Date().toISOString();
      }
      if (status === "converted" && !lead.convertedAt) {
        lead.convertedAt = new Date().toISOString();
      }

      setLoading(false);
      return {
        success: true,
        data: lead,
        message: `Lead status updated to ${status}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update lead";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Update lead priority
   */
  const updateLeadPriority = async (
    id: string,
    priority: Lead["priority"]
  ): Promise<ApiResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const lead = mockLeads.find((l) => l.id === id);

      if (!lead) {
        throw new Error("Lead not found");
      }

      lead.priority = priority;
      lead.updatedAt = new Date().toISOString();

      setLoading(false);
      return {
        success: true,
        data: lead,
        message: `Lead priority updated to ${priority}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update priority";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Assign lead to user
   */
  const assignLead = async (leadId: string, userId: string): Promise<ApiResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const lead = mockLeads.find((l) => l.id === leadId);

      if (!lead) {
        throw new Error("Lead not found");
      }

      lead.assignedTo = userId;
      lead.updatedAt = new Date().toISOString();

      setLoading(false);
      return {
        success: true,
        data: lead,
        message: "Lead assigned successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign lead";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Add note to lead
   */
  const addLeadNote = async (leadId: string, note: string): Promise<ApiResponse<Lead>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const lead = mockLeads.find((l) => l.id === leadId);

      if (!lead) {
        throw new Error("Lead not found");
      }

      if (!lead.notes) {
        lead.notes = [];
      }

      lead.notes.push(`${new Date().toISOString()}: ${note}`);
      lead.updatedAt = new Date().toISOString();

      setLoading(false);
      return {
        success: true,
        data: lead,
        message: "Note added successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add note";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete lead
   */
  const deleteLead = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockLeads.findIndex((l) => l.id === id);

      if (index === -1) {
        throw new Error("Lead not found");
      }

      mockLeads.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Lead deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete lead";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get lead statistics
   */
  const getLeadStats = async (): Promise<
    ApiResponse<{
      total: number;
      newLeads: number;
      contacted: number;
      qualified: number;
      converted: number;
      conversionRate: number;
      byType: Record<string, number>;
      byPriority: Record<string, number>;
    }>
  > => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const total = mockLeads.length;
      const newLeads = mockLeads.filter((l) => l.status === "new").length;
      const contacted = mockLeads.filter((l) => l.status === "contacted").length;
      const qualified = mockLeads.filter((l) => l.status === "qualified").length;
      const converted = mockLeads.filter((l) => l.status === "converted").length;
      const conversionRate = total > 0 ? (converted / total) * 100 : 0;

      const byType: Record<string, number> = {};
      const byPriority: Record<string, number> = {};

      mockLeads.forEach((lead) => {
        byType[lead.leadType] = (byType[lead.leadType] || 0) + 1;
        byPriority[lead.priority] = (byPriority[lead.priority] || 0) + 1;
      });

      setLoading(false);
      return {
        success: true,
        data: {
          total,
          newLeads,
          contacted,
          qualified,
          converted,
          conversionRate: Math.round(conversionRate * 10) / 10,
          byType,
          byPriority,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get stats";
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
    submitLead,
    getLeads,
    getLeadById,
    updateLeadStatus,
    updateLeadPriority,
    assignLead,
    addLeadNote,
    deleteLead,
    getLeadStats,
  };
};

// Helper function for success messages
function getSuccessMessage(leadType: LeadFormData["leadType"]): string {
  const messages: Record<LeadFormData["leadType"], string> = {
    valuation: "Thank you! We'll contact you within 24 hours with a free property valuation.",
    contact: "Thank you for contacting us! We'll get back to you shortly.",
    newsletter: "Successfully subscribed! Check your email for confirmation.",
    buying_pack: "Thank you! Your Buyer Starter Pack will be sent to your email shortly.",
    referral: "Thank you for the referral! We'll review it and be in touch soon.",
    survey_booking: "Survey booking request received! We'll contact you to confirm the appointment.",
    faq: "Thank you for your question! Our team will respond shortly.",
    general: "Thank you! Your request has been submitted successfully.",
  };

  return messages[leadType] || "Thank you! Your submission has been received.";
}
