import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface CampaignFormData {
  name: string; type: string; subject: string; content: string;
  templatePreset?: string; targetRoles?: string[]; targetAll?: boolean;
  scheduledAt?: string; status?: string;
}

export const useCampaignApi = () => {
  const queryClient = useQueryClient();

  const useGetCampaigns = (params?: any) => useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.type) query.set('type', params.type);
      const result = await apiClient.fetch(`/campaigns?${query}`);
      if (!result.success) throw new Error(result.message);
      return result;
    },
  });

  const useGetCampaignById = (id: string) => useQuery({
    queryKey: ['campaigns', id],
    queryFn: async () => { const r = await apiClient.fetch(`/campaigns/${id}`); if (!r.success) throw new Error(r.message); return r.data; },
    enabled: !!id,
  });

  const useCreateCampaign = () => useMutation({
    mutationFn: async (data: CampaignFormData) => { const r = await apiClient.fetch('/campaigns', { method: 'POST', body: JSON.stringify(data) }); if (!r.success) throw new Error(r.message); return r; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const useUpdateCampaign = () => useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CampaignFormData> }) => { const r = await apiClient.fetch(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }); if (!r.success) throw new Error(r.message); return r; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const useDeleteCampaign = () => useMutation({
    mutationFn: async (id: string) => { const r = await apiClient.fetch(`/campaigns/${id}`, { method: 'DELETE' }); if (!r.success) throw new Error(r.message); return r; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const useDuplicateCampaign = () => useMutation({
    mutationFn: async (id: string) => { const r = await apiClient.fetch(`/campaigns/${id}/duplicate`, { method: 'POST' }); if (!r.success) throw new Error(r.message); return r; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const useSendCampaign = () => useMutation({
    mutationFn: async (id: string) => { const r = await apiClient.fetch(`/campaigns/${id}/send`, { method: 'POST' }); if (!r.success) throw new Error(r.message); return r; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });

  const useSendTestEmail = () => useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => { const r = await apiClient.fetch(`/campaigns/${id}/test`, { method: 'POST', body: JSON.stringify({ email }) }); if (!r.success) throw new Error(r.message); return r; },
  });

  const useGetTemplates = () => useQuery({
    queryKey: ['campaigns', 'templates'],
    queryFn: async () => { const r = await apiClient.fetch('/campaigns/templates'); return r.success && Array.isArray(r.data) ? r.data : []; },
    staleTime: 300000,
  });

  const useGetProperties = () => useQuery({
    queryKey: ['campaigns', 'properties'],
    queryFn: async () => { const r = await apiClient.fetch('/campaigns/properties'); return r.success && Array.isArray(r.data) ? r.data : []; },
    staleTime: 120000,
  });

  const useGetAuctions = () => useQuery({
    queryKey: ['campaigns', 'auctions'],
    queryFn: async () => { const r = await apiClient.fetch('/campaigns/auctions'); return r.success && Array.isArray(r.data) ? r.data : []; },
    staleTime: 120000,
  });

  return { useGetCampaigns, useGetCampaignById, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, useDuplicateCampaign, useSendCampaign, useSendTestEmail, useGetTemplates, useGetProperties, useGetAuctions };
};

export const useCampaignStats = () => useQuery({
  queryKey: ['campaigns', 'stats'],
  queryFn: async () => { const r = await apiClient.fetch('/campaigns/stats'); if (!r.success) throw new Error(r.message); return r.data; },
  refetchInterval: 30000,
});