import { useState } from "react";
import { ApiResponse } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dashboard-specific types
export interface DashboardStats {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    activeAuctions: number;
    auctionGrowth: number;
    totalProperties: number;
    propertyGrowth: number;
    totalUsers: number;
    userGrowth: number;
  };
  recentActivities: Activity[];
  revenueData: RevenueData[];
  propertyTypeDistribution: PropertyTypeData[];
  auctionMetrics: AuctionMetrics;
  userMetrics: UserMetrics;
  financialMetrics: FinancialMetrics;
  marketingMetrics: MarketingMetrics;
}

export interface Activity {
  id: string;
  type: "property" | "auction" | "user" | "payment";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "pending" | "warning" | "error";
  icon: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  auctions: number;
  properties: number;
}

export interface PropertyTypeData {
  name: string;
  value: number;
  color: string;
}

export interface AuctionMetrics {
  total: number;
  live: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  totalBids: number;
  averageBidsPerAuction: number;
  successRate: number;
}

export interface UserMetrics {
  total: number;
  active: number;
  newThisMonth: number;
  byRole: {
    buyers: number;
    sellers: number;
    investors: number;
    agents: number;
    admins: number;
  };
  kycPending: number;
  kycVerified: number;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  transactionFees: number;
  commissions: number;
  pendingPayments: number;
  revenueBySource: {
    auctions: number;
    directSales: number;
    commissions: number;
    other: number;
  };
}

export interface MarketingMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  emailsSent: number;
  smsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  conversions: number;
  roi: number;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}

// Mock data
const mockDashboardStats: DashboardStats = {
  overview: {
    totalRevenue: 12450000,
    revenueGrowth: 12.5,
    activeAuctions: 23,
    auctionGrowth: 8.3,
    totalProperties: 1060,
    propertyGrowth: -2.4,
    totalUsers: 4523,
    userGrowth: 15.2,
  },
  recentActivities: [
    {
      id: "ACT-001",
      type: "property",
      title: "New Property Listed",
      description: "Luxury Villa in Mayfair - £2.5M",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      status: "success",
      icon: "building",
    },
    {
      id: "ACT-002",
      type: "auction",
      title: "Auction Started",
      description: "Premium Properties Auction - 12 lots",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      status: "success",
      icon: "gavel",
    },
    {
      id: "ACT-003",
      type: "user",
      title: "New User Registration",
      description: "Emma Wilson joined as Buyer",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      status: "pending",
      icon: "user",
    },
    {
      id: "ACT-004",
      type: "payment",
      title: "Payment Received",
      description: "£485,000 - Property Sale",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      status: "success",
      icon: "dollar",
    },
  ],
  revenueData: [
    { month: "Jan", revenue: 45000, auctions: 12, properties: 89 },
    { month: "Feb", revenue: 52000, auctions: 15, properties: 95 },
    { month: "Mar", revenue: 48000, auctions: 14, properties: 87 },
    { month: "Apr", revenue: 61000, auctions: 18, properties: 102 },
    { month: "May", revenue: 58000, auctions: 16, properties: 98 },
    { month: "Jun", revenue: 67000, auctions: 21, properties: 112 },
  ],
  propertyTypeDistribution: [
    { name: "Houses", value: 425, color: "#3b82f6" },
    { name: "Apartments", value: 312, color: "#8b5cf6" },
    { name: "Villas", value: 178, color: "#ec4899" },
    { name: "Commercial", value: 145, color: "#10b981" },
  ],
  auctionMetrics: {
    total: 156,
    live: 23,
    upcoming: 45,
    completed: 78,
    cancelled: 10,
    totalBids: 12470,
    averageBidsPerAuction: 54,
    successRate: 78.3,
  },
  userMetrics: {
    total: 4523,
    active: 3891,
    newThisMonth: 342,
    byRole: {
      buyers: 2134,
      sellers: 892,
      investors: 342,
      agents: 156,
      admins: 12,
    },
    kycPending: 234,
    kycVerified: 3891,
  },
  financialMetrics: {
    totalRevenue: 45800000,
    totalExpenses: 12400000,
    netProfit: 33400000,
    profitMargin: 72.9,
    transactionFees: 2340000,
    commissions: 1890000,
    pendingPayments: 3450000,
    revenueBySource: {
      auctions: 32400000,
      directSales: 9800000,
      commissions: 2100000,
      other: 1500000,
    },
  },
  marketingMetrics: {
    totalCampaigns: 48,
    activeCampaigns: 12,
    emailsSent: 145200,
    smsSent: 34500,
    averageOpenRate: 68.5,
    averageClickRate: 12.3,
    conversions: 1842,
    roi: 3.8,
  },
};

