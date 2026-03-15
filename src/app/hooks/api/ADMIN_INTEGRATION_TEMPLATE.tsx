/**
 * Admin Dashboard API Integration Template
 * 
 * This file shows how to integrate all API hooks into the Admin.tsx file
 * Copy the relevant sections into your Admin.tsx
 */

import { useState, useEffect } from "react";
import {
  usePropertyApi,
  useAuctionApi,
  useCampaignApi,
  useReportApi,
  useUserApi,
  useAgentApi,
  useDashboardApi,
} from "../hooks/api";
import type {
  AuctionFormData,
  CampaignFormData,
  ReportFormData,
  UserFormData,
  AgentFormData,
} from "../hooks/api";

export default function AdminIntegrationTemplate() {
  // =====================================================
  // STEP 1: Initialize All API Hooks
  // =====================================================
  
  const propertyApi = usePropertyApi();
  const auctionApi = useAuctionApi();
  const campaignApi = useCampaignApi();
  const reportApi = useReportApi();
  const userApi = useUserApi();
  const agentApi = useAgentApi();
  const dashboardApi = useDashboardApi();

  // =====================================================
  // STEP 2: Add State for Dashboard Data
  // =====================================================
  
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // =====================================================
  // STEP 3: Load Dashboard Data on Mount
  // =====================================================
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load overview stats
    const statsResponse = await dashboardApi.getDashboardStats();
    if (statsResponse.success) {
      setDashboardStats(statsResponse.data);
    }

    // Load recent activities
    const activitiesResponse = await dashboardApi.getRecentActivities(10);
    if (activitiesResponse.success) {
      setRecentActivities(activitiesResponse.data || []);
    }

    // Load notifications
    const notificationsResponse = await dashboardApi.getNotifications();
    if (notificationsResponse.success) {
      setNotifications(notificationsResponse.data || []);
    }
  };

  // =====================================================
  // MODAL 1: Create Auction
  // =====================================================
  
  const [auctionFormData, setAuctionFormData] = useState<AuctionFormData>({
    auctionTitle: "",
    auctionType: "online",
    startDateTime: "",
    endDateTime: "",
    description: "",
    venueName: "",
    venueAddress: "",
    registrationFee: 0,
    depositRequired: 0,
    maxBidders: 100,
    enableAutoBidding: false,
    sendEmailNotifications: true,
  });

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await auctionApi.createAuction(auctionFormData);

    if (response.success) {
      alert(
        `✅ ${response.message}\n\n` +
        `Auction ID: ${response.data?.id}\n` +
        `Title: ${response.data?.auctionTitle}\n` +
        `Type: ${response.data?.auctionType}\n` +
        `Status: ${response.data?.status}`
      );
      
      // Close modal
      setShowCreateAuctionModal(false);
      
      // Reset form
      setAuctionFormData({
        auctionTitle: "",
        auctionType: "online",
        startDateTime: "",
        endDateTime: "",
        description: "",
        venueName: "",
        venueAddress: "",
        registrationFee: 0,
        depositRequired: 0,
        maxBidders: 100,
        enableAutoBidding: false,
        sendEmailNotifications: true,
      });
      
      // Refresh auction list if needed
      // await loadAuctions();
    } else {
      alert(`❌ Failed to create auction\n\n${response.error}`);
    }
  };

  // =====================================================
  // MODAL 2: Send Campaign
  // =====================================================
  
  const [campaignFormData, setCampaignFormData] = useState<CampaignFormData>({
    campaignName: "",
    campaignType: "newsletter",
    targetAudience: "all",
    emailSubject: "",
    emailBody: "",
    emailTemplate: "modern",
    scheduleType: "now",
    scheduleDateTime: "",
  });

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await campaignApi.createCampaign(campaignFormData);

    if (response.success) {
      const message =
        campaignFormData.scheduleType === "now"
          ? `✅ Campaign sent successfully!\n\nRecipients: ${response.data?.sentCount || 0}\nCampaign ID: ${response.data?.id}`
          : `✅ Campaign scheduled!\n\nScheduled for: ${campaignFormData.scheduleDateTime}\nCampaign ID: ${response.data?.id}`;

      alert(message);
      
      // Close modal
      setShowSendCampaignModal(false);
      
      // Reset form
      setCampaignFormData({
        campaignName: "",
        campaignType: "newsletter",
        targetAudience: "all",
        emailSubject: "",
        emailBody: "",
        emailTemplate: "modern",
        scheduleType: "now",
        scheduleDateTime: "",
      });
    } else {
      alert(`❌ Failed to send campaign\n\n${response.error}`);
    }
  };

  // =====================================================
  // MODAL 3: Generate Report
  // =====================================================
  
  const [reportFormData, setReportFormData] = useState<ReportFormData>({
    reportType: "sales",
    startDate: "",
    endDate: "",
    format: "pdf",
    includeCharts: true,
  });

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await reportApi.generateReport(reportFormData);

    if (response.success) {
      alert(
        `✅ Report generated successfully!\n\n` +
        `Report ID: ${response.data?.id}\n` +
        `Type: ${response.data?.reportType}\n` +
        `Format: ${response.data?.format}\n` +
        `Status: ${response.data?.status}`
      );

      // Auto-download if completed
      if (response.data?.status === "completed" && response.data?.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
      }

      // Close modal
      setShowGenerateReportModal(false);
      
      // Reset form
      setReportFormData({
        reportType: "sales",
        startDate: "",
        endDate: "",
        format: "pdf",
        includeCharts: true,
      });
    } else {
      alert(`❌ Failed to generate report\n\n${response.error}`);
    }
  };

  // =====================================================
  // MODAL 4: Add User
  // =====================================================
  
  const [userFormData, setUserFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "buyer",
    accountStatus: "active",
    password: "",
    permissions: {
      canBid: true,
      canList: false,
      emailNotifications: true,
      smsAlerts: false,
    },
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await userApi.createUser(userFormData);

    if (response.success) {
      alert(
        `✅ User created successfully!\n\n` +
        `User ID: ${response.data?.id}\n` +
        `Name: ${response.data?.fullName}\n` +
        `Email: ${response.data?.email}\n` +
        `Role: ${response.data?.role}\n` +
        `Status: ${response.data?.accountStatus}`
      );

      // Close modal
      setShowAddUserModal(false);
      
      // Reset form
      setUserFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "buyer",
        accountStatus: "active",
        password: "",
        permissions: {
          canBid: true,
          canList: false,
          emailNotifications: true,
          smsAlerts: false,
        },
      });
      
      // Refresh user list
      // await loadUsers();
    } else {
      alert(`❌ Failed to create user\n\n${response.error}`);
    }
  };

  // =====================================================
  // MODAL 5: Add Agent
  // =====================================================
  
  const [agentFormData, setAgentFormData] = useState<AgentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    licenseNumber: "",
    officeAddress: "",
    commissionRate: 2.5,
    specialization: "residential",
  });

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await agentApi.createAgent(agentFormData);

    if (response.success) {
      alert(
        `✅ Agent created successfully!\n\n` +
        `Agent ID: ${response.data?.id}\n` +
        `Name: ${response.data?.fullName}\n` +
        `Company: ${response.data?.companyName}\n` +
        `License: ${response.data?.licenseNumber}\n` +
        `Commission: ${response.data?.commissionRate}%`
      );

      // Close modal
      setShowAddAgentModal(false);
      
      // Reset form
      setAgentFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        licenseNumber: "",
        officeAddress: "",
        commissionRate: 2.5,
        specialization: "residential",
      });
      
      // Refresh agent list
      // await loadAgents();
    } else {
      alert(`❌ Failed to create agent\n\n${response.error}`);
    }
  };

  // =====================================================
  // DASHBOARD STATS CARDS
  // =====================================================
  
  const renderOverviewStats = () => {
    if (!dashboardStats) return null;

    const stats = dashboardStats.overview;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="size-6 text-white" />
            </div>
            <span className={`text-sm font-bold ${stats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.revenueGrowth >= 0 ? "+" : ""}
              {stats.revenueGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">
            £{(stats.totalRevenue / 1000000).toFixed(2)}M
          </h3>
          <p className="text-slate-600 font-medium text-sm">Total Revenue</p>
        </div>

        {/* Active Auctions Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Gavel className="size-6 text-white" />
            </div>
            <span className={`text-sm font-bold ${stats.auctionGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.auctionGrowth >= 0 ? "+" : ""}
              {stats.auctionGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{stats.activeAuctions}</h3>
          <p className="text-slate-600 font-medium text-sm">Active Auctions</p>
        </div>

        {/* Total Properties Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Building2 className="size-6 text-white" />
            </div>
            <span className={`text-sm font-bold ${stats.propertyGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.propertyGrowth >= 0 ? "+" : ""}
              {stats.propertyGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{stats.totalProperties}</h3>
          <p className="text-slate-600 font-medium text-sm">Total Properties</p>
        </div>

        {/* Total Users Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Users className="size-6 text-white" />
            </div>
            <span className={`text-sm font-bold ${stats.userGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.userGrowth >= 0 ? "+" : ""}
              {stats.userGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-slate-600 font-medium text-sm">Total Users</p>
        </div>
      </div>
    );
  };

  // =====================================================
  // RENDER EXAMPLE: Create Auction Modal with API
  // =====================================================
  
  return (
    <div>
      {/* ... other dashboard content ... */}

      {/* Create Auction Modal - WITH API INTEGRATION */}
      {showCreateAuctionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black mb-6">Create New Auction</h2>

            <form onSubmit={handleCreateAuction} className="space-y-6">
              {/* Auction Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Auction Title *</label>
                <input
                  type="text"
                  value={auctionFormData.auctionTitle}
                  onChange={(e) => setAuctionFormData({ ...auctionFormData, auctionTitle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                  required
                />
              </div>

              {/* Auction Type */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Auction Type *</label>
                <select
                  value={auctionFormData.auctionType}
                  onChange={(e) => setAuctionFormData({ ...auctionFormData, auctionType: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                  required
                >
                  <option value="live">Live Auction</option>
                  <option value="online">Online Auction</option>
                  <option value="hybrid">Hybrid Auction</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={auctionFormData.startDateTime}
                    onChange={(e) => setAuctionFormData({ ...auctionFormData, startDateTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={auctionFormData.endDateTime}
                    onChange={(e) => setAuctionFormData({ ...auctionFormData, endDateTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Show API Loading State */}
              {auctionApi.loading && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                  <div className="inline-block animate-spin size-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-sm text-blue-800 font-bold">Creating auction...</p>
                </div>
              )}

              {/* Show API Error */}
              {auctionApi.error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
                  <p className="font-bold">Error:</p>
                  <p className="text-sm">{auctionApi.error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateAuctionModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold"
                  disabled={auctionApi.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold disabled:opacity-50"
                  disabled={auctionApi.loading}
                >
                  {auctionApi.loading ? "Creating..." : "Create Auction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// HELPER: Modal State Management
// =====================================================

// Add these useState hooks to your Admin component:
const [showCreateAuctionModal, setShowCreateAuctionModal] = useState(false);
const [showSendCampaignModal, setShowSendCampaignModal] = useState(false);
const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
const [showAddUserModal, setShowAddUserModal] = useState(false);
const [showAddAgentModal, setShowAddAgentModal] = useState(false);

// =====================================================
// INTEGRATION INSTRUCTIONS
// =====================================================

/**
 * TO INTEGRATE INTO ADMIN.TSX:
 * 
 * 1. Add imports at the top:
 *    import { useAuctionApi, useCampaignApi, useReportApi, useUserApi, useAgentApi, useDashboardApi } from "../hooks/api";
 * 
 * 2. Initialize hooks in component:
 *    const auctionApi = useAuctionApi();
 *    const campaignApi = useCampaignApi();
 *    // ... etc
 * 
 * 3. Add form state:
 *    const [auctionFormData, setAuctionFormData] = useState<AuctionFormData>({ ... });
 * 
 * 4. Replace modal submit handlers:
 *    Replace your existing handleSubmit with handleCreateAuction, handleSendCampaign, etc.
 * 
 * 5. Update form inputs:
 *    Update value and onChange props to use the new form data state
 * 
 * 6. Add loading/error states:
 *    Show loading spinners and error messages from API hooks
 * 
 * 7. Test each modal:
 *    - Fill form and submit
 *    - Verify loading state appears
 *    - Check success alert
 *    - Verify modal closes
 *    - Check error handling
 */
