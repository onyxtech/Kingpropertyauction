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
  AlertCircle,
  Award,
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
import MenuEditor from "../components/MenuEditor";
import ConfirmModal from "@/features/shared/components/ConfirmModal";
import StatsOverview from "../components/dashboard/StatsOverview";
import AuctionsTab from "../components/dashboard/AuctionsTab";
import UsersTab from "../components/dashboard/UsersTab";
import MenuManagerTab from "../components/MenuManagerTab";
import Analytics from "./Analytics";


export default function Admin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useAdminStats();
  const { useGetUsers, useUpdateUserStatus, useDeleteUser, useReviewRoleRequest } = useUserApi();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const updateUserStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();
  const reviewRoleRequest = useReviewRoleRequest();

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
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");


  useEffect(() => {
    let path = location.pathname.replace("/admin/", "").replace("/admin", "");
    if (!path || path === "/admin") path = "overview";
    setActiveTab(path);
  }, [location]);

  const refetchAllAuctions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["auctions"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [queryClient]);

  useAuctionSocket({
    onAuctionUpdate: () => refetchAllAuctions(),
    onBidUpdate: () => refetchAllAuctions(),
  });


  const modules = [
    {
      id: "properties",
      title: "Property Management",
      description: "Approve, categorize and manage listings",
      icon: Building2,
      gradient: "from-purple-500 to-pink-600",
      stats: {
        total: stats?.totalProperties || 0,
        pending: stats?.pendingProperties || 0,
        approved: stats?.approvedProperties || 0,
      },
    },
    {
      id: "auctions",
      title: "Auction Management",
      description: "Create and manage live auctions",
      icon: Gavel,
      gradient: "from-rose-500 to-red-600",
      stats: {
        total: stats?.totalAuctions || 0,
        live: stats?.liveAuctions || 0,
        bids: stats?.totalBids || 0,
      },
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage buyers, owners and agents",
      icon: Users,
      gradient: "from-pink-500 to-rose-600",
      stats: {
        total: stats?.totalUsers || 0,
        pending: stats?.pendingUsers || 0,
      },
    },
    {
      id: "leads",
      title: "Leads & Enquiries",
      description: "Contact forms and property enquiries",
      icon: Mail,
      gradient: "from-amber-500 to-orange-600",
      stats: {
        total: stats?.totalLeads || 0,
      },
    },
    {
      id: "inbox",
      title: "Inbox & Messages",
      description: "Customer support conversations",
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-600",
      stats: {
        total: stats?.totalLeads || 0,
      },
    },
    {
      id: "marketing",
      title: "Marketing & Campaigns",
      description: "Email and SMS campaigns",
      icon: Send,
      gradient: "from-emerald-500 to-teal-600",
      stats: { campaigns: 0 },
    },
    {
      id: "menuManager",
      title: "Menu Manager",
      description: "Navigation menus with drag and drop",
      icon: Menu,
      gradient: "from-cyan-500 to-blue-600",
      stats: {},
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      description: "Performance metrics and insights",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-600",
      stats: {},
    },
    {
      id: "settings",
      title: "Platform Settings",
      description: "Configure emails, OAuth and integrations",
      icon: Settings,
      gradient: "from-slate-500 to-slate-700",
      stats: {},
    },
  ];

  const recentActivities = (stats?.activities || []).map((a: any, idx: number) => ({
    id: `${a.type}-${idx}`,
    type: a.type,
    message: a.message || "Activity recorded",
    time: a.time || "Recently",
    link: a.link || "",
    icon:
      a.icon === "gavel" ? Gavel :
      a.icon === "check" ? CheckCircle :
      a.icon === "user" ? Users :
      a.icon === "building" ? Building2 :
      a.icon === "mail" ? Mail :
      a.icon === "x" ? XCircle :
      a.icon === "alert-circle" ? AlertCircle :
      a.icon === "award" ? Award :
      Bell,
    color: a.color || "blue",
  }));

  const pendingApprovals = [
    ...(stats?.approvals || []).map((a: any) => ({
      id: a.id,
      type: a.type,
      title: a.title || "Pending review",
      submittedBy: a.submittedBy,
      date: a.date,
      status: a.status,
    })),
    ...(users || [])
      .filter((u: any) => !u.isActive)
      .slice(0, 5)
      .map((u: any) => ({
        id: u._id,
        type: "user",
        title: `${u.name} (${u.role})`,
        submittedBy: u.email,
        date: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recently",
        status: "pending",
      })),
    ...(users || [])
      .filter((u: any) => u.roleRequest?.status === "pending")
      .slice(0, 5)
      .map((u: any) => ({
        id: u._id + "-role",
        type: "role",
        title: `${u.name} wants to become ${u.roleRequest.requestedRole}`,
        submittedBy: u.email,
        date: u.roleRequest.requestedAt
          ? new Date(u.roleRequest.requestedAt).toLocaleDateString()
          : "Recently",
        status: "pending",
      })),
  ].filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );

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
          onModuleClick={(id) => {
            if (id === "marketing") {
              navigate("/admin/campaigns");
            } else if (id === "analytics") {
              navigate("/admin/analytics");
            } else if (id === "menuManager") {
              navigate("/admin/menus");
            } else if (id === "leads") {
              navigate("/admin/leads");
            } else if (id === "inbox") {
              navigate("/admin/inbox");
            } else if (id === "settings") {
              navigate("/admin/settings");
            } else {
              setActiveTab(id);
            }
          }}
          onNavigate={(path) => navigate(path)}
          onApprovalReview={(type) => {
            if (type === "property") {
              setActiveTab("properties");
              navigate("/admin/properties");
            } else if (type === "user" || type === "role") {
              setActiveTab("users");
              navigate("/admin/users");
            }
          }}
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
          onCreateAuction={() => setShowCreateAuctionModal(true)}
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

      {/* Users Tab */}      {/* Users Tab */}
      {activeTab === "users" && (
        <UsersTab
          users={users}
          usersLoading={usersLoading}
          theme={theme}
          updateUserStatus={updateUserStatus}
          reviewRoleRequest={reviewRoleRequest}
          onEditUser={setEditingUser}
          onDeleteUser={setUserToDelete}
          onAddAgent={() => setShowAddAgentModal(true)}
          onAddUser={() => setShowAddUserModal(true)}
        />
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && <Analytics />}

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
