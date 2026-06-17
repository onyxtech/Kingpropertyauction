import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

export const useCustomerApi = () => {
  const { login, user, token, setActiveView } = useAuthStore();

  const useMyProperties = () =>
    useQuery({
      queryKey: ["my-properties"],
      queryFn: async () => {
        const result = await apiClient.fetch("/properties/my");
        return result.success ? result.data : [];
      },
      staleTime: 0,
    });

  const useMyBids = () =>
    useQuery({
      queryKey: ["my-bids"],
      queryFn: async () => {
        const result = await apiClient.fetch("/bids/my-bids");
        return result.success ? result.data : [];
      },
      staleTime: 10 * 1000,
      refetchInterval: (query) => {
        const data = query.state.data;
        const hasActiveBids =
          Array.isArray(data) &&
          data.some((b: any) =>
            ["active", "winning", "outbid"].includes(b.status),
          );
        return hasActiveBids ? 30 * 1000 : false;
      },
    });

  const useMyMessages = () =>
    useQuery({
      queryKey: ["my-messages"],
      queryFn: async () => {
        const result = await apiClient.fetch("/messages/my/list");
        return result.success ? result.data : [];
      },
      staleTime: 30 * 1000,
    });

  const useMyProfile = () =>
    useQuery({
      queryKey: ["my-profile"],
      queryFn: async () => {
        const result = await apiClient.fetch("/auth/me");
        return result.success ? result.user : null;
      },
      staleTime: 0,
    });

  const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (data: any) => {
        const result = await apiClient.fetch("/auth/profile", {
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (!result.success) throw new Error(result.message || "Update failed");
        return result.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["my-profile"] });
        const userData = data?.user || data?.data?.user || data;
        if (userData && token && user) {
          login(token, {
            ...user,
            ...userData,
            agentDetails: userData.agentDetails || user.agentDetails,
          });
        }
      },
    });
  };

  const useMyPropertyStats = () =>
    useQuery({
      queryKey: ["my-property-stats"],
      queryFn: async () => {
        const result = await apiClient.fetch("/properties/my/auction-stats");
        return result.success ? result.data : null;
      },
      staleTime: 15 * 1000,
    });

  const useMyPropertyBidders = () =>
    useQuery({
      queryKey: ["my-property-bidders"],
      queryFn: async () => {
        const result = await apiClient.fetch("/properties/my/bidders");
        return result.success ? result.data : [];
      },
      staleTime: 15 * 1000,
      refetchInterval: 30 * 1000,
    });

  const useSwitchView = () => {
    return useMutation({
      mutationFn: async (view: "buyer" | "seller") => {
        const result = await apiClient.fetch("/users/switch-view", {
          method: "POST",
          body: JSON.stringify({ view }),
        });
        if (!result.success) throw new Error(result.message || "Switch failed");
        return result.data;
      },
      onSuccess: (data) => {
        // Just update the in-memory view - no persistence needed
        setActiveView(data.activeView || "buyer");
      },
    });
  };

  const useRequestRoleSwitch = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (payload: {
        requestedRole: string;
        message?: string;
      }) => {
        const result = await apiClient.fetch("/users/request-role", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!result.success)
          throw new Error(result.message || "Request failed");
        return result.data;
      },
      onSuccess: (data) => {
        if (data && token && user) {
          login(token, { ...user, roleRequest: data.roleRequest });
        }
        queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      },
    });
  };

  const useMyWatchlist = () =>
    useQuery({
      queryKey: ["my-watchlist"],
      queryFn: async () => {
        const result = await apiClient.fetch("/properties/watchlist");
        return result.success ? result.data : [];
      },
      staleTime: 30 * 1000,
    });

  const useToggleWatchlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (propertyId: string) => {
        const result = await apiClient.fetch(
          `/properties/${propertyId}/watchlist`,
          {
            method: "POST",
          },
        );
        if (!result.success) throw new Error(result.message || "Toggle failed");
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-watchlist"] });
      },
    });
  };

  const useMyEnquiries = () =>
    useQuery({
      queryKey: ["my-enquiries"],
      queryFn: async () => {
        const result = await apiClient.fetch("/leads/my");
        return result.success ? result.data : [];
      },
      staleTime: 60 * 1000,
    });

  const useMyPayments = () =>
    useQuery({
      queryKey: ["my-payments"],
      queryFn: async () => {
        const result = await apiClient.fetch("/payments/my");
        return result.success ? result.data : [];
      },
      staleTime: 30 * 1000,
    });

  return {
    useMyProperties,
    useMyBids,
    useMyMessages,
    useMyProfile,
    useUpdateProfile,
    useMyPropertyStats,
    useMyPropertyBidders,
    useSwitchView,
    useRequestRoleSwitch,
    useMyWatchlist,
    useToggleWatchlist,
    useMyPayments,
    useMyEnquiries,
  };
};
