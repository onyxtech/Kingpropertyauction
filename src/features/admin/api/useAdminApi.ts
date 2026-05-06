import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const result = await apiClient.fetch('/dashboard/stats');
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });
};