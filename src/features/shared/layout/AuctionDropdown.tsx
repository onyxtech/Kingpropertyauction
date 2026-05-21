import {
  ChevronRight,
  Grid3x3,
  Zap,
  Package,
  FileText,
} from "lucide-react";

interface AuctionDropdownProps {
  show: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (path: string) => void;
}

export default function AuctionDropdown({
  show,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: AuctionDropdownProps) {
  if (!show) return null;

  return (
    <div
      className="absolute top-full left-0 pt-2 w-[500px] opacity-100 visible transition-all"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 size-64 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-64 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 space-y-3">
          <button
            onClick={() => onNavigate("/auctions")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-blue-600 bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/80 hover:to-indigo-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Grid3x3 className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-blue-600 transition-colors">
                  View All Auctions
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Browse auction lots
                </div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => onNavigate("/live-auctions")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-red-600 bg-gradient-to-r from-transparent to-transparent hover:from-red-50/80 hover:to-orange-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-red-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Zap className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-red-600 transition-colors flex items-center gap-2">
                  Live Auctions
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full animate-pulse font-black">
                    LIVE
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Bid in real-time
                </div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => onNavigate("/view-all-lots")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-emerald-600 bg-gradient-to-r from-transparent to-transparent hover:from-emerald-50/80 hover:to-teal-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Package className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-emerald-600 transition-colors">
                  View All Lots
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Explore inventory
                </div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 py-1 text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm rounded-full">
              SERVICES
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <button
            onClick={() => onNavigate("/free-valuation")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-orange-600 bg-gradient-to-r from-transparent to-transparent hover:from-orange-50/80 hover:to-amber-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-orange-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <FileText className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-orange-600 transition-colors">
                  Property Valuation
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Get instant estimate
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full">
              FREE
            </div>
          </button>

          <button
            onClick={() => onNavigate("/catalogue-request")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-rose-600 bg-gradient-to-r from-transparent to-transparent hover:from-rose-50/80 hover:to-red-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-rose-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <FileText className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-rose-600 transition-colors">
                  Catalogue Request
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Download brochures
                </div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}