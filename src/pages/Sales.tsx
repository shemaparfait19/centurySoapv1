import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingCart,
  Plus,
  Search,
  DollarSign,
  Package,
  User,
  Banknote,
  Smartphone,
  Download,
} from "lucide-react";
import { Sale, Product, Client } from "../types";
import toast from "react-hot-toast";
import { supabaseService } from "../services/supabaseService";

const Sales: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Load data from Supabase
  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await supabaseService.getProducts();
      if (data && data.length > 0) {
        setProducts(data);
        return;
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
    
    // Fallback to mock data if Supabase fails
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
    ];

    setProducts(mockProducts);
  };

  const loadSales = async () => {
    console.log("🔄 Loading sales from Supabase...");
    
    try {
      const data = await supabaseService.getSales();
      console.log("📊 Loaded sales from database:", data);
      
      if (data && data.length > 0) {
        setSales(data);
        setFilteredSales(data);
        toast.success(`Loaded ${data.length} sales from database`);
        return;
      } else {
        console.log("⚠️ No sales found in database, using mock data");
      }
    } catch (error) {
      console.error("❌ Error loading sales from Supabase:", error);
    }
    
    // Fallback to mock data if Supabase fails
    console.log("📝 Using mock sales data");
    const mockSales: Sale[] = [
      {
        id: "1",
        productId: "1",
        productName: "Century Liquid Soap 5L",
        productCategory: "LIQUID_SOAP",
        quantity: 10,
        unitPrice: 2000,
        totalAmount: 20000,
        paymentMethod: "Cash",
        paymentStatus: "Paid",
        clientName: "Hotel Mille Collines",
        clientType: "regular",
        sellerId: "2",
        sellerName: "John Seller",
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        productId: "3",
        productName: "Century Handwash 500ml",
        productCategory: "HANDWASH",
        quantity: 20,
        unitPrice: 1500,
        totalAmount: 30000,
        paymentMethod: "MoMo",
        paymentStatus: "Paid",
        clientName: "Walk-in Customer",
        clientType: "random",
        sellerId: "3",
        sellerName: "Sarah Seller",
        date: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
      },
    ];

    setSales(mockSales);
    setFilteredSales(mockSales);
  };

  // Filter sales based on search term and date
  useEffect(() => {
    let filtered = sales;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleAddSale = async (saleData: Omit<Sale, "id" | "createdAt">) => {
    console.log("📝 Attempting to save sale:", saleData);
    
    try {
      const newSale = await supabaseService.createSale(saleData);
      console.log("✅ Sale saved to Supabase:", newSale);
      
      if (newSale) {
        setSales([newSale, ...sales]);
        setShowAddModal(false);
        toast.success("Sale saved to database!");
        return;
      }
    } catch (error) {
      console.error("❌ Error creating sale in Supabase:", error);
      toast.error("Failed to save to database. Using local storage.");
    }
    
    // Fallback to local state if Supabase fails
    console.log("⚠️ Using fallback - saving to local state only");
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSales([newSale, ...sales]);
    setShowAddModal(false);
    toast.success("Sale recorded (local only - not saved to database)");
  };

  const getTotalRevenue = () => {
    return filteredSales.reduce((total, sale) => total + sale.totalAmount, 0);
  };

  const getTotalUnits = () => {
    return filteredSales.reduce((total, sale) => total + sale.quantity, 0);
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
          sale.unitPrice,
          sale.totalAmount,
          sale.paymentMethod,
          sale.paymentStatus,
          sale.clientName || "",
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
              <p className="text-sm text-gray-600">Total Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalUnits()}
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
                <th className="table-header">Amount (RWF)</th>
                <th className="table-header">Payment</th>
                <th className="table-header">Status</th>
                <th className="table-header">Client</th>
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
                  <td className="table-cell">{sale.quantity} units</td>
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
                  <td className="table-cell">{sale.clientName || "-"}</td>
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
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientType: "random" as "regular" | "random",
    paymentMethod: "Cash" as "Cash" | "MoMo",
    paymentStatus: "Paid" as "Paid" | "Not Paid",
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Load clients
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await supabaseService.getClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  // Filter clients based on search
  useEffect(() => {
    if (formData.clientName.length > 0) {
      const filtered = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(formData.clientName.toLowerCase()) ||
          c.phone?.includes(formData.clientName)
      );
      setFilteredClients(filtered);
      setShowClientDropdown(filtered.length > 0);
    } else {
      setFilteredClients([]);
      setShowClientDropdown(false);
    }
  }, [formData.clientName, clients]);

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone || "",
      clientType: client.type,
    });
    setShowClientDropdown(false);
  };

  // Auto-set payment status to Paid when payment method is selected
  const handlePaymentMethodChange = (method: "Cash" | "MoMo") => {
    setFormData({ 
      ...formData, 
      paymentMethod: method,
      paymentStatus: "Paid" // Auto-set to Paid when payment method is selected
    });
  };

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const unitPrice = selectedProduct
    ? (formData.clientType === "regular" ? selectedProduct.regularPrice : selectedProduct.randomPrice)
    : 0;
  const totalAmount = unitPrice * formData.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const saleData: Omit<Sale, "id" | "createdAt"> = {
      productId: formData.productId,
      productName: selectedProduct.name,
      productCategory: selectedProduct.category,
      quantity: formData.quantity,
      unitPrice,
      totalAmount,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      clientId: formData.clientId || undefined,
      clientName: formData.clientName || undefined,
      clientType: formData.clientType,
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
                    {product.name} - RWF {product.regularPrice.toLocaleString()}/{product.randomPrice.toLocaleString()}
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

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => {
                  setFormData({ ...formData, clientName: e.target.value, clientId: "" });
                  setSelectedClient(null);
                }}
                onFocus={() => formData.clientName && setShowClientDropdown(true)}
                className="input-field"
                placeholder="Start typing to search clients..."
                required
              />
              {showClientDropdown && filteredClients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-600">
                        {client.phone && `📞 ${client.phone} • `}
                        {client.type === "regular" ? "Regular Client" : "Random Client"}
                        {client.totalPurchases > 0 && ` • RWF ${client.totalPurchases.toLocaleString()} spent`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {selectedClient && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {selectedClient.name}
                    {selectedClient.totalPurchases > 0 && (
                      <span> • Total purchases: RWF {selectedClient.totalPurchases.toLocaleString()}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, clientPhone: e.target.value })
                }
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Type
              </label>
              <select
                value={formData.clientType}
                onChange={(e) =>
                  setFormData({ ...formData, clientType: e.target.value as "regular" | "random" })
                }
                className="input-field"
              >
                <option value="random">Random Client (Normal Price)</option>
                <option value="regular">Regular Client (Special Price)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    handlePaymentMethodChange(e.target.value as "Cash" | "MoMo")
                  }
                  className="input-field"
                >
                  <option value="Cash">Cash</option>
                  <option value="MoMo">Mobile Money</option>
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
                <p className="text-xs text-gray-500 mt-1">
                  Auto-set to Paid when payment method selected
                </p>
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
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-medium">RWF {unitPrice.toLocaleString()}</span>
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
