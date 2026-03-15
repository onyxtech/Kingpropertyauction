import { useState } from "react";
import { ApiResponse } from "../../types/api";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Bidding Types
export interface BidData {
  auctionId: string;
  amount: number;
  maxBid?: number; // For auto-bidding
  userId: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  propertyId: string;
  userId: string;
  bidderName: string;
  bidderNumber: string;
  amount: number;
  maxBid?: number;
  isAutoBid: boolean;
  timestamp: string;
  status: "active" | "outbid" | "winning" | "won" | "lost" | "retracted";
}

export interface BidHistory {
  bids: Bid[];
  currentHighBid: number;
  totalBids: number;
  uniqueBidders: number;
  yourHighestBid?: number;
  yourPosition?: number;
}

// Mock bids data
let mockBids: Bid[] = [
  {
    id: "BID-001",
    auctionId: "AUC-001",
    propertyId: "PROP-001",
    userId: "USR-001",
    bidderName: "John D.",
    bidderNumber: "B001",
    amount: 450000,
    isAutoBid: false,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    status: "winning",
  },
  {
    id: "BID-002",
    auctionId: "AUC-001",
    propertyId: "PROP-001",
    userId: "USR-002",
    bidderName: "Sarah M.",
    bidderNumber: "B002",
    amount: 445000,
    isAutoBid: false,
    timestamp: new Date(Date.now() - 120000).toISOString(),
    status: "outbid",
  },
];

let nextBidId = 3;

