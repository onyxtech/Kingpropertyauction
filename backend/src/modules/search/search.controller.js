import Auction from "../auction/auction.model.js";

export const universalSearch = async (req, res) => {
  try {
    const { q, type } = req.query;
    const results = { auctions: [] };

    if (q && q.length >= 2 && (!type || type === "all" || type === "auctions")) {
      const regex = new RegExp(q, "i");
      results.auctions = await Auction.find({
        auctionTitle: regex,
        status: { $in: ["live", "scheduled"] },
      })
        .select("auctionTitle slug auctionType status startDateTime totalLots")
        .sort("-startDateTime")
        .limit(5)
        .lean();
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};