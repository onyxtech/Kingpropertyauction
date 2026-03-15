# 📊 Select Fields Mapping - Complete Reference

Complete mapping of all select fields used in forms to their Settings API categories.

---

## 🎯 Quick Reference

| Form | Select Fields | Categories Used |
|------|---------------|-----------------|
| **Add Property** | 10 dropdowns | 7 categories |
| **Create Auction** | 2 dropdowns | 1 category |
| **Send Campaign** | 4 dropdowns | 4 categories |
| **Generate Report** | 2 dropdowns | 2 categories |
| **Add User** | 3 dropdowns | 3 categories |
| **Add Agent** | 2 dropdowns | 2 categories |

**Total**: 23 select fields across 6 forms → 19 unique categories

---

## 📋 Form-by-Form Breakdown

### 1. Add Property Form (`/add-property`)

**Location:** `/src/app/pages/AddProperty.tsx`

| Field Name | Label | Category | API Call |
|------------|-------|----------|----------|
| `propertyType` | Property Type | `propertyType` | `getActiveOptions("propertyType")` |
| `propertyCategory` | Property Category | `propertyCategory` | `getActiveOptions("propertyCategory")` |
| `listingType` | Listing Type | `listingType` | `getActiveOptions("listingType")` |
| `propertyStatus` | Property Status | `propertyStatus` | `getActiveOptions("propertyStatus")` |
| `furnishedStatus` | Furnished Status | `furnishedStatus` | `getActiveOptions("furnishedStatus")` |
| `currency` | Currency | `currency` | `getActiveOptions("currency")` |
| `auctionStatus` | Auction Status | `auctionStatus` | `getActiveOptions("auctionStatus")` |
| `ownershipType` | Ownership Type | `ownershipType` | `getActiveOptions("ownershipType")` |
| `mortgageStatus` | Mortgage Status | `mortgageStatus` | `getActiveOptions("mortgageStatus")` |

**Integration Example:**

```typescript
import { useState, useEffect } from "react";
import { useSettingsApi } from "../hooks/api";

function AddProperty() {
  const { getActiveOptions } = useSettingsApi();
  const [options, setOptions] = useState({
    propertyTypes: [],
    propertyCategories: [],
    listingTypes: [],
    propertyStatuses: [],
    furnishedStatuses: [],
    currencies: [],
    auctionStatuses: [],
    ownershipTypes: [],
    mortgageStatuses: [],
  });

  useEffect(() => {
    loadAllOptions();
  }, []);

  const loadAllOptions = async () => {
    const [
      types,
      categories,
      listing,
      status,
      furnished,
      currencies,
      auctionStatus,
      ownership,
      mortgage,
    ] = await Promise.all([
      getActiveOptions("propertyType"),
      getActiveOptions("propertyCategory"),
      getActiveOptions("listingType"),
      getActiveOptions("propertyStatus"),
      getActiveOptions("furnishedStatus"),
      getActiveOptions("currency"),
      getActiveOptions("auctionStatus"),
      getActiveOptions("ownershipType"),
      getActiveOptions("mortgageStatus"),
    ]);

    setOptions({
      propertyTypes: types.data || [],
      propertyCategories: categories.data || [],
      listingTypes: listing.data || [],
      propertyStatuses: status.data || [],
      furnishedStatuses: furnished.data || [],
      currencies: currencies.data || [],
      auctionStatuses: auctionStatus.data || [],
      ownershipTypes: ownership.data || [],
      mortgageStatuses: mortgage.data || [],
    });
  };

  return (
    <form>
      {/* Step 1: Basic Information */}
      <select name="propertyType">
        <option value="">Select Property Type</option>
        {options.propertyTypes.map((type) => (
          <option key={type.id} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <select name="propertyCategory">
        <option value="">Select Category</option>
        {options.propertyCategories.map((cat) => (
          <option key={cat.id} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <select name="listingType">
        <option value="">Select Listing Type</option>
        {options.listingTypes.map((type) => (
          <option key={type.id} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* ... other fields */}
    </form>
  );
}
```

---

### 2. Create Auction Modal

**Location:** `/src/app/pages/Admin.tsx` → Create Auction Modal

| Field Name | Label | Category | API Call |
|------------|-------|----------|----------|
| `auctionType` | Auction Type | `auctionType` | `getActiveOptions("auctionType")` |

**Integration Example:**

```typescript
const { getActiveOptions } = useSettingsApi();
const [auctionTypes, setAuctionTypes] = useState([]);

useEffect(() => {
  loadAuctionTypes();
}, []);

const loadAuctionTypes = async () => {
  const response = await getActiveOptions("auctionType");
  if (response.success) {
    setAuctionTypes(response.data || []);
  }
};

<select name="auctionType">
  <option value="">Select Auction Type</option>
  {auctionTypes.map((type) => (
    <option key={type.id} value={type.value}>
      {type.label}
    </option>
  ))}
</select>
```