export const useBiddingApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Place a bid
   */
  const placeBid = async (data: BidData): Promise<ApiResponse<Bid>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(1000);

      // Get current high bid for auction
      const auctionBids = mockBids.filter((b) => b.auctionId === data.auctionId);
      const currentHighBid = auctionBids.length > 0 ? Math.max(...auctionBids.map((b) => b.amount)) : 0;

      // Validate bid amount
      const minimumBid = currentHighBid + 1000; // £1,000 increment
      if (data.amount < minimumBid) {
        throw new Error(`Bid must be at least £${minimumBid.toLocaleString()}`);
      }

      // Check if user already has a bid
      const userBid = auctionBids.find((b) => b.userId === data.userId);

      // Create new bid
      const newBid: Bid = {
        id: `BID-${String(nextBidId).padStart(3, "0")}`,
        auctionId: data.auctionId,
        propertyId: "PROP-001", // Would come from auction data
        userId: data.userId,
        bidderName: "You", // Would come from user data
        bidderNumber: `B${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        amount: data.amount,
        maxBid: data.maxBid,
        isAutoBid: !!data.maxBid,
        timestamp: new Date().toISOString(),
        status: "winning",
      };

      // Mark previous bids as outbid
      mockBids.forEach((bid) => {
        if (bid.auctionId === data.auctionId && bid.status === "winning") {
          bid.status = "outbid";
        }
      });

      mockBids.push(newBid);
      nextBidId++;

      setLoading(false);
      return {
        success: true,
        data: newBid,
        message: `Bid placed successfully! You are now the highest bidder at £${data.amount.toLocaleString()}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place bid";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get bid history for an auction
   */
  const getBidHistory = async (auctionId: string): Promise<ApiResponse<BidHistory>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const auctionBids = mockBids
        .filter((b) => b.auctionId === auctionId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const currentHighBid = auctionBids.length > 0 ? Math.max(...auctionBids.map((b) => b.amount)) : 0;
      const uniqueBidders = new Set(auctionBids.map((b) => b.userId)).size;

      const bidHistory: BidHistory = {
        bids: auctionBids,
        currentHighBid,
        totalBids: auctionBids.length,
        uniqueBidders,
      };

      setLoading(false);
      return {
        success: true,
        data: bidHistory,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get bid history";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get user's bids across all auctions
   */
  const getMyBids = async (userId: string): Promise<ApiResponse<Bid[]>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const userBids = mockBids
        .filter((b) => b.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setLoading(false);
      return {
        success: true,
        data: userBids,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get your bids";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get current high bid for an auction
   */
  const getCurrentHighBid = async (auctionId: string): Promise<ApiResponse<Bid | null>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const auctionBids = mockBids.filter((b) => b.auctionId === auctionId);

      if (auctionBids.length === 0) {
        setLoading(false);
        return {
          success: true,
          data: null,
        };
      }

      const highestBid = auctionBids.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current
      );

      setLoading(false);
      return {
        success: true,
        data: highestBid,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get current bid";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Set maximum autobid amount
   */
  const setMaxBid = async (
    auctionId: string,
    userId: string,
    maxAmount: number
  ): Promise<ApiResponse<Bid>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      // Find user's current bid
      const userBid = mockBids.find((b) => b.auctionId === auctionId && b.userId === userId);

      if (!userBid) {
        throw new Error("You must place a bid first before setting a maximum autobid");
      }

      if (maxAmount <= userBid.amount) {
        throw new Error("Maximum autobid must be higher than your current bid");
      }

      // Update max bid
      userBid.maxBid = maxAmount;
      userBid.isAutoBid = true;

      setLoading(false);
      return {
        success: true,
        data: userBid,
        message: `Maximum autobid set to £${maxAmount.toLocaleString()}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to set maximum bid";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Retract a bid (if allowed by auction rules)
   */
  const retractBid = async (bidId: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      await delay(800);

      const bidIndex = mockBids.findIndex((b) => b.id === bidId);

      if (bidIndex === -1) {
        throw new Error("Bid not found");
      }

      const bid = mockBids[bidIndex];

      // Check if bid can be retracted (e.g., auction not ended, within time limit)
      const bidAge = Date.now() - new Date(bid.timestamp).getTime();
      const maxRetractionTime = 5 * 60 * 1000; // 5 minutes

      if (bidAge > maxRetractionTime) {
        throw new Error("Bids can only be retracted within 5 minutes of placing");
      }

      // Mark bid as retracted
      bid.status = "retracted";

      // Re-calculate winning bid
      const auctionBids = mockBids.filter(
        (b) => b.auctionId === bid.auctionId && b.status !== "retracted"
      );
      
      if (auctionBids.length > 0) {
        const highestBid = auctionBids.reduce((prev, current) =>
          prev.amount > current.amount ? prev : current
        );
        highestBid.status = "winning";
      }

      setLoading(false);
      return {
        success: true,
        message: "Bid retracted successfully",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to retract bid";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Check if user is winning an auction
   */
  const isWinning = async (auctionId: string, userId: string): Promise<ApiResponse<boolean>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(300);

      const auctionBids = mockBids.filter((b) => b.auctionId === auctionId);

      if (auctionBids.length === 0) {
        setLoading(false);
        return { success: true, data: false };
      }

      const highestBid = auctionBids.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current
      );

      const isUserWinning = highestBid.userId === userId;

      setLoading(false);
      return {
        success: true,
        data: isUserWinning,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check bid status";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get bid increment rules for an auction
   */
  const getBidIncrement = async (currentBid: number): Promise<ApiResponse<number>> => {
    setLoading(true);
    setError(null);

    try {
      await delay(200);

      // Typical auction increment rules
      let increment = 1000;

      if (currentBid >= 1000000) {
        increment = 50000; // £50k for properties over £1M
      } else if (currentBid >= 500000) {
        increment = 25000; // £25k for properties over £500k
      } else if (currentBid >= 250000) {
        increment = 10000; // £10k for properties over £250k
      } else if (currentBid >= 100000) {
        increment = 5000; // £5k for properties over £100k
      }

      setLoading(false);
      return {
        success: true,
        data: increment,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get bid increment";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get bidding statistics for a property
   */
  const getBiddingStats = async (auctionId: string): Promise<
    ApiResponse<{
      totalBids: number;
      uniqueBidders: number;
      currentHighBid: number;
      startingBid: number;
      averageBid: number;
      bidFrequency: number; // bids per hour
    }>
  > => {
    setLoading(true);
    setError(null);

    try {
      await delay(500);

      const auctionBids = mockBids.filter((b) => b.auctionId === auctionId);

      if (auctionBids.length === 0) {
        setLoading(false);
        return {
          success: true,
          data: {
            totalBids: 0,
            uniqueBidders: 0,
            currentHighBid: 0,
            startingBid: 400000,
            averageBid: 0,
            bidFrequency: 0,
          },
        };
      }

      const totalBids = auctionBids.length;
      const uniqueBidders = new Set(auctionBids.map((b) => b.userId)).size;
      const currentHighBid = Math.max(...auctionBids.map((b) => b.amount));
      const averageBid = auctionBids.reduce((sum, b) => sum + b.amount, 0) / totalBids;

      // Calculate bid frequency
      const firstBid = new Date(auctionBids[auctionBids.length - 1].timestamp).getTime();
      const lastBid = new Date(auctionBids[0].timestamp).getTime();
      const durationHours = (lastBid - firstBid) / (1000 * 60 * 60);
      const bidFrequency = durationHours > 0 ? totalBids / durationHours : totalBids;

      setLoading(false);
      return {
        success: true,
        data: {
          totalBids,
          uniqueBidders,
          currentHighBid,
          startingBid: 400000, // Mock starting bid
          averageBid: Math.round(averageBid),
          bidFrequency: Math.round(bidFrequency * 10) / 10,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get bidding stats";
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    loading,
    error,
    placeBid,
    getBidHistory,
    getMyBids,
    getCurrentHighBid,
    setMaxBid,
    retractBid,
    isWinning,
    getBidIncrement,
    getBiddingStats,
  };
};
