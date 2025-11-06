import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Package,
  BarChart3,
  Calendar,
  Edit,
} from "lucide-react";
import { Product, StockUpdate } from "../types";
import toast from "react-hot-toast";

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        category: "LIQUID_SOAP",
        name: "Century Liquid Soap 5L",
        description: "5 Liter Jerry Can",
        size: 5,
        sizeUnit: "L",
        unit: "jerry_can",
        regularPrice: 2000,
        randomPrice: 2500,
        stock: 50,
        minStock: 20,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        category: "LIQUID_SOAP",
        name: "Century Liquid Soap 20L",
        description: "20 Liter Jerry Can",
        size: 20,
        sizeUnit: "L",
        unit: "jerry_can",
        regularPrice: 10000,
        randomPrice: 10000,
        stock: 30,
        minStock: 10,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "3",
        category: "HANDWASH",
        name: "Century Handwash 500ml",
        description: "500ml Bottle",
        size: 500,
        sizeUnit: "ml",
        unit: "bottle",
        regularPrice: 1100,
        randomPrice: 1500,
        stock: 200,
        minStock: 50,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "4",
        category: "TILES_CLEANER",
        name: "Century Tiles Cleaner 1L",
        description: "1 Liter Bottle",
        size: 1,
        sizeUnit: "L",
        unit: "bottle",
        regularPrice: 3000,
        randomPrice: 3000,
        stock: 80,
        minStock: 20,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "5",
        category: "LIQUID_SOAP",
        name: "Century Liquid Soap Box of 4",
        description: "Box of 4 (5L each)",
        size: 5,
        sizeUnit: "L",
        unit: "box",
        itemsPerBox: 4,
        regularPrice: 8000,
        randomPrice: 10000,
        stock: 15,
        minStock: 5,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
    ];

    const mockStockUpdates: StockUpdate[] = [
      {
        id: "1",
        productId: "1",
        productName: "Soap Liquid Jerry Can 7L",
        type: "restock",
        quantity: 50,
        previousStock: 100,
        newStock: 150,
        reason: "Monthly restock",
        userId: "1",
        userName: "Admin User",
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        productId: "2",
        productName: "Soap Liquid Jerry Can 10L",
        type: "sale",
        quantity: -5,
        previousStock: 85,
        newStock: 80,
        reason: "Customer sale",
        userId: "2",
        userName: "John Seller",
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
      },
    ];

    setProducts(mockProducts);
    setStockUpdates(mockStockUpdates);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter products based on search term and stock status
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by stock status
    if (stockFilter !== "all") {
      switch (stockFilter) {
        case "low":
          filtered = filtered.filter(
            (product) => product.stock <= product.minStock
          );
          break;
        case "medium":
          filtered = filtered.filter(
            (product) =>
              product.stock > product.minStock &&
              product.stock <= product.minStock * 2
          );
          break;
        case "good":
          filtered = filtered.filter(
            (product) => product.stock > product.minStock * 2
          );
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [searchTerm, stockFilter, products]);

  const handleRestock = (
    productId: string,
    quantity: number,
    reason: string
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newStock = product.stock + quantity;
    
    // Prevent negative stock
    if (newStock < 0) {
      toast.error("Cannot remove more stock than available");
      return;
    }

    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: newStock, updatedAt: new Date() };
      }
      return p;
    });

    const stockUpdate: StockUpdate = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type: quantity > 0 ? "restock" : "adjustment",
      quantity: Math.abs(quantity),
      previousStock: product.stock,
      newStock,
      reason,
      userId: user?.id || "",
      userName: user?.name || "",
      date: new Date(),
      createdAt: new Date(),
    };

    setStockUpdates([stockUpdate, ...stockUpdates]);
    setProducts(updatedProducts);
    setShowRestockModal(false);
    setSelectedProduct(null);
    toast.success(quantity > 0 ? "Stock added successfully!" : "Stock removed successfully!");
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return {
        status: "low",
        color: "text-danger-600",
        bgColor: "bg-danger-50",
        icon: AlertTriangle,
      };
    } else if (stock <= minStock * 2) {
      return {
        status: "medium",
        color: "text-warning-600",
        bgColor: "bg-warning-50",
        icon: AlertTriangle,
      };
    } else {
      return {
        status: "good",
        color: "text-success-600",
        bgColor: "bg-success-50",
        icon: CheckCircle,
      };
    }
  };

  const getTotalStock = () => {
    return products.reduce((total, product) => total + product.stock, 0);
  };

  const getLowStockCount = () => {
    return products.filter((product) => product.stock <= product.minStock)
      .length;
  };

  const getAverageStock = () => {
    return products.length > 0
      ? Math.round(getTotalStock() / products.length)
      : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">
            Track and manage your soap stock levels
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalStock()} L
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {getLowStockCount()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {getAverageStock()} L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="medium">Medium Stock</option>
            <option value="good">Good Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.minStock);
          const Icon = stockStatus.icon;

          return (
            <div
              key={product.id}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  {user?.role === "admin" && (
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowRestockModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {product.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Size:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.size}{product.sizeUnit} {product.unit === "jerry_can" ? "Jerry Can" : product.unit === "box" ? "Box" : "Bottle"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Current Stock:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.stock} L
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Min Threshold:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.minStock} L
                  </span>
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Stock Level</span>
                    <span>
                      {Math.round(
                        (product.stock / (product.minStock * 3)) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        stockStatus.status === "low"
                          ? "bg-danger-500"
                          : stockStatus.status === "medium"
                          ? "bg-warning-500"
                          : "bg-success-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (product.stock / (product.minStock * 3)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-2 p-2 rounded-lg ${stockStatus.bgColor}`}
                >
                  <Icon className={`w-4 h-4 ${stockStatus.color}`} />
                  <span className={`text-xs font-medium ${stockStatus.color}`}>
                    {stockStatus.status === "low"
                      ? "Low Stock - Restock Needed"
                      : stockStatus.status === "medium"
                      ? "Medium Stock - Monitor"
                      : "Good Stock Level"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Stock Updates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Stock Updates
        </h3>
        <div className="space-y-3">
          {stockUpdates.slice(0, 5).map((update) => (
            <div
              key={update.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  update.type === "restock"
                    ? "bg-success-100"
                    : "bg-warning-100"
                }`}
              >
                {update.type === "restock" ? (
                  <TrendingUp className="w-4 h-4 text-success-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-warning-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {update.productName}
                </p>
                <p className="text-xs text-gray-500">
                  {update.type === "restock" ? "Restocked" : "Sold"}{" "}
                  {Math.abs(update.quantity)} L by {update.userName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {update.previousStock} → {update.newStock} L
                </p>
                <p className="text-xs text-gray-500">
                  {update.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedProduct && (
        <RestockModal
          product={selectedProduct}
          onClose={() => {
            setShowRestockModal(false);
            setSelectedProduct(null);
          }}
          onRestock={handleRestock}
        />
      )}
    </div>
  );
};

// Restock Modal Component
interface RestockModalProps {
  product: Product;
  onClose: () => void;
  onRestock: (productId: string, quantity: number, reason: string) => void;
}

const RestockModal: React.FC<RestockModalProps> = ({
  product,
  onClose,
  onRestock,
}) => {
  const [formData, setFormData] = useState({
    action: "add" as "add" | "remove",
    quantity: 0,
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    const finalQuantity = formData.action === "remove" ? -formData.quantity : formData.quantity;
    onRestock(product.id, finalQuantity, formData.reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Update Stock
          </h2>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Current Stock:</span>
                <p className="font-medium">{product.stock} L</p>
              </div>
              <div>
                <span className="text-gray-500">Min Threshold:</span>
                <p className="font-medium">{product.minStock} L</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, action: "add" })}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.action === "add"
                      ? "bg-success-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, action: "remove" })}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.action === "remove"
                      ? "bg-danger-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Remove Stock
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity (units)
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                className="input-field"
                min="1"
                max={formData.action === "remove" ? product.stock : undefined}
                required
              />
              {formData.action === "remove" && formData.quantity > product.stock && (
                <p className="text-sm text-danger-600 mt-1">
                  Cannot remove more than current stock ({product.stock} units)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="input-field"
                rows={3}
                placeholder={formData.action === "add" ? "e.g., Monthly restock, New delivery" : "e.g., Damaged goods, Return to supplier"}
                required
              />
            </div>

            <div className={`p-4 rounded-lg border ${
              formData.action === "add" 
                ? "bg-success-50 border-success-200" 
                : "bg-danger-50 border-danger-200"
            }`}>
              <p className={`text-sm ${
                formData.action === "add" ? "text-success-800" : "text-danger-800"
              }`}>
                <strong>New Stock Level:</strong>{" "}
                {formData.action === "add" 
                  ? product.stock + formData.quantity 
                  : product.stock - formData.quantity} units
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button type="submit" className="btn-primary flex-1">
                Update Stock
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
