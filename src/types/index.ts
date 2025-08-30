export interface Product {
  id: string;
  name: string;
  description: string;
  capacity: number; // in liters
  unit: 'L' | 'jerry_can';
  price: number; // in RWF
  stock: number; // current stock in liters
  minStock: number; // minimum stock threshold
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number; // in jerry cans or liters
  totalLiters: number;
  unitPrice: number; // price per liter
  totalAmount: number; // total price in RWF
  paymentMethod: 'Cash' | 'MoMo';
  paymentStatus: 'Paid' | 'Not Paid';
  customerName?: string;
  sellerId: string;
  sellerName: string;
  date: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
  createdAt: Date;
}

export interface StockUpdate {
  id: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale' | 'adjustment';
  quantity: number; // in liters
  previousStock: number;
  newStock: number;
  reason?: string;
  userId: string;
  userName: string;
  date: Date;
  createdAt: Date;
}

export interface ReportData {
  period: string;
  totalLitersSold: number;
  totalRevenue: number;
  cashRevenue: number;
  momoRevenue: number;
  totalSales: number;
  topProducts: Array<{
    name: string;
    litersSold: number;
    revenue: number;
  }>;
  topSellers: Array<{
    name: string;
    litersSold: number;
    revenue: number;
  }>;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  todaySales: number;
  todayRevenue: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
} 