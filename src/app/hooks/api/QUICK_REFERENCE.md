# 🚀 Quick Reference Guide - Admin Dashboard API

**TL;DR:** All backend APIs are ready. Copy code from `ADMIN_INTEGRATION_TEMPLATE.tsx` to integrate.

---

## 📦 What You Have

```
✅ 7 API Hooks
✅ 62 API Methods
✅ Full TypeScript Support
✅ Mock Data Ready
✅ Complete Documentation
✅ Integration Templates
```

---

## 🎯 Quick Start (3 Steps)

### 1. Import Hooks
```typescript
import { useAuctionApi, useCampaignApi, useReportApi, useUserApi, useAgentApi } from "../hooks/api";
```

### 2. Initialize in Component
```typescript
const auctionApi = useAuctionApi();
const campaignApi = useCampaignApi();
// ... etc
```

### 3. Use in Forms
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await auctionApi.createAuction(formData);
  if (response.success) {
    alert("✅ Success!");
  }
};
```

---

## 📋 API Hooks Summary

| Hook | Methods | Use For |
|------|---------|---------|
| `usePropertyApi` | 8 | Properties |
| `useAuctionApi` | 8 | Auctions |
| `useCampaignApi` | 7 | Campaigns |
| `useReportApi` | 7 | Reports |
| `useUserApi` | 10 | Users |
| `useAgentApi` | 10 | Agents |
| `useDashboardApi` | 12 | Stats |

---

## 🔥 Most Used Methods

```typescript
// Create
await propertyApi.createProperty(data);
await auctionApi.createAuction(data);
await campaignApi.createCampaign(data);
await reportApi.generateReport(data);
await userApi.createUser(data);
await agentApi.createAgent(data);

// List
await propertyApi.getProperties({ page: 1, pageSize: 10 });
await auctionApi.getAuctions({ status: "live" });
await userApi.getUsers({ role: "buyer" });

// Stats
await dashboardApi.getDashboardStats();
await userApi.getUserStats();
await agentApi.getAgentStats();
```

---

## 🎨 Form Integration Pattern

```typescript
// 1. State
const [formData, setFormData] = useState<AuctionFormData>({ ... });

// 2. Handler
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await auctionApi.createAuction(formData);
  if (response.success) {
    alert(`✅ ${response.message}`);
    closeModal();
  }
};

// 3. Loading
{auctionApi.loading && <LoadingSpinner />}

// 4. Error
{auctionApi.error && <ErrorMessage error={auctionApi.error} />}

// 5. Submit
<button disabled={auctionApi.loading}>
  {auctionApi.loading ? "Creating..." : "Create"}
</button>
```

---

## 📝 5 Forms to Integrate

| Form | Line | API Hook | Status |
|------|------|----------|--------|
| Create Auction | ~1717 | `useAuctionApi` | ⚠️ TODO |
| Send Campaign | ~1894 | `useCampaignApi` | ⚠️ TODO |
| Generate Report | ~2079 | `useReportApi` | ⚠️ TODO |
| Add User | ~2211 | `useUserApi` | ⚠️ TODO |
| Add Agent | ~2375 | `useAgentApi` | ⚠️ TODO |

---

## 📚 Documentation Files

1. **README.md** - Complete API docs
2. **INTEGRATION_EXAMPLES.md** - Real code examples
3. **DASHBOARD_API_VERIFICATION.md** - Full verification
4. **ADMIN_INTEGRATION_TEMPLATE.tsx** - Copy-paste code
5. **API_VERIFICATION_CHECKLIST.md** - Progress tracker
6. **QUICK_REFERENCE.md** - This file

---

## 🧩 Integration Checklist

For each form:

```
[ ] 1. Import API hook
[ ] 2. Initialize hook
[ ] 3. Add form state
[ ] 4. Update submit handler
[ ] 5. Add loading state
[ ] 6. Add error handling
[ ] 7. Test success flow
[ ] 8. Test error flow
[ ] 9. Test loading state
[ ] 10. Done! ✅
```

---

## 💡 Pro Tips

1. **Always check `response.success`** before using data
2. **Use TypeScript types** from the API exports
3. **Show loading states** to improve UX
4. **Handle errors gracefully** with user-friendly messages
5. **Reset forms** after successful submission
6. **Refresh lists** after create/update/delete

---

## 🐛 Troubleshooting

### "Cannot find module 'api'"
```typescript
// ❌ Wrong
import { useAuctionApi } from "../hooks/api";

// ✅ Correct (check your path)
import { useAuctionApi } from "../hooks/api";
```

### "Property 'success' does not exist"
```typescript
// ❌ Wrong
const response = await createAuction(data);

// ✅ Correct (use destructured hook)
const { createAuction } = useAuctionApi();
const response = await createAuction(data);
```

### "Loading state not working"
```typescript
// ❌ Wrong
const { createAuction } = useAuctionApi();

// ✅ Correct (destructure loading too)
const { loading, createAuction } = useAuctionApi();
```

---

## 📞 Need Help?

1. Check `INTEGRATION_EXAMPLES.md` for full code examples
2. See `ADMIN_INTEGRATION_TEMPLATE.tsx` for copy-paste code
3. Read `DASHBOARD_API_VERIFICATION.md` for detailed verification
4. Review `README.md` for complete API documentation

---

## 🎯 Next Steps

1. Open `Admin.tsx`
2. Open `ADMIN_INTEGRATION_TEMPLATE.tsx`
3. Copy the integration code for each form
4. Test each form
5. Ship it! 🚀

---

**Quick Reference Version:** 1.0  
**Last Updated:** March 13, 2026  
**Status:** Ready for Integration ✅
