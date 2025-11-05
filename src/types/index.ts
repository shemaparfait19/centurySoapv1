export type ProductCategory = 'LIQUID_SOAP' | 'HANDWASH' | 'TILES_CLEANER';
export type ProductUnit = 'bottle' | 'jerry_can' | 'box';

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  size: number; // size in liters or ml
  sizeUnit: 'L' | 'ml'; // liter or milliliter
  unit: ProductUnit; // bottle, jerry_can, or box
  itemsPerBox?: number; // if unit is 'box', how many items per box
  regularPrice: number; // price for regular/special clients in RWF
  randomPrice: number; // price for random/occasional clients in RWF
  stock: number; // current stock in units (bottles, cans, or boxes)
  minStock: number; // minimum stock threshold
  createdAt: Date;
  updatedAt: Date;
}

export type ClientType = 'regular' | 'random';

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  type: ClientType; // regular (special pricing) or random (normal pricing)
  totalPurchases: number; // total amount spent
  lastPurchaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  productCategory: ProductCategory;
  quantity: number; // number of units sold (bottles, cans, or boxes)
  unitPrice: number; // price per unit applied (regular or random price)
  totalAmount: number; // total price in RWF
  paymentMethod: 'Cash' | 'MoMo';
  paymentStatus: 'Paid' | 'Not Paid';
  clientId?: string; // optional client reference
  clientName?: string;
  clientType: ClientType; // which pricing was applied
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
  quantity: number; // in units (bottles, cans, or boxes)
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
  totalUnitsSold: number;
  totalRevenue: number;
  cashRevenue: number;
  momoRevenue: number;
  totalSales: number;
  regularClientRevenue: number;
  randomClientRevenue: number;
  topProducts: Array<{
    name: string;
    unitsSold: number;
    revenue: number;
  }>;
  topSellers: Array<{
    name: string;
    unitsSold: number;
    revenue: number;
  }>;
  topClients: Array<{
    name: string;
    totalPurchases: number;
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
  totalClients: number;
  regularClients: number;
  randomClients: number;
} 