-- CENTURY SOAP Inventory Management System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'seller');
CREATE TYPE payment_method AS ENUM ('Cash', 'MoMo');
CREATE TYPE payment_status AS ENUM ('Paid', 'Not Paid');
CREATE TYPE unit_type AS ENUM ('jerry_can', 'liter', 'bottle');

-- Create users table (simple user management)
CREATE TABLE public.users (
    id TEXT PRIMARY KEY, -- Simple text ID instead of UUID
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL, -- Store hashed passwords
    role user_role NOT NULL DEFAULT 'seller',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
    id TEXT DEFAULT 'prod_' || floor(random() * 1000000)::text PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    capacity DECIMAL(10,2) NOT NULL, -- in liters
    unit unit_type NOT NULL DEFAULT 'jerry_can',
    price DECIMAL(12,2) NOT NULL, -- in RWF
    stock DECIMAL(10,2) NOT NULL DEFAULT 0, -- current stock in liters
    min_stock DECIMAL(10,2) NOT NULL DEFAULT 0, -- minimum stock threshold
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE public.sales (
    id TEXT DEFAULT 'sale_' || floor(random() * 1000000)::text PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    product_name TEXT NOT NULL, -- denormalized for performance
    quantity INTEGER NOT NULL, -- number of units sold
    total_liters DECIMAL(10,2) NOT NULL, -- total liters sold
    unit_price DECIMAL(12,2) NOT NULL, -- price per liter
    total_amount DECIMAL(12,2) NOT NULL, -- total amount in RWF
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'Paid',
    customer_name TEXT, -- optional
    seller_id TEXT REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    seller_name TEXT NOT NULL, -- denormalized for performance
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_updates table for tracking inventory changes
CREATE TABLE public.stock_updates (
    id TEXT DEFAULT 'update_' || floor(random() * 1000000)::text PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    previous_stock DECIMAL(10,2) NOT NULL,
    new_stock DECIMAL(10,2) NOT NULL,
    change_amount DECIMAL(10,2) NOT NULL, -- positive for additions, negative for deductions
    reason TEXT NOT NULL, -- 'restock', 'sale', 'adjustment', etc.
    updated_by TEXT REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_stock ON public.products(stock);
CREATE INDEX idx_sales_date ON public.sales(date);
CREATE INDEX idx_sales_seller_id ON public.sales(seller_id);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_stock_updates_product_id ON public.stock_updates(product_id);
CREATE INDEX idx_stock_updates_created_at ON public.stock_updates(created_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Anyone can view users" ON public.users
    FOR SELECT USING (true);

-- RLS Policies for products table
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Anyone can modify products" ON public.products
    FOR ALL USING (true);

-- RLS Policies for sales table
CREATE POLICY "Anyone can view sales" ON public.sales
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create sales" ON public.sales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can modify sales" ON public.sales
    FOR UPDATE USING (true);

-- RLS Policies for stock_updates table
CREATE POLICY "Anyone can view stock updates" ON public.stock_updates
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create stock updates" ON public.stock_updates
    FOR INSERT WITH CHECK (true);

-- Create functions for automatic stock management
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product stock when sale is created
    IF TG_OP = 'INSERT' THEN
        UPDATE public.products 
        SET stock = stock - NEW.total_liters,
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
            (SELECT stock + NEW.total_liters FROM public.products WHERE id = NEW.product_id),
            (SELECT stock FROM public.products WHERE id = NEW.product_id),
            -NEW.total_liters,
            'sale',
            NEW.seller_id
        );
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stock updates on sales
CREATE TRIGGER trigger_update_stock_on_sale
    AFTER INSERT ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- Create function to check low stock
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    current_stock DECIMAL(10,2),
    min_stock DECIMAL(10,2),
    stock_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.stock,
        p.min_stock,
        CASE 
            WHEN p.stock <= p.min_stock THEN 'Critical'
            WHEN p.stock <= p.min_stock * 1.5 THEN 'Low'
            ELSE 'Normal'
        END as stock_status
    FROM public.products p
    WHERE p.stock <= p.min_stock * 1.5
    ORDER BY p.stock ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert predefined users (simple passwords for demo)
INSERT INTO public.users (id, email, name, password_hash, role) VALUES
('admin1', 'admin@centurysoap.com', 'Admin User', 'password123', 'admin'),
('seller1', 'john@centurysoap.com', 'John Seller', 'password123', 'seller'),
('seller2', 'sarah@centurysoap.com', 'Sarah Seller', 'password123', 'seller');

-- Insert sample data
INSERT INTO public.products (id, name, description, capacity, unit, price, stock, min_stock) VALUES
('prod1', 'Soap Liquid Jerry Can 7L', 'Premium liquid soap in 7L jerry can', 7.0, 'jerry_can', 3500.00, 150.0, 20.0),
('prod2', 'Soap Liquid Jerry Can 10L', 'Premium liquid soap in 10L jerry can', 10.0, 'jerry_can', 5000.00, 80.0, 15.0),
('prod3', 'Soap Liquid Jerry Can 20L', 'Premium liquid soap in 20L jerry can', 20.0, 'jerry_can', 9500.00, 45.0, 10.0),
('prod4', 'Soap Liquid Bottle 500ml', 'Premium liquid soap in 500ml bottle', 0.5, 'bottle', 250.00, 200.0, 30.0),
('prod5', 'Soap Liquid Bottle 1L', 'Premium liquid soap in 1L bottle', 1.0, 'bottle', 450.00, 150.0, 25.0);

-- Create view for sales analytics
CREATE VIEW sales_analytics AS
SELECT 
    DATE_TRUNC('day', s.date) as sale_date,
    COUNT(*) as total_sales,
    SUM(s.total_liters) as total_liters_sold,
    SUM(s.total_amount) as total_revenue,
    SUM(CASE WHEN s.payment_method = 'Cash' THEN s.total_amount ELSE 0 END) as cash_revenue,
    SUM(CASE WHEN s.payment_method = 'MoMo' THEN s.total_amount ELSE 0 END) as momo_revenue,
    COUNT(DISTINCT s.seller_id) as unique_sellers
FROM public.sales s
GROUP BY DATE_TRUNC('day', s.date)
ORDER BY sale_date DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 