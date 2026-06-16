import { useAuthStore } from "@/stores/authStore";

export type CustomerRole = "admin" | "agent" | "seller" | "buyer" | "user";

export const useCustomerRole = () => {
  const { user, activeView: storedActiveView } = useAuthStore();

  const rawRole = user?.role || "buyer";
  const role = rawRole === "user" ? "buyer" : rawRole as CustomerRole;
  const permissions = user?.permissions || {};

  const canBid = role !== "admin" && permissions.canBid === true;
  const canListProperties = permissions.canListProperties === true;

  // Derive correct default view from permissions
  const getDefaultView = (): string => {
    if (role === "admin") return "admin";
    if ((role === "seller" || role === "agent") && !canBid) return "seller";
    if (role === "buyer" && !canListProperties) return "buyer";
    // Has both permissions - use role default
    if (role === "seller" || role === "agent") return "seller";
    return "buyer";
  };

  const activeView = storedActiveView || getDefaultView();

  // What's visible NOW
  const showSellerView = canListProperties && activeView === "seller";
  const showBuyerView = canBid && activeView === "buyer";

  // Can switch = has both permissions
  const canSwitchView = canBid && canListProperties;

  const hasPendingRequest = user?.roleRequest?.status === "pending";
  const canApplyToSell = !canListProperties && role !== "admin" && !hasPendingRequest;
  const canApplyToBid = !canBid && role !== "admin" && !hasPendingRequest;

  const getCombinedRoleLabel = () => {
    if (role === "admin")
      return (user as any)?.isSuperAdmin ? "Super Admin" : "Administrator";
    if (role === "agent") return canBid ? "Agent & Buyer" : "Agent";
        if (role === "seller") return canBid ? "Owner & Buyer" : "Owner";
    return canListProperties ? "Buyer & Owner" : "Buyer";
  };

  const getActiveViewLabel = () => {
    if (activeView === "seller") {
      if (role === "agent") return "Agent View";
      return "Owner View";
    }
    return "Buyer View";
  };

  return {
    role,
    rawRole,
    activeView,
    canBid,
    canListProperties,
    canSwitchView,
    canApplyToSell,
    canApplyToBid,
    showSellerView,
    showBuyerView,
    getCombinedRoleLabel,
    getRoleLabel: getCombinedRoleLabel,
    getActiveViewLabel,
    canAddProperty: canListProperties,
    canSeeEarnings: canListProperties,
    canSeeCommission: role === "agent",
    canSwitchToBuyer: canSwitchView,
    isAdmin: role === "admin",
    isSeller: role === "seller",
    isAgent: role === "agent",
    isBuyer: role === "buyer" || rawRole === "user",
    isOwnProperty: (property: any) => {
      const ownerId = property?.createdBy?._id || property?.createdBy;
      const uid = user?.id || (user as any)?._id;
      return !!(ownerId && uid && ownerId.toString() === uid.toString());
    },
  };
};
