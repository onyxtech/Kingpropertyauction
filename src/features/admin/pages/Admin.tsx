import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
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
import {
  allWebsitePages,
  pageCategories,
} from "../../website/data/websitePages";

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
  const [showSendCampaignModal, setShowSendCampaignModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [pages, setPages] = useState(allWebsitePages);

  useEffect(() => {
    let path = location.pathname.replace("/admin/", "").replace("/admin", "");
    if (!path || path === "/admin") path = "overview";
    setActiveTab(path);
  }, [location]);

  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 45000, auctions: 12 },
    { month: "Feb", revenue: 52000, auctions: 15 },
    { month: "Mar", revenue: 48000, auctions: 14 },
    { month: "Apr", revenue: 61000, auctions: 18 },
    { month: "May", revenue: 58000, auctions: 16 },
    { month: "Jun", revenue: 67000, auctions: 21 },
  ];

  const propertyTypeData = [
    { name: "Houses", value: 425, color: "#3b82f6" },
    { name: "Apartments", value: 312, color: "#8b5cf6" },
    { name: "Villas", value: 178, color: "#ec4899" },
    { name: "Commercial", value: 145, color: "#10b981" },
  ];

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
      action: () => setShowSendCampaignModal(true),
    },
    {
      id: "generateReport",
      label: "Generate Report",
      icon: FileText,
      action: () => setShowGenerateReportModal(true),
    },
  ];

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && (
        <>
          {/* Hero Stats */}
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Welcome back, Admin! 👋
            </h2>
            <p className="text-slate-600 font-medium">
              Here's what's happening with King Property Auction today.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Modules Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900 mb-6">
              Management Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-left group"
                  >
                    <div
                      className={`size-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="size-8 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">
                      {module.title}
                    </h4>
                    <p className="text-sm text-slate-600 font-medium mb-4">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      {Object.entries(module.stats).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-slate-100 px-3 py-1.5 rounded-lg"
                        >
                          <span className="text-slate-500 capitalize">
                            {key}:{" "}
                          </span>
                          <span className="text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity & Pending Approvals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="size-6" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    const colorMap: Record<string, string> = {
                      blue: "from-blue-500 to-indigo-600",
                      purple: "from-purple-500 to-pink-600",
                      green: "from-green-500 to-emerald-600",
                      emerald: "from-emerald-500 to-teal-600",
                      red: "from-red-500 to-rose-600",
                      orange: "from-orange-500 to-amber-600",
                    };
                    return (
                      <div
                        key={activity.id}
                        onClick={() => activity.link && navigate(activity.link)}
                        className={`flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all ${activity.link ? "cursor-pointer" : ""}`}
                      >
                        <div
                          className={`size-10 rounded-xl bg-gradient-to-br ${colorMap[activity.color] || "from-blue-500 to-indigo-600"} flex items-center justify-center flex-shrink-0 shadow-md`}
                        >
                          <Icon className="size-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 mb-1">
                            {activity.message}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                {recentActivities.length >= 8 && (
                  <p className="w-full py-2 text-slate-400 text-xs font-medium text-center">
                    Showing most recent activities
                  </p>
                )}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="size-6 text-orange-500" />
                Pending Approvals
              </h3>
              <div className="space-y-4">
                {pendingApprovals.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No pending approvals
                  </p>
                ) : (
                  pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 hover:border-orange-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-black rounded-lg">
                              {item.type}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                              #{item.id}
                            </span>
                          </div>
                          <p className="text-sm font-black text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-600 font-medium mt-1">
                            By: {item.submittedBy}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (item.type === "Property") {
                              setActiveTab("properties");
                              navigate("/admin/properties");
                            } else if (item.type === "Users") {
                              setActiveTab("users");
                              navigate("/admin/users");
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all"
                        >
                          Review
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.date}
                      </p>
                    </div>
                  ))
                )}
                {pendingApprovals.length >= 8 && (
                  <p className="w-full py-2 text-slate-400 text-xs font-medium text-center">
                    Showing latest pending approvals
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Page Builder Tab */}
      {activeTab === "pageBuilder" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Page Builder
              </h2>
              <p className="text-slate-600 font-medium">
                Manage all 33 website pages with category filters (UC-001)
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPage(null);
                setShowPageEditor(true);
              }}
              className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
            >
              <Plus className="size-5" />
              Create New Page
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-6 flex flex-wrap gap-3">
            {pageCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:scale-105 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white`
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {category.name}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/30 text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search pages by name or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              <Search className="size-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages
              .filter((page) => {
                const matchesCategory =
                  selectedCategory === "all" ||
                  page.category === selectedCategory;
                const matchesSearch =
                  page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  page.slug.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              })
              .map((page) => {
                const category = pageCategories.find(
                  (c) => c.id === page.category,
                );
                return (
                  <div
                    key={page.id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            page.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {page.status}
                        </span>
                        {category && (
                          <span
                            className={`px-2 py-1 ${category.color} text-white rounded-lg text-xs font-bold`}
                          >
                            {category.name.split(" ")[0]}
                          </span>
                        )}
                      </div>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="size-4 text-slate-600" />
                      </button>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">
                      {page.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mb-2">
                      {page.slug}
                    </p>
                    <p className="text-sm text-slate-600 font-medium mb-4">
                      Template: {page.template}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {page.views}
                      </span>
                      <span>{page.lastEdited}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingPage(page);
                          setShowPageEditor(true);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
                      >
                        <Edit className="size-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(page.slug)}
                        className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
                      >
                        <Eye className="size-4" />
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* No Results Message */}
          {pages.filter((page) => {
            const matchesCategory =
              selectedCategory === "all" || page.category === selectedCategory;
            const matchesSearch =
              page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              page.slug.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
          }).length === 0 && (
            <div className="text-center py-12">
              <FileText className="size-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-900 mb-2">
                No Pages Found
              </h3>
              <p className="text-slate-600 font-medium">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      )}

      {/* Menu Manager Tab */}
      {activeTab === "menuManager" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Menu Manager
              </h2>
              <p className="text-slate-600 font-medium">
                Create dynamic navigation menus (UC-002)
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMenu(null);
                setShowMenuEditor(true);
              }}
              className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
            >
              <Plus className="size-5" />
              Create Menu
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                id: 1,
                name: "Main Navigation",
                location: "Header",
                items: 8,
                status: "Active",
              },
              {
                id: 2,
                name: "Footer Links",
                location: "Footer",
                items: 12,
                status: "Active",
              },
              {
                id: 3,
                name: "User Account Menu",
                location: "Header Dropdown",
                items: 6,
                status: "Active",
              },
              {
                id: 4,
                name: "Mobile Menu",
                location: "Mobile Header",
                items: 10,
                status: "Active",
              },
            ].map((menu) => (
              <div
                key={menu.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-black text-slate-900">
                    {menu.name}
                  </h4>
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                    {menu.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600 font-medium">
                    <strong>Location:</strong> {menu.location}
                  </p>
                  <p className="text-sm text-slate-600 font-medium">
                    <strong>Menu Items:</strong> {menu.items}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMenu(menu);
                      setShowMenuEditor(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-1"
                  >
                    <Edit className="size-4" />
                    Edit Menu
                  </button>
                  <button className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                    <Menu className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Properties Tab */}
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
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Auction Management
              </h2>
              <p className="text-slate-600 font-medium">
                Create and manage live auctions (UC-006, UC-007, UC-008)
              </p>
            </div>
            <button
              onClick={() => setShowCreateAuctionModal(true)}
              className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
            >
              <Plus className="size-5" /> Create Auction
            </button>
          </div>
          <AuctionStats />
          <AuctionCards />
        </div>
      )}

      {/* Marketing Hub Tab */}
      {activeTab === "marketing" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Marketing Hub
              </h2>
              <p className="text-slate-600 font-medium">
                SMS, Email campaigns & auto alerts (UC-009, UC-010, UC-011)
              </p>
            </div>
            <button
              onClick={() => setShowSendCampaignModal(true)}
              className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
            >
              <Send className="size-5" />
              New Campaign
            </button>
          </div>

          {/* Marketing Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Email Sent",
                value: "45.2K",
                color: "from-blue-500 to-indigo-600",
                icon: Mail,
              },
              {
                label: "SMS Sent",
                value: "12.8K",
                color: "from-green-500 to-emerald-600",
                icon: MessageSquare,
              },
              {
                label: "Open Rate",
                value: "68.5%",
                color: "from-purple-500 to-pink-600",
                icon: Eye,
              },
              {
                label: "Click Rate",
                value: "24.3%",
                color: "from-orange-500 to-amber-600",
                icon: Target,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
                >
                  <div
                    className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Campaign Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                title: "Email Campaigns",
                description: "Automated email marketing",
                icon: Mail,
                gradient: "from-blue-500 to-indigo-600",
                campaigns: 42,
              },
              {
                title: "SMS Campaigns",
                description: "Targeted SMS messaging",
                icon: MessageSquare,
                gradient: "from-green-500 to-emerald-600",
                campaigns: 18,
              },
              {
                title: "Auto Alerts",
                description: "Real-time notifications",
                icon: Bell,
                gradient: "from-orange-500 to-amber-600",
                campaigns: 8,
              },
            ].map((type, index) => {
              const Icon = type.icon;
              return (
                <button
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-left group"
                >
                  <div
                    className={`size-14 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="size-7 text-white" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">
                    {type.title}
                  </h4>
                  <p className="text-sm text-slate-600 font-medium mb-3">
                    {type.description}
                  </p>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                    <span className="text-xs font-bold text-slate-900">
                      {type.campaigns} Active
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              Recent Campaigns
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "New Auction Alert - Premium Properties",
                  type: "Email",
                  sent: "12.4K",
                  opened: "8.5K",
                  clicked: "2.1K",
                  status: "completed",
                },
                {
                  name: "Auction Ending Soon Reminder",
                  type: "SMS",
                  sent: "5.2K",
                  opened: "4.8K",
                  clicked: "1.9K",
                  status: "completed",
                },
                {
                  name: "Price Drop Notification",
                  type: "Email",
                  sent: "8.7K",
                  opened: "6.2K",
                  clicked: "1.5K",
                  status: "active",
                },
                {
                  name: "New Property in Saved Location",
                  type: "Push",
                  sent: "15.3K",
                  opened: "12.1K",
                  clicked: "4.2K",
                  status: "active",
                },
              ].map((campaign, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {campaign.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {campaign.name}
                      </h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        campaign.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
                    <span>
                      Sent:{" "}
                      <strong className="text-slate-900">
                        {campaign.sent}
                      </strong>
                    </span>
                    <span>
                      Opened:{" "}
                      <strong className="text-slate-900">
                        {campaign.opened}
                      </strong>
                    </span>
                    <span>
                      Clicked:{" "}
                      <strong className="text-slate-900">
                        {campaign.clicked}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Tools Tab */}
      {activeTab === "ai" && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              AI Optimization Tools
            </h2>
            <p className="text-slate-600 font-medium">
              Valuation, fraud detection & predictions (UC-015, UC-016, UC-017)
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                title: "AI Property Valuation",
                description: "Analyze past sales & predict winning bids",
                icon: Sparkles,
                gradient: "from-purple-500 to-pink-600",
                stats: { valuations: "1,024", accuracy: "94.5%" },
              },
              {
                title: "Fraud Detection Engine",
                description: "Detect suspicious bidding patterns",
                icon: AlertTriangle,
                gradient: "from-red-500 to-rose-600",
                stats: { alerts: "7", blocked: "23" },
              },
              {
                title: "Smart Demand Prediction",
                description: "Hot property zones & timing",
                icon: Target,
                gradient: "from-blue-500 to-indigo-600",
                stats: { predictions: "342", accuracy: "89.2%" },
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg"
                >
                  <div
                    className={`size-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon className="size-7 text-white" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-slate-600 font-medium mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-3">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-slate-100 px-3 py-1.5 rounded-lg"
                      >
                        <p className="text-xs text-slate-500 capitalize mb-0.5">
                          {key}
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 text-white mb-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Bot className="size-8" />
                  AI Insights & Recommendations
                </h3>
                <p className="text-white/90 font-medium mb-6">
                  Powered by advanced machine learning algorithms
                </p>

                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <h4 className="font-black mb-1">🔥 Hot Zone Alert</h4>
                    <p className="text-sm text-white/90">
                      Mayfair properties seeing 34% increase in demand. Consider
                      scheduling more auctions.
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <h4 className="font-black mb-1">⏰ Optimal Timing</h4>
                    <p className="text-sm text-white/90">
                      Thursday 7-9 PM shows highest bidding activity. Schedule
                      premium auctions accordingly.
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <h4 className="font-black mb-1">💰 Revenue Forecast</h4>
                    <p className="text-sm text-white/90">
                      Projected £245K revenue next month based on current trends
                      (+18% vs last month).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === "compliance" && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Legal & Compliance
            </h2>
            <p className="text-slate-600 font-medium">
              KYC verification, AML monitoring & contracts (UC-018, UC-019,
              UC-020)
            </p>
          </div>

          {/* Compliance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "KYC Verified",
                value: "1,156",
                color: "from-green-500 to-emerald-600",
                icon: UserCheck,
              },
              {
                label: "Pending Verification",
                value: "34",
                color: "from-yellow-500 to-orange-600",
                icon: Clock,
              },
              {
                label: "Contracts Generated",
                value: "487",
                color: "from-blue-500 to-indigo-600",
                icon: FileCheck,
              },
              {
                label: "AML Alerts",
                value: "7",
                color: "from-red-500 to-rose-600",
                icon: AlertTriangle,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
                >
                  <div
                    className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* KYC Queue & AML Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KYC Verification Queue */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="size-6 text-blue-600" />
                KYC Verification Queue
              </h3>
              <div className="space-y-3">
                {[
                  {
                    name: "Emma Wilson",
                    email: "emma@example.com",
                    submitted: "2 hours ago",
                    docs: 3,
                    status: "pending",
                  },
                  {
                    name: "James Davis",
                    email: "james@example.com",
                    submitted: "5 hours ago",
                    docs: 2,
                    status: "review",
                  },
                  {
                    name: "Olivia Martinez",
                    email: "olivia@example.com",
                    submitted: "1 day ago",
                    docs: 3,
                    status: "pending",
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {user.name}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium">
                          {user.email}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-3">
                      <span>{user.docs} documents</span>
                      <span>{user.submitted}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all">
                        Approve
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AML Monitoring */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="size-6 text-red-600" />
                AML Alerts
              </h3>
              <div className="space-y-3">
                {[
                  {
                    user: "Anonymous User #4523",
                    type: "Large Transaction",
                    amount: "£450,000",
                    risk: "high",
                    time: "1 hour ago",
                  },
                  {
                    user: "Michael Brown",
                    type: "Multiple Accounts",
                    amount: "N/A",
                    risk: "medium",
                    time: "3 hours ago",
                  },
                  {
                    user: "Sarah Johnson",
                    type: "Rapid Bidding",
                    amount: "£125,000",
                    risk: "low",
                    time: "5 hours ago",
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      alert.risk === "high"
                        ? "bg-red-50 border-red-200"
                        : alert.risk === "medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {alert.type}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          alert.risk === "high"
                            ? "bg-red-500 text-white"
                            : alert.risk === "medium"
                              ? "bg-yellow-500 text-white"
                              : "bg-blue-500 text-white"
                        }`}
                      >
                        {alert.risk.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mb-1">
                      {alert.user}
                    </p>
                    {alert.amount !== "N/A" && (
                      <p className="text-sm font-bold text-slate-900 mb-2">
                        {alert.amount}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {alert.time}
                      </span>
                      <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">
                        Investigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Management Tab */}
      {activeTab === "financial" && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Financial Management
            </h2>
            <p className="text-slate-600 font-medium">
              Escrow, commissions & invoices (UC-021, UC-022)
            </p>
          </div>

          {/* Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Escrow Balance",
                value: "£2.4M",
                color: "from-green-500 to-emerald-600",
                icon: Lock,
              },
              {
                label: "Revenue (MTD)",
                value: "£187K",
                color: "from-blue-500 to-indigo-600",
                icon: TrendingUp,
              },
              {
                label: "Commissions Paid",
                value: "£42.3K",
                color: "from-purple-500 to-pink-600",
                icon: DollarSign,
              },
              {
                label: "Pending Invoices",
                value: "23",
                color: "from-orange-500 to-amber-600",
                icon: Receipt,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
                >
                  <div
                    className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Escrow Transactions & Recent Invoices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Escrow Transactions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="size-6 text-green-600" />
                Escrow Transactions
              </h3>
              <div className="space-y-3">
                {[
                  {
                    id: "ESC001",
                    property: "Modern Luxury Villa",
                    amount: "£125,000",
                    buyer: "Emma Wilson",
                    status: "held",
                    date: "2026-02-20",
                  },
                  {
                    id: "ESC002",
                    property: "Contemporary Penthouse",
                    amount: "£95,000",
                    buyer: "James Davis",
                    status: "released",
                    date: "2026-02-19",
                  },
                  {
                    id: "ESC003",
                    property: "Waterfront Apartment",
                    amount: "£48,000",
                    buyer: "Michael Brown",
                    status: "held",
                    date: "2026-02-21",
                  },
                ].map((transaction, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">
                        #{transaction.id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          transaction.status === "held"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {transaction.property}
                    </h4>
                    <p className="text-lg font-black text-green-600 mb-2">
                      {transaction.amount}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>Buyer: {transaction.buyer}</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Receipt className="size-6 text-blue-600" />
                Recent Invoices
              </h3>
              <div className="space-y-3">
                {[
                  {
                    id: "INV-2847",
                    to: "John Smith",
                    amount: "£12,450",
                    type: "Commission",
                    status: "paid",
                    date: "2026-02-19",
                  },
                  {
                    id: "INV-2848",
                    to: "Sarah Johnson",
                    amount: "£8,900",
                    type: "Platform Fee",
                    status: "pending",
                    date: "2026-02-20",
                  },
                  {
                    id: "INV-2849",
                    to: "David Lee",
                    amount: "£15,200",
                    type: "Commission",
                    status: "paid",
                    date: "2026-02-21",
                  },
                ].map((invoice, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">
                        #{invoice.id}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {invoice.to}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {invoice.type}
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {invoice.amount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {invoice.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Integration Tab */}
      {activeTab === "social" && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Social & External Integration
            </h2>
            <p className="text-slate-600 font-medium">
              Share to social media & sync with portals (UC-012, UC-013)
            </p>
          </div>

          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Properties Shared",
                value: "892",
                color: "from-blue-500 to-indigo-600",
              },
              {
                label: "Zoopla Synced",
                value: "456",
                color: "from-purple-500 to-pink-600",
              },
              {
                label: "Social Reach",
                value: "125K",
                color: "from-green-500 to-emerald-600",
              },
              {
                label: "Engagement",
                value: "34.2%",
                color: "from-orange-500 to-amber-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
              >
                <div
                  className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                >
                  <Share2 className="size-5 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Social Platforms & Property Portals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Social Media Platforms */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Social Media Platforms
              </h3>
              <div className="space-y-3">
                {[
                  {
                    platform: "Facebook",
                    connected: true,
                    shares: 342,
                    engagement: "42.5%",
                  },
                  {
                    platform: "LinkedIn",
                    connected: true,
                    shares: 189,
                    engagement: "28.3%",
                  },
                  {
                    platform: "Twitter",
                    connected: true,
                    shares: 256,
                    engagement: "31.7%",
                  },
                  {
                    platform: "WhatsApp",
                    connected: false,
                    shares: 0,
                    engagement: "N/A",
                  },
                ].map((social, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">
                        {social.platform}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          social.connected
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {social.connected ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    {social.connected && (
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                        <span>
                          Shares:{" "}
                          <strong className="text-slate-900">
                            {social.shares}
                          </strong>
                        </span>
                        <span>
                          Engagement:{" "}
                          <strong className="text-slate-900">
                            {social.engagement}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Property Portals */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Property Portals
              </h3>
              <div className="space-y-3">
                {[
                  {
                    portal: "Zoopla",
                    connected: true,
                    synced: 456,
                    status: "active",
                  },
                  {
                    portal: "Rightmove",
                    connected: true,
                    synced: 398,
                    status: "active",
                  },
                  {
                    portal: "OnTheMarket",
                    connected: false,
                    synced: 0,
                    status: "inactive",
                  },
                  {
                    portal: "PrimeLocation",
                    connected: false,
                    synced: 0,
                    status: "inactive",
                  },
                ].map((portal, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">
                        {portal.portal}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          portal.connected
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {portal.connected ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    {portal.connected && (
                      <p className="text-sm text-slate-600 font-medium">
                        {portal.synced} properties synced
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                User Management
              </h2>
              <p className="text-slate-600 font-medium">
                Manage buyers, sellers, agents, and investors
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <UserCheck className="size-5" />
                Add Agent
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
              >
                <Plus className="size-5" />
                Add User
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Users",
                value: users?.length || 0,
                color: "from-blue-500 to-indigo-600",
              },
              {
                label: "Active Users",
                value: users?.filter((u: any) => u.isActive).length || 0,
                color: "from-green-500 to-emerald-600",
              },
              {
                label: "Buyers",
                value: users?.filter((u: any) => u.role === "user").length || 0,
                color: "from-purple-500 to-pink-600",
              },
              {
                label: "Agents",
                value:
                  users?.filter((u: any) => u.role === "agent").length || 0,
                color: "from-orange-500 to-amber-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
              >
                <div
                  className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                >
                  <Users className="size-5 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-slate-500"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : users?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users?.map((user: any) => (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-10 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
                            >
                              <span className="text-white font-bold text-sm">
                                {user.name
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("") || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {user.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${user.isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                          >
                            {user.isActive ? "active" : "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all">
                              <Eye className="size-4" />
                            </button>
                            {!user.isActive && (
                              <button
                                onClick={() =>
                                  updateUserStatus.mutate({
                                    id: user._id,
                                    status: "active",
                                  })
                                }
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                              >
                                <CheckCircle className="size-4" />
                              </button>
                            )}
                            {user.isActive && user.role !== "admin" && (
                              <button
                                onClick={() =>
                                  updateUserStatus.mutate({
                                    id: user._id,
                                    status: "pending",
                                  })
                                }
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              >
                                <XCircle className="size-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
                            >
                              <Edit className="size-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm("Delete this user?"))
                                  deleteUser.mutate(user._id);
                              }}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Analytics & Reports
              </h2>
              <p className="text-slate-600 font-medium">
                Performance metrics and business insights
              </p>
            </div>
            <button
              onClick={() => setShowGenerateReportModal(true)}
              className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
            >
              <FileText className="size-5" />
              Generate Report
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Revenue & Auctions
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="auctions"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Property Types */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Property Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-6">
              Key Performance Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Avg. Property Value",
                  value: "£1.85M",
                  change: "+12.4%",
                },
                {
                  label: "Avg. Time to Sale",
                  value: "24 days",
                  change: "-8.2%",
                },
                {
                  label: "Customer Satisfaction",
                  value: "94.5%",
                  change: "+3.1%",
                },
              ].map((kpi, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6"
                >
                  <p className="text-sm text-white/80 font-medium mb-2">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-black mb-2">{kpi.value}</p>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <ArrowUp className="size-4" />
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Investors Tab */}
      {activeTab === "investors" && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Investor Dashboard
            </h2>
            <p className="text-slate-600 font-medium">
              ROI estimation and investment analytics (UC-014)
            </p>
          </div>

          {/* Investor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Investors",
                value: "342",
                color: "from-blue-500 to-indigo-600",
              },
              {
                label: "Investment Opportunities",
                value: "156",
                color: "from-purple-500 to-pink-600",
              },
              {
                label: "Avg. ROI",
                value: "18.5%",
                color: "from-green-500 to-emerald-600",
              },
              {
                label: "Total Invested",
                value: "£42.8M",
                color: "from-orange-500 to-amber-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg"
              >
                <div
                  className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}
                >
                  <TrendingUp className="size-5 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Investment Opportunities */}
          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <TrendingUp className="size-8" />
              Top Investment Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  property: "Commercial Office - Canary Wharf",
                  roi: "22.5%",
                  risk: "Low",
                  demand: "High",
                },
                {
                  property: "Residential Complex - Shoreditch",
                  roi: "19.8%",
                  risk: "Medium",
                  demand: "Very High",
                },
                {
                  property: "Mixed-Use Development - Camden",
                  roi: "24.1%",
                  risk: "Medium",
                  demand: "High",
                },
              ].map((opp, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6"
                >
                  <h4 className="font-black text-lg mb-3">{opp.property}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">Est. ROI</span>
                      <span className="font-black text-lg">{opp.roi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">Risk Level</span>
                      <span className="font-bold">{opp.risk}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">Demand</span>
                      <span className="font-bold">{opp.demand}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-3 bg-white text-teal-600 rounded-xl font-bold hover:bg-white/90 transition-all">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Editor Modal */}
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
      {/* Send Campaign Modal */}
      {showSendCampaignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-white/60 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 rounded-t-3xl border-b-2 border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Send Marketing Campaign
                  </h2>
                  <p className="text-white/90 font-medium">
                    Create and send email campaigns to your audience
                  </p>
                </div>
                <button
                  onClick={() => setShowSendCampaignModal(false)}
                  className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30 hover:scale-110"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              className="p-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Campaign sent successfully!");
                setShowSendCampaignModal(false);
              }}
            >
              {/* Campaign Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Mail className="size-6 text-blue-600" />
                  Campaign Details
                </h3>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., New Property Listings - March 2026"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Campaign Type *
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="property">New Property Alert</option>
                      <option value="auction">Auction Reminder</option>
                      <option value="promotional">Promotional Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Target Audience *
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select audience...</option>
                      <option value="all">All Subscribers</option>
                      <option value="buyers">Buyers Only</option>
                      <option value="sellers">Sellers Only</option>
                      <option value="investors">Investors</option>
                      <option value="agents">Agents</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="size-6 text-purple-600" />
                  Email Content
                </h3>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email subject line"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Body *
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Compose your email message..."
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Template
                  </label>
                  <select className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Custom (No Template)</option>
                    <option value="modern">Modern Design</option>
                    <option value="classic">Classic Newsletter</option>
                    <option value="minimal">Minimal Clean</option>
                  </select>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="size-6 text-green-600" />
                  Schedule
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="radio"
                      name="schedule"
                      value="now"
                      className="size-5 accent-blue-600"
                      defaultChecked
                    />
                    <span className="text-sm font-bold text-slate-700">
                      Send Now
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="radio"
                      name="schedule"
                      value="later"
                      className="size-5 accent-blue-600"
                    />
                    <span className="text-sm font-bold text-slate-700">
                      Schedule for Later
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSendCampaignModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  Send Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-white/60 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 px-8 py-6 rounded-t-3xl border-b-2 border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Generate Report
                  </h2>
                  <p className="text-white/90 font-medium">
                    Create custom analytics and performance reports
                  </p>
                </div>
                <button
                  onClick={() => setShowGenerateReportModal(false)}
                  className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border border-white/30 hover:scale-110"
                >
                  <X className="size-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              className="p-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Report generated successfully!");
                setShowGenerateReportModal(false);
              }}
            >
              {/* Report Type */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="size-6 text-green-600" />
                  Report Type
                </h3>

                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { value: "sales", label: "Sales Report", icon: DollarSign },
                    {
                      value: "auction",
                      label: "Auction Performance",
                      icon: Gavel,
                    },
                    { value: "user", label: "User Activity", icon: Users },
                    {
                      value: "property",
                      label: "Property Listings",
                      icon: Building2,
                    },
                    {
                      value: "financial",
                      label: "Financial Summary",
                      icon: CreditCard,
                    },
                    {
                      value: "marketing",
                      label: "Marketing Analytics",
                      icon: TrendingUp,
                    },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-green-300"
                    >
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        className="size-5 accent-green-600"
                      />
                      <type.icon className="size-5 text-green-600" />
                      <span className="text-sm font-bold text-slate-700">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="size-6 text-blue-600" />
                  Date Range
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-slate-600">
                    Quick Select:
                  </span>
                  {[
                    "Last 7 Days",
                    "Last 30 Days",
                    "Last Quarter",
                    "Last Year",
                  ].map((range) => (
                    <button
                      key={range}
                      type="button"
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-all"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="size-6 text-purple-600" />
                  Export Format
                </h3>

                <div className="grid md:grid-cols-3 gap-3">
                  {["PDF", "Excel", "CSV"].map((format) => (
                    <label
                      key={format}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.toLowerCase()}
                        className="size-5 accent-green-600"
                        defaultChecked={format === "PDF"}
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {format}
                      </span>
                    </label>
                  ))}
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    className="size-5 rounded accent-green-600"
                  />
                  <span className="text-sm font-bold text-slate-700">
                    Include Charts and Graphs
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateReportModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
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
    </AdminLayout>
  );
}
