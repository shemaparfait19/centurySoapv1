import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import { ReportData } from "../types";
import { supabaseService } from "../services/supabaseService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState("month");
  const [isLoading, setIsLoading] = useState(false);

  // Load real data from Supabase
  useEffect(() => {
    generateReport();
  }, [dateRange]);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      // Get date range
      const today = new Date();
      let startDate = new Date();
      let period = "";

      switch (dateRange) {
        case "week":
          startDate.setDate(today.getDate() - 7);
          period = "This Week";
          break;
        case "month":
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          period = "This Month";
          break;
        case "quarter":
          startDate = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          period = "This Quarter";
          break;
        case "year":
          startDate = new Date(today.getFullYear(), 0, 1);
          period = "This Year";
          break;
        default:
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          period = "This Month";
      }

      // Get all sales in date range
      const sales = await supabaseService.getSales();
      const filteredSales = sales.filter(s => new Date(s.date) >= startDate);

      // Calculate totals
      const totalUnitsSold = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
      const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const totalSales = filteredSales.length;

      // Payment method breakdown
      const cashRevenue = filteredSales
        .filter(s => s.paymentMethod === "Cash")
        .reduce((sum, s) => sum + s.totalAmount, 0);
      const momoRevenue = filteredSales
        .filter(s => s.paymentMethod === "MoMo")
        .reduce((sum, s) => sum + s.totalAmount, 0);

      // Client type breakdown
      const regularClientRevenue = filteredSales
        .filter(s => s.clientType === "regular")
        .reduce((sum, s) => sum + s.totalAmount, 0);
      const randomClientRevenue = filteredSales
        .filter(s => s.clientType === "random")
        .reduce((sum, s) => sum + s.totalAmount, 0);

      // Top products
      const productMap = new Map<string, { name: string; unitsSold: number; revenue: number }>();
      filteredSales.forEach(sale => {
        const existing = productMap.get(sale.productId) || { name: sale.productName, unitsSold: 0, revenue: 0 };
        existing.unitsSold += sale.quantity;
        existing.revenue += sale.totalAmount;
        productMap.set(sale.productId, existing);
      });
      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top sellers
      const sellerMap = new Map<string, { name: string; unitsSold: number; revenue: number }>();
      filteredSales.forEach(sale => {
        const existing = sellerMap.get(sale.sellerId) || { name: sale.sellerName, unitsSold: 0, revenue: 0 };
        existing.unitsSold += sale.quantity;
        existing.revenue += sale.totalAmount;
        sellerMap.set(sale.sellerId, existing);
      });
      const topSellers = Array.from(sellerMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top clients
      const clients = await supabaseService.getClients();
      const topClients = clients
        .filter(c => c.totalPurchases > 0)
        .sort((a, b) => b.totalPurchases - a.totalPurchases)
        .slice(0, 5)
        .map(c => ({
          name: c.name,
          totalPurchases: filteredSales.filter(s => s.clientId === c.id).length,
          revenue: c.totalPurchases,
        }));

      const reportData: ReportData = {
        period,
        totalUnitsSold,
        totalRevenue,
        cashRevenue,
        momoRevenue,
        totalSales,
        regularClientRevenue,
        randomClientRevenue,
        topProducts,
        topSellers,
        topClients,
      };

      setReportData(reportData);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const headers = [
        "Period",
        "Total Units Sold",
        "Total Revenue",
        "Cash Revenue",
        "MoMo Revenue",
        "Total Sales",
      ];
      const csvContent = [
        headers.join(","),
        [
          reportData?.period || "",
          reportData?.totalUnitsSold || 0,
          reportData?.totalRevenue || 0,
          reportData?.cashRevenue || 0,
          reportData?.momoRevenue || 0,
          reportData?.totalSales || 0,
        ].join(","),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `century-soap-report-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report exported as CSV!");
    } else {
      toast.success("PDF export feature coming soon!");
    }
  };

  const chartData = [
    { name: "Week 1", sales: 12, revenue: 36000 },
    { name: "Week 2", sales: 19, revenue: 57000 },
    { name: "Week 3", sales: 15, revenue: 45000 },
    { name: "Week 4", sales: 22, revenue: 66000 },
  ];

  const paymentData = [
    { name: "Cash", value: 78, color: "#10b981" },
    { name: "MoMo", value: 22, color: "#8b5cf6" },
  ];

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-500">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your soap business performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button
            onClick={generateReport}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <BarChart3 className="w-5 h-5" />
            <span>{isLoading ? "Generating..." : "Generate Report"}</span>
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.totalUnitsSold}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                RWF {reportData.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.totalSales}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.topSellers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span>Sales</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Methods Distribution
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span>Cash</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <span>MoMo</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value}%`, "Percentage"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Products
            </h3>
            <div className="text-sm text-gray-500">By Revenue</div>
          </div>
          <div className="space-y-4">
            {reportData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-amber-600"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Units Sold:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product.unitsSold}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    RWF {product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Sellers</h3>
            <div className="text-sm text-gray-500">By Performance</div>
          </div>
          <div className="space-y-4">
            {reportData.topSellers.map((seller, index) => (
              <div key={seller.name} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-amber-600"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{seller.name}</p>
                  <p className="text-sm text-gray-500">
                    {seller.unitsSold} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    RWF {seller.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Breakdown
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportReport("csv")}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportReport("pdf")}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-green-800 mb-1">Cash Revenue</h4>
            <p className="text-2xl font-bold text-green-900">
              RWF {reportData.cashRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-green-600">
              {Math.round(
                (reportData.cashRevenue / reportData.totalRevenue) * 100
              )}
              % of total
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-purple-800 mb-1">MoMo Revenue</h4>
            <p className="text-2xl font-bold text-purple-900">
              RWF {reportData.momoRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-purple-600">
              {Math.round(
                (reportData.momoRevenue / reportData.totalRevenue) * 100
              )}
              % of total
            </p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-blue-800 mb-1">Total Revenue</h4>
            <p className="text-2xl font-bold text-blue-900">
              RWF {reportData.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">
              {reportData.totalSales} total sales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
