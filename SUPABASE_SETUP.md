# 🚀 Supabase Setup Guide for CENTURY SOAP

## 📋 Prerequisites

- Supabase project created at: `https://hgwbelpkzsrcnotnalst.supabase.co`
- Access to your Supabase dashboard

## 🔑 Step 1: Get Your API Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `centurySoap` project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: `https://hgwbelpkzsrcnotnalst.supabase.co`
   - **anon public key** (this is your `supabaseAnonKey`)

## 🗄️ Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:

- ✅ Users table with role-based access
- ✅ Products table for inventory management
- ✅ Sales table for transaction tracking
- ✅ Stock updates table for audit trail
- ✅ Row Level Security (RLS) policies
- ✅ Automatic stock management triggers
- ✅ Sample product data

## 🔐 Step 3: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Email confirmations** (optional but recommended)
3. Set **Site URL** to your application URL
4. Configure any additional auth providers if needed

## 🔒 Step 4: Update Environment Variables

1. Create a `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=https://hgwbelpkzsrcnotnalst.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Update `src/lib/supabase.ts` with your actual anon key:

```typescript
const supabaseAnonKey = "your_actual_anon_key_here";
```

## 👥 Step 5: Create Initial Users

After running the schema, you'll need to create user accounts. You can do this through:

1. **Supabase Dashboard** → **Authentication** → **Users** → **Add User**
2. Or through your application's signup process

**Recommended initial users:**

- **Admin**: admin@centurysoap.com
- **Seller**: john@centurysoap.com
- **Seller**: sarah@centurysoap.com

## 🧪 Step 6: Test Your Setup

1. Start your development server: `npm run dev`
2. Try to log in with one of the test accounts
3. Check if you can view products and create sales
4. Verify that stock updates automatically when sales are made

## 🔍 Step 7: Verify Database Tables

In your Supabase dashboard, go to **Table Editor** and verify these tables exist:

- `users`
- `products`
- `sales`
- `stock_updates`

## 📊 Step 8: Check RLS Policies

Go to **Authentication** → **Policies** to verify Row Level Security is working:

- Users can only see their own sales (unless admin)
- Only admins can modify products
- Stock updates are tracked automatically

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API key" error**

   - Double-check your anon key in the environment variables
   - Ensure the key is copied exactly from Supabase dashboard

2. **"Table doesn't exist" error**

   - Make sure you ran the complete SQL schema
   - Check the SQL Editor for any error messages

3. **"Permission denied" error**

   - Verify RLS policies are enabled
   - Check if user authentication is working properly

4. **Stock not updating automatically**
   - Verify the trigger function was created
   - Check the `stock_updates` table for records

## 📱 Next Steps

Once Supabase is configured:

1. **Update your components** to use Supabase instead of mock data
2. **Implement real-time updates** using Supabase subscriptions
3. **Add user management** features for admins
4. **Set up automated backups** in Supabase dashboard
5. **Monitor usage** and consider upgrading if needed

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 💡 Pro Tips

- **Backup your data** regularly using Supabase's backup features
- **Monitor your usage** to stay within free tier limits
- **Use the Supabase CLI** for local development and migrations
- **Set up alerts** for low stock notifications
- **Implement caching** for frequently accessed data

---

🎉 **Congratulations!** Your CENTURY SOAP system now has a robust, scalable backend that will never lose your data!
