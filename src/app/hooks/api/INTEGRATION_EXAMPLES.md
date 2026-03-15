# API Integration Examples

This document shows how to integrate the API hooks into your forms and components.

## Table of Contents

1. [Add Property Form](#add-property-form)
2. [Create Auction Modal](#create-auction-modal)
3. [Send Campaign Modal](#send-campaign-modal)
4. [Generate Report Modal](#generate-report-modal)
5. [Add User Modal](#add-user-modal)
6. [Add Agent Modal](#add-agent-modal)

---

## 1. Add Property Form

**File:** `/src/app/pages/AddProperty.tsx`

### Integration Steps:

```typescript
// 1. Import the API hook
import { usePropertyApi } from "../hooks/api";

// 2. Initialize the hook in your component
const { loading, error, createProperty, uploadPropertyImages } = usePropertyApi();

// 3. Handle form submission with API
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Upload images first
    let imageUrls: string[] = [];
    if (formData.propertyImages.length > 0) {
      const uploadResponse = await uploadPropertyImages(formData.propertyImages);
      if (uploadResponse.success && uploadResponse.data) {
        imageUrls = uploadResponse.data.map((file) => file.fileUrl);
      }
    }

    // Create property
    const propertyData = {
      ...formData,
      propertyImages: imageUrls,
    };

    const response = await createProperty(propertyData);

    if (response.success) {
      alert(`✅ Property created! ID: ${response.data?.id}`);
      navigate("/admin");
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

// 4. Show loading state in submit button
<button type="submit" disabled={loading}>
  {loading ? "Submitting..." : "Submit Property"}
</button>
```

---

## 2. Create Auction Modal

**File:** `/src/app/components/modals/CreateAuctionModal.tsx`

### Full Example:

```typescript
import { useState } from "react";
import { useAuctionApi } from "../../hooks/api";
import type { AuctionFormData } from "../../hooks/api";

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAuctionModal({ isOpen, onClose, onSuccess }: CreateAuctionModalProps) {
  const { loading, error, createAuction } = useAuctionApi();
  const [formData, setFormData] = useState<AuctionFormData>({
    auctionTitle: "",
    auctionType: "online",
    startDateTime: "",
    endDateTime: "",
    description: "",
    venueName: "",
    venueAddress: "",
    registrationFee: 0,
    depositRequired: 0,
    maxBidders: 100,
    enableAutoBidding: false,
    sendEmailNotifications: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createAuction(formData);

    if (response.success) {
      alert(`✅ ${response.message}\nAuction ID: ${response.data?.id}`);
      onSuccess?.();
      onClose();
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black mb-6">Create New Auction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <input
            type="text"
            placeholder="Auction Title"
            value={formData.auctionTitle}
            onChange={(e) => setFormData({ ...formData, auctionTitle: e.target.value })}
            className="w-full px-4 py-3 border-2 rounded-xl"
            required
          />

          {/* Show API error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Submit button with loading state */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 rounded-xl font-bold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Auction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## 3. Send Campaign Modal

**File:** `/src/app/components/modals/SendCampaignModal.tsx`

```typescript
import { useState } from "react";
import { useCampaignApi } from "../../hooks/api";
import type { CampaignFormData } from "../../hooks/api";

export default function SendCampaignModal({ isOpen, onClose, onSuccess }) {
  const { loading, error, createCampaign } = useCampaignApi();
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: "",
    campaignType: "newsletter",
    targetAudience: "all",
    emailSubject: "",
    emailBody: "",
    emailTemplate: "modern",
    scheduleType: "now",
    scheduleDateTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createCampaign(formData);

    if (response.success) {
      const message = formData.scheduleType === "now"
        ? `✅ Campaign sent to ${response.data?.sentCount || 0} recipients!`
        : `✅ Campaign scheduled successfully!`;
      
      alert(message);
      onSuccess?.();
      onClose();
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
          {/* Campaign Type */}
          <select
            value={formData.campaignType}
            onChange={(e) => setFormData({ ...formData, campaignType: e.target.value as any })}
            className="w-full px-4 py-3 border-2 rounded-xl"
          >
            <option value="newsletter">Newsletter</option>
            <option value="property">Property Promotion</option>
            <option value="auction">Auction Announcement</option>
            <option value="promotional">Promotional</option>
          </select>

          {/* Target Audience */}
          <select
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
            className="w-full px-4 py-3 border-2 rounded-xl"
          >
            <option value="all">All Users</option>
            <option value="buyers">Buyers Only</option>
            <option value="sellers">Sellers Only</option>
            <option value="investors">Investors Only</option>
            <option value="agents">Agents Only</option>
          </select>

          {/* Schedule Type */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="scheduleType"
                value="now"
                checked={formData.scheduleType === "now"}
                onChange={(e) => setFormData({ ...formData, scheduleType: "now" })}
              />
              Send Now
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="scheduleType"
                value="later"
                checked={formData.scheduleType === "later"}
                onChange={(e) => setFormData({ ...formData, scheduleType: "later" })}
              />
              Schedule for Later
            </label>
          </div>

          {formData.scheduleType === "later" && (
            <input
              type="datetime-local"
              value={formData.scheduleDateTime}
              onChange={(e) => setFormData({ ...formData, scheduleDateTime: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : formData.scheduleType === "now" ? "Send Campaign" : "Schedule Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 4. Generate Report Modal

**File:** `/src/app/components/modals/GenerateReportModal.tsx`

```typescript
import { useState } from "react";
import { useReportApi } from "../../hooks/api";
import type { ReportFormData } from "../../hooks/api";

export default function GenerateReportModal({ isOpen, onClose, onSuccess }) {
  const { loading, error, generateReport, downloadReport } = useReportApi();
  const [formData, setFormData] = useState<ReportFormData>({
    reportType: "sales",
    startDate: "",
    endDate: "",
    format: "pdf",
    includeCharts: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate report
    const response = await generateReport(formData);

    if (response.success) {
      alert(`✅ Report generated successfully!\nReport ID: ${response.data?.id}`);
      
      // Auto-download if completed
      if (response.data?.status === "completed" && response.data?.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
      }
      
      onSuccess?.();
      onClose();
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-black mb-6">Generate Report</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Report Type */}
          <select
            value={formData.reportType}
            onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
            className="w-full px-4 py-3 border-2 rounded-xl"
          >
            <option value="sales">Sales Report</option>
            <option value="auction">Auction Report</option>
            <option value="user">User Report</option>
            <option value="property">Property Report</option>
            <option value="financial">Financial Report</option>
            <option value="marketing">Marketing Report</option>
          </select>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="px-4 py-3 border-2 rounded-xl"
              required
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="px-4 py-3 border-2 rounded-xl"
              required
            />
          </div>

          {/* Format */}
          <select
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
            className="w-full px-4 py-3 border-2 rounded-xl"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>

          {/* Include Charts */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.includeCharts}
              onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
              className="size-5"
            />
            Include Charts and Graphs
          </label>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin size-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-sm text-slate-600">Generating report...</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold">
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 5. Add User Modal

**File:** `/src/app/components/modals/AddUserModal.tsx`

```typescript
import { useState } from "react";
import { useUserApi } from "../../hooks/api";
import type { UserFormData } from "../../hooks/api";

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const { loading, error, createUser } = useUserApi();
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "buyer",
    accountStatus: "active",
    password: "",
    permissions: {
      canBid: true,
      canList: false,
      emailNotifications: true,
      smsAlerts: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createUser(formData);

    if (response.success) {
      alert(`✅ User created successfully!\nUser ID: ${response.data?.id}\nName: ${response.data?.fullName}`);
      onSuccess?.();
      onClose();
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="investor">Investor</option>
        <option value="agent">Agent</option>
        <option value="admin">Admin</option>
      </select>

      {/* Permissions */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.permissions.canBid}
            onChange={(e) =>
              setFormData({
                ...formData,
                permissions: { ...formData.permissions, canBid: e.target.checked },
              })
            }
          />
          Can Bid
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.permissions.canList}
            onChange={(e) =>
              setFormData({
                ...formData,
                permissions: { ...formData.permissions, canList: e.target.checked },
              })
            }
          />
          Can List Properties
        </label>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

---

## 6. Add Agent Modal

**File:** `/src/app/components/modals/AddAgentModal.tsx`

```typescript
import { useState } from "react";
import { useAgentApi } from "../../hooks/api";
import type { AgentFormData } from "../../hooks/api";

export default function AddAgentModal({ isOpen, onClose, onSuccess }) {
  const { loading, error, createAgent } = useAgentApi();
  const [formData, setFormData] = useState<AgentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    licenseNumber: "",
    officeAddress: "",
    commissionRate: 2.5,
    specialization: "residential",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createAgent(formData);

    if (response.success) {
      alert(`✅ Agent created successfully!\nAgent ID: ${response.data?.id}\nName: ${response.data?.fullName}\nCompany: ${formData.companyName}`);
      onSuccess?.();
      onClose();
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      {/* Contact Info */}
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        required
      />

      {/* Company Info */}
      <input
        type="text"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="License Number"
        value={formData.licenseNumber}
        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
      />

      {/* Commission Rate */}
      <div>
        <label className="block text-sm font-bold mb-2">Commission Rate (%)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.commissionRate}
          onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
          className="w-full px-4 py-3 border-2 rounded-xl"
        />
      </div>

      {/* Specialization */}
      <select
        value={formData.specialization}
        onChange={(e) => setFormData({ ...formData, specialization: e.target.value as any })}
        className="w-full px-4 py-3 border-2 rounded-xl"
      >
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
        <option value="luxury">Luxury</option>
        <option value="all">All Types</option>
      </select>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-800 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold disabled:opacity-50"
      >
        {loading ? "Creating Agent..." : "Create Agent"}
      </button>
    </form>
  );
}
```

---

## Advanced API Usage Examples

### 1. Fetch Properties with Pagination

```typescript
import { usePropertyApi } from "../hooks/api";

function PropertyList() {
  const { getProperties } = usePropertyApi();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProperties = async () => {
      const response = await getProperties({
        page,
        pageSize: 10,
        search: "",
        status: "available",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success) {
        setProperties(response.data);
      }
    };

    loadProperties();
  }, [page]);

  return <div>{/* Render properties */}</div>;
}
```

### 2. Approve Property

```typescript
const { approveProperty } = usePropertyApi();

const handleApprove = async (propertyId: string) => {
  const response = await approveProperty(propertyId);
  
  if (response.success) {
    alert("✅ Property approved!");
    // Refresh property list
  }
};
```

### 3. Get Campaign Statistics

```typescript
const { getCampaignStats } = useCampaignApi();

const loadStats = async (campaignId: string) => {
  const response = await getCampaignStats(campaignId);
  
  if (response.success) {
    console.log("Stats:", response.data);
    // { sent: 4523, opened: 3098, clicked: 557, ... }
  }
};
```

### 4. Get Agent Performance

```typescript
const { getAgentPerformance } = useAgentApi();

const loadPerformance = async (agentId: string) => {
  const response = await getAgentPerformance(agentId);
  
  if (response.success) {
    console.log("Performance:", response.data);
    // { totalListings: 47, totalSales: 23, conversionRate: 48.9, ... }
  }
};
```

---

## Best Practices

1. **Always check `response.success`** before accessing `response.data`
2. **Show loading states** using the `loading` boolean
3. **Display error messages** using the `error` state
4. **Use try-catch** for additional error handling
5. **Provide user feedback** with alerts or toasts
6. **Clean up on unmount** if making async calls in useEffect
7. **Refresh data** after successful create/update/delete operations

---

## Converting to Real Backend

When ready to connect to a real API:

1. Replace mock `delay()` calls with `fetch()` or `axios`
2. Update API endpoint URLs
3. Add authentication headers (JWT, API keys)
4. Handle real error responses
5. Update type definitions if needed

Example:

```typescript
// Mock (current)
const createProperty = async (data) => {
  await delay(1000);
  return { success: true, data: mockProperty };
};

// Real API
const createProperty = async (data) => {
  try {
    const response = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return { success: response.ok, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 🎉 Summary

All API hooks are ready to use with:
- ✅ Full TypeScript support
- ✅ Mock data for development
- ✅ Consistent error handling
- ✅ Loading states
- ✅ Pagination support
- ✅ Search and filtering
- ✅ CRUD operations
- ✅ File uploads
- ✅ Statistics and analytics

Happy coding! 🚀
