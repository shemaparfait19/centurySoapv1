-- CENTURY SOAP Inventory Management System Database Schema V2
-- Updated schema with product categories, client management, and two-tier pricing
-- Run this in your Supabase SQL Editor

-- Drop existing tables if you want to start fresh (CAUTION: This will delete all data)
-- DROP TABLE IF EXISTS public.stock_updates CASCADE;
-- DROP TABLE IF EXISTS public.sales CASCADE;
-- DROP TABLE IF EXISTS public.clients CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;
-- DROP TYPE IF EXISTS user_role CASCADE;
-- DROP TYPE IF EXISTS payment_method CASCADE;
-- DROP TYPE IF EXISTS payment_status CASCADE;
-- DROP TYPE IF EXISTS product_category CASCADE;
-- DROP TYPE IF EXISTS product_unit CASCADE;
-- DROP TYPE IF EXISTS client_type CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'seller');
CREATE TYPE payment_method AS ENUM ('Cash', 'MoMo');
CREATE TYPE payment_status AS ENUM ('Paid', 'Not Paid');
CREATE TYPE product_category AS ENUM ('LIQUID_SOAP', 'HANDWASH', 'TILES_CLEANER');
CREATE TYPE product_unit AS ENUM ('bottle', 'jerry_can', 'box');
CREATE TYPE client_type AS ENUM ('regular', 'random');

