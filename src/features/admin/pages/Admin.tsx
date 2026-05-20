import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { useAdminStats } from "../api/useAdminApi";
import { useUserApi } from "../api/useUserApi";
import { useQueryClient } from "@tanstack/react-query";

import {
  LayoutDashboard,
  Building2,
  Users,
  Gavel,
  TrendingUp,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Search,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Menu,
  Mail,
  MessageSquare,
  Share2,
  Database,
  Shield,
  Lock,
  CreditCard,
  Receipt,
  BrainCircuit,
  AlertTriangle,
  Target,
  BarChart3,
  FileCheck,
  Sparkles,
  Globe,
  Link,
  Calendar,
  Send,
  Zap,
  Bot,
  TrendingDown,
  UserCheck,
  Home,
  Plus,
  X,
  Briefcase,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import AdminLayout from "../components/AdminLayout";
import StatsCards from "../components/StatsCards";
import PropertyStats from "../components/PropertyStats";
import PropertiesTable from "../components/PropertiesTable";
import AuctionStats from "@/features/auction/components/AuctionStats";
import AuctionCards from "@/features/auction/components/AuctionCards";
import AuctionFormModal from "@/features/auction/components/AuctionFormModal";
import EditUserModal from "../components/EditUserModal";
import AddUserModal from "../components/AddUserModal";
import AddAgentModal from "../components/AddAgentModal";
import { useTheme } from "../../../app/hooks/useTheme";
import PageBuilderWithAPI from "../components/PageBuilderWithAPI";
import MenuEditor from "../components/MenuEditor";
import ConfirmModal from "@/features/shared/components/ConfirmModal";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { apiClient } from "@/lib/apiClient";
import {
  allWebsitePages,
  pageCategories,
} from "../../website/data/websitePages";
import StatsOverview from "../components/dashboard/StatsOverview";
import AuctionsTab from "../components/dashboard/AuctionsTab";
import UsersTab from "../components/dashboard/UsersTab";
import LiveRoomResultsModal from "../components/dashboard/LiveRoomResultsModal";
import PageBuilderTab from "../components/PageBuilderTab";
import MenuManagerTab from "../components/MenuManagerTab";
import AiTab from "../components/AiTab";
import ComplianceTab from "../components/ComplianceTab";
import FinancialTab from "../components/FinancialTab";
import SocialTab from "../components/SocialTab";
import InvestorsTab from "../components/InvestorsTab";
import RejectModal from "../components/RejectModal";

export default function Admin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useAdminStats();
  const { useGetUsers, useUpdateUserStatus, useDeleteUser } = useUserApi();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const updateUserStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

  const getInitialTab = () => {
    const path = window.location.pathname
      .replace("/admin/", "")
      .replace("/admin", "");
    return path || "overview";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showCreateAuctionModal, setShowCreateAuctionModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [pages, setPages] = useState(allWebsitePages);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // Live Room Auction management state
  const [liveRoomAuctions, setLiveRoomAuctions] = useState<any[]>([]);
  const [liveRegistrations, setLiveRegistrations] = useState<any[]>([]);
  const [selectedLiveAuction, setSelectedLiveAuction] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingLead, setRejectingLead] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [auctionViewMode, setAuctionViewMode] = useState<"online" | "liveroom">(
    "online",
  );
  const [liveRoomStats, setLiveRoomStats] = useState({
    total: 0,
    live: 0,
    scheduled: 0,
    completed: 0,
    totalRegistrations: 0,
  });
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsAuction, setResultsAuction] = useState<any>(null);
  const [propertyResults, setPropertyResults] = useState<any[]>([]);
  const [savingResults, setSavingResults] = useState(false);

  useEffect(() => {
    let path = location.pathname.replace("/admin/", "").replace("/admin", "");
    if (!path || path === "/admin") path = "overview";
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    if (activeTab !== "auctions") return;
    Promise.all([
      apiClient.fetch("/auctions?limit=100"),
      apiClient.fetch("/leads?leadType=live-registration&limit=1"),
    ])
      .then(([auctionData, regData]: any[]) => {
        const all = (auctionData.data || []) as any[];
        const liveRoom = all.filter((a: any) => a.auctionType === "live");
        setLiveRoomAuctions(liveRoom);
        setLiveRoomStats({
          total: liveRoom.length,
          live: liveRoom.filter((a: any) => a.status === "live").length,
          scheduled: liveRoom.filter((a: any) => a.status === "scheduled")
            .length,
          completed: liveRoom.filter((a: any) => a.status === "completed")
            .length,
          totalRegistrations:
            regData?.pagination?.total || regData?.data?.length || 0,
        });
      })
      .catch(() => {});
  }, [activeTab]);

  const refetchAllAuctions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["auctions"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    apiClient
      .fetch("/auctions?limit=100")
      .then((data: any) => {
        const all = (data.data || []) as any[];
        const liveRoom = all.filter((a: any) => a.auctionType === "live");
        setLiveRoomAuctions(liveRoom);
        setLiveRoomStats((prev) => ({
          ...prev,
          total: liveRoom.length,
          live: liveRoom.filter((a: any) => a.status === "live").length,
          scheduled: liveRoom.filter((a: any) => a.status === "scheduled")
            .length,
          completed: liveRoom.filter((a: any) => a.status === "completed")
            .length,
        }));
      })
      .catch(() => {});
  }, [queryClient]);

  useAuctionSocket({
    onAuctionUpdate: () => refetchAllAuctions(),
    onBidUpdate: () => refetchAllAuctions(),
  });

  const fetchLiveRegistrations = async (auctionId: string) => {
    const data = await apiClient.fetch(
      `/leads/live-registrations?auctionId=${auctionId}`,
    );
    if (data.success) setLiveRegistrations(data.data || []);
  };

  const handleApproveLead = async (leadId: string) => {
    const data = await apiClient.fetch(`/leads/${leadId}/approve`, {
      method: "PATCH",
    });
    if (data.success) {
      setLiveRegistrations((prev) =>
        prev.map((l) =>
          l._id === leadId ? { ...l, approvalStatus: "approved" } : l,
        ),
      );
      setToastMsg("Registration approved!");
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleRejectLead = async () => {
    if (!rejectingLead) return;
    const data = await apiClient.fetch(`/leads/${rejectingLead._id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason: rejectReason }),
    });
    if (data.success) {
      setLiveRegistrations((prev) =>
        prev.map((l) =>
          l._id === rejectingLead._id
            ? { ...l, approvalStatus: "rejected" }
            : l,
        ),
      );
      setShowRejectModal(false);
      setRejectingLead(null);
      setRejectReason("");
      setToastMsg("Registration rejected.");
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleSaveResults = async () => {
    if (!resultsAuction || savingResults) return;
    setSavingResults(true);
    try {
      const data = await apiClient.fetch(
        `/auctions/${resultsAuction._id}/live-results`,
        {
          method: "POST",
          body: JSON.stringify({ results: propertyResults }),
        },
      );
      if (data.success) {
        setShowResultsModal(false);
        setResultsAuction(null);
        setToastMsg("Results saved successfully!");
        setTimeout(() => setToastMsg(""), 4000);
        apiClient
          .fetch("/auctions?limit=100")
          .then((auctionData: any) => {
            const all = (auctionData.data || []) as any[];
            const liveRoom = all.filter((a: any) => a.auctionType === "live");
            setLiveRoomAuctions(liveRoom);
          })
          .catch(() => {});
      } else {
        setToastMsg("❌ " + (data.message || "Failed to save results"));
        setTimeout(() => setToastMsg(""), 5000);
      }
    } catch (e: any) {
      setToastMsg("❌ Error: " + e.message);
      setTimeout(() => setToastMsg(""), 5000);
    } finally {
      setSavingResults(false);
    }
  };

  const modules = [
    {
      id: "pageBuilder",
      title: "Page Builder",
      description: "Create and manage dynamic website pages",
      icon: FileText,
      gradient: "from-blue-500 to-indigo-600",
      stats: { pages: 24, published: 18 },
    },
    {
      id: "menuManager",
      title: "Menu Manager",
      description: "Create navigation menus with drag-drop",
      icon: Menu,
      gradient: "from-cyan-500 to-blue-600",
      stats: { menus: 4, items: 32 },
    },
    {
      id: "properties",
      title: "Property Management",
      description: "Approve, categorize and manage listings",
      icon: Building2,
      gradient: "from-purple-500 to-pink-600",
      stats: {
        total: stats?.totalProperties || 0,
        pending: stats?.pendingProperties || 0,
      },
    },
    {
      id: "auctions",
      title: "Auction Management",
      description: "Create and manage live auctions",
      icon: Gavel,
      gradient: "from-rose-500 to-red-600",
      stats: {
        active: stats?.liveAuctions || 0,
        scheduled: (stats?.totalAuctions || 0) - (stats?.liveAuctions || 0),
      },
    },
    {
      id: "marketing",
      title: "Marketing Hub",
      description: "SMS, Email campaigns & auto alerts",
      icon: Send,
      gradient: "from-emerald-500 to-teal-600",
      stats: { campaigns: 18, sent: "52.4K" },
    },
    {
      id: "social",
      title: "Social Integration",
      description: "Share to social media & sync with portals",
      icon: Share2,
      gradient: "from-orange-500 to-amber-600",
      stats: { platforms: 5, synced: 892 },
    },
    {
      id: "investors",
      title: "Investor Dashboard",
      description: "ROI estimation & analytics",
      icon: TrendingUp,
      gradient: "from-violet-500 to-purple-600",
      stats: { investors: 342, opportunities: 156 },
    },
    {
      id: "ai",
      title: "AI Optimization",
      description: "Valuation, fraud detection & predictions",
      icon: BrainCircuit,
      gradient: "from-fuchsia-500 to-pink-600",
      stats: { valuations: 1024, alerts: 7 },
    },
    {
      id: "compliance",
      title: "Legal & Compliance",
      description: "KYC, AML monitoring & contracts",
      icon: Shield,
      gradient: "from-indigo-500 to-blue-600",
      stats: { verified: 1156, pending: 34 },
    },
    {
      id: "financial",
      title: "Financial Management",
      description: "Escrow, commissions & invoices",
      icon: CreditCard,
      gradient: "from-green-500 to-emerald-600",
      stats: { escrow: "£2.4M", revenue: "£187K" },
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage buyers, sellers & agents",
      icon: Users,
      gradient: "from-pink-500 to-rose-600",
      stats: {
        total: stats?.totalUsers || 0,
        active: (stats?.totalUsers || 0) - (stats?.pendingUsers || 0),
      },
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      description: "Performance metrics & insights",
      icon: BarChart3,
      gradient: "from-teal-500 to-cyan-600",
      stats: { reports: 42, insights: 128 },
    },
  ];

  const recentActivities = (stats?.activities || []).map((a: any) => ({
    id: a.message,
    type: a.type,
    message: a.message,
    time: a.time,
    link: a.link,
    icon:
      a.icon === "building"
        ? Building2
        : a.icon === "user"
          ? Users
          : a.icon === "gavel"
            ? Gavel
            : a.icon === "check"
              ? CheckCircle
              : a.icon === "x"
                ? XCircle
                : Clock,
    color: a.color || "blue",
  }));

  const pendingApprovals = (stats?.approvals || []).map((a: any) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    submittedBy: a.submittedBy,
    date: a.date,
    status: a.status,
  }));

  const quickActions = [
    {
      id: "newProperty",
      label: "Add Property",
      icon: Plus,
      action: () => navigate("/add-property"),
    },
    {
      id: "createAuction",
      label: "Create Auction",
      icon: Gavel,
      action: () => setShowCreateAuctionModal(true),
    },
    {
      id: "sendCampaign",
      label: "Send Campaign",
      icon: Mail,
      action: () => navigate("/admin/campaigns"),
    },
    {
      id: "generateReport",
      label: "Generate Report",
      icon: FileText,
      action: () => navigate("/admin/analytics"),
    },
  ];

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && (
        <StatsOverview
          modules={modules}
          recentActivities={recentActivities}
          pendingApprovals={pendingApprovals}
          onModuleClick={(id) => setActiveTab(id)}
          onNavigate={(path) => navigate(path)}
          onApprovalReview={(type) => {
            if (type === "Property") {
              setActiveTab("properties");
              navigate("/admin/properties");
            } else if (type === "Users") {
              setActiveTab("users");
              navigate("/admin/users");
            }
          }}
        />
      )}

      {/* Page Builder Tab */}
      {activeTab === "pageBuilder" && (
        <PageBuilderTab
          pages={pages}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          theme={theme}
          onCreatePage={() => {
            setEditingPage(null);
            setShowPageEditor(true);
          }}
          onEditPage={(page) => {
            setEditingPage(page);
            setShowPageEditor(true);
          }}
          onNavigate={(path) => navigate(path)}
        />
      )}

      {/* Menu Manager Tab */}
      {activeTab === "menuManager" && (
        <MenuManagerTab
          theme={theme}
          onCreateMenu={() => { setEditingMenu(null); setShowMenuEditor(true); }}
          onEditMenu={(menu) => { setEditingMenu(menu); setShowMenuEditor(true); }}
        />
      )}

      {/* Properties Tab */}      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Property Management
              </h2>
              <p className="text-slate-600 font-medium">
                Approve, categorize and manage listings
              </p>
            </div>
            <button
              onClick={() => navigate("/add-property")}
              className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
            >
              <Plus className="size-5" />
              Add Property
            </button>
          </div>

          {/* Property Stats Cards */}
          <PropertyStats />

          {/* Properties Table */}
          <PropertiesTable />
        </div>
      )}

      {/* Auction Management Tab */}
      {activeTab === "auctions" && (
        <AuctionsTab
          theme={theme}
          auctionViewMode={auctionViewMode}
          setAuctionViewMode={setAuctionViewMode}
          liveRoomAuctions={liveRoomAuctions}
          liveRoomStats={liveRoomStats}
          liveRegistrations={liveRegistrations}
          selectedLiveAuction={selectedLiveAuction}
          onCreateAuction={() => setShowCreateAuctionModal(true)}
          onSelectAuction={(auction) => {
            setSelectedLiveAuction(auction);
            fetchLiveRegistrations(auction._id);
          }}
          onApproveLead={handleApproveLead}
          onShowReject={(lead) => {
            setRejectingLead(lead);
            setShowRejectModal(true);
            setRejectReason("");
          }}
          onEnterResults={(auction) => {
            setResultsAuction(auction);
            setPropertyResults(
              (auction.properties || []).map((p: any) => ({
                id: p._id || p,
                title: p.propertyTitle || "Property",
                status: "unsold",
                soldPrice: "",
                winnerName: "",
                winnerEmail: "",
              })),
            );
            setShowResultsModal(true);
          }}
        />
      )}

      {/* Marketing Tab - Now redirects to dedicated page */}
      {activeTab === "marketing" && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Send className="size-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-600 mb-2">
              Marketing moved to dedicated page
            </p>
            <button
              onClick={() => navigate("/admin/campaigns")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
            >
              Open Campaigns Dashboard
            </button>
          </div>
        </div>
      )}

      {/* AI Tools Tab */}
      {activeTab === "ai" && <AiTab />}

      {/* Compliance Tab */}
      {activeTab === "compliance" && <ComplianceTab />}

      {/* Financial Management Tab */}
      {activeTab === "financial" && <FinancialTab />}

      {/* Social Integration Tab */}
      {activeTab === "social" && <SocialTab />}

      {/* Users Tab */}      {/* Users Tab */}
      {activeTab === "users" && (
        <UsersTab
          users={users}
          usersLoading={usersLoading}
          theme={theme}
          updateUserStatus={updateUserStatus}
          onEditUser={setEditingUser}
          onDeleteUser={setUserToDelete}
          onAddAgent={() => setShowAddAgentModal(true)}
          onAddUser={() => setShowAddUserModal(true)}
        />
      )}

      {/* Analytics Tab - Now redirects to dedicated page */}
      {activeTab === "analytics" && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <BarChart3 className="size-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-600 mb-2">
              Analytics moved to dedicated page
            </p>
            <button
              onClick={() => navigate("/admin/analytics")}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-all"
            >
              Open Analytics Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Investors Tab */}
      {activeTab === "investors" && <InvestorsTab />}

      {/* Page Editor Modal */}      {/* Page Editor Modal */}
      {showPageEditor && (
        <PageBuilderWithAPI
          pageId={editingPage?.id}
          onClose={() => {
            setShowPageEditor(false);
            setEditingPage(null);
          }}
          onSave={(pageId) => {
            console.log("Page saved with ID:", pageId);
            // Refresh pages list if needed
          }}
        />
      )}

      {/* Menu Editor Modal */}
      {showMenuEditor && (
        <MenuEditor
          onClose={() => {
            setShowMenuEditor(false);
            setEditingMenu(null);
          }}
          editData={editingMenu}
        />
      )}

      {/* Create Auction Modal */}
      {showCreateAuctionModal && (
        <AuctionFormModal onClose={() => setShowCreateAuctionModal(false)} />
      )}

      {/* Reject Registration Modal */}
      <RejectModal
        rejectingLead={rejectingLead}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onReject={handleRejectLead}
        onClose={() => {
          setShowRejectModal(false);
          setRejectingLead(null);
          setRejectReason("");
        }}
      />

      {/* Live Results Modal */}      {/* Live Results Modal */}
      <LiveRoomResultsModal
        show={showResultsModal}
        resultsAuction={resultsAuction}
        propertyResults={propertyResults}
        setPropertyResults={setPropertyResults}
        savingResults={savingResults}
        onSave={handleSaveResults}
        onClose={() => {
          setShowResultsModal(false);
          setResultsAuction(null);
        }}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        />
      )}
      {showAddAgentModal && (
        <AddAgentModal
          onClose={() => setShowAddAgentModal(false)}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["users"] })
          }
        />
      )}
      <ConfirmModal
        show={!!userToDelete}
        title="Delete User"
        message="This user account will be permanently deleted."
        onConfirm={() => {
          deleteUser.mutate(userToDelete);
          setUserToDelete(null);
        }}
        onCancel={() => setUserToDelete(null)}
      />
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-green-500 text-white rounded-2xl shadow-2xl font-bold">
          {toastMsg}
        </div>
      )}
    </AdminLayout>
  );
}