---

### 3. Send Campaign Modal

**Location:** `/src/app/pages/Admin.tsx` → Send Campaign Modal

| Field Name | Label | Category | API Call |
|------------|-------|----------|----------|
| `campaignType` | Campaign Type | `campaignType` | `getActiveOptions("campaignType")` |
| `targetAudience` | Target Audience | `targetAudience` | `getActiveOptions("targetAudience")` |
| `emailTemplate` | Email Template | `emailTemplate` | `getActiveOptions("emailTemplate")` |
| `scheduleType` | Schedule Type | `scheduleType` | `getActiveOptions("scheduleType")` |

**Integration Example:**

```typescript
const { getActiveOptions } = useSettingsApi();
const [campaignOptions, setCampaignOptions] = useState({
  types: [],
  audiences: [],
  templates: [],
  schedules: [],
});

useEffect(() => {
  loadCampaignOptions();
}, []);

const loadCampaignOptions = async () => {
  const [types, audiences, templates, schedules] = await Promise.all([
    getActiveOptions("campaignType"),
    getActiveOptions("targetAudience"),
    getActiveOptions("emailTemplate"),
    getActiveOptions("scheduleType"),
  ]);

  setCampaignOptions({
    types: types.data || [],
    audiences: audiences.data || [],
    templates: templates.data || [],
    schedules: schedules.data || [],
  });
};

<form>
  <select name="campaignType">
    {campaignOptions.types.map((type) => (
      <option key={type.id} value={type.value}>
        {type.label}
      </option>
    ))}
  </select>

  <select name="targetAudience">
    {campaignOptions.audiences.map((audience) => (
      <option key={audience.id} value={audience.value}>
        {audience.label}
      </option>
    ))}
  </select>
</form>
```

---

### 4. Generate Report Modal

**Location:** `/src/app/pages/Admin.tsx` → Generate Report Modal

| Field Name | Label | Category | API Call |
|------------|-------|----------|----------|
| `reportType` | Report Type | `reportType` | `getActiveOptions("reportType")` |
| `format` | Format | `reportFormat` | `getActiveOptions("reportFormat")` |

**Integration Example:**

```typescript
const { getActiveOptions } = useSettingsApi();
const [reportOptions, setReportOptions] = useState({
  types: [],
  formats: [],
});

useEffect(() => {
  loadReportOptions();
}, []);

const loadReportOptions = async () => {
  const [types, formats] = await Promise.all([
    getActiveOptions("reportType"),
    getActiveOptions("reportFormat"),
  ]);

  setReportOptions({
    types: types.data || [],
    formats: formats.data || [],
  });
};

<form>
  <select name="reportType">
    {reportOptions.types.map((type) => (
      <option key={type.id} value={type.value}>
        {type.label}
      </option>
    ))}
  </select>

  <select name="format">
    {reportOptions.formats.map((format) => (
      <option key={format.id} value={format.value}>
        {format.label}
      </option>
    ))}
  </select>
</form>
```

---

### 5. Add User Modal

**Location:** `/src/app/pages/Admin.tsx` → Add User Modal

| Field Name | Label | Category | API Call |
|------------|-------|----------|----------|
| `role` | User Role | `userRole` | `getActiveOptions("userRole")` |
| `accountStatus` | Account Status | `accountStatus` | `getActiveOptions("accountStatus")` |
| `kycStatus` | KYC Status | `kycStatus` | `getActiveOptions("kycStatus")` |

**Integration Example:**

```typescript
const { getActiveOptions } = useSettingsApi();
const [userOptions, setUserOptions] = useState({
  roles: [],
  statuses: [],
  kycStatuses: [],
});

useEffect(() => {
  loadUserOptions();
}, []);

const loadUserOptions = async () => {
  const [roles, statuses, kyc] = await Promise.all([
    getActiveOptions("userRole"),
    getActiveOptions("accountStatus"),
    getActiveOptions("kycStatus"),
  ]);

  setUserOptions({
    roles: roles.data || [],
    statuses: statuses.data || [],
    kycStatuses: kyc.data || [],
  });
};

<form>
  <select name="role">
    {userOptions.roles.map((role) => (
      <option key={role.id} value={role.value}>
        {role.label}
      </option>
    ))}
  </select>

  <select name="accountStatus">
    {userOptions.statuses.map((status) => (
      <option key={status.id} value={status.value}>
        {status.label}
      </option>
    ))}
  </select>
</form>
```

---

### 6. Add Agent Modal

**Location:** `/src/app/pages/Admin.tsx` → Add Agent Modal

