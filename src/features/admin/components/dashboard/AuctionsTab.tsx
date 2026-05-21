import { Plus } from "lucide-react";
import AuctionStats from "@/features/auction/components/AuctionStats";
import AuctionCards from "@/features/auction/components/AuctionCards";

interface AuctionsTabProps {
  theme: { secondary: string };
  onCreateAuction: () => void;
}

export default function AuctionsTab({ theme, onCreateAuction }: AuctionsTabProps) {
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

      <AuctionStats />
      <AuctionCards />
    </div>
  );
}
