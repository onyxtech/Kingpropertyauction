import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useMenuApi = () => {
  const queryClient = useQueryClient();

  const useGetMenus = () =>
    useQuery({
      queryKey: ["menus"],
      queryFn: async () => {
        const result = await apiClient.fetch("/menus");
        if (!result.success) throw new Error(result.message);
        return result.data || [];
      },
    });

  const useGetMenuById = (id: string) =>
    useQuery({
      queryKey: ["menus", id],
      queryFn: async () => {
        const result = await apiClient.fetch(`/menus/${id}`);
        if (!result.success) throw new Error(result.message);
        return result.data;
      },
      enabled: !!id,
    });

  const useCreateMenu = () =>
    useMutation({
      mutationFn: async (data: any) => {
        const result = await apiClient.fetch("/menus", { method: "POST", body: JSON.stringify(data) });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
    });

  const useUpdateMenu = () =>
    useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        const result = await apiClient.fetch(`/menus/${id}`, { method: "PUT", body: JSON.stringify(data) });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
    });

  const useDeleteMenu = () =>
    useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/menus/${id}`, { method: "DELETE" });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
    });

  const useDuplicateMenu = () =>
    useMutation({
      mutationFn: async (id: string) => {
        const result = await apiClient.fetch(`/menus/${id}/duplicate`, { method: "POST" });
        if (!result.success) throw new Error(result.message);
        return result;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
    });

  return { useGetMenus, useGetMenuById, useCreateMenu, useUpdateMenu, useDeleteMenu, useDuplicateMenu };
};