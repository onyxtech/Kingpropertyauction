import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from "@/lib/apiClient";
import type { AuctionFormData } from "@/app/types/api";

export const useAuctionApi = () => {
  const queryClient = useQueryClient();

  const useGetAuctions = (params?: any) => {
    return useQuery({
      queryKey: ['auctions', params],
      queryFn: async () => {
        const query = new URLSearchParams();
        if (params?.page) query.set('page', String(params.page));
        if (params?.status) query.set('status', params.status);
        if (params?.type) query.set('type', params.type);
        if (params?.excludeType) query.set('excludeType', params.excludeType);
        if (params?.limit) query.set('limit', String(params.limit));
        const result = await apiClient.fetch(`/auctions?${query}`);
        if (!result.success) throw new Error(result.message);
        return result;
      },
      enabled: true,
    });
  };

  const useGetAuctionById = (id: string) => {
    return useQuery({
      queryKey: ['auctions', id],
      queryFn: async () => {
        const result = await apiClient.fetch(`/auctions/${id}`);
        if (!result.success) throw new Error(result.message);
        return result.data;
      },
      enabled: !!id,
    });
  };

  const useCreateAuction = () => {
    return useMutation({
      mutationFn: async (data: AuctionFormData) => {
        const result = await apiClient.fetch('/auctions', { method: 'POST', body: JSON.stringify(data) });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
    });
  };

  const useUpdateAuction = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<AuctionFormData> }) => {
        const result = await apiClient.fetch(`/auctions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
    });
  };

  const useDeleteAuction = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/auctions/${id}`, { method: 'DELETE' });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
    });
  };

  const useStartAuction = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/auctions/${id}/start`, { method: 'PATCH' });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
    });
  };

  const useEndAuction = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/auctions/${id}/end`, { method: 'PATCH' });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
    });
  };

  const useCancelAuction = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/auctions/${id}/cancel`, { method: 'PATCH' });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
    });
  };

  return {
    useGetAuctions, useGetAuctionById, useCreateAuction, useUpdateAuction,
    useDeleteAuction, useStartAuction, useEndAuction, useCancelAuction,
  };
};