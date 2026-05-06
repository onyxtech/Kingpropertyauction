import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useUserApi = () => {
  const queryClient = useQueryClient();

  const useGetUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const result = await apiClient.fetch("/users");
        if (!result.success) throw new Error(result.message);
        return result.data;
      },
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

  return { useGetUsers, useUpdateUserStatus, useDeleteUser, useUpdateUser };
};