-- Create users table
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'seller',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE public.clients (
    id TEXT DEFAULT 'client_' || floor(random() * 1000000)::text PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    type client_type NOT NULL DEFAULT 'random',
    total_purchases DECIMAL(12,2) NOT NULL DEFAULT 0,
    last_purchase_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table with new structure
CREATE TABLE public.products (
    id TEXT DEFAULT 'prod_' || floor(random() * 1000000)::text PRIMARY KEY,
    category product_category NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    size DECIMAL(10,2) NOT NULL, -- size in liters or ml
    size_unit TEXT NOT NULL CHECK (size_unit IN ('L', 'ml')),
    unit product_unit NOT NULL,
    items_per_box INTEGER, -- for box units
    regular_price DECIMAL(12,2) NOT NULL, -- price for regular clients
    random_price DECIMAL(12,2) NOT NULL, -- price for random clients
    stock DECIMAL(10,2) NOT NULL DEFAULT 0, -- stock in units
    min_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table with client tracking
CREATE TABLE public.sales (
    id TEXT DEFAULT 'sale_' || floor(random() * 1000000)::text PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    product_name TEXT NOT NULL,
    product_category product_category NOT NULL,
    quantity INTEGER NOT NULL, -- number of units sold
    unit_price DECIMAL(12,2) NOT NULL, -- price per unit applied
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'Paid',
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT,
    client_type client_type NOT NULL,
    seller_id TEXT REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    seller_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_updates table
CREATE TABLE public.stock_updates (
    id TEXT DEFAULT 'update_' || floor(random() * 1000000)::text PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    previous_stock DECIMAL(10,2) NOT NULL,
    new_stock DECIMAL(10,2) NOT NULL,
    change_amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    updated_by TEXT REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_stock ON public.products(stock);
CREATE INDEX idx_clients_type ON public.clients(type);
CREATE INDEX idx_clients_name ON public.clients(name);
CREATE INDEX idx_sales_date ON public.sales(date);
CREATE INDEX idx_sales_seller_id ON public.sales(seller_id);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_client_id ON public.sales(client_id);
CREATE INDEX idx_sales_client_type ON public.sales(client_type);
CREATE INDEX idx_stock_updates_product_id ON public.stock_updates(product_id);
CREATE INDEX idx_stock_updates_created_at ON public.stock_updates(created_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for demo)
CREATE POLICY "Anyone can view users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Anyone can view clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Anyone can modify clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can modify products" ON public.products FOR ALL USING (true);
CREATE POLICY "Anyone can view sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Anyone can create sales" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can modify sales" ON public.sales FOR UPDATE USING (true);
CREATE POLICY "Anyone can view stock updates" ON public.stock_updates FOR SELECT USING (true);
CREATE POLICY "Anyone can create stock updates" ON public.stock_updates FOR INSERT WITH CHECK (true);

-- Function to update product stock on sale
CREATE OR REPLACE FUNCTION update_product_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product stock
    UPDATE public.products 
    SET stock = stock - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    -- Insert stock update record
    INSERT INTO public.stock_updates (
        product_id, 
        previous_stock, 
        new_stock, 
        change_amount, 
        reason, 
        updated_by
    ) VALUES (
        NEW.product_id,
        (SELECT stock + NEW.quantity FROM public.products WHERE id = NEW.product_id),
        (SELECT stock FROM public.products WHERE id = NEW.product_id),
        -NEW.quantity,
        'sale',
        NEW.seller_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update client total purchases
CREATE OR REPLACE FUNCTION update_client_purchases()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.client_id IS NOT NULL THEN
        UPDATE public.clients
        SET total_purchases = total_purchases + NEW.total_amount,
            last_purchase_date = NEW.date,
            updated_at = NOW()
        WHERE id = NEW.client_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_stock_on_sale
    AFTER INSERT ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock_on_sale();

CREATE TRIGGER trigger_update_client_purchases
    AFTER INSERT ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION update_client_purchases();

-- Insert demo users
INSERT INTO public.users (id, email, name, password_hash, role) VALUES
('admin1', 'admin@centurysoap.com', 'Admin User', 'password123', 'admin'),
('seller1', 'john@centurysoap.com', 'John Seller', 'password123', 'seller'),
('seller2', 'sarah@centurysoap.com', 'Sarah Seller', 'password123', 'seller');

-- Insert demo clients
INSERT INTO public.clients (id, name, phone, email, type, total_purchases) VALUES
('client1', 'Hotel Mille Collines', '+250788123456', 'procurement@millecollines.rw', 'regular', 0),
('client2', 'Kigali Heights', '+250788234567', 'admin@kigaliheights.rw', 'regular', 0),
('client3', 'Serena Hotel', '+250788345678', 'purchasing@serena.rw', 'regular', 0),
('client4', 'Walk-in Customer', NULL, NULL, 'random', 0);

-- Insert products based on your pricing structure

-- CENTURY LIQUID SOAP
INSERT INTO public.products (id, category, name, description, size, size_unit, unit, items_per_box, regular_price, random_price, stock, min_stock) VALUES
('prod_ls_5l', 'LIQUID_SOAP', 'Century Liquid Soap 5L', 'Premium liquid soap in 5 litre container', 5, 'L', 'jerry_can', NULL, 2000, 2500, 100, 10),
('prod_ls_20l', 'LIQUID_SOAP', 'Century Liquid Soap 20L', 'Premium liquid soap in 20 litre jerry can', 20, 'L', 'jerry_can', NULL, 10000, 10000, 50, 5),
('prod_ls_box4', 'LIQUID_SOAP', 'Century Liquid Soap Box of 4 (5L each)', 'Box containing 4 units of 5L liquid soap', 5, 'L', 'box', 4, 8000, 10000, 20, 3);

-- CENTURY HANDWASH
INSERT INTO public.products (id, category, name, description, size, size_unit, unit, items_per_box, regular_price, random_price, stock, min_stock) VALUES
('prod_hw_500ml', 'HANDWASH', 'Century Handwash 500ml', 'Premium handwash in 500ml bottle', 500, 'ml', 'bottle', NULL, 1100, 1500, 200, 20),
('prod_hw_box24', 'HANDWASH', 'Century Handwash Box of 24 (500ml each)', 'Box containing 24 bottles of 500ml handwash', 500, 'ml', 'box', 24, 26400, 26400, 15, 2),
('prod_hw_20l', 'HANDWASH', 'Century Handwash 20L', 'Premium handwash in 20 litre jerry can', 20, 'L', 'jerry_can', NULL, 25000, 35000, 30, 3);

-- CENTURY TILES CLEANER
INSERT INTO public.products (id, category, name, description, size, size_unit, unit, items_per_box, regular_price, random_price, stock, min_stock) VALUES
('prod_tc_1l', 'TILES_CLEANER', 'Century Tiles Cleaner 1L', 'Professional tiles cleaner in 1 litre bottle', 1, 'L', 'bottle', NULL, 3000, 3000, 80, 10),
('prod_tc_box12', 'TILES_CLEANER', 'Century Tiles Cleaner Box of 12 (1L each)', 'Box containing 12 bottles of 1L tiles cleaner', 1, 'L', 'box', 12, 36000, 36000, 10, 2),
('prod_tc_20l', 'TILES_CLEANER', 'Century Tiles Cleaner 20L', 'Professional tiles cleaner in 20 litre jerry can', 20, 'L', 'jerry_can', NULL, 60000, 60000, 15, 2);

-- Create view for sales analytics
CREATE OR REPLACE VIEW sales_analytics AS
SELECT 
    DATE_TRUNC('day', s.date) as sale_date,
    COUNT(*) as total_sales,
    SUM(s.quantity) as total_units_sold,
    SUM(s.total_amount) as total_revenue,
    SUM(CASE WHEN s.payment_method = 'Cash' THEN s.total_amount ELSE 0 END) as cash_revenue,
    SUM(CASE WHEN s.payment_method = 'MoMo' THEN s.total_amount ELSE 0 END) as momo_revenue,
    SUM(CASE WHEN s.client_type = 'regular' THEN s.total_amount ELSE 0 END) as regular_client_revenue,
    SUM(CASE WHEN s.client_type = 'random' THEN s.total_amount ELSE 0 END) as random_client_revenue,
    COUNT(DISTINCT s.seller_id) as unique_sellers,
    COUNT(DISTINCT s.client_id) as unique_clients
FROM public.sales s
GROUP BY DATE_TRUNC('day', s.date)
ORDER BY sale_date DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
