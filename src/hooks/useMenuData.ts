import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useMenuData = () => {
  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const result = await apiClient.fetch("/menus");
      return result.success ? result.data : [];
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const headerMenu = menus.find(
    (m: any) => m.location === "Header" && m.status === "active",
  );
  const footerMenu = menus.find(
    (m: any) => m.location === "Footer" && m.status === "active",
  );

  const getTopLevel = (menu: any) => {
    if (!menu?.items) return [];
    return menu.items
      .filter((item: any) => !item.parent)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  };

  const getChildren = (menu: any, parentId: string) => {
    if (!menu?.items) return [];
    return menu.items
      .filter((item: any) => {
        const p = item.parent?._id || item.parent;
        return p?.toString() === parentId?.toString();
      })
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  };

  const getFooterGroups = () => {
    if (!footerMenu?.items) return [];
    const parents = getTopLevel(footerMenu);
    return parents.map((parent: any) => ({
      ...parent,
      children: getChildren(footerMenu, parent._id),
    }));
  };

  const getHeaderDropdowns = () => {
    const topLevel = getTopLevel(headerMenu);
    return topLevel
      .filter((item: any) => {
        if (item.type === "dropdown") return true;
        const children = getChildren(headerMenu, item._id);
        return children.length > 0;
      })
      .map((item: any) => ({
        ...item,
        children: getChildren(headerMenu, item._id),
      }));
  };

  const getStandaloneLinks = () => {
    return getTopLevel(headerMenu).filter((item: any) => {
      if (item.type === "dropdown") return false;
      const children = getChildren(headerMenu, item._id);
      return children.length === 0;
    });
  };

  return {
    menus,
    isLoading,
    headerMenu,
    footerMenu,
    getTopLevel,
    getChildren,
    getFooterGroups,
    getHeaderDropdowns,
    getStandaloneLinks,
  };
};
