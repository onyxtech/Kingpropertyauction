import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import AuctionStats from "@/features/auction/components/AuctionStats";
import AuctionCards from "@/features/auction/components/AuctionCards";
import AuctionTimer from "@/features/shared/components/AuctionTimer";
import FilterBar from "@/features/shared/components/FilterBar";

interface AuctionsTabProps {
  theme: { secondary: string };
  auctionViewMode: "online" | "liveroom";
  setAuctionViewMode: (mode: "online" | "liveroom") => void;
  liveRoomAuctions: any[];
  liveRoomStats: { total: number; live: number; scheduled: number; completed: number; totalRegistrations: number };
  liveRegistrations: any[];
  selectedLiveAuction: any | null;
  onCreateAuction: () => void;
  onSelectAuction: (auction: any) => void;
  onApproveLead: (id: string) => void;
  onShowReject: (lead: any) => void;
  onEnterResults: (auction: any) => void;
}

export default function AuctionsTab(props: AuctionsTabProps) {
  const { theme, auctionViewMode, setAuctionViewMode, liveRoomAuctions, liveRoomStats, liveRegistrations, selectedLiveAuction, onCreateAuction, onSelectAuction, onApproveLead, onShowReject, onEnterResults } = props;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredLiveRoom = liveRoomAuctions.filter((a: any) => {
    if (search && !a.auctionTitle?.toLowerCase().includes(search.toLowerCase()) && !a.venue?.city?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Auction Management</h2>
          <p className="text-slate-600 font-medium">Create and manage live auctions</p>
        </div>
        <button onClick={onCreateAuction} className={`px-6 py-3 bg-gradient-to-r ${theme.secondary} text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}>
          <Plus className="size-5" /> Create Auction
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setAuctionViewMode("online")} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${auctionViewMode === "online" ? "bg-blue-600 text-white shadow-lg" : "bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-blue-300"}`}>
          🖥️ Online Auctions
        </button>
        <button onClick={() => setAuctionViewMode("liveroom")} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${auctionViewMode === "liveroom" ? "bg-purple-600 text-white shadow-lg" : "bg-white/80 text-slate-700 border-2 border-slate-200 hover:border-purple-300"}`}>
          🏛️ Live Room Auctions
        </button>
      </div>

      {auctionViewMode === "online" ? (
        <>
          <AuctionStats />
          <AuctionCards />
        </>
      ) : (
        <div className="space-y-6">
          {/* Live Room Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total", value: liveRoomStats.total, color: "from-purple-500 to-indigo-600" },
              { label: "Live Now", value: liveRoomStats.live, color: "from-red-500 to-rose-600" },
              { label: "Scheduled", value: liveRoomStats.scheduled, color: "from-blue-500 to-cyan-600" },
              { label: "Completed", value: liveRoomStats.completed, color: "from-slate-500 to-slate-600" },
              { label: "Registrations", value: liveRoomStats.totalRegistrations, color: "from-green-500 to-emerald-600" },
            ].map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
                <div className={`size-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}><MapPin className="size-4 text-white" /></div>
                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-xs font-medium text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter Bar for Live Room */}
          <FilterBar
            searchPlaceholder="Search auctions..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[{
              label: "All Status", value: statusFilter,
              options: [
                { value: "scheduled", label: "Scheduled" }, { value: "live", label: "Live" },
                { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" },
              ],
              onChange: setStatusFilter,
            }]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLiveRoom.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-white/80 rounded-3xl border-2 border-white/60 shadow-xl">
                <MapPin className="size-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-slate-600">No auctions found</p>
              </div>
            ) : filteredLiveRoom.map((auction: any) => (
              <div key={auction._id} className={`bg-white/80 backdrop-blur-xl rounded-2xl p-5 border-2 shadow-lg cursor-pointer transition-all hover:shadow-xl ${selectedLiveAuction?._id === auction._id ? "border-purple-500 ring-2 ring-purple-300" : "border-white/60 hover:border-purple-300"}`}
                onClick={() => onSelectAuction(auction)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mb-2 ${auction.auctionType === "live" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                      {auction.auctionType === "live" ? "🏛️ Live Room" : "🔄 Hybrid"}
                    </span>
                    <h3 className="font-black text-slate-900 text-sm leading-tight">{auction.auctionTitle}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${auction.status === "live" ? "bg-red-100 text-red-600" : auction.status === "completed" ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-600"}`}>{auction.status?.toUpperCase()}</span>
                </div>
                {auction.venue?.name ? (
                  <div className="flex items-center gap-1 text-xs text-slate-600 mb-2"><MapPin className="size-3 text-purple-500" /><span className="font-medium">{auction.venue.name}{auction.venue.city ? `, ${auction.venue.city}` : ""}</span></div>
                ) : <div className="text-xs text-slate-400 mb-2">No venue set</div>}
                <p className="text-xs text-slate-500 mb-2">{auction.startDateTime ? new Date(auction.startDateTime).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }) : "TBC"}</p>
                {auction.startDateTime && auction.endDateTime && <AuctionTimer startDateTime={auction.startDateTime} endDateTime={auction.endDateTime} status={auction.status} showLabel={true} />}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button onClick={e => { e.stopPropagation(); onEnterResults(auction); }} className="w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all">Enter Results</button>
                </div>
              </div>
            ))}
          </div>

          {selectedLiveAuction && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-200 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div><h3 className="text-xl font-black text-slate-900">Registrations</h3><p className="text-sm text-slate-500 font-medium">{selectedLiveAuction.auctionTitle}</p></div>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">{liveRegistrations.length} registered</span>
              </div>
              {liveRegistrations.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium">No registrations yet for this auction.</div>
              ) : (
                <div className="space-y-3">
                  {liveRegistrations.map((reg: any) => (
                    <div key={reg._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">{reg.name?.charAt(0) || "?"}</div>
                        <div><p className="font-bold text-slate-900 text-sm">{reg.name}</p><p className="text-xs text-slate-500">{reg.email} · {reg.phone}</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reg.approvalStatus === "approved" ? (
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Approved</span>
                        ) : reg.approvalStatus === "rejected" ? (
                          <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">✗ Rejected</span>
                        ) : (
                          <>
                            <button onClick={() => onApproveLead(reg._id)} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold hover:bg-green-200">✓ Approve</button>
                            <button onClick={() => onShowReject(reg)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold hover:bg-red-200">✗ Reject</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}