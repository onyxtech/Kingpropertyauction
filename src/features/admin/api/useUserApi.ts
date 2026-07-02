import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

export const useUserApi = () => {
  const queryClient = useQueryClient();

  const useGetUsers = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const result = await apiClient.fetch("/users");
        if (!result.success) return [];
        return result.data;
      },
      enabled: isAuthenticated,
      retry: false,
    });
  };

  const useGetUserProperties = (userId: string) => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users", userId, "properties"],
      queryFn: async () => {
        const result = await apiClient.fetch(`/users/${userId}/properties`);
        if (!result.success) return [];
        return result.data;
      },
      enabled: !!userId && isAuthenticated,
      retry: false,
    });
  };

  const useGetUserAuctions = (userId: string) => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users", userId, "auctions"],
      queryFn: async () => {
        const result = await apiClient.fetch(`/users/${userId}/auctions`);
        if (!result.success) return [];
        return result.data;
      },
      enabled: !!userId && isAuthenticated,
      retry: false,
    });
  };

  const useGetUserBids = (
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users", userId, "bids", page, limit],
      queryFn: async () => {
        const result = await apiClient.fetch(
          `/users/${userId}/bids?page=${page}&limit=${limit}`,
        );
        if (!result.success)
          return { data: [], pagination: { total: 0, pages: 0 } };
        return result;
      },
      enabled: !!userId && isAuthenticated,
      retry: false,
    });
  };

  const useGetUserDocuments = (
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users", userId, "documents", page, limit],
      queryFn: async () => {
        const result = await apiClient.fetch(
          `/users/${userId}/documents?page=${page}&limit=${limit}`,
        );
        if (!result.success)
          return { data: [], pagination: { total: 0, pages: 0 } };
        return result;
      },
      enabled: !!userId && isAuthenticated,
      retry: false,
    });
  };

  const useUpdateUserStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }: { id: string; status: string }) => {
        const result = await apiClient.fetch(`/users/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    });
  };

  const useUpdateUser = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        const result = await apiClient.fetch(`/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    });
  };

  const useDeleteUser = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/users/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "suspended" }),
        });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    });
  };

  const useReviewRoleRequest = () => {
    return useMutation({
      mutationFn: async ({
        id,
        decision,
        reviewNote,
      }: {
        id: string;
        decision: "approved" | "rejected";
        reviewNote?: string;
      }) => {
        const result = await apiClient.fetch(`/users/${id}/review-role`, {
          method: "PATCH",
          body: JSON.stringify({ decision, reviewNote }),
        });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    });
  };

  const useVerifyDocument = () => {
    return useMutation({
      mutationFn: async ({
        userId,
        docIndex,
        status,
        rejectionReason,
      }: {
        userId: string;
        docIndex: number;
        status: "verified" | "rejected";
        rejectionReason?: string;
      }) => {
        const result = await apiClient.fetch("/users/verify-id-document", {
          method: "PUT",
          body: JSON.stringify({ userId, docIndex, status, rejectionReason }),
        });
        if (!result.success) throw new Error(result.message);
        return result;
      },
    });
  };

  const useGetUserById = (userId: string) => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users", userId],
      queryFn: async () => {
        const result = await apiClient.fetch(`/users/${userId}`);
        if (!result.success) throw new Error(result.message);
        return result;
      },
      enabled: !!userId && isAuthenticated,
      retry: false,
    });
  };

  const useGetUserPayments = (
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
      queryKey: ["users", userId, "payments", page, limit],
      queryFn: async () => {
        const result = await apiClient.fetch(
          `/users/${userId}/payments?page=${page}&limit=${limit}`,
        );
        if (!result.success)
          return { data: [], pagination: { total: 0, pages: 0 } };
        return result;
      },
      enabled: !!userId && isAuthenticated,
      retry: false,
    });
  };

  const useGetUserActivity = (userId: string, page: number = 1, limit: number = 20) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["users", userId, "activity", page, limit],
    queryFn: async () => {
      const result = await apiClient.fetch(
        `/users/${userId}/activity?page=${page}&limit=${limit}`
      );
      if (!result.success) return { data: [], pagination: { total: 0, pages: 0 } };
      return result;
    },
    enabled: !!userId && isAuthenticated,
    retry: false,
  });
};

  return {
    useGetUsers,
    useGetUserById, 
    useGetUserProperties,
    useGetUserAuctions,
    useGetUserBids,
    useGetUserDocuments,
    useVerifyDocument,
    useGetUserPayments,
    useGetUserActivity, 
    useUpdateUserStatus,
    useDeleteUser,
    useUpdateUser,
    useReviewRoleRequest,
  };
};
