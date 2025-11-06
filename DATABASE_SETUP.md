# 🗄️ Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/hgwbelpkzsrcnotnalst
2. Login with your Supabase account

### Step 2: Run the Schema
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase-schema-v2.sql` in your project
4. Copy **ALL** the contents (lines 1-246)
5. Paste into the SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)

### Step 3: Verify Tables Created
After running, you should see these tables in the **Table Editor**:
- ✅ users
- ✅ products
- ✅ clients
- ✅ sales
- ✅ stock_updates

### Step 4: Test the Connection
1. Go back to your app (http://localhost:5173)
2. Try recording a sale
3. Refresh the page - the sale should still be there!

## What This Fixes

### ✅ Issue 1: Client Names Not Saving
**Before:** Random names were generated  
**After:** Your entered client name is saved to database

### ✅ Issue 2: Data Lost on Reload
**Before:** All data disappeared after refresh  
**After:** Data persists in Supabase database

### ✅ Issue 3: Payment Status Validation
**Before:** Could change status freely  
**After:** Auto-set to "Paid" when payment method selected, can only change to "Not Paid" if needed

## Troubleshooting

### Error: "type already exists"
If you see this error, it means you already ran the schema before. To start fresh:
1. Uncomment lines 5-16 in `supabase-schema-v2.sql` (remove the `--`)
2. Run those DROP commands first
3. Then run the full schema again

### Error: "permission denied"
Make sure you're logged into the correct Supabase project and have admin access.

### Sales still not saving?
Check the browser console (F12) for errors. The app will fallback to mock data if Supabase connection fails.

## What's Connected Now

✅ **Sales Page** - Saves to `sales` table  
✅ **Products Page** - Reads from `products` table  
⚠️ **Inventory Page** - Still using mock data (needs update)  
⚠️ **Clients Page** - Still using mock data (needs update)  
⚠️ **Dashboard** - Still using mock data (needs update)

## Next Steps

After setting up the database, you can:
1. Add real products via the Products page
2. Add clients via the Clients page
3. Record sales - they'll persist!
4. View reports with real data
