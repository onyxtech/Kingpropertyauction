import Property from '../property/property.model.js';
import Auction from '../auction/auction.model.js';
import Bid from '../bid/bid.model.js';

// ─── Intent detection ───
const detectIntent = (text) => {
  const t = text.toLowerCase();
  const intents = [];

  if (/propert|house|flat|apartment|land|commercial|farmhouse|bedroom|bath|locat|city|town|area|postcode|price|cheap|expens|afford|budget|under|below|above|over|£/.test(t)) {
    intents.push('property_search');
  }

  if (/auction|live|upcoming|schedule|lot|hammer|bid|when|today|tomorrow|this week|next week|current/.test(t)) {
    intents.push('auction_search');
  }

  if (/how many|count|total|number of|available|list/.test(t)) {
    intents.push('stats');
  }

  if (/lot \d+|property id|specific|particular|this property|that property/.test(t)) {
    intents.push('specific_property');
  }

  return intents;
};

// ─── Extract filters from message ───
const extractFilters = (text) => {
  const t = text.toLowerCase();
  const filters = {};

  const ukCities = [
    'london', 'manchester', 'birmingham', 'leeds', 'liverpool',
    'sheffield', 'bristol', 'edinburgh', 'glasgow', 'cardiff',
    'newcastle', 'nottingham', 'oxford', 'cambridge', 'york',
    'leicester', 'coventry', 'bradford', 'belfast', 'brighton',
  ];
  const foundCity = ukCities.find(city => t.includes(city));
  if (foundCity) filters.city = foundCity;

  if (/house|detached|semi|terraced/.test(t)) filters.propertyType = 'house';
  if (/flat|apartment/.test(t)) filters.propertyType = 'apartment';
  if (/land|plot/.test(t)) filters.propertyType = 'land';
  if (/commercial|office|shop|retail/.test(t)) filters.propertyType = 'commercial';
  if (/farmhouse|farm/.test(t)) filters.propertyType = 'farmhouse';

  const priceMatches = t.match(/£?\s*(\d+(?:,\d+)?(?:\.\d+)?)\s*k?/g);
  if (priceMatches) {
    const prices = priceMatches.map(p => {
      const num = parseFloat(p.replace(/[£,\s]/g, ''));
      return p.includes('k') ? num * 1000 : num;
    }).filter(p => p > 1000);

    if (prices.length === 1) {
      if (/under|below|less than|up to|max/.test(t)) filters.maxPrice = prices[0];
      if (/above|over|more than|min|at least/.test(t)) filters.minPrice = prices[0];
    }
    if (prices.length === 2) {
      filters.minPrice = Math.min(...prices);
      filters.maxPrice = Math.max(...prices);
    }
  }

  const bedroomMatch = t.match(/(\d+)\s*bed/);
  if (bedroomMatch) filters.bedrooms = parseInt(bedroomMatch[1]);

  return filters;
};

// ─── Query properties ───
const searchProperties = async (filters = {}) => {
  try {
    const query = { propertyStatus: 'available', approvalStatus: 'approved' };

    if (filters.city) {
      query['location.city'] = { $regex: filters.city, $options: 'i' };
    }
    if (filters.propertyType) {
      query.propertyType = filters.propertyType;
    }
    if (filters.maxPrice) {
      query['pricing.startingAuctionPrice'] = { $lte: filters.maxPrice };
    }
    if (filters.minPrice) {
      query['pricing.startingAuctionPrice'] = {
        ...query['pricing.startingAuctionPrice'],
        $gte: filters.minPrice,
      };
    }
    if (filters.bedrooms) {
      query['specifications.bedrooms'] = filters.bedrooms;
    }

    return await Property.find(query)
      .limit(5)
      .sort('-createdAt')
      .select('propertyTitle propertyType location pricing specifications currentBid auctionDetails slug propertyStatus')
      .lean();
  } catch (e) {
    console.error('[RAG] Property search error:', e.message);
    return [];
  }
};

// ─── Query auctions ───
const searchAuctions = async (statusFilter = null) => {
  try {
    const query = statusFilter
      ? { status: statusFilter }
      : { status: { $in: ['live', 'scheduled'] } };

    return await Auction.find(query)
      .limit(5)
      .sort('startDateTime')
      .select('auctionTitle auctionType status startDateTime endDateTime totalLots currentBid totalBids slug')
      .lean();
  } catch (e) {
    console.error('[RAG] Auction search error:', e.message);
    return [];
  }
};

