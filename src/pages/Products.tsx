import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Droplet,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Mock products data with new structure
  useEffect(() => {
    const mockProducts: Product[] = [
      // LIQUID SOAP
      {
        id: '1',
        category: 'LIQUID_SOAP',
        name: 'Century Liquid Soap 5L',
        description: '5 Liter Jerry Can',
        size: 5,
        sizeUnit: 'L',
        unit: 'jerry_can',
        regularPrice: 2000,
        randomPrice: 2500,
        stock: 50,
        minStock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        category: 'LIQUID_SOAP',
        name: 'Century Liquid Soap 20L',
        description: '20 Liter Jerry Can',
        size: 20,
        sizeUnit: 'L',
        unit: 'jerry_can',
        regularPrice: 10000,
        randomPrice: 10000,
        stock: 30,
        minStock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        category: 'LIQUID_SOAP',
        name: 'Century Liquid Soap Box of 4',
        description: 'Box of 4 (5L each)',
        size: 5,
        sizeUnit: 'L',
        unit: 'box',
        itemsPerBox: 4,
        regularPrice: 8000,
        randomPrice: 10000,
        stock: 15,
        minStock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // HANDWASH
      {
        id: '4',
        category: 'HANDWASH',
        name: 'Century Handwash 500ml',
        description: '500ml Bottle',
        size: 500,
        sizeUnit: 'ml',
        unit: 'bottle',
        regularPrice: 1100,
        randomPrice: 1500,
        stock: 200,
        minStock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        category: 'HANDWASH',
        name: 'Century Handwash Box of 24',
        description: 'Box of 24 (500ml each)',
        size: 500,
        sizeUnit: 'ml',
        unit: 'box',
        itemsPerBox: 24,
        regularPrice: 26400,
        randomPrice: 26400,
        stock: 10,
        minStock: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        category: 'HANDWASH',
        name: 'Century Handwash 20L',
        description: '20 Liter Jerry Can',
        size: 20,
        sizeUnit: 'L',
        unit: 'jerry_can',
        regularPrice: 25000,
        randomPrice: 35000,
        stock: 12,
        minStock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // TILES CLEANER
      {
        id: '7',
        category: 'TILES_CLEANER',
        name: 'Century Tiles Cleaner 1L',
        description: '1 Liter Bottle',
        size: 1,
        sizeUnit: 'L',
        unit: 'bottle',
        regularPrice: 3000,
        randomPrice: 3000,
        stock: 80,
        minStock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8',
        category: 'TILES_CLEANER',
        name: 'Century Tiles Cleaner Box of 12',
        description: 'Box of 12 (1L each)',
        size: 1,
        sizeUnit: 'L',
        unit: 'box',
        itemsPerBox: 12,
        regularPrice: 36000,
        randomPrice: 36000,
        stock: 8,
        minStock: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9',
        category: 'TILES_CLEANER',
        name: 'Century Tiles Cleaner 20L',
        description: '20 Liter Jerry Can',
        size: 20,
        sizeUnit: 'L',
        unit: 'jerry_can',
        regularPrice: 60000,
        randomPrice: 60000,
        stock: 6,
        minStock: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedCategory]);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
    toast.success('Product added successfully!');
  };

  const handleEditProduct = (productData: Product) => {
    const updatedProducts = products.map(p =>
      p.id === productData.id ? { ...productData, updatedAt: new Date() } : p
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
    toast.success('Product updated successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    }
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return { status: 'low', color: 'text-danger-600', bgColor: 'bg-danger-50', icon: AlertTriangle };
    } else if (stock <= minStock * 2) {
      return { status: 'medium', color: 'text-warning-600', bgColor: 'bg-warning-50', icon: AlertTriangle };
    } else {
      return { status: 'good', color: 'text-success-600', bgColor: 'bg-success-50', icon: CheckCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your soap products and inventory</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        )}
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
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setSelectedCategory('LIQUID_SOAP')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'LIQUID_SOAP'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Liquid Soap</span>
        </button>
        <button
          onClick={() => setSelectedCategory('HANDWASH')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'HANDWASH'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Handwash</span>
        </button>
        <button
          onClick={() => setSelectedCategory('TILES_CLEANER')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'TILES_CLEANER'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tiles Cleaner</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.minStock);
          const Icon = stockStatus.icon;
          
          return (
            <div key={product.id} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  {user?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Unit Type:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {product.unit === 'jerry_can' ? 'Jerry Can' : product.unit === 'box' ? 'Box' : 'Bottle'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Regular Price:</span>
                  <span className="text-sm font-medium text-success-600">
                    {product.regularPrice.toLocaleString()} RWF
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Random Price:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.randomPrice.toLocaleString()} RWF
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.stock} {product.unit === 'jerry_can' ? 'cans' : product.unit === 'box' ? 'boxes' : 'bottles'}
                  </span>
                </div>

                <div className={`flex items-center space-x-2 p-2 rounded-lg ${stockStatus.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stockStatus.color}`} />
                  <span className={`text-xs font-medium ${stockStatus.color}`}>
                    {stockStatus.status === 'low' ? 'Low Stock' : 
                     stockStatus.status === 'medium' ? 'Medium Stock' : 'Good Stock'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={editingProduct ? (productData) => handleEditProduct({ ...editingProduct, ...productData }) : handleAddProduct}
        />
      )}
    </div>
  );
};

// Product Modal Component
interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    capacity: product?.capacity || 7,
    unit: product?.unit || 'jerry_can' as 'L' | 'jerry_can',
    price: product?.price || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (L)
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as 'L' | 'jerry_can' })}
                  className="input-field"
                >
                  <option value="jerry_can">Jerry Can</option>
                  <option value="L">Liters</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (RWF)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock (L)
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock Threshold (L)
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                className="input-field"
                min="1"
                required
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                {product ? 'Update Product' : 'Add Product'}
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

export default Products; 