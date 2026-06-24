// Maps bidder IDs to anonymous labels like "Bidder 1 (Glasgow)"
const bidderMap = new Map<string, { number: number; city: string }>();
let counter = 0;

export const getAnonymousBidder = (bidderId: string, city?: string) => {
  if (!bidderId) return { name: "Anonymous", city: "" };
  
  if (!bidderMap.has(bidderId)) {
    counter++;
    bidderMap.set(bidderId, { number: counter, city: city || "UK" });
  }
  
  const data = bidderMap.get(bidderId)!;
  return {
    name: `Bidder ${data.number}`,
    city: data.city,
    initials: `B${data.number}`,
    avatar: String(data.number),
  };
};

// Reset counter (call when component mounts)
export const resetBidderCounter = () => {
  counter = 0;
  bidderMap.clear();
};