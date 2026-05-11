import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/stores/authStore';

export const useAdminStats = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const result = await apiClient.fetch('/dashboard/stats');
      if (!result.success) {
        return {
          totalProperties: 0, pendingProperties: 0, approvedProperties: 0,
          totalAuctions: 0, liveAuctions: 0, totalBids: 0,
          totalUsers: 0, totalLeads: 0, pendingUsers: 0,
          activities: [], approvals: [],
        };
      }
      return result.data;
    },
    enabled: isAuthenticated, // Only fetch when logged in
    retry: false,
  });
};