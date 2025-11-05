# CENTURY SOAP - Major Modifications Summary

## Overview
This document outlines the huge modifications made to transform the Century Soap inventory system to support:
1. **Three Product Categories** with multiple size options
2. **Two-Tier Pricing System** (Regular vs Random clients)
3. **Client Management System**
4. **Box/Bulk Product Options**

---

## 1. NEW PRODUCT STRUCTURE

### Product Categories
- **CENTURY LIQUID SOAP**
- **CENTURY HANDWASH**
- **CENTURY TILES CLEANER**

### ⚠️ IMPORTANT: Unit-Based Inventory
**Stock is tracked by ACTUAL UNITS, not liters!**
- If you have 10 jerry cans of 5L soap → Stock = **10 jerry cans**
- If you sell 3 jerry cans → Stock becomes **7 jerry cans**
- Size (5L, 20L, etc.) is for display/reference only
- You count and manage actual physical units (cans, bottles, boxes)

### Product Variants & Pricing

#### CENTURY LIQUID SOAP
| Product | Size | Unit | Regular Price | Random Price | Box Details |
|---------|------|------|---------------|--------------|-------------|
| 5 Litres | 5L | Jerry Can | 2,000 RWF | 2,500 RWF | - |
| 20 Litres | 20L | Jerry Can | 10,000 RWF | 10,000 RWF | - |
| Box of 4 | 5L each | Box | 8,000 RWF | 10,000 RWF | 4 units of 5L |

#### CENTURY HANDWASH
| Product | Size | Unit | Regular Price | Random Price | Box Details |
|---------|------|------|---------------|--------------|-------------|
| 500ml Bottle | 500ml | Bottle | 1,100 RWF | 1,500 RWF | - |
| Box of 24 | 500ml each | Box | 26,400 RWF | 26,400 RWF | 24 bottles |
| 20 Litres | 20L | Jerry Can | 25,000 RWF | 35,000 RWF | - |

#### CENTURY TILES CLEANER
| Product | Size | Unit | Regular Price | Random Price | Box Details |
|---------|------|------|---------------|--------------|-------------|
| 1 Litre Bottle | 1L | Bottle | 3,000 RWF | 3,000 RWF | - |
| Box of 12 | 1L each | Box | 36,000 RWF | 36,000 RWF | 12 bottles |
| 20 Litres | 20L | Jerry Can | 60,000 RWF | 60,000 RWF | - |

---

## 2. TWO-TIER PRICING SYSTEM

### Client Types
1. **Regular Clients** (Special/Discounted Pricing)
   - Hotels, restaurants, regular businesses
   - Get discounted prices on select products
   - Tracked in the system with purchase history

2. **Random Clients** (Normal Pricing)
   - Walk-in customers
   - Occasional buyers
   - Pay standard retail prices

### Pricing Logic
- When recording a sale, select client type
- System automatically applies correct pricing:
  - Regular client → Uses `regularPrice`
  - Random client → Uses `randomPrice`
- Price differences are significant on some products (e.g., 5L Liquid Soap: 2,000 vs 2,500 RWF)

---

## 3. CLIENT MANAGEMENT SYSTEM

### New Features
- **Add/Edit/Delete Clients**
- **Client Types**: Regular or Random
- **Contact Information**: Phone, Email
- **Purchase Tracking**: Total purchases, last purchase date
- **Client Search & Filtering**

### Client Dashboard
- Total clients count
- Regular vs Random breakdown
- Individual client purchase history
- Automatic updates when sales are made

---

## 4. MODIFIED FILES

### Type Definitions (`src/types/index.ts`)
- Added `ProductCategory` type
- Added `ProductUnit` type (bottle, jerry_can, box)
- Added `ClientType` type (regular, random)
- Added `Client` interface
- Updated `Product` interface with:
  - `category`, `size`, `sizeUnit`
  - `regularPrice`, `randomPrice`
  - `itemsPerBox` for box products
- Updated `Sale` interface with:
  - `clientId`, `clientName`, `clientType`
  - `productCategory`
- Updated `ReportData` and `DashboardStats` interfaces

### Database Schema (`supabase-schema-v2.sql`)
- **New `clients` table** with type, contact info, purchase tracking
- **Updated `products` table** with categories, dual pricing, box support
- **Updated `sales` table** with client tracking
- **New triggers** for automatic client purchase updates
- **Updated analytics views** for client-based reporting
- **Seeded data** with all 10 product variants

### Services (`src/services/supabaseService.ts`)
- Added client CRUD operations:
  - `getClients()`
  - `getClient(id)`
  - `createClient()`
  - `updateClient()`
  - `deleteClient()`
- Added `subscribeToClients()` for real-time updates

### Pages
- **New `src/pages/Clients.tsx`**: Full client management interface
- Updated `src/App.tsx`: Added Clients route
- Updated `src/components/Layout.tsx`: Added Clients navigation

---

## 5. DATABASE MIGRATION STEPS

### Option A: Fresh Start (Recommended for Development)
```sql
-- Run the entire supabase-schema-v2.sql file
-- This will create all tables with the new structure
```

### Option B: Migration from Old Schema
```sql
-- 1. Backup existing data
-- 2. Drop old tables
DROP TABLE IF EXISTS public.stock_updates CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 3. Run supabase-schema-v2.sql
-- 4. Migrate old data if needed
```

---

## 6. KEY FEATURES IMPLEMENTED

### ✅ Product Management
- Category-based organization
- Multiple size options per category
- Box/bulk product support
- Dual pricing system

### ✅ Client Management
- Add regular clients (hotels, businesses)
- Track client purchase history
- Automatic pricing based on client type
- Search and filter clients

### ✅ Sales Recording
- Select client type before sale
- Automatic price application
- Track which pricing tier was used
- Client purchase history auto-updates

### ✅ Reporting & Analytics
- Regular vs Random client revenue breakdown
- Top clients by purchase volume
- Category-based sales analysis
- Client-specific reports

---

## 7. NEXT STEPS TO COMPLETE

### Still Need to Update:
1. **Products Page** - Update to handle new product structure with categories
2. **Sales Page** - Add client selection and automatic pricing
3. **Reports Page** - Add client-based analytics
4. **Dashboard** - Update stats to show client metrics

### Testing Checklist:
- [ ] Run Supabase schema v2
- [ ] Test client creation (regular & random)
- [ ] Test product creation with dual pricing
- [ ] Test sales with different client types
- [ ] Verify automatic price application
- [ ] Check client purchase history updates
- [ ] Test reporting with client breakdown

---

## 8. DEMO CLIENTS (Pre-seeded)

```sql
-- Regular Clients (Get Special Pricing)
1. Hotel Mille Collines
2. Kigali Heights
3. Serena Hotel

-- Random Client (Walk-in)
4. Walk-in Customer
```

---

## 9. TECHNICAL NOTES

### Database Triggers
- **`trigger_update_stock_on_sale`**: Automatically reduces stock when sale is made
- **`trigger_update_client_purchases`**: Updates client total purchases and last purchase date

### Real-time Subscriptions
- Products changes
- Sales changes
- Stock updates changes
- **NEW**: Clients changes

### RLS Policies
- Permissive policies for demo (anyone can view/modify)
- Ready to be tightened for production

---

## 10. PRICING EXAMPLES

### Example 1: Regular Client (Hotel)
- Buys 10 units of 5L Liquid Soap
- Price: 2,000 RWF × 10 = **20,000 RWF**
- Saves: 500 RWF per unit = **5,000 RWF total savings**

### Example 2: Random Client (Walk-in)
- Buys 10 units of 5L Liquid Soap
- Price: 2,500 RWF × 10 = **25,000 RWF**

### Example 3: Box Purchase
- Regular client buys 1 Box of 4 (5L Liquid Soap)
- Price: **8,000 RWF** (2,000 RWF per unit)
- Random client price would be: **10,000 RWF**

---

## SUMMARY

The system now supports:
- ✅ 3 product categories
- ✅ 10 product variants
- ✅ Two-tier pricing (regular/random)
- ✅ Client management
- ✅ Box/bulk products
- ✅ Automatic pricing application
- ✅ Client purchase tracking
- ✅ Enhanced reporting

**Status**: Core infrastructure complete. UI pages (Products, Sales, Reports) need updates to use new structure.