// ─── Get platform stats ───
const getPlatformStats = async () => {
  try {
    const [totalProperties, availableProperties, liveAuctions, scheduledAuctions, totalBids] =
      await Promise.all([
        Property.countDocuments({ approvalStatus: 'approved' }),
        Property.countDocuments({ propertyStatus: 'available', approvalStatus: 'approved' }),
        Auction.countDocuments({ status: 'live' }),
        Auction.countDocuments({ status: 'scheduled' }),
        Bid.countDocuments(),
      ]);

    return { totalProperties, availableProperties, liveAuctions, scheduledAuctions, totalBids };
  } catch (e) {
    console.error('[RAG] Stats error:', e.message);
    return null;
  }
};

// ─── Format property for AI context ───
const formatProperty = (p) => {
  const city = p.location?.city || '';
  const area = p.location?.area || '';
  const price = p.pricing?.startingAuctionPrice?.toLocaleString('en-GB') || 'POA';
  const currentBid = p.currentBid ? `£${p.currentBid.toLocaleString('en-GB')}` : 'No bids yet';
  const beds = p.specifications?.bedrooms || '';
  const status = p.auctionDetails?.auctionStatus || p.propertyStatus;
  const url = `/properties/${p.slug || p._id}`;

  return `• ${p.propertyTitle}${beds ? ` (${beds} bed)` : ''} | ${area ? area + ', ' : ''}${city} | Guide: £${price} | Current bid: ${currentBid} | Status: ${status} | URL: ${url}`;
};

// ─── Format auction for AI context ───
const formatAuction = (a) => {
  const start = a.startDateTime
    ? new Date(a.startDateTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';

  const url = `/auctions/${a.slug || a._id}`;

  let timeInfo = '';
  if (a.status === 'live') {
    const endsIn = a.endDateTime ? Math.round((new Date(a.endDateTime) - Date.now()) / 60000) : null;
    timeInfo = endsIn ? ` | LIVE - Ends in ${endsIn > 60 ? Math.round(endsIn / 60) + 'h' : endsIn + 'min'}` : ' | LIVE NOW';
  } else {
    timeInfo = start ? ` | Starts: ${start}` : '';
  }

  return `• ${a.auctionTitle} | ${a.auctionType} | ${a.totalLots || 0} lots | ${a.status.toUpperCase()}${timeInfo} | URL: ${url}`;
};

// ─── MAIN: Get RAG context for a user message ───
export const getRAGContext = async (userMessage) => {
  const intents = detectIntent(userMessage);
  const filters = extractFilters(userMessage);
  const contextParts = [];

  if (intents.includes('property_search')) {
    const properties = await searchProperties(filters);
    if (properties.length > 0) {
      contextParts.push(
        `MATCHING PROPERTIES IN DATABASE (${properties.length} found):\n` +
        properties.map(formatProperty).join('\n')
      );
    } else {
      const anyProperties = await searchProperties({});
      if (anyProperties.length > 0) {
        contextParts.push(
          `AVAILABLE PROPERTIES (showing recent):\n` +
          anyProperties.map(formatProperty).join('\n')
        );
      } else {
        contextParts.push('PROPERTIES: No properties currently match those criteria. Suggest user browse /properties or contact us.');
      }
    }
  }

  if (intents.includes('auction_search')) {
    const isLiveQuery = /live|now|current|today|ongoing/.test(userMessage.toLowerCase());
    const auctions = await searchAuctions(isLiveQuery ? 'live' : null);

    if (auctions.length > 0) {
      const liveOnes = auctions.filter(a => a.status === 'live');
      const scheduledOnes = auctions.filter(a => a.status === 'scheduled');

      let auctionContext = 'CURRENT AUCTIONS IN DATABASE:\n';
      if (liveOnes.length > 0) {
        auctionContext += `LIVE NOW (${liveOnes.length}):\n` + liveOnes.map(formatAuction).join('\n') + '\n';
      }
      if (scheduledOnes.length > 0) {
        auctionContext += `UPCOMING (${scheduledOnes.length}):\n` + scheduledOnes.map(formatAuction).join('\n');
      }
      contextParts.push(auctionContext);
    } else {
      contextParts.push('AUCTIONS: No live or upcoming auctions at this moment. Suggest user check /auctions for latest schedule.');
    }
  }

  if (intents.includes('stats')) {
    const stats = await getPlatformStats();
    if (stats) {
      contextParts.push(
        `PLATFORM STATISTICS:\n` +
        `• Available properties: ${stats.availableProperties}\n` +
        `• Live auctions right now: ${stats.liveAuctions}\n` +
        `• Upcoming auctions: ${stats.scheduledAuctions}\n` +
        `• Total bids placed: ${stats.totalBids}`
      );
    }
  }

  return contextParts.join('\n\n');
};
