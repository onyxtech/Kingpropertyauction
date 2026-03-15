// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Property Types
export interface PropertyFormData {
  // 1. Basic Property Information
  propertyTitle: string;
  propertyDescription: string;
  propertyType: "house" | "apartment" | "land" | "commercial" | "farmhouse";
  propertyCategory: "residential" | "commercial" | "industrial";
  listingType: "auction" | "direct_sale";
  propertyID?: string;
  propertyStatus: "available" | "sold" | "pending";

  // 2. Location Details
  country: string;
  state: string;
  city: string;
  area: string;
  streetAddress: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;

  // 3. Property Specifications
  totalArea: string;
  landArea?: string;
  coveredArea?: string;
  bedrooms: string;
  bathrooms: string;
  floors?: string;
  yearBuilt?: string;
  parkingSpaces?: string;
  furnishedStatus: "unfurnished" | "semi-furnished" | "fully-furnished";

  // 4. Pricing Information
  startingAuctionPrice: string;
  reservePrice: string;
  buyNowPrice?: string;
  minimumBidIncrement: string;
  estimatedMarketValue?: string;
  currency: "GBP" | "USD" | "EUR";

  // 5. Auction Details
  auctionStartDate: string;
  auctionEndDate: string;
  auctionStatus: "upcoming" | "live" | "closed";
  bidDepositAmount?: string;
  autoBidEnabled: boolean;
  maximumBidLimit?: string;
  numberOfBidders?: string;

  // 6. Property Features
  features: {
    garden: boolean;
    swimmingPool: boolean;
    balcony: boolean;
    airConditioning: boolean;
    securitySystem: boolean;
    elevator: boolean;
    gym: boolean;
    solarSystem: boolean;
  };

  // 7. Legal Information
  ownershipType: string;
  titleDeedNumber?: string;
  propertyTaxInfo?: string;
  mortgageStatus: "clear" | "mortgaged" | "partially_paid";
  zoningType?: string;

  // 8. Seller / Agent Information
  sellerName: string;
  sellerContact: string;
  sellerEmail: string;
  agentName?: string;
  agentContact?: string;

  // 9. Media & Documents (file paths after upload)
  propertyImages?: string[];
  propertyVideo?: string;
  virtualTour?: string;
  floorPlan?: string;
  legalDocuments?: string[];

  // 10. System Fields
  createdBy?: string;
  createdDate?: string;
  lastUpdated?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
}

export interface Property extends PropertyFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Auction Types
export interface AuctionFormData {
  auctionTitle: string;
  auctionType: "live" | "online" | "hybrid";
  startDateTime: string;
  endDateTime: string;
  description?: string;
  venueName?: string;
  venueAddress?: string;
  registrationFee?: number;
  depositRequired?: number;
  maxBidders?: number;
  enableAutoBidding: boolean;
  sendEmailNotifications: boolean;
}

export interface Auction extends AuctionFormData {
  id: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  totalBids: number;
  totalBidders: number;
  createdAt: string;
  updatedAt: string;
}

// Campaign Types
export interface CampaignFormData {
  campaignName: string;
  campaignType: "newsletter" | "property" | "auction" | "promotional";
  targetAudience: "all" | "buyers" | "sellers" | "investors" | "agents";
  emailSubject: string;
  emailBody: string;
  emailTemplate?: "custom" | "modern" | "classic" | "minimal";
  scheduleType: "now" | "later";
  scheduleDateTime?: string;
}

export interface Campaign extends CampaignFormData {
  id: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface ReportFormData {
  reportType: "sales" | "auction" | "user" | "property" | "financial" | "marketing";
  startDate: string;
  endDate: string;
  format: "pdf" | "excel" | "csv";
  includeCharts: boolean;
}

export interface Report extends ReportFormData {
  id: string;
  status: "generating" | "completed" | "failed";
  fileUrl?: string;
  createdAt: string;
}

// User Types
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "buyer" | "seller" | "investor" | "agent" | "admin";
  accountStatus: "active" | "pending" | "suspended";
  password: string;
  permissions: {
    canBid: boolean;
    canList: boolean;
    emailNotifications: boolean;
    smsAlerts: boolean;
  };
}

export interface User extends Omit<UserFormData, "password"> {
  id: string;
  fullName: string;
  avatar?: string;
  kycStatus?: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Agent Types
export interface AgentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  licenseNumber?: string;
  officeAddress?: string;
  commissionRate?: number;
  specialization?: "residential" | "commercial" | "luxury" | "all";
}

export interface Agent extends AgentFormData {
  id: string;
  fullName: string;
  avatar?: string;
  status: "active" | "inactive" | "suspended";
  totalListings?: number;
  totalSales?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  type?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}
