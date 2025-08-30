import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Eye,
  Download,
} from "lucide-react";
import { Sale, Product } from "../types";
import toast from "react-hot-toast";

const Sales: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock data
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Soap Liquid Jerry Can 7L",
        description: "Premium liquid soap in 7L jerry can",
        capacity: 7,
        unit: "jerry_can",
        price: 3500,
        stock: 150,
        minStock: 20,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "Soap Liquid Jerry Can 10L",
        description: "Premium liquid soap in 10L jerry can",
        capacity: 10,
        unit: "jerry_can",
        price: 5000,
        stock: 80,
        minStock: 15,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "3",
        name: "Soap Liquid Jerry Can 20L",
        description: "Premium liquid soap in 20L jerry can",
        capacity: 20,
        unit: "jerry_can",
        price: 9500,
        stock: 45,
        minStock: 10,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
    ];

    const mockSales: Sale[] = [
      {
        id: "1",
        productId: "1",
        productName: "Soap Liquid Jerry Can 7L",
        quantity: 2,
        totalLiters: 14,
        unitPrice: 500,
        totalAmount: 7000,
        paymentMethod: "Cash",
        paymentStatus: "Paid",
        customerName: "John Doe",
        sellerId: "2",
        sellerName: "John Seller",
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        productId: "2",
        productName: "Soap Liquid Jerry Can 10L",
        quantity: 1,
        totalLiters: 10,
        unitPrice: 500,
        totalAmount: 5000,
        paymentMethod: "MoMo",
        paymentStatus: "Paid",
        customerName: "Jane Smith",
        sellerId: "3",
        sellerName: "Sarah Seller",
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
      },
    ];

    setProducts(mockProducts);
    setSales(mockSales);
    setFilteredSales(mockSales);
  }, []);

  // Filter sales based on search term and date
  useEffect(() => {
    let filtered = sales;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((sale) => sale.date >= startOfDay);
          break;
        case "week":
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          filtered = filtered.filter((sale) => sale.date >= startOfWeek);
          break;
        case "month":
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          filtered = filtered.filter((sale) => sale.date >= startOfMonth);
          break;
      }
    }

    setFilteredSales(filtered);
  }, [searchTerm, dateFilter, sales]);

  const handleAddSale = (saleData: Omit<Sale, "id" | "createdAt">) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales([...sales, newSale]);
    setShowAddModal(false);
    toast.success("Sale recorded successfully!");
  };

  const getTotalRevenue = () => {
    return filteredSales.reduce((total, sale) => total + sale.totalAmount, 0);
  };

  const getTotalLiters = () => {
    return filteredSales.reduce((total, sale) => total + sale.totalLiters, 0);
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Product",
      "Quantity",
      "Total Liters",
      "Unit Price",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Customer",
      "Seller",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredSales.map((sale) =>
        [
          sale.date.toLocaleDateString(),
          sale.productName,
          sale.quantity,
          sale.totalLiters,
          sale.unitPrice,
          sale.totalAmount,
          sale.paymentMethod,
          sale.paymentStatus,
          sale.customerName || "",
          sale.sellerName,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Sales data exported successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600">Record and track your soap sales</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Record Sale</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredSales.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Liters Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalLiters()} L
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                RWF {getTotalRevenue().toLocaleString()}
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
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Product</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Total (L)</th>
                <th className="table-header">Amount (RWF)</th>
                <th className="table-header">Payment</th>
                <th className="table-header">Status</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Seller</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    {sale.date.toLocaleDateString()}
                  </td>
                  <td className="table-cell font-medium">{sale.productName}</td>
                  <td className="table-cell">{sale.quantity}</td>
                  <td className="table-cell">{sale.totalLiters} L</td>
                  <td className="table-cell font-medium">
                    RWF {sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {sale.paymentMethod === "Cash" ? (
                        <Banknote className="w-4 h-4 text-green-600" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-purple-600" />
                      )}
                      <span className="text-sm">{sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sale.paymentStatus === "Paid"
                          ? "bg-success-100 text-success-800"
                          : "bg-warning-100 text-warning-800"
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="table-cell">{sale.customerName || "-"}</td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="text-sm">{sale.sellerName}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddModal && (
        <SaleModal
          products={products}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSale}
          sellerId={user?.id || ""}
          sellerName={user?.name || ""}
        />
      )}
    </div>
  );
};

// Sale Modal Component
interface SaleModalProps {
  products: Product[];
  onClose: () => void;
  onSave: (sale: Omit<Sale, "id" | "createdAt">) => void;
  sellerId: string;
  sellerName: string;
}

const SaleModal: React.FC<SaleModalProps> = ({
  products,
  onClose,
  onSave,
  sellerId,
  sellerName,
}) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    customerName: "",
    paymentMethod: "Cash" as "Cash" | "MoMo",
    paymentStatus: "Paid" as "Paid" | "Not Paid",
  });

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const totalLiters = selectedProduct
    ? selectedProduct.capacity * formData.quantity
    : 0;
  const totalAmount = selectedProduct
    ? selectedProduct.price * formData.quantity
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const saleData: Omit<Sale, "id" | "createdAt"> = {
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      totalLiters,
      unitPrice: selectedProduct.price / selectedProduct.capacity,
      totalAmount,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      customerName: formData.customerName || undefined,
      sellerId,
      sellerName,
      date: new Date(),
    };

    onSave(saleData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Record New Sale
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                className="input-field"
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - RWF {product.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                className="input-field"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name (Optional)
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="input-field"
                placeholder="Enter customer name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as "Cash" | "MoMo",
                    })
                  }
                  className="input-field"
                >
                  <option value="Cash">Cash</option>
                  <option value="MoMo">MoMo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentStatus: e.target.value as "Paid" | "Not Paid",
                    })
                  }
                  className="input-field"
                >
                  <option value="Paid">Paid</option>
                  <option value="Not Paid">Not Paid</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            {selectedProduct && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Sale Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Liters:</span>
                    <span className="font-medium">{totalLiters} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-lg text-primary-600">
                      RWF {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={!selectedProduct}
              >
                Record Sale
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

export default Sales;
