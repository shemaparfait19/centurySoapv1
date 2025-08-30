import { supabase } from "../lib/supabase";
import { Product, Sale, StockUpdate } from "../types";

// User Management
export const supabaseService = {
  // Simple Authentication (no Supabase auth needed)
  async signIn(email: string, password: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password_hash", password) // Simple password check for demo
      .single();

    if (error || !data) {
      throw new Error("Invalid email or password");
    }

    // Store user in localStorage for session management
    localStorage.setItem("currentUser", JSON.stringify(data));
    return { user: data };
  },

  async signOut() {
    localStorage.removeItem("currentUser");
  },

  async getCurrentUser() {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },

  async updateStock(
    productId: string,
    newStock: number,
    reason: string,
    updatedBy: string
  ): Promise<void> {
    const { error } = await supabase.from("stock_updates").insert({
      product_id: productId,
      previous_stock: 0, // Will be updated by trigger
      new_stock: newStock,
      change_amount: newStock,
      reason,
      updated_by: updatedBy,
    });

    if (error) throw error;

    // Update product stock
    await this.updateProduct(productId, { stock: newStock });
  },

  // Sales
  async getSales(userId?: string): Promise<Sale[]> {
    let query = supabase
      .from("sales")
      .select("*")
      .order("date", { ascending: false });

    if (userId) {
      query = query.eq("seller_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getSalesByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Sale[]> {
    let query = supabase
      .from("sales")
      .select("*")
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (userId) {
      query = query.eq("seller_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createSale(sale: Omit<Sale, "id" | "createdAt">): Promise<Sale> {
    const { data, error } = await supabase
      .from("sales")
      .insert(sale)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSale(id: string, updates: Partial<Sale>): Promise<Sale> {
    const { data, error } = await supabase
      .from("sales")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Analytics
  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
    todaySales: number;
    todayRevenue: number;
    monthlyRevenue: number;
    monthlyGrowth: number;
  }> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    // Get products stats
    const { data: products } = await supabase.from("products").select("stock");

    const totalProducts = products?.length || 0;
    const totalStock =
      products?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;

    // Get low stock products
    const { data: lowStockProducts } = await supabase.rpc(
      "get_low_stock_products"
    );

    // Get today's sales
    const { data: todaySales } = await supabase
      .from("sales")
      .select("total_amount")
      .eq("date", today.toISOString().split("T")[0]);

    const todaySalesCount = todaySales?.length || 0;
    const todayRevenue =
      todaySales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;

    // Get monthly revenue
    const { data: monthlySales } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("date", startOfMonth.toISOString().split("T")[0]);

    const monthlyRevenue =
      monthlySales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;

    // Get last month revenue for growth calculation
    const { data: lastMonthSales } = await supabase
      .from("sales")
      .select("total_amount")
      .gte("date", startOfLastMonth.toISOString().split("T")[0])
      .lt("date", startOfMonth.toISOString().split("T")[0]);

    const lastMonthRevenue =
      lastMonthSales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
    const monthlyGrowth =
      lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    return {
      totalProducts,
      totalStock,
      lowStockProducts: lowStockProducts?.length || 0,
      todaySales: todaySalesCount,
      todayRevenue,
      monthlyRevenue,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    };
  },

  async getSalesAnalytics(startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from("sales_analytics")
      .select("*")
      .gte("sale_date", startDate.toISOString())
      .lte("sale_date", endDate.toISOString())
      .order("sale_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Stock Updates
  async getStockUpdates(productId?: string): Promise<StockUpdate[]> {
    let query = supabase
      .from("stock_updates")
      .select(
        `
        *,
        products(name),
        users(name)
      `
      )
      .order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Real-time subscriptions
  subscribeToSales(callback: (payload: any) => void) {
    return supabase
      .channel("sales_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales" },
        callback
      )
      .subscribe();
  },

  subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel("products_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        callback
      )
      .subscribe();
  },

  subscribeToStockUpdates(callback: (payload: any) => void) {
    return supabase
      .channel("stock_updates_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stock_updates" },
        callback
      )
      .subscribe();
  },
};
