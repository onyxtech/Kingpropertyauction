import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const result = await apiClient.fetch('/analytics/overview');
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Auto-refresh every minute
  });
};

export const useRevenueTrend = (months: number = 12) => {
  return useQuery({
    queryKey: ['analytics', 'revenue', months],
    queryFn: async () => {
      const result = await apiClient.fetch(`/analytics/revenue?months=${months}`);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 30000,
  });
};

export const usePropertyDistribution = () => {
  return useQuery({
    queryKey: ['analytics', 'property-distribution'],
    queryFn: async () => {
      const result = await apiClient.fetch('/analytics/property-distribution');
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 60000,
  });
};

export const useBiddingActivity = (months: number = 6) => {
  return useQuery({
    queryKey: ['analytics', 'bidding-activity', months],
    queryFn: async () => {
      const result = await apiClient.fetch(`/analytics/bidding-activity?months=${months}`);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 15000, // 15 seconds - bidding changes frequently
    refetchInterval: 30000,
  });
};

export const useUserGrowth = (months: number = 12) => {
  return useQuery({
    queryKey: ['analytics', 'user-growth', months],
    queryFn: async () => {
      const result = await apiClient.fetch(`/analytics/user-growth?months=${months}`);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 60000,
  });
};

export const useKpiMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'kpi'],
    queryFn: async () => {
      const result = await apiClient.fetch('/analytics/kpi');
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useLeadsAnalytics = (months: number = 6) => {
  return useQuery({
    queryKey: ['analytics', 'leads', months],
    queryFn: async () => {
      const result = await apiClient.fetch(`/analytics/leads?months=${months}`);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};