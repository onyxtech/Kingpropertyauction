import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { mediaUrl } from "@/lib/mediaUrl";
import { useNavigate } from "react-router";
import {
  Search,
  Grid,
  List,
  MapPin,
  Users,
  Eye,
  Download,
  Building2,
  ChevronDown,
} from "lucide-react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";
import PublicLayout from "@/features/shared/layout/PublicLayout";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import { useQueryClient } from "@tanstack/react-query";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { formatUKDateTime } from "@/features/shared/utils/dateUtils";

export default function Auctions() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [urlParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    urlParams.get("search") || urlParams.get("location") || "",
  );
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const [auctionPage, setAuctionPage] = useState(1);
  const [allAuctions, setAllAuctions] = useState<any[]>([]);

  const { useGetAuctions } = useAuctionApi();
  const { data: auctionsData, isLoading } = useGetAuctions({
    page: auctionPage,
    limit: 12,
  });
  const auctions = auctionsData?.data || [];
  const auctionsTotal = auctionsData?.pagination?.total || 0;
  const hasMoreAuctions = allAuctions.length < auctionsTotal;

  useEffect(() => {
    if (auctions.length > 0) {
      setAllAuctions((prev) => {
        const existingIds = new Set(prev.map((a: any) => a._id));
        const newOnes = auctions.filter((a: any) => !existingIds.has(a._id));
        return [...prev, ...newOnes];
      });
    }
  }, [auctions]);

  const handleLoadMoreAuctions = () => setAuctionPage((prev) => prev + 1);
  const queryClient = useQueryClient();

  useAuctionSocket();

  // Map backend data to exact static design format
  const displayAuctions = allAuctions.length > 0 ? allAuctions : auctions;
  const auctionLots = displayAuctions.map((a: any, index: number) => {
    const category = a.property?.propertyCategory || "residential";
    const typeMap: Record<string, string> = {
      residential: "Residential",
      commercial: "Commercial",
      industrial: "Mixed Portfolio",
    };

    return {
      lotNumber: `LOT-2026-${String(index + 1).padStart(3, "0")}`,
      title: a.auctionTitle || "Untitled Auction",
      location: "Location TBD",
      type: typeMap[category] || "Mixed Portfolio",
      startDate: a.startDateTime ? formatUKDateTime(a.startDateTime) : "TBD",
      startTime: "",
      endDate: a.endDateTime ? formatUKDateTime(a.endDateTime) : "TBD",
      endTime: "",
      totalProperties: a.properties?.length || 1,
      auctionId: a._id,
      estimatedValue: a.startingBid
        ? `£${a.startingBid.toLocaleString()}`
        : "£0",
      image: a.properties?.[0]?.media?.propertyImages?.[0]
        ? mediaUrl(a.properties[0].media.propertyImages[0])
        : a.auctionImage ||
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1080",
      status:
        a.status === "live"
          ? "Live Now"
          : a.status === "scheduled"
            ? "Upcoming"
            : "Completed",
      registeredBidders: a.totalBidders || 0,
      slug: a.slug || a._id,
      propertySlug: a.property?.slug || a.property?._id || "",
      rawStatus: a.status,
      startDateTime: a.startDateTime,
      endDateTime: a.endDateTime,
    };
  });

  const filteredLots = auctionLots.filter((lot) => {
    const matchesSearch =
      lot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All Types" || lot.type === filterType;
    const matchesStatus =
      filterStatus === "All Status" || lot.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const liveCount = auctionLots.filter((a) => a.status === "Live Now").length;
  const upcomingCount = auctionLots.filter(
    (a) => a.status === "Upcoming",
  ).length;
  const totalProperties = auctionLots.reduce(
    (sum, lot) => sum + lot.totalProperties,
    0,
  );
  const totalValue = auctionLots.reduce((sum, a) => {
    const val = parseFloat(a.estimatedValue?.replace(/[£,]/g, "") || "0");
    return sum + val;
  }, 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("King Property Auction", 14, 18);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Auction Catalogue", 14, 26);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 14, 32);
    doc.text(`Total Lots: ${filteredLots.length}`, 14, 37);

    autoTable(doc, {
      startY: 42,
      head: [
        [
          "Lot",
          "Title",
          "Type",
          "Start",
          "End",
          "Props",
          "Est. Value",
          "Status",
          "Bidders",
        ],
      ],
      body: filteredLots.map((l) => [
        l.lotNumber,
        l.title,
        l.type,
        l.startDate,
        l.endDate,
        String(l.totalProperties),
        l.estimatedValue,
        l.status,
        String(l.registeredBidders),
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`auction-catalogue-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Lot Number",
      "Title",
      "Type",
      "Location",
      "Start Date",
      "End Date",
      "Properties",
      "Estimated Value",
      "Status",
      "Registered Bidders",
    ];
    const rows = filteredLots.map((l) => [
      l.lotNumber,
      l.title,
      l.type,
      l.location,
      l.startDate,
      l.endDate,
      l.totalProperties,
      l.estimatedValue,
      l.status,
      l.registeredBidders,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auction-catalogue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-96">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <div className="size-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-white">
                🔨 {liveCount} Live Auction Lots • {upcomingCount} Upcoming Lots
              </span>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Auction Lots
              <br />
              <span className="text-cyan-300">Browse & Register to Bid</span>
            </h1>
            <p className="text-2xl text-white/90 font-medium">
              Explore our live and upcoming auction lots featuring multiple
              properties
              <br />
              <span className="text-yellow-200">
                ✨ {totalProperties} properties across {auctionLots.length}{" "}
                auction lots
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 -mt-8">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {liveCount}
                </div>
                <div className="text-sm text-slate-600 font-bold">
                  Live Auction Lots
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {upcomingCount}
                </div>
                <div className="text-sm text-slate-600 font-bold">
                  Upcoming Lots
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {totalProperties}
                </div>
                <div className="text-sm text-slate-600 font-bold">
                  Total Properties
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  £{(totalValue / 1000000).toFixed(0)}M
                </div>
                <div className="text-sm text-slate-600 font-bold">
                  Total Value
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by lot number, title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900"
              />
            </div>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-4 pr-10 py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 cursor-pointer"
              >
                <option>All Types</option>
                <option>Residential</option>
                <option>Commercial</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-4 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 cursor-pointer"
              >
                <option>All Status</option>
                <option>Live Now</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${viewMode === "grid" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-200"}`}
              >
                <Grid className="size-5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${viewMode === "table" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-200"}`}
              >
                <List className="size-5" />
                Table
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-slate-600 font-medium">
              Showing{" "}
              <span className="font-black text-slate-900">
                {filteredLots.length}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-900">
                {auctionLots.length}
              </span>{" "}
              auction lots
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Download className="size-5" />
                Export PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="px-5 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2"
              >
                <Download className="size-5" />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot: any) => (
              <div
                key={lot.lotNumber}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    src={lot.image}
                    alt={lot.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {lot.status === "Live Now" ? (
                      <div className="px-4 py-2 bg-red-500 text-white text-sm font-black rounded-full flex items-center gap-2 shadow-xl animate-pulse">
                        <div className="size-2 bg-white rounded-full" />
                        LIVE NOW
                      </div>
                    ) : lot.status === "Upcoming" ? (
                      <div className="px-4 py-2 bg-blue-600 text-white text-sm font-black rounded-full shadow-xl">
                        📅 UPCOMING
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-slate-600 text-white text-sm font-black rounded-full shadow-xl">
                        ✅ COMPLETED
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-slate-900">
                    {lot.lotNumber}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {lot.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 font-medium mb-4">
                    <MapPin className="size-4 text-blue-600" />
                    <span className="text-sm">{lot.location}</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">
                          START DATE & TIME
                        </span>
                      </div>
                      <div className="text-sm font-black text-blue-600">
                        {lot.startDate}
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">
                          END DATE & TIME
                        </span>
                      </div>
                      <div className="text-sm font-black text-purple-600">
                        {lot.endDate}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <span className="text-sm font-bold text-slate-600">
                        Total Properties
                      </span>
                      <span className="text-lg font-black text-emerald-600">
                        {lot.totalProperties}
                      </span>
                    </div>
                    {lot.rawStatus && lot.startDateTime && lot.endDateTime && (
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                        <AuctionTimer
                          startDateTime={lot.startDateTime}
                          endDateTime={lot.endDateTime}
                          status={lot.rawStatus}
                          showLabel={true}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                      <Users className="size-4 text-blue-600" />
                      {lot.registeredBidders} bidders
                    </div>
                    <div className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                      {lot.type}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/auctions/${lot.slug}`)}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="size-5" />
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/auctions/${lot.slug}/properties`)
                      }
                      className="px-4 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Building2 className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                      Lot Number
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                      Auction Title
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                      Start Date & Time
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                      End Date & Time
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLots.map((lot: any, idx: number) => (
                    <tr
                      key={lot.lotNumber}
                      className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}
                    >
                      <td className="px-6 py-5">
                        <div className="font-black text-blue-600">
                          {lot.lotNumber}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-slate-900 mb-1">
                          {lot.title}
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          {lot.type}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <MapPin className="size-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm">{lot.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-900">
                          {lot.startDate}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-900">
                          {lot.endDate}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                          <Building2 className="size-4 text-emerald-600" />
                          <span className="text-lg font-black text-emerald-600">
                            {lot.totalProperties}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {lot.status === "Live Now" ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">
                            <div className="size-2 bg-white rounded-full" />
                            LIVE NOW
                          </div>
                        ) : lot.status === "Upcoming" ? (
                          <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-black rounded-full">
                            📅 UPCOMING
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-black rounded-full">
                            ✅ COMPLETED
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/auctions/${lot.slug}`)}
                            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="size-5" />
                            View Details
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/auctions/${lot.slug}/properties`)
                            }
                            className="px-4 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Building2 className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredLots.length === 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-white/60 p-16 text-center">
            <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              No Auction Lots Found
            </h3>
            <p className="text-slate-600 font-medium mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("All Types");
                setFilterStatus("All Status");
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <h2 className="text-4xl font-black mb-6">
            Want to Participate in These Auctions?
          </h2>
          <p className="text-2xl font-medium mb-10">
            Register now to bid on properties from any of our auction lots
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Register to Bid
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
        {/* Load More Button */}
        {hasMoreAuctions && (
          <div className="text-center mt-10 pb-6">
            <button
              onClick={handleLoadMoreAuctions}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Load More Auctions
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
