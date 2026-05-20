// ─── Cache Keys ───
export const CACHE_KEYS = {
  AUCTIONS: 'auctions',
  AUCTION_DETAIL: (id: string) => `auctions-${id}`,
  PROPERTIES: 'properties',
  PROPERTY_DETAIL: (slug: string) => `properties-${slug}`,
  USERS: 'users',
  LEADS: 'leads',
  BIDS: 'bids',
  STATS: 'stats',
} as const;

// ─── Cache TTL (seconds) ───
export const CACHE_TTL = {
  SHORT: 10,
  MEDIUM: 30,
  LONG: 60,
  VERY_LONG: 300,
} as const;

// ─── Auction Types ───
export const AUCTION_TYPES = {
  ONLINE: 'online',
  LIVE: 'live',
} as const;

// ─── Auction Statuses ───
export const AUCTION_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// ─── Property Statuses ───
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  UNSOLD: 'unsold',
} as const;

// ─── Lead Types ───
export const LEAD_TYPES = {
  CONTACT: 'contact',
  VALUATION: 'valuation',
  FINANCE: 'finance',
  CATALOGUE: 'catalogue',
  LIVE_REGISTRATION: 'live-registration',
  NEWSLETTER: 'newsletter',
  FAQ: 'faq',
  LEGAL: 'legal',
} as const;

// ─── Routes ───
export const ROUTES = {
  HOME: '/',
  AUCTIONS: '/auctions',
  LIVE_AUCTIONS: '/live-auctions',
  VIEW_ALL_LOTS: '/view-all-lots',
  VIEW_LIVE_LOCATIONS: '/view-live-locations',
  PROPERTIES: '/properties',
  CONTACT: '/contact-us',
  FREE_VALUATION: '/free-valuation',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_LEADS: '/admin/leads',
  ADMIN_LIVE_REGISTRATIONS: '/admin/live-registrations',
} as const;

// ─── UK Timezone ───
export const UK_TIMEZONE = 'Europe/London';

// ─── Format helpers ───
export const formatUKDateOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: UK_TIMEZONE,
};

export const formatUKDateTimeOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: UK_TIMEZONE,
};
