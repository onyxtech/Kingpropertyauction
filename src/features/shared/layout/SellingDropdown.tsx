import { ChevronRight, Building2, Grid3x3, ThumbsUp, HelpCircle, FileText, Gift, ClipboardList } from "lucide-react";

interface SellingDropdownProps {
  show: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (path: string) => void;
}

export default function SellingDropdown({ show, onMouseEnter, onMouseLeave, onNavigate }: SellingDropdownProps) {
  if (!show) return null;

  return (
    <div className="absolute top-full left-0 pt-2 w-72 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-3"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-red-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 size-64 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-64 bg-gradient-to-br from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-1.5">
          <button
            onClick={() => onNavigate("/add-property")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-green-600 bg-gradient-to-r from-transparent to-transparent hover:from-green-50/80 hover:to-emerald-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Building2 className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-green-600 transition-colors">Add Property</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">List your property</div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => onNavigate("/selling-overview")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-blue-600 bg-gradient-to-r from-transparent to-transparent hover:from-blue-50/80 hover:to-indigo-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Grid3x3 className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-blue-600 transition-colors">Selling Overview</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Start your journey</div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => onNavigate("/why-sell-with-future")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-purple-600 bg-gradient-to-r from-transparent to-transparent hover:from-purple-50/80 hover:to-pink-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <ThumbsUp className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-purple-600 transition-colors">Why Sell With Future</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Discover advantages</div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => onNavigate("/guide-faq")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-emerald-600 bg-gradient-to-r from-transparent to-transparent hover:from-emerald-50/80 hover:to-teal-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <HelpCircle className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-emerald-600 transition-colors">Guide & FAQ</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Get answers</div>
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
            <span className="px-3 py-1 text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm rounded-full">PREMIUM</span>
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
                <div className="font-bold group-hover:text-orange-600 transition-colors">Free Valuation</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Know your worth</div>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full">FREE</div>
          </button>

          <button
            onClick={() => onNavigate("/referral-fee")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-indigo-600 bg-gradient-to-r from-transparent to-transparent hover:from-indigo-50/80 hover:to-blue-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Gift className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-indigo-600 transition-colors">Referral Fee</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Earn rewards</div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => onNavigate("/home-report")}
            className="w-full px-5 py-4 text-left text-sm font-bold text-slate-700 hover:text-rose-600 bg-gradient-to-r from-transparent to-transparent hover:from-rose-50/80 hover:to-red-50/80 rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="size-11 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-rose-500/40 transition-all group-hover:scale-110 group-hover:rotate-3">
                <ClipboardList className="size-5 text-white" />
              </div>
              <div>
                <div className="font-bold group-hover:text-rose-600 transition-colors">Home Report</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Property assessment</div>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
