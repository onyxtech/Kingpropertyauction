// ─── User Types ───
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Property Types ───
export interface PropertyLocation {
  country: string;
  state: string;
  city: string;
  area: string;
  streetAddress: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;
}

export interface PropertyPricing {
  currency: string;
  startingAuctionPrice: number;
  reservePrice: number;
  minimumBidIncrement: number;
  buyNowPrice?: number;
}

export interface PropertyMedia {
  propertyImages: string[];
  videoTour?: string;
  floorPlan?: string;
  legalDocuments: string[];
}

export interface PropertyAuctionDetails {
  auctionStatus: string;
  currentBid: number;
  soldPrice?: number;
  autoBidEnabled: boolean;
  numberOfBidders: number;
  auctionStartDate?: string;
  auctionEndDate?: string;
}

export interface Property {
  _id: string;
  slug: string;
  propertyTitle: string;
  propertyType: string;
  listingType: 'auction' | 'direct_sale';
  propertyStatus: 'available' | 'sold' | 'unsold';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  location: PropertyLocation;
  pricing: PropertyPricing;
  media: PropertyMedia;
  auctionDetails: PropertyAuctionDetails;
  specifications?: {
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
  };
  currentBid: number;
  totalBids: number;
  soldPrice?: number;
  winningBidder?: User | string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Venue Types ───
export interface Venue {
  name: string;
  address: string;
  city: string;
  postcode: string;
}

// ─── Auction Types ───
export type AuctionType = 'online' | 'live';
export type AuctionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface Auction {
  _id: string;
  slug: string;
  auctionTitle: string;
  description?: string;
  auctionType: AuctionType;
  status: AuctionStatus;
  startDateTime: string;
  endDateTime: string;
  properties: Property[] | string[];
  totalBids: number;
  totalBidders: number;
  venue?: Venue;
  auctionImage?: string;
  bidIncrement?: number;
  createdBy?: User | string;
  createdAt: string;
  updatedAt: string;
}

// ─── Bid Types ───
export interface Bid {
  _id: string;
  auction: Auction | string;
  property: Property | string;
  bidder: User | string;
  amount: number;
  isAutoBid: boolean;
  maxBid?: number;
  status: 'winning' | 'outbid' | 'won' | 'lost' | 'retracted';
  createdAt: string;
}

// ─── Lead Types ───
export type LeadType =
  | 'contact' | 'valuation' | 'finance' | 'catalogue'
  | 'referral' | 'general' | 'chat' | 'alert' | 'solicitor'
  | 'home-report' | 'buying' | 'selling' | 'legal' | 'faq'
  | 'newsletter' | 'live-registration';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  leadType: LeadType;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  registrationStatus?: 'pending' | 'approved' | 'rejected';
  auctionRef?: string;
  notes?: Array<{ text: string; addedBy: string; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Types ───
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ─── Socket Event Types ───
export interface AuctionStatusUpdateEvent {
  auctionId: string;
  status: AuctionStatus;
  type?: string;
}

export interface BidUpdateEvent {
  auctionId: string;
  propertyId: string;
  newBid: number;
  currentBid: number;
  totalBids: number;
  reservePrice: number;
  reserveMet: boolean;
  isAutoBid: boolean;
}
