import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Gavel } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import AuctionFormModal from "@/features/auction/components/AuctionFormModal";
import { useAuctionApi } from "@/features/auction/api/useAuctionApi";

export default function EditAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetAuctionById } = useAuctionApi();
  const { data: auction, isLoading } = useGetAuctionById(id || "");

  if (isLoading) {
    return (
      <AdminLayout activeTab="auctions" onTabChange={() => {}}>
        <div className="flex items-center justify-center h-96">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="auctions" onTabChange={() => {}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/admin/auctions")} className="p-2.5 hover:bg-white/80 rounded-xl transition-all">
            <ArrowLeft className="size-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Gavel className="size-8 text-purple-600" />
              Edit Auction
            </h1>
            <p className="text-slate-600 font-medium">{auction?.auctionTitle}</p>
          </div>
        </div>
        {auction && (
          <AuctionFormModal
            editData={auction}
            onClose={() => navigate("/admin/auctions")}
            onSave={() => navigate("/admin/auctions")}
          />
        )}
      </div>
    </AdminLayout>
  );
}