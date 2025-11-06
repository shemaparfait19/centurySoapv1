import { supabase } from "../lib/supabase";
import { Product, Sale, StockUpdate, Client } from "../types";

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
    
    // Transform snake_case to camelCase
    return (data || []).map((product: any) => ({
      id: product.id,
      category: product.category,
      name: product.name,
      description: product.description,
      size: product.size,
      sizeUnit: product.size_unit,
      unit: product.unit,
      itemsPerBox: product.items_per_box,
      regularPrice: product.regular_price,
      randomPrice: product.random_price,
      stock: product.stock,
      minStock: product.min_stock,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }));
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
    
    // Transform snake_case to camelCase
    return (data || []).map((sale: any) => ({
      id: sale.id,
      productId: sale.product_id,
      productName: sale.product_name,
      productCategory: sale.product_category,
      quantity: sale.quantity,
      unitPrice: sale.unit_price,
      totalAmount: sale.total_amount,
      paymentMethod: sale.payment_method,
      paymentStatus: sale.payment_status,
      clientId: sale.client_id,
      clientName: sale.client_name,
      clientType: sale.client_type,
      sellerId: sale.seller_id,
      sellerName: sale.seller_name,
      date: new Date(sale.date),
      createdAt: new Date(sale.created_at),
    }));
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
    // First, get current product stock
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", sale.productId)
      .single();

    if (productError) throw productError;

    // Check if enough stock available
    if (product.stock < sale.quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}, Requested: ${sale.quantity}`);
    }

    // Transform camelCase to snake_case for database
    const dbSale = {
      product_id: sale.productId,
      product_name: sale.productName,
      product_category: sale.productCategory,
      quantity: sale.quantity,
      unit_price: sale.unitPrice,
      total_amount: sale.totalAmount,
      payment_method: sale.paymentMethod,
      payment_status: sale.paymentStatus,
      client_id: sale.clientId,
      client_name: sale.clientName,
      client_type: sale.clientType,
      seller_id: sale.sellerId,
      seller_name: sale.sellerName,
      date: sale.date,
    };

    // Insert sale
    const { data, error } = await supabase
      .from("sales")
      .insert(dbSale)
      .select()
      .single();

    if (error) throw error;

    // Reduce stock
    const newStock = product.stock - sale.quantity;
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", sale.productId);

    if (updateError) throw updateError;

    // Update client purchase tracking if clientId exists
    if (sale.clientId) {
      const { data: client } = await supabase
        .from("clients")
        .select("total_purchases")
        .eq("id", sale.clientId)
        .single();

      if (client) {
        const newTotalPurchases = client.total_purchases + sale.totalAmount;
        await supabase
          .from("clients")
          .update({
            total_purchases: newTotalPurchases,
            last_purchase_date: new Date().toISOString().split('T')[0],
          })
          .eq("id", sale.clientId);
      }
    }
    
    // Transform snake_case back to camelCase
    return {
      id: data.id,
      productId: data.product_id,
      productName: data.product_name,
      productCategory: data.product_category,
      quantity: data.quantity,
      unitPrice: data.unit_price,
      totalAmount: data.total_amount,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      clientId: data.client_id,
      clientName: data.client_name,
      clientType: data.client_type,
      sellerId: data.seller_id,
      sellerName: data.seller_name,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
    };
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

  // Clients Management
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("name");

    if (error) throw error;
    
    // Transform snake_case to camelCase
    return (data || []).map((client: any) => ({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      type: client.type,
      totalPurchases: client.total_purchases,
      lastPurchaseDate: client.last_purchase_date ? new Date(client.last_purchase_date) : undefined,
      createdAt: new Date(client.created_at),
      updatedAt: new Date(client.updated_at),
    }));
  },

  async getClient(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createClient(
    client: Omit<Client, "id" | "createdAt" | "updatedAt" | "totalPurchases" | "lastPurchaseDate">
  ): Promise<Client> {
    const { data, error} = await supabase
      .from("clients")
      .insert({
        name: client.name,
        phone: client.phone,
        email: client.email,
        type: client.type,
        total_purchases: 0,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Transform snake_case to camelCase
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      type: data.type,
      totalPurchases: data.total_purchases,
      lastPurchaseDate: data.last_purchase_date ? new Date(data.last_purchase_date) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) throw error;
  },

  subscribeToClients(callback: (payload: any) => void) {
    return supabase
      .channel("clients_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients" },
        callback
      )
      .subscribe();
  },
};
