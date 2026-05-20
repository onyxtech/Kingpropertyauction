import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { CACHE_KEYS } from '@/constants';
import type { AuctionStatusUpdateEvent, BidUpdateEvent } from '@/types';

interface UseAuctionSocketOptions {
  onAuctionUpdate?: (data: AuctionStatusUpdateEvent) => void;
  onBidUpdate?: (data: BidUpdateEvent) => void;
  propertyId?: string;
  auctionId?: string;
}

export const useAuctionSocket = (options: UseAuctionSocketOptions = {}) => {
  const queryClient = useQueryClient();
  const { onAuctionUpdate, onBidUpdate, propertyId, auctionId } = options;

  const handleAuctionUpdate = useCallback(
    (data: AuctionStatusUpdateEvent) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.AUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PROPERTIES] });
      onAuctionUpdate?.(data);
    },
    [queryClient, onAuctionUpdate]
  );

  const handleBidUpdate = useCallback(
    (data: BidUpdateEvent) => {
      if (propertyId && data.propertyId !== propertyId) return;
      if (auctionId && data.auctionId !== auctionId) return;

      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.AUCTIONS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PROPERTIES] });
      onBidUpdate?.(data);
    },
    [queryClient, onBidUpdate, propertyId, auctionId]
  );

  useEffect(() => {
    const socket = getSocket();

    socket.on('auction_status_update', handleAuctionUpdate);
    socket.on('bid_update', handleBidUpdate);

    return () => {
      socket.off('auction_status_update', handleAuctionUpdate);
      socket.off('bid_update', handleBidUpdate);
    };
  }, [handleAuctionUpdate, handleBidUpdate]);
};

export default useAuctionSocket;
