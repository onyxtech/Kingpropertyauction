# API Hooks Documentation

This directory contains TypeScript API hooks for the King Property Auction platform. All hooks follow a consistent pattern and provide mock data for development.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Available Hooks](#available-hooks)
4. [Usage Examples](#usage-examples)
5. [API Reference](#api-reference)
6. [Type Definitions](#type-definitions)

## Overview

All API hooks are built with:
- **TypeScript** for type safety
- **React Hooks** for state management
- **Mock Data** for development/testing
- **Consistent API** across all modules
- **Error Handling** built-in
- **Loading States** for better UX

## Installation

Import hooks from the central index file:

```typescript
import { usePropertyApi, useAuctionApi, useUserApi } from '../hooks/api';
```

Or import individual hooks:

```typescript
import { usePropertyApi } from '../hooks/api/usePropertyApi';
```

## Available Hooks

### 1. usePropertyApi
Manage property listings, uploads, and approvals.

**Methods:**
- `createProperty(data)` - Create new property
- `getProperties(params)` - Get all properties with filters
- `getPropertyById(id)` - Get single property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property
- `uploadPropertyImages(files)` - Upload images
- `approveProperty(id)` - Approve property
- `rejectProperty(id, reason)` - Reject property

### 2. useAuctionApi
Manage auction events and bidding.

**Methods:**
- `createAuction(data)` - Create new auction
- `getAuctions(params)` - Get all auctions
- `getAuctionById(id)` - Get single auction
- `updateAuction(id, data)` - Update auction
- `deleteAuction(id)` - Delete auction
- `startAuction(id)` - Start auction
- `endAuction(id)` - End auction
- `cancelAuction(id, reason)` - Cancel auction

### 3. useCampaignApi
Manage marketing campaigns and emails.

**Methods:**
- `createCampaign(data)` - Create new campaign
- `getCampaigns(params)` - Get all campaigns
- `getCampaignById(id)` - Get single campaign
- `updateCampaign(id, data)` - Update campaign
- `deleteCampaign(id)` - Delete campaign
- `sendCampaignNow(id)` - Send campaign immediately
- `getCampaignStats(id)` - Get campaign statistics

### 4. useReportApi
Generate and manage reports.

**Methods:**
- `generateReport(data)` - Generate new report
- `getReports(params)` - Get all reports
- `getReportById(id)` - Get single report
- `deleteReport(id)` - Delete report
- `downloadReport(id)` - Download report file
- `getReportAnalytics(type, startDate, endDate)` - Get analytics
- `scheduleRecurringReport(data, frequency)` - Schedule recurring report

### 5. useUserApi
Manage user accounts and KYC.

**Methods:**
- `createUser(data)` - Create new user
- `getUsers(params)` - Get all users
- `getUserById(id)` - Get single user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `suspendUser(id, reason)` - Suspend user
- `activateUser(id)` - Activate user
- `verifyUserKYC(id)` - Verify KYC
- `rejectUserKYC(id, reason)` - Reject KYC
- `getUserStats()` - Get user statistics

### 6. useAgentApi
Manage property agents and performance.

**Methods:**
- `createAgent(data)` - Create new agent
- `getAgents(params)` - Get all agents
- `getAgentById(id)` - Get single agent
- `updateAgent(id, data)` - Update agent
- `deleteAgent(id)` - Delete agent
- `suspendAgent(id, reason)` - Suspend agent
- `activateAgent(id)` - Activate agent
- `getAgentPerformance(id)` - Get performance stats
- `getAgentStats()` - Get agent statistics
- `assignPropertyToAgent(agentId, propertyId)` - Assign property

### 7. useDashboardApi ✨ NEW
Dashboard analytics and metrics.

**Methods:**
- `getDashboardStats()` - Get complete dashboard stats
- `getRecentActivities(limit)` - Get recent activities
- `getNotifications(unreadOnly)` - Get notifications
- `markNotificationRead(id)` - Mark notification as read
- `getOverviewStats()` - Get overview statistics
- `getRevenueAnalytics(start, end)` - Get revenue data
- `getAuctionMetrics()` - Get auction metrics
- `getUserMetrics()` - Get user metrics
- `getFinancialMetrics()` - Get financial metrics
- `getMarketingMetrics()` - Get marketing metrics
- `exportDashboardData(format)` - Export dashboard data
- `getSystemHealth()` - System health check

### 8. useSettingsApi 🎛️ NEW
Manage select field options dynamically.

**Methods:**
- `getOptionsByCategory(category)` - Get all options for a category
- `getActiveOptions(category)` - Get only active options (for forms)
- `createOption(data)` - Add new option
- `updateOption(id, data)` - Edit existing option
- `deleteOption(id)` - Delete option
- `reorderOptions(category, ids)` - Change sort order
- `toggleOptionStatus(id)` - Activate/deactivate
- `getCategorySummary()` - Get category summary

**Settings Page:** Navigate to `/settings` to manage options

**Categories:** 21+ categories including propertyType, auctionType, userRole, etc.

**Documentation:** See `SETTINGS_INTEGRATION_GUIDE.md` for complete guide

## Usage Examples

### Basic Usage

```typescript
import React, { useEffect, useState } from 'react';
import { usePropertyApi } from '../hooks/api';

function PropertyList() {
  const { loading, error, getProperties } = usePropertyApi();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await getProperties({ page: 1, pageSize: 10 });
      if (response.success) {
        setProperties(response.data);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>{property.propertyTitle}</div>
      ))}
    </div>
  );
}
```

### Creating a Property

```typescript
import { usePropertyApi } from '../hooks/api';

function AddPropertyForm() {
  const { loading, error, createProperty } = usePropertyApi();

  const handleSubmit = async (formData) => {
    const response = await createProperty(formData);
    
    if (response.success) {
      console.log('Property created:', response.data);
      alert(response.message);
    } else {
      console.error('Error:', response.error);
      alert('Failed to create property');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(/* your form data */);
    }}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Filtering and Searching

```typescript
import { usePropertyApi } from '../hooks/api';

function SearchablePropertyList() {
  const { getProperties } = usePropertyApi();
  const [properties, setProperties] = useState([]);

  const searchProperties = async (searchTerm) => {
    const response = await getProperties({
      page: 1,
      pageSize: 20,
      search: searchTerm,
      status: 'available',
      type: 'house',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    if (response.success) {
      setProperties(response.data);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        onChange={(e) => searchProperties(e.target.value)}
        placeholder="Search properties..."
      />
      {/* Display properties */}
    </div>
  );
}
```

### Pagination Example

```typescript
import { usePropertyApi } from '../hooks/api';

function PaginatedPropertyList() {
  const { getProperties } = usePropertyApi();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });

  const loadProperties = async (page) => {
    const response = await getProperties({ page, pageSize: 10 });
    
    if (response.success) {
      setProperties(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages
      });
    }
  };

  return (
    <div>
      {/* Display properties */}
      <div>
        <button 
          onClick={() => loadProperties(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button 
          onClick={() => loadProperties(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### File Upload Example

```typescript
import { usePropertyApi } from '../hooks/api';

function PropertyImageUpload() {
  const { uploadPropertyImages, loading } = usePropertyApi();

  const handleFileUpload = async (files) => {
    const response = await uploadPropertyImages(Array.from(files));
    
    if (response.success) {
      console.log('Uploaded files:', response.data);
      // response.data contains array of FileUploadResponse objects
      response.data.forEach(file => {
        console.log('File URL:', file.fileUrl);
      });
    }
  };

  return (
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => handleFileUpload(e.target.files)}
      disabled={loading}
    />
  );
}
```

### Campaign with Statistics

```typescript
import { useCampaignApi } from '../hooks/api';

function CampaignDashboard({ campaignId }) {
  const { getCampaignStats, sendCampaignNow } = useCampaignApi();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const response = await getCampaignStats(campaignId);
      if (response.success) {
        setStats(response.data);
      }
    };
    loadStats();
  }, [campaignId]);

  const handleSendNow = async () => {
    const response = await sendCampaignNow(campaignId);
    if (response.success) {
      alert(response.message); // "Campaign sent to X recipients"
    }
  };

  return (
    <div>
      {stats && (
        <div>
          <p>Sent: {stats.sent}</p>
          <p>Opened: {stats.opened} ({stats.openRate}%)</p>
          <p>Clicked: {stats.clicked} ({stats.clickRate}%)</p>
        </div>
      )}
      <button onClick={handleSendNow}>Send Campaign</button>
    </div>
  );
}
```

### Report Generation

```typescript
import { useReportApi } from '../hooks/api';

function ReportGenerator() {
  const { generateReport, loading } = useReportApi();

  const handleGenerateReport = async () => {
    const reportData = {
      reportType: 'sales',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      format: 'pdf',
      includeCharts: true
    };

    const response = await generateReport(reportData);
    
    if (response.success) {
      console.log('Report generated:', response.data);
      // Download the report
      window.open(response.data.fileUrl, '_blank');
    }
  };

  return (
    <button onClick={handleGenerateReport} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Report'}
    </button>
  );
}
```

## API Reference

### Common Response Types

#### ApiResponse<T>
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

#### PaginatedResponse<T>
```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

#### QueryParams
```typescript
interface QueryParams {
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
```

## Type Definitions

All type definitions are available in `/src/app/types/api.ts`:

- `Property` & `PropertyFormData`
- `Auction` & `AuctionFormData`
- `Campaign` & `CampaignFormData`
- `Report` & `ReportFormData`
- `User` & `UserFormData`
- `Agent` & `AgentFormData`

## Error Handling

All hooks provide consistent error handling:

```typescript
const { loading, error, createProperty } = usePropertyApi();

// Error is automatically set in the hook state
if (error) {
  console.error('API Error:', error);
}

// Or check the response
const response = await createProperty(data);
if (!response.success) {
  console.error('Request failed:', response.error);
}
```

## Loading States

All hooks provide loading state:

```typescript
const { loading, getProperties } = usePropertyApi();

return (
  <div>
    {loading && <Spinner />}
    <button disabled={loading}>Submit</button>
  </div>
);
```

## Converting to Real API

To connect to a real backend API:

1. Replace the mock `delay()` calls with actual `fetch()` or `axios` calls
2. Update the API endpoint URLs
3. Add authentication headers as needed
4. Handle real error responses
5. Update mock data structures to match backend response

Example conversion:

```typescript
// Current mock implementation
const createProperty = async (data: PropertyFormData): Promise<ApiResponse<Property>> => {
  await delay(1000);
  const newProperty = { ...data, id: 'PROP-001' };
  return { success: true, data: newProperty };
};

// Real API implementation
const createProperty = async (data: PropertyFormData): Promise<ApiResponse<Property>> => {
  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create property');
    }
    
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
```

## Best Practices

1. **Always check response.success** before using data
2. **Display error messages** to users
3. **Show loading states** during API calls
4. **Handle pagination** for large datasets
5. **Debounce search inputs** to reduce API calls
6. **Cache responses** where appropriate
7. **Use TypeScript types** for type safety
8. **Clean up async operations** in useEffect cleanup functions

## Support

For issues or questions about the API hooks, please refer to the main project documentation or contact the development team.