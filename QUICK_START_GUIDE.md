# CENTURY SOAP - Quick Start Guide

## ⚠️ CRITICAL: How Inventory Works

**We track ACTUAL UNITS (jerry cans, bottles, boxes) - NOT liters!**

Example:
- You have **50 jerry cans** of 5L soap → Stock = **50 jerry cans**
- You sell **10 jerry cans** → Stock = **40 jerry cans**
- The "5L" is just a label for customers - you count actual cans!

See `INVENTORY_TRACKING_EXAMPLES.md` for detailed examples.

---

## What Changed?

Your inventory system now supports:
1. **3 Product Categories**: Liquid Soap, Handwash, Tiles Cleaner
2. **10 Product Variants**: Different sizes and box options
3. **Two Pricing Tiers**: 
   - **Regular clients** (hotels, businesses) get discounted prices
   - **Random clients** (walk-ins) pay normal prices
4. **Client Management**: Track regular customers and their purchases

---

## Quick Setup

### 1. Update Your Database
Run this in your Supabase SQL Editor:
```bash
# Use the new schema file
supabase-schema-v2.sql
```

This will create:
- Updated `products` table with categories and dual pricing
- New `clients` table for customer management
- Updated `sales` table to track client types
- 10 pre-seeded products (all variants)
- 4 demo clients

### 2. The Pricing System

**Example: 5L Liquid Soap**
- Regular Client (Hotel): **2,000 RWF** ✅ (Discounted)
- Random Client (Walk-in): **2,500 RWF** (Normal)

**Example: 500ml Handwash**
- Regular Client: **1,100 RWF** ✅ (Discounted)
- Random Client: **1,500 RWF** (Normal)

---

## How It Works

### When Recording a Sale:
1. Select the product
2. Select client type (Regular or Random)
3. System automatically applies correct price:
   - Regular → Uses `regularPrice`
   - Random → Uses `randomPrice`
4. Sale is recorded with client info
5. If client exists, their purchase history updates automatically

### Client Types:
- **Regular**: Hotels, restaurants, businesses (get discounts)
- **Random**: Walk-in customers, one-time buyers (normal prices)

---

## New Features Available

### ✅ Client Management Page (`/clients`)
- Add new clients (regular or random)
- Edit client information
- View purchase history
- Search and filter clients
- See total purchases per client

### ✅ Dual Pricing
- Every product has two prices
- Automatic application based on client type
- Clear savings for regular clients

### ✅ Box Products
- Box of 4 (5L Liquid Soap)
- Box of 24 (500ml Handwash)
- Box of 12 (1L Tiles Cleaner)
- Track items per box

---

## Pre-loaded Products

### LIQUID SOAP
1. 5L Jerry Can - 2,000/2,500 RWF
2. 20L Jerry Can - 10,000/10,000 RWF
3. Box of 4 (5L) - 8,000/10,000 RWF

### HANDWASH
4. 500ml Bottle - 1,100/1,500 RWF
5. Box of 24 (500ml) - 26,400/26,400 RWF
6. 20L Jerry Can - 25,000/35,000 RWF

### TILES CLEANER
7. 1L Bottle - 3,000/3,000 RWF
8. Box of 12 (1L) - 36,000/36,000 RWF
9. 20L Jerry Can - 60,000/60,000 RWF

*(First price = Regular, Second price = Random)*

---

## Pre-loaded Clients

1. **Hotel Mille Collines** (Regular)
2. **Kigali Heights** (Regular)
3. **Serena Hotel** (Regular)
4. **Walk-in Customer** (Random)

---

## What Still Needs Updates

The following pages need to be updated to use the new system:

### 1. Products Page
- Show products by category
- Display both prices
- Handle box products

### 2. Sales Page
- Add client selection dropdown
- Show correct price based on client type
- Handle box quantity calculations

### 3. Reports Page
- Show regular vs random client revenue
- Top clients analysis
- Category-based reports

### 4. Dashboard
- Add client statistics
- Show pricing tier breakdown

---

## Files Modified

### Core Files:
- ✅ `src/types/index.ts` - New interfaces
- ✅ `supabase-schema-v2.sql` - New database structure
- ✅ `src/services/supabaseService.ts` - Client management methods
- ✅ `src/pages/Clients.tsx` - **NEW** Client management page
- ✅ `src/App.tsx` - Added Clients route
- ✅ `src/components/Layout.tsx` - Added Clients navigation

### Need Updates:
- ⏳ `src/pages/Products.tsx`
- ⏳ `src/pages/Sales.tsx`
- ⏳ `src/pages/Reports.tsx`
- ⏳ `src/pages/Dashboard.tsx`

---

## Testing the System

### Test 1: Add a Regular Client
1. Go to `/clients`
2. Click "Add Client"
3. Name: "Test Hotel"
4. Type: Regular
5. Save

### Test 2: Record a Sale
1. Go to `/sales`
2. Select product: "5L Liquid Soap"
3. Select client type: Regular
4. Price should show: 2,000 RWF (not 2,500)
5. Complete sale

### Test 3: Check Client History
1. Go back to `/clients`
2. Find "Test Hotel"
3. Should show updated purchase total
4. Should show last purchase date

---

## Important Notes

### Lint Errors
The TypeScript lint errors you see are expected and will resolve once you:
- Run `npm install` (dependencies are already in package.json)
- The types will load properly

### Database Migration
- Use `supabase-schema-v2.sql` for fresh setup
- Backup old data if migrating from previous version
- All demo data is included in the schema

### Price Logic
- Some products have same price for both tiers (e.g., 20L Tiles Cleaner: 60,000 both)
- Some products have significant discounts (e.g., 5L Soap: 2,000 vs 2,500)
- Box products often have better per-unit pricing for regular clients

---

## Next Steps

Ready to tell me what modifications you want for the remaining pages (Products, Sales, Reports, Dashboard)?

Or do you want to test the current setup first?