let mockNotifications: NotificationData[] = [
  {
    id: "NOT-001",
    title: "New Auction Started",
    message: "Premium Properties Auction is now live with 12 lots",
    type: "success",
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    read: false,
  },
  {
    id: "NOT-002",
    title: "KYC Verification Required",
    message: "3 users pending KYC verification",
    type: "warning",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    read: false,
  },
  {
    id: "NOT-003",
    title: "Property Approved",
    message: "Luxury Villa in Chelsea has been approved",
    type: "success",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    read: true,
  },
];

export const useDashboardApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get complete dashboard statistics
   */
  const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard stats";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get recent activities
   */
  const getRecentActivities = async (limit = 10): Promise<ApiResponse<Activity[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const activities = mockDashboardStats.recentActivities.slice(0, limit);

      setLoading(false);
      return {
        success: true,
        data: activities,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch activities";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get notifications
   */
  const getNotifications = async (unreadOnly = false): Promise<ApiResponse<NotificationData[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      let notifications = [...mockNotifications];
      if (unreadOnly) {
        notifications = notifications.filter((n) => !n.read);
      }

      setLoading(false);
      return {
        success: true,
        data: notifications,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Mark notification as read
   */
  const markNotificationRead = async (notificationId: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const notification = mockNotifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }

      setLoading(false);
      return {
        success: true,
        message: "Notification marked as read",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark notification";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get overview statistics
   */
  const getOverviewStats = async (): Promise<ApiResponse<DashboardStats["overview"]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats.overview,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch overview";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get revenue analytics
   */
  const getRevenueAnalytics = async (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<RevenueData[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats.revenueData,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch revenue analytics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get auction metrics
   */
  const getAuctionMetrics = async (): Promise<ApiResponse<AuctionMetrics>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats.auctionMetrics,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch auction metrics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get user metrics
   */
  const getUserMetrics = async (): Promise<ApiResponse<UserMetrics>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats.userMetrics,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user metrics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get financial metrics
   */
  const getFinancialMetrics = async (): Promise<ApiResponse<FinancialMetrics>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats.financialMetrics,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch financial metrics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get marketing metrics
   */
  const getMarketingMetrics = async (): Promise<ApiResponse<MarketingMetrics>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      setLoading(false);
      return {
        success: true,
        data: mockDashboardStats.marketingMetrics,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch marketing metrics";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Export dashboard data
   */
  const exportDashboardData = async (format: "pdf" | "excel" | "csv"): Promise<ApiResponse<{ fileUrl: string }>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(2000);

      const fileExtension = format === "excel" ? "xlsx" : format;
      const fileUrl = `/downloads/dashboard-export-${Date.now()}.${fileExtension}`;

      setLoading(false);
      return {
        success: true,
        data: { fileUrl },
        message: "Dashboard data exported successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export data";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get system health status
   */
  const getSystemHealth = async (): Promise<
    ApiResponse<{
      status: "healthy" | "warning" | "critical";
      services: Array<{ name: string; status: string; uptime: number }>;
    }>
  > => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const health = {
        status: "healthy" as const,
        services: [
          { name: "Database", status: "operational", uptime: 99.9 },
          { name: "API Server", status: "operational", uptime: 99.8 },
          { name: "Payment Gateway", status: "operational", uptime: 99.7 },
          { name: "Email Service", status: "operational", uptime: 99.5 },
          { name: "SMS Service", status: "operational", uptime: 99.6 },
        ],
      };

      setLoading(false);
      return {
        success: true,
        data: health,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch system health";
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
    getDashboardStats,
    getRecentActivities,
    getNotifications,
    markNotificationRead,
    getOverviewStats,
    getRevenueAnalytics,
    getAuctionMetrics,
    getUserMetrics,
    getFinancialMetrics,
    getMarketingMetrics,
    exportDashboardData,
    getSystemHealth,
  };
};
