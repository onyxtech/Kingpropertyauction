import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  FileChartColumn,
  Users,
  UserCheck,
  Gavel,
  TrendingUp,
  Building,
  Layers,
  DollarSign,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  CustomerListReport,
  AgentListReport,
  AuctionListReport,
  BiddingListReport,
  AgentPropertyReport,
  CustomerPropertyReport,
  ReportsOverview,
} from "../components/reports";

const reportMenu = [
  {
    id: "overview",
    label: "Reports Overview",
    icon: FileChartColumn,
    color: "from-slate-600 to-slate-700",
  },
  {
    id: "customers",
    label: "Customer List",
    icon: Users,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "agents",
    label: "Agent List",
    icon: UserCheck,
    color: "from-violet-600 to-purple-600",
  },
  {
    id: "auctions",
    label: "Auction List",
    icon: Gavel,
    color: "from-rose-600 to-red-600",
  },
  {
    id: "bids",
    label: "Bidding List",
    icon: TrendingUp,
    color: "from-teal-600 to-cyan-600",
  },
  {
    id: "agentProperties",
    label: "Agent Property List",
    icon: Building,
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "customerProperties",
    label: "Customer Property List",
    icon: Layers,
    color: "from-pink-600 to-rose-600",
  },
];

const formatPrice = (val: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(val || 0);

export default function Reports() {
  const [activeReport, setActiveReport] = useState("overview");

  // ─── API Queries ────────────────────────────

  const { data: overviewData } = useQuery({
    queryKey: ["reports", "overview"],
    queryFn: () => apiClient.fetch("/reports/overview"),
    staleTime: 30 * 1000,
  });

  const { data: customersReport } = useQuery({
    queryKey: ["reports", "customers"],
    queryFn: () => apiClient.fetch("/reports/customers"),
    staleTime: 60 * 1000,
  });

  const { data: agentsReport } = useQuery({
    queryKey: ["reports", "agents"],
    queryFn: () => apiClient.fetch("/reports/agents"),
    staleTime: 60 * 1000,
  });

  const { data: auctionsReport } = useQuery({
    queryKey: ["reports", "auctions"],
    queryFn: () => apiClient.fetch("/reports/auctions"),
    staleTime: 30 * 1000,
  });

  const { data: bidsReport } = useQuery({
    queryKey: ["reports", "bids"],
    queryFn: () => apiClient.fetch("/reports/bids"),
    staleTime: 15 * 1000,
  });

  const { data: agentPropsReport } = useQuery({
    queryKey: ["reports", "agent-properties"],
    queryFn: () => apiClient.fetch("/reports/agent-properties"),
    staleTime: 60 * 1000,
  });

  const { data: customerPropsReport } = useQuery({
    queryKey: ["reports", "customer-properties"],
    queryFn: () => apiClient.fetch("/reports/customer-properties"),
    staleTime: 60 * 1000,
  });

  // ─── Derived Data ──────────────────────────

  const overview = overviewData?.data || {};
  const customerData = customersReport?.data || [];
  const customerStats = customersReport?.stats || {
    total: 0,
    active: 0,
    kycVerified: 0,
    totalSpend: "£0",
  };
  const agentData = agentsReport?.data || [];
  const agentStats = agentsReport?.stats || {
    total: 0,
    active: 0,
    totalListings: 0,
    totalCommission: "£0",
  };
  const auctionData = auctionsReport?.data || [];
  const auctionStats = auctionsReport?.stats || {
    total: 0,
    completed: 0,
    live: 0,
    totalValue: "£0",
  };
  const bidData = bidsReport?.data || [];
  const bidStats = bidsReport?.stats || {
    total: 0,
    uniqueBidders: 0,
    avgBidValue: "£0",
    winningBids: 0,
  };
  const agentPropData = agentPropsReport?.data || [];
  const agentPropStats = agentPropsReport?.stats || {
    total: 0,
    sold: 0,
    activeLive: 0,
    totalCommission: "£0",
  };
  const customerPropData = customerPropsReport?.data || [];
  const customerPropStats = customerPropsReport?.stats || {
    total: 0,
    completed: 0,
    activeBids: 0,
    totalPurchased: "£0",
  };

  const countMap: Record<string, string> = {
    customers: `${customerData.length} customers`,
    agents: `${agentData.length} agents`,
    auctions: `${auctionData.length} auctions`,
    bids: `${bidData.length} bids`,
    agentProperties: `${agentPropData.length} listings`,
    customerProperties: `${customerPropData.length} records`,
  };

  const kpis = [
    {
      label: "Total Customers",
      value: String(overview.totalCustomers || customerStats.total),
      change: `Active: ${overview.activeCustomers || customerStats.active}`,
      up: true,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Active Agents",
      value: String(overview.totalAgents || agentStats.total),
      change: `Active: ${overview.activeAgents || agentStats.active}`,
      up: true,
      icon: UserCheck,
      color: "from-violet-500 to-purple-600",
    },
    {
      label: "Active Revenue",
      value: overview.totalRevenue || customerStats.totalSpend,
      change: `Total Bids: ${overview.totalBids || bidStats.total}`,
      up: true,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Total Commission",
      value: overview.totalCommission || agentStats.totalCommission,
      change: `Auctions: ${overview.totalAuctions || auctionStats.total}`,
      up: true,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const summary = [
    {
      report: "Customers",
      total: String(customerStats.total),
      active: String(customerStats.active),
      month: `+${customerStats.total}`,
      updated: "Today",
    },
    {
      report: "Agents",
      total: String(agentStats.total),
      active: String(agentStats.active),
      month: `+${agentStats.total}`,
      updated: "Today",
    },
    {
      report: "Auctions",
      total: String(auctionStats.total),
      active: String(auctionStats.live),
      month: `+${auctionStats.total}`,
      updated: "Today",
    },
    {
      report: "Bids",
      total: String(bidStats.total),
      active: String(bidStats.uniqueBidders),
      month: `+${bidStats.total}`,
      updated: "Today",
    },
    {
      report: "Agent Properties",
      total: String(agentPropStats.total),
      active: String(agentPropStats.activeLive),
      month: `+${agentPropStats.total}`,
      updated: "Today",
    },
    {
      report: "Customer Properties",
      total: String(customerPropStats.total),
      active: String(customerPropStats.activeBids),
      month: `+${customerPropStats.total}`,
      updated: "Today",
    },
  ];

  return (
    <AdminLayout activeTab="reports" onTabChange={() => {}}>
      <div>
        {/* Top Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {reportMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveReport(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeReport === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Report Content */}
        {activeReport === "overview" && (
          <ReportsOverview
            kpis={kpis}
            summary={summary}
            countMap={countMap}
            onNavigate={setActiveReport}
          />
        )}

        {activeReport === "customers" && (
          <CustomerListReport data={customerData} stats={customerStats} />
        )}

        {activeReport === "agents" && (
          <AgentListReport data={agentData} stats={agentStats} />
        )}

        {activeReport === "auctions" && (
          <AuctionListReport data={auctionData} stats={auctionStats} />
        )}

        {activeReport === "bids" && (
          <BiddingListReport data={bidData} stats={bidStats} />
        )}

        {activeReport === "agentProperties" && (
          <AgentPropertyReport data={agentPropData} stats={agentPropStats} />
        )}

        {activeReport === "customerProperties" && (
          <CustomerPropertyReport
            data={customerPropData}
            stats={customerPropStats}
          />
        )}
      </div>
    </AdminLayout>
  );
}