| Field Name | Label | Category | API Call |
|------------|-------|----------|----------|
| `specialization` | Specialization | `agentSpecialization` | `getActiveOptions("agentSpecialization")` |
| `status` | Agent Status | `agentStatus` | `getActiveOptions("agentStatus")` |

**Integration Example:**

```typescript
const { getActiveOptions } = useSettingsApi();
const [agentOptions, setAgentOptions] = useState({
  specializations: [],
  statuses: [],
});

useEffect(() => {
  loadAgentOptions();
}, []);

const loadAgentOptions = async () => {
  const [specializations, statuses] = await Promise.all([
    getActiveOptions("agentSpecialization"),
    getActiveOptions("agentStatus"),
  ]);

  setAgentOptions({
    specializations: specializations.data || [],
    statuses: statuses.data || [],
  });
};

<form>
  <select name="specialization">
    {agentOptions.specializations.map((spec) => (
      <option key={spec.id} value={spec.value}>
        {spec.label}
      </option>
    ))}
  </select>

  <select name="status">
    {agentOptions.statuses.map((status) => (
      <option key={status.id} value={status.value}>
        {status.label}
      </option>
    ))}
  </select>
</form>
```

---

## 🔧 Reusable Hooks

### useFormOptions Hook

Create a custom hook for loading multiple categories:

```typescript
// /src/app/hooks/useFormOptions.ts
import { useState, useEffect } from "react";
import { useSettingsApi } from "./api";
import type { SelectOption, OptionCategory } from "./api/useSettingsApi";

export const useFormOptions = (categories: OptionCategory[]) => {
  const { getActiveOptions } = useSettingsApi();
  const [options, setOptions] = useState<Record<string, SelectOption[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoading(true);
      
      const responses = await Promise.all(
        categories.map((category) => getActiveOptions(category))
      );

      const optionsMap: Record<string, SelectOption[]> = {};
      categories.forEach((category, index) => {
        if (responses[index].success) {
          optionsMap[category] = responses[index].data || [];
        }
      });

      setOptions(optionsMap);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load options");
    } finally {
      setLoading(false);
    }
  };

  return { options, loading, error, refresh: loadOptions };
};

// Usage:
function PropertyForm() {
  const { options, loading } = useFormOptions([
    "propertyType",
    "propertyCategory",
    "furnishedStatus",
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <form>
      <select>
        {options.propertyType?.map((type) => (
          <option key={type.id} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </form>
  );
}
```

---

## 📊 Category Statistics

| Category | # Options | Forms Using It |
|----------|-----------|----------------|
| `propertyType` | 5 | Add Property |
| `propertyCategory` | 3 | Add Property |
| `listingType` | 2 | Add Property |
| `propertyStatus` | 3 | Add Property, Property List |
| `furnishedStatus` | 3 | Add Property |
| `currency` | 3 | Add Property, Auctions |
| `auctionType` | 3 | Create Auction |
| `auctionStatus` | 4 | Add Property, Auction List |
| `ownershipType` | 2 | Add Property |
| `mortgageStatus` | 3 | Add Property |
| `campaignType` | 4 | Send Campaign |
| `targetAudience` | 5 | Send Campaign |
| `emailTemplate` | 4 | Send Campaign |
| `scheduleType` | 2 | Send Campaign |
| `reportType` | 6 | Generate Report |
| `reportFormat` | 3 | Generate Report |
| `userRole` | 5 | Add User, User List |
| `accountStatus` | 3 | Add User, User List |
| `kycStatus` | 3 | Add User, User List |
| `agentSpecialization` | 4 | Add Agent |
| `agentStatus` | 3 | Add Agent, Agent List |

**Total**: 71 select options across 21 categories

---

## 🎯 Migration Checklist

For each form:

- [ ] **Identify all select fields** in the form
- [ ] **Map each field** to its Settings category
- [ ] **Import useSettingsApi** hook
- [ ] **Create state** for options
- [ ] **Load options** in useEffect
- [ ] **Replace hardcoded** options with dynamic data
- [ ] **Test form** with dynamic options
- [ ] **Add loading** states
- [ ] **Handle errors** gracefully

---

## 🚀 Next Steps

1. **Visit Settings Page**: Navigate to `/settings` to manage options
2. **Update Forms**: Replace hardcoded selects with Settings API
3. **Test Thoroughly**: Verify all dropdowns load correctly
4. **Add New Options**: Use Settings page to add custom options
5. **Monitor Usage**: Track which categories need more options

---

## 📝 Summary

✅ **21 Categories** covering all form select fields  
✅ **71 Total Options** ready to use  
✅ **6 Forms** to integrate  
✅ **23 Select Fields** to replace  
✅ **Settings Page** for easy management  
✅ **TypeScript Support** for type safety  
✅ **Reusable Hooks** for efficient loading  

All your select field options are now manageable from `/settings`! 🎉
