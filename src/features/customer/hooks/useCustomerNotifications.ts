import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/stores/authStore";

export const useCustomerNotifications = () => {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [toasts, setToasts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["customer-notifications"],
    queryFn: async () => {
      const result = await apiClient.fetch("/notifications/all?limit=20");
      if (result.success) {
        setTotal(result.total || 0);
        return result.data;
      }
      return [];
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const { data: unreadData, refetch: refetchCount } = useQuery({
    queryKey: ["notification-count"],
    queryFn: async () => {
      const result = await apiClient.fetch("/notifications/unread-count");
      return result.success ? result.data : { count: 0 };
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const unreadCount = unreadData?.count || 0;
  const hasMore = notifications.length < total;

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.fetch(`/notifications/${id}/read`, { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await apiClient.fetch("/notifications/read-all", { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  const loadMore = async () => {
    const result = await apiClient.fetch(
      `/notifications/all?limit=20&skip=${notifications.length}`
    );
    if (result.success) {
      queryClient.setQueryData(
        ["customer-notifications"],
        (old: any[]) => [...(old || []), ...result.data]
      );
      setTotal(result.total || 0);
    }
  };

  const showToast = useCallback((notification: any) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = getSocket();
    const userId = (user as any)._id || (user as any).id;
    const ns = user?.notificationSettings || {};

    socket.emit("join_notifications");

    const handleBidUpdate = (data: any) => {
      if (data.outbidUserId === userId) {
        if (ns.outbid === false) { refetch(); refetchCount(); return; }
        showToast({
          type: "outbid",
          title: "You've been outbid!",
          message: `New highest bid: £${data.amount?.toLocaleString()}`,
          color: "orange",
          link: `/auctions/${data.auctionId}`,
        });
        refetch();
        refetchCount();
      }
    };

    const handleAuctionWon = (data: any) => {
      if (data.userId === userId) {
        if (ns.auctionWon === false) { refetch(); refetchCount(); queryClient.invalidateQueries({ queryKey: ["my-bids"] }); return; }
        showToast({
          type: "won",
          title: "🎉 You won!",
          message: "Congratulations! You won the auction",
          color: "green",
          link: `/auctions/${data.auctionId}`,
        });
        refetch();
        refetchCount();
        queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      }
    };

    const handleNewNotification = (data: any) => {
      const type = data.type || "message";
      if (type === "bid" && ns.newBidOnProperty === false) { refetch(); refetchCount(); return; }
      if (type === "bid" && data.message?.includes("placed") && ns.bidPlaced === false) { refetch(); refetchCount(); return; }
      if (type === "bid" && data.message?.includes("lost") && ns.auctionLost === false) { refetch(); refetchCount(); return; }
      if (type === "bid_won" && ns.auctionWon === false) { refetch(); refetchCount(); return; }
      if (type === "property_sold" && ns.propertySold === false) { refetch(); refetchCount(); return; }
      if (type === "auction_live" && ns.auctionStarted === false) { refetch(); refetchCount(); return; }
      if (type === "auction_completed" && ns.auctionEnded === false) { refetch(); refetchCount(); return; }
      if (type === "property" && data.message?.includes("approved") && ns.propertyApproved === false) { refetch(); refetchCount(); return; }
      if (type === "property" && data.message?.includes("rejected") && ns.propertyRejected === false) { refetch(); refetchCount(); return; }
      if (type === "lead" && data.message?.toLowerCase().includes("opportunity") && ns.offerReceived === false) { refetch(); refetchCount(); return; }
      if (type === "lead" && data.message?.toLowerCase().includes("reply") && ns.messageReceived === false) { refetch(); refetchCount(); return; }
      if (type === "lead" && !data.message?.toLowerCase().includes("opportunity") && !data.message?.toLowerCase().includes("reply") && ns.newEnquiry === false) { refetch(); refetchCount(); return; }
      if (type === "message" && ns.messageReceived === false) { refetch(); refetchCount(); return; }
      if (type === "user" && ns.messageReceived === false) { refetch(); refetchCount(); return; }
      if (type === "auction_completed") {
        showToast({
          type: "auction_completed",
          title: "Auction Ended",
          message: data.message || "An auction has ended",
          color: "purple",
          link: data.link,
        });
        refetch();
        refetchCount();
        queryClient.invalidateQueries({ queryKey: ["my-bids"] });
        return;
      }
      if (type === "system") {
        showToast({
          type: "system",
          title: "Update",
          message: data.message || "You have an update",
          color: data.color || "blue",
          link: data.link,
        });
        refetch();
        refetchCount();
        queryClient.invalidateQueries({ queryKey: ["my-payments"] });
        queryClient.invalidateQueries({ queryKey: ["my-commissions"] });
        queryClient.invalidateQueries({ queryKey: ["my-bids"] });
        return;
      }
      if (type === "offer") {
        showToast({
          type: "offer",
          title: "Property Opportunity",
          message: data.message || "A property you bid on may be available",
          color: "amber",
          link: data.link || "/dashboard/offers",
        });
        refetch();
        refetchCount();
        queryClient.invalidateQueries({ queryKey: ["customer-notifications"] });
        return;
      }
      showToast({
        type,
        title: "New notification",
        message: data.message || "You have a new notification",
        color: data.color || "blue",
        link: data.link || "/dashboard/messages",
      });
      refetch();
      refetchCount();
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["my-commissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
    };

    socket.on("bid_update", handleBidUpdate);
    socket.on("auction_won", handleAuctionWon);
    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("bid_update", handleBidUpdate);
      socket.off("auction_won", handleAuctionWon);
      socket.off("new_notification", handleNewNotification);
    };
  }, [isAuthenticated, user, showToast, refetch, refetchCount, queryClient]);

  return {
    notifications,
    unreadCount,
    toasts,
    hasMore,
    loadMore,
    markAsRead: (id: string) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
  };
};
