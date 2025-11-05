# Build Errors - Quick Fix Guide

## Status: PARTIALLY FIXED ✅

### ✅ FIXED:
1. **Dashboard.tsx** - Added missing client fields to DashboardStats
2. **Reports.tsx** - Changed litersSold to unitsSold, added client revenue fields
3. **Products.tsx** - Already updated with new structure

### ⚠️ STILL NEED FIXES:

The following files still use the OLD product structure and need updates:

---

## 1. Inventory.tsx

**Errors:**
- Uses `capacity` instead of `size` and `sizeUnit`
- Uses `price` instead of `regularPrice` and `randomPrice`
- Uses old unit type `'L'` instead of ProductUnit types

**Quick Fix:**
Replace all mock product objects to use new structure:
```typescript
// OLD:
{
  capacity: 20,
  unit: 'jerry_can',
  price: 9500,
}

// NEW:
{
  category: 'LIQUID_SOAP',
  size: 20,
  sizeUnit: 'L',
  unit: 'jerry_can',
  regularPrice: 10000,
  randomPrice: 10000,
}
```

---

## 2. Sales.tsx

**Errors:**
- Uses `capacity` and `price` in Product objects
- Uses `totalLiters` in Sale objects (should be removed)
- Uses `customerName` instead of `clientName` and `clientType`

**Quick Fix:**
1. Update Product mock data (same as Inventory)
2. Update Sale interface usage:
```typescript
// OLD:
{
  totalLiters: 60,
  customerName: "Hotel ABC",
}

// NEW:
{
  productCategory: 'LIQUID_SOAP',
  clientName: "Hotel ABC",
  clientType: 'regular',
}
```

---

## 3. Products.tsx (ProductModal)

**Error:**
- Form still uses old `capacity`, `price` fields

**Quick Fix:**
Update ProductModal form to use new fields:
```typescript
// OLD formData:
{
  capacity: 7,
  unit: 'jerry_can',
  price: 0,
}

// NEW formData:
{
  category: 'LIQUID_SOAP',
  size: 5,
  sizeUnit: 'L',
  unit: 'jerry_can',
  regularPrice: 0,
  randomPrice: 0,
}
```

---

## Quick Commands to Test

After fixes, run:
```bash
npm run build
```

Should compile without TypeScript errors.

---

## Summary of Type Changes

### Product Interface:
- ❌ `capacity` → ✅ `size` + `sizeUnit`
- ❌ `price` → ✅ `regularPrice` + `randomPrice`
- ➕ Added: `category`, `itemsPerBox`

### Sale Interface:
- ❌ `totalLiters` → ✅ Removed (not needed)
- ❌ `customerName` → ✅ `clientName` + `clientType`
- ➕ Added: `productCategory`, `clientId`

### DashboardStats Interface:
- ➕ Added: `totalClients`, `regularClients`, `randomClients`

### ReportData Interface:
- ❌ `totalLitersSold` → ✅ `totalUnitsSold`
- ❌ `litersSold` → ✅ `unitsSold`
- ➕ Added: `regularClientRevenue`, `randomClientRevenue`, `topClients`
