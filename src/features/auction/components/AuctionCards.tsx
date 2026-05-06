import { useAuctionApi } from "@/features/auction/api/useAuctionApi";
import AuctionCard from "./AuctionCard";

export default function AuctionCards() {
  const { useGetAuctions } = useAuctionApi();
  const { data, isLoading } = useGetAuctions();
  const auctions = data?.data || [];

  if (isLoading) {
    return <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6"><p className="text-center text-slate-500 py-8">Loading auctions...</p></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {auctions.map((auction: any) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
      {auctions.length === 0 && (
        <div className="col-span-2 text-center py-8 text-slate-500">No auctions found.</div>
      )}
    </div>
  );
}