import { useState } from "react";
import { Report, ReportFormData, ApiResponse, PaginatedResponse, QueryParams } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database
let mockReports: Report[] = [
  {
    id: "RPT-001",
    reportType: "sales",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    format: "pdf",
    includeCharts: true,
    status: "completed",
    fileUrl: "/downloads/reports/sales-report-feb-2026.pdf",
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "RPT-002",
    reportType: "auction",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    format: "excel",
    includeCharts: true,
    status: "completed",
    fileUrl: "/downloads/reports/auction-report-jan-2026.xlsx",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "RPT-003",
    reportType: "financial",
    startDate: "2026-03-01",
    endDate: "2026-03-13",
    format: "pdf",
    includeCharts: true,
    status: "generating",
    createdAt: "2026-03-13T10:00:00Z",
  },
];

let nextReportId = 4;

export const useReportApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate a new report
   */
  const generateReport = async (data: ReportFormData): Promise<ApiResponse<Report>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(2000); // Simulate report generation time

      const reportId = `RPT-${String(nextReportId).padStart(3, "0")}`;
      const fileExtension = data.format === "excel" ? "xlsx" : data.format;
      const fileName = `${data.reportType}-report-${Date.now()}.${fileExtension}`;

      const newReport: Report = {
        ...data,
        id: reportId,
        status: "completed",
        fileUrl: `/downloads/reports/${fileName}`,
        createdAt: new Date().toISOString(),
      };

      mockReports.push(newReport);
      nextReportId++;

      setLoading(false);
      return {
        success: true,
        data: newReport,
        message: "Report generated successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate report";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get all reports with pagination and filters
   */
  const getReports = async (params?: QueryParams): Promise<PaginatedResponse<Report>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      let filteredReports = [...mockReports];

      // Apply filters
      if (params?.type) {
        filteredReports = filteredReports.filter((r) => r.reportType === params.type);
      }

      if (params?.status) {
        filteredReports = filteredReports.filter((r) => r.status === params.status);
      }

      if (params?.dateFrom) {
        filteredReports = filteredReports.filter((r) => r.startDate >= params.dateFrom!);
      }

      if (params?.dateTo) {
        filteredReports = filteredReports.filter((r) => r.endDate <= params.dateTo!);
      }

      // Apply sorting (default: newest first)
      filteredReports.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return params?.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      // Pagination
      const total = filteredReports.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredReports.slice(startIndex, endIndex);

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
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch reports";
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
   * Get a single report by ID
   */
  const getReportById = async (id: string): Promise<ApiResponse<Report>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const report = mockReports.find((r) => r.id === id);

      if (!report) {
        throw new Error("Report not found");
      }

      setLoading(false);
      return {
        success: true,
        data: report,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch report";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Delete a report
   */
  const deleteReport = async (id: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const index = mockReports.findIndex((r) => r.id === id);

      if (index === -1) {
        throw new Error("Report not found");
      }

      mockReports.splice(index, 1);

      setLoading(false);
      return {
        success: true,
        message: "Report deleted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete report";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Download a report file
   */
  const downloadReport = async (id: string): Promise<ApiResponse<{ downloadUrl: string }>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const report = mockReports.find((r) => r.id === id);

      if (!report) {
        throw new Error("Report not found");
      }

      if (report.status !== "completed") {
        throw new Error("Report is not ready for download");
      }

      if (!report.fileUrl) {
        throw new Error("Report file not available");
      }

      setLoading(false);
      return {
        success: true,
        data: { downloadUrl: report.fileUrl },
        message: "Report ready for download",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to download report";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get report analytics/statistics
   */
  const getReportAnalytics = async (reportType: string, startDate: string, endDate: string): Promise<ApiResponse<any>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      // Mock analytics data based on report type
      const analytics: Record<string, any> = {
        sales: {
          totalSales: 142,
          totalRevenue: 45800000,
          averageSalePrice: 322535,
          topProperty: "Luxury Villa - Mayfair",
          growthRate: 12.5,
        },
        auction: {
          totalAuctions: 23,
          completedAuctions: 18,
          totalBids: 1247,
          averageBidsPerAuction: 54,
          successRate: 78.3,
        },
        user: {
          totalUsers: 4523,
          newUsers: 342,
          activeUsers: 3891,
          usersByRole: {
            buyers: 2134,
            sellers: 892,
            investors: 342,
            agents: 156,
          },
        },
        property: {
          totalListings: 1060,
          activeListings: 523,
          soldProperties: 142,
          pendingProperties: 395,
          averageListingValue: 485000,
        },
        financial: {
          totalRevenue: 45800000,
          totalExpenses: 12400000,
          netProfit: 33400000,
          profitMargin: 72.9,
          transactionFees: 2340000,
        },
        marketing: {
          totalCampaigns: 12,
          emailsSent: 45200,
          averageOpenRate: 68.5,
          averageClickRate: 12.3,
          conversions: 342,
        },
      };

      setLoading(false);
      return {
        success: true,
        data: analytics[reportType] || {},
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Schedule a recurring report
   */
  const scheduleRecurringReport = async (
    data: ReportFormData,
    frequency: "daily" | "weekly" | "monthly"
  ): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      // In a real implementation, this would create a scheduled task
      setLoading(false);
      return {
        success: true,
        message: `Report scheduled to run ${frequency}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to schedule report";
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
    generateReport,
    getReports,
    getReportById,
    deleteReport,
    downloadReport,
    getReportAnalytics,
    scheduleRecurringReport,
  };
};
