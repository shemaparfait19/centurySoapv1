-- RESET DATABASE SCRIPT
-- Run this FIRST if you get "already exists" errors
-- This will delete all existing data and start fresh

-- Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.stock_updates CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop all custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS product_unit CASCADE;
DROP TYPE IF EXISTS client_type CASCADE;

-- Success message
SELECT 'Database reset complete! Now run supabase-schema-v2.sql' as message;
