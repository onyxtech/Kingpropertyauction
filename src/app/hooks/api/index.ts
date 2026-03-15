/**
 * API Hooks Index
 * 
 * Central export file for all API hooks
 * Import like: import { usePropertyApi, useAuctionApi } from '../hooks/api';
 */

export { usePropertyApi } from './usePropertyApi';
export { useAuctionApi } from './useAuctionApi';
export { useCampaignApi } from './useCampaignApi';
export { useReportApi } from './useReportApi';
export { useUserApi } from './useUserApi';
export { useAgentApi } from './useAgentApi';
export { useDashboardApi } from './useDashboardApi';
export { useSettingsApi } from './useSettingsApi';
export { useAuthApi } from './useAuthApi';
export { useBiddingApi } from './useBiddingApi';
export { useLeadApi } from './useLeadApi';
export { usePageApi } from './usePageApi';

// Re-export types for convenience
export type {
  Property,
  PropertyFormData,
  Auction,
  AuctionFormData,
  Campaign,
  CampaignFormData,
  Report,
  ReportFormData,
  User,
  UserFormData,
  Agent,
  AgentFormData,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  FileUploadResponse,
} from '../../types/api';