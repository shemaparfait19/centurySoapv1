import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  Users,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { DashboardStats, Product, Sale } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    todaySales: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalProducts: 8,
      totalStock: 1250,
      lowStockProducts: 2,
      todaySales: 15,
      todayRevenue: 45000,
      monthlyRevenue: 1250000,
      monthlyGrowth: 12.5,
    });
  }, []);

  const chartData = [
    { name: 'Mon', sales: 12, revenue: 36000 },
    { name: 'Tue', sales: 19, revenue: 57000 },
    { name: 'Wed', sales: 15, revenue: 45000 },
    { name: 'Thu', sales: 22, revenue: 66000 },
    { name: 'Fri', sales: 18, revenue: 54000 },
    { name: 'Sat', sales: 25, revenue: 75000 },
    { name: 'Sun', sales: 20, revenue: 60000 },
  ];

  const paymentData = [
    { name: 'Cash', value: 65, color: '#10b981' },
    { name: 'MoMo', value: 35, color: '#8b5cf6' },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-primary-500"
        />
        <StatCard
          title="Total Stock (L)"
          value={stats.totalStock.toLocaleString()}
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          color="bg-success-500"
        />
        <StatCard
          title="Today's Sales"
          value={stats.todaySales}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-secondary-500"
          change={`${stats.monthlyGrowth}% from last month`}
        />
        <StatCard
          title="Today's Revenue"
          value={`RWF ${stats.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-warning-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend (This Week)</h3>
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
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
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
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Percentage']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5" />
              <span>Record New Sale</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <Package className="w-5 h-5" />
              <span>Add New Product</span>
            </button>
            <button className="w-full btn-secondary text-left flex items-center space-x-3">
              <BarChart3 className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
          <div className="space-y-3">
            {stats.lowStockProducts > 0 ? (
              <div className="flex items-center space-x-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning-600" />
                <div>
                  <p className="text-sm font-medium text-warning-800">
                    Low Stock Alert
                  </p>
                  <p className="text-xs text-warning-600">
                    {stats.lowStockProducts} products need restocking
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-success-800">
                    All Good!
                  </p>
                  <p className="text-xs text-success-600">
                    Stock levels are healthy
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-primary-800">
                  Team Performance
                </p>
                <p className="text-xs text-primary-600">
                  Sales team is performing well this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 