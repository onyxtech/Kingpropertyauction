import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useBiddingApi = () => {
  const queryClient = useQueryClient();

  const usePlaceBid = () => {
    return useMutation({
      mutationFn: async (data: {
        auction: string;
        property: string;
        amount: number;
        isAutoBid?: boolean;
        maxBid?: number | null;
      }) => {
        const result = await apiClient.fetch("/bids", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auctions"] });
        queryClient.invalidateQueries({ queryKey: ["bids"] });
      },
    });
  };

  const useGetBidHistory = (auctionId: string) => {
    return useQuery({
      queryKey: ["bids", auctionId],
      queryFn: async () => {
        const result = await apiClient.fetch(`/bids/auction/${auctionId}`);
        if (!result.success) throw new Error(result.message);
        return result.data;
      },
      enabled: !!auctionId,
    });
  };

  const useGetMyBids = () => {
    return useQuery({
      queryKey: ["bids", "my"],
      queryFn: async () => {
        const result = await apiClient.fetch("/bids/my-bids");
        if (!result.success) throw new Error(result.message);
        return result.data;
      },
    });
  };

  const useGetAllBids = (params?: any) => {
    return useQuery({
      queryKey: ["bids", "admin", "all", params],
      queryFn: async () => {
        const query = new URLSearchParams();
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.auctionId) query.set("auctionId", params.auctionId);
        if (params?.propertyId) query.set("propertyId", params.propertyId);
        if (params?.status) query.set("status", params.status);
        if (params?.sortBy) query.set("sortBy", params.sortBy);
        const result = await apiClient.fetch(`/bids/admin/all?${query}`);
        if (!result.success) throw new Error(result.message);
        return result;
      },
    });
  };

  const useGetBidsStats = () => {
    return useQuery({
      queryKey: ["bids", "admin", "stats"],
      queryFn: async () => {
        const result = await apiClient.fetch("/bids/admin/stats");
        if (!result.success) throw new Error(result.message);
        return result.data;
      },
    });
  };

  return {
    usePlaceBid,
    useGetBidHistory,
    useGetMyBids,
    useGetAllBids,
    useGetBidsStats,
  };
};
