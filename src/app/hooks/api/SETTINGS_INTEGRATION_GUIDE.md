# 🎛️ Settings API Integration Guide

Complete guide for managing select field options using the Settings API.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Methods](#api-methods)
3. [Available Categories](#available-categories)
4. [Integration Examples](#integration-examples)
5. [Using Settings in Forms](#using-settings-in-forms)
6. [Settings Page Features](#settings-page-features)

---

## Overview

The Settings API (`useSettingsApi`) allows you to **dynamically manage all dropdown options** used across your forms. Instead of hardcoding select options, you can now manage them from the Settings page at `/settings`.

### Benefits:
- ✅ **Dynamic Options** - Add/edit/delete options without code changes
- ✅ **Centralized Management** - One place to manage all dropdowns
- ✅ **Active/Inactive Status** - Enable/disable options without deleting
- ✅ **Custom Sorting** - Control the display order
- ✅ **Rich Metadata** - Colors, icons, descriptions for better UX
- ✅ **Type-Safe** - Full TypeScript support

---

## API Methods

### Import the Hook

```typescript
import { useSettingsApi } from "../hooks/api";
import type { SelectOption, OptionCategory } from "../hooks/api/useSettingsApi";
```

### Available Methods

```typescript
const {
  loading,
  error,
  getOptionsByCategory,      // Get all options for a category
  getActiveOptions,          // Get only active options (for forms)
  createOption,              // Add new option
  updateOption,              // Edit existing option
  deleteOption,              // Delete option
  reorderOptions,            // Change sort order
  toggleOptionStatus,        // Activate/deactivate
  getCategorySummary,        // Get summary of all categories
} = useSettingsApi();
```

---

## Available Categories

| Category | Used In | Example Values |
|----------|---------|---------------|
| `propertyType` | Property Forms | house, apartment, land, commercial, farmhouse |
| `propertyCategory` | Property Forms | residential, commercial, industrial |
| `listingType` | Property Forms | auction, direct_sale |
| `propertyStatus` | Property Forms | available, sold, pending |
| `furnishedStatus` | Property Forms | unfurnished, semi-furnished, fully-furnished |
| `currency` | Property Forms | GBP, USD, EUR |
| `auctionType` | Auction Forms | live, online, hybrid |
| `auctionStatus` | Auction Forms | scheduled, live, completed, cancelled |
| `ownershipType` | Property Forms | freehold, leasehold |
| `mortgageStatus` | Property Forms | clear, mortgaged, partially_paid |
| `campaignType` | Campaign Forms | newsletter, property, auction, promotional |
| `targetAudience` | Campaign Forms | all, buyers, sellers, investors, agents |
| `emailTemplate` | Campaign Forms | modern, classic, minimal, custom |
| `scheduleType` | Campaign Forms | now, later |
| `reportType` | Report Forms | sales, auction, user, property, financial, marketing |
| `reportFormat` | Report Forms | pdf, excel, csv |
| `userRole` | User Forms | buyer, seller, investor, agent, admin |
| `accountStatus` | User Forms | active, pending, suspended |
| `kycStatus` | User Forms | pending, verified, rejected |
| `agentSpecialization` | Agent Forms | residential, commercial, luxury, all |
| `agentStatus` | Agent Forms | active, inactive, suspended |

---

## Integration Examples

### 1. Load Options for a Select Field

```typescript
import { useState, useEffect } from "react";
import { useSettingsApi } from "../hooks/api";

function PropertyForm() {
  const { getActiveOptions } = useSettingsApi();
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const loadPropertyTypes = async () => {
    const response = await getActiveOptions("propertyType");
    if (response.success && response.data) {
      setPropertyTypes(response.data);
    }
  };

  return (
    <select>
      <option value="">Select Property Type</option>
      {propertyTypes.map((type) => (
        <option key={type.id} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  );
}
```

### 2. Load Multiple Categories

```typescript
function PropertyForm() {
  const { getActiveOptions } = useSettingsApi();
  const [options, setOptions] = useState({
    propertyTypes: [],
    propertyCategories: [],
    furnishedStatuses: [],
    currencies: [],
  });

  useEffect(() => {
    loadAllOptions();
  }, []);

  const loadAllOptions = async () => {
    const [types, categories, furnished, currencies] = await Promise.all([
      getActiveOptions("propertyType"),
      getActiveOptions("propertyCategory"),
      getActiveOptions("furnishedStatus"),
      getActiveOptions("currency"),
    ]);

    setOptions({
      propertyTypes: types.data || [],
      propertyCategories: categories.data || [],
      furnishedStatuses: furnished.data || [],
      currencies: currencies.data || [],
    });
  };

  return (
    <form>
      {/* Property Type */}
      <select>
        {options.propertyTypes.map((type) => (
          <option key={type.id} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* Property Category */}
      <select>
        {options.propertyCategories.map((cat) => (
          <option key={cat.id} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </form>
  );
}
```

### 3. Display Options with Colors & Icons

```typescript
function PropertyTypeSelector() {
  const { getActiveOptions } = useSettingsApi();
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const loadPropertyTypes = async () => {
    const response = await getActiveOptions("propertyType");
    if (response.success && response.data) {
      setPropertyTypes(response.data);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {propertyTypes.map((type) => (
        <button
          key={type.id}
          className="p-4 rounded-xl border-2 hover:shadow-lg transition-all"
          style={{
            borderColor: type.color,
            backgroundColor: `${type.color}10`,
          }}
        >
          <div
            className="size-12 rounded-lg mx-auto mb-2"
            style={{ backgroundColor: type.color }}
          >
            {/* Icon here */}
          </div>
          <p className="font-bold">{type.label}</p>
          {type.description && (
            <p className="text-xs text-slate-600">{type.description}</p>
          )}
        </button>
      ))}
    </div>
  );
}
```

### 4. Custom Hook for Form Options

```typescript
// Create a custom hook for reusability
import { useState, useEffect } from "react";
import { useSettingsApi } from "../hooks/api";
import type { SelectOption, OptionCategory } from "../hooks/api/useSettingsApi";

export const useFormOptions = (categories: OptionCategory[]) => {
  const { getActiveOptions } = useSettingsApi();
  const [options, setOptions] = useState<Record<string, SelectOption[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    
    const responses = await Promise.all(
      categories.map((category) => getActiveOptions(category))
    );

    const optionsMap: Record<string, SelectOption[]> = {};
    categories.forEach((category, index) => {
      optionsMap[category] = responses[index].data || [];
    });

    setOptions(optionsMap);
    setLoading(false);
  };

  return { options, loading, refresh: loadOptions };
};

// Usage in forms
function PropertyForm() {
  const { options, loading } = useFormOptions([
    "propertyType",
    "propertyCategory",
    "furnishedStatus",
    "currency",
  ]);

  if (loading) return <div>Loading options...</div>;

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

## Using Settings in Forms

### Property Form Example

```typescript
import { useState, useEffect } from "react";
import { useSettingsApi, usePropertyApi } from "../hooks/api";
import type { PropertyFormData } from "../hooks/api";

function AddPropertyForm() {
  const { getActiveOptions } = useSettingsApi();
  const { createProperty } = usePropertyApi();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyType: "",
    propertyCategory: "",
    furnishedStatus: "",
    currency: "GBP",
    // ... other fields
  });

  const [selectOptions, setSelectOptions] = useState({
    propertyTypes: [],
    propertyCategories: [],
    furnishedStatuses: [],
    currencies: [],
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    const [types, categories, furnished, currencies] = await Promise.all([
      getActiveOptions("propertyType"),
      getActiveOptions("propertyCategory"),
      getActiveOptions("furnishedStatus"),
      getActiveOptions("currency"),
    ]);

    setSelectOptions({
      propertyTypes: types.data || [],
      propertyCategories: categories.data || [],
      furnishedStatuses: furnished.data || [],
      currencies: currencies.data || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createProperty(formData);
    if (response.success) {
      alert("✅ Property created!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Property Type */}
      <div>
        <label>Property Type</label>
        <select
          value={formData.propertyType}
          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
          required
        >
          <option value="">Select Property Type</option>
          {selectOptions.propertyTypes.map((type) => (
            <option key={type.id} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Property Category */}
      <div>
        <label>Property Category</label>
        <select
          value={formData.propertyCategory}
          onChange={(e) => setFormData({ ...formData, propertyCategory: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {selectOptions.propertyCategories.map((cat) => (
            <option key={cat.id} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Furnished Status */}
      <div>
        <label>Furnished Status</label>
        <select
          value={formData.furnishedStatus}
          onChange={(e) => setFormData({ ...formData, furnishedStatus: e.target.value })}
          required
        >
          <option value="">Select Furnished Status</option>
          {selectOptions.furnishedStatuses.map((status) => (
            <option key={status.id} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Currency */}
      <div>
        <label>Currency</label>
        <select
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          required
        >
          {selectOptions.currencies.map((currency) => (
            <option key={currency.id} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Create Property</button>
    </form>
  );
}
```

### Auction Form Example

```typescript
function CreateAuctionForm() {
  const { getActiveOptions } = useSettingsApi();
  const [auctionTypes, setAuctionTypes] = useState([]);

  useEffect(() => {
    loadAuctionTypes();
  }, []);

  const loadAuctionTypes = async () => {
    const response = await getActiveOptions("auctionType");
    if (response.success && response.data) {
      setAuctionTypes(response.data);
    }
  };

  return (
    <form>
      <div>
        <label>Auction Type</label>
        <select>
          <option value="">Select Auction Type</option>
          {auctionTypes.map((type) => (
            <option key={type.id} value={type.value}>
              {type.label}
              {type.description && ` - ${type.description}`}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
```

---

## Settings Page Features

### Access the Settings Page

Navigate to `/settings` to access the Settings Management page.

### Features:

1. **Category Navigation** - Browse all 9+ option categories
2. **Add New Options** - Create new dropdown options with:
   - Label (display name)
   - Value (system ID)
   - Description (optional)
   - Color (for visual distinction)
   - Sort order (display sequence)
   - Active status (show/hide in forms)

3. **Edit Options** - Update existing options
4. **Delete Options** - Remove options (with confirmation)
5. **Toggle Status** - Activate/deactivate without deleting
6. **Drag to Reorder** - Change display order (coming soon)
7. **Bulk Actions** - Manage multiple options at once (coming soon)

### Adding a New Option

1. Navigate to `/settings`
2. Select a category from the sidebar
3. Click "Add Option"
4. Fill in the form:
   - **Label**: "Townhouse"
   - **Value**: "townhouse" (auto-formatted)
   - **Description**: "Multi-story townhouse property"
   - **Color**: Choose a color
   - **Sort Order**: 6
   - **Active**: ✓ Checked
5. Click "Create Option"

The new option will immediately be available in all forms using that category!

---

## Admin Dashboard Integration

### Add Settings Link to Admin Sidebar

```typescript
// In Admin.tsx sidebar
const sidebarItems = [
  // ... existing items
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    action: () => navigate("/settings"),
  },
];
```

---

## API Response Examples

### Get Options by Category

```typescript
const response = await getOptionsByCategory("propertyType");

// Response:
{
  success: true,
  data: [
    {
      id: "PT-001",
      value: "house",
      label: "House",
      category: "propertyType",
      description: "Single family detached house",
      isActive: true,
      sortOrder: 1,
      color: "#3b82f6",
      icon: "home",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    },
    // ... more options
  ]
}
```

### Create New Option

```typescript
const response = await createOption({
  value: "penthouse",
  label: "Penthouse",
  category: "propertyType",
  description: "Luxury top-floor apartment",
  isActive: true,
  sortOrder: 6,
  color: "#8b5cf6",
  icon: "building",
});

// Response:
{
  success: true,
  data: {
    id: "PT-006",
    value: "penthouse",
    label: "Penthouse",
    // ... all fields
  },
  message: "Option created successfully"
}
```

### Update Option

```typescript
const response = await updateOption("PT-001", {
  label: "Single Family House",
  description: "Detached single family residence",
});

// Response:
{
  success: true,
  data: { /* updated option */ },
  message: "Option updated successfully"
}
```

---

## Best Practices

1. **Always Use Active Options in Forms**
   ```typescript
   // ✅ Good - Only shows active options
   const response = await getActiveOptions("propertyType");
   
   // ❌ Bad - Shows inactive options too
   const response = await getOptionsByCategory("propertyType");
   ```

2. **Cache Options to Reduce API Calls**
   ```typescript
   // Load once and store in state
   useEffect(() => {
     loadOptions();
   }, []); // Empty dependency array
   ```

3. **Provide Fallback Values**
   ```typescript
   {options.propertyTypes?.length > 0 ? (
     options.propertyTypes.map(...)
   ) : (
     <option>Loading...</option>
   )}
   ```

4. **Handle Loading States**
   ```typescript
   if (loading) return <SelectSkeleton />;
   ```

5. **Use Colors for Better UX**
   ```typescript
   <option 
     value={type.value}
     style={{ color: type.color }}
   >
     {type.label}
   </option>
   ```

---

## Migration Guide

### Before (Hardcoded Options)

```typescript
// ❌ Old way - hardcoded
<select>
  <option value="house">House</option>
  <option value="apartment">Apartment</option>
  <option value="land">Land</option>
</select>
```

### After (Dynamic Options)

```typescript
// ✅ New way - dynamic from Settings API
const { getActiveOptions } = useSettingsApi();
const [propertyTypes, setPropertyTypes] = useState([]);

useEffect(() => {
  loadOptions();
}, []);

const loadOptions = async () => {
  const response = await getActiveOptions("propertyType");
  if (response.success) {
    setPropertyTypes(response.data);
  }
};

<select>
  {propertyTypes.map((type) => (
    <option key={type.id} value={type.value}>
      {type.label}
    </option>
  ))}
</select>
```

---

## 🎉 Summary

The Settings API provides:

- ✅ **8 API Methods** for complete CRUD operations
- ✅ **20+ Option Categories** covering all form fields
- ✅ **Full Settings Page** at `/settings` for management
- ✅ **TypeScript Support** with type-safe interfaces
- ✅ **Rich Metadata** including colors, icons, descriptions
- ✅ **Active/Inactive Status** for flexible management
- ✅ **Mock Data** ready for immediate use

### Next Steps:

1. Navigate to `/settings` to see the Settings page
2. Try adding a new property type
3. Update your forms to use `getActiveOptions()`
4. Replace hardcoded options with dynamic loading

**All select fields across your application can now be managed from one central location!** 🚀
