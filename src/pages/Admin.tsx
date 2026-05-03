/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useRef, ChangeEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { Plus, Trash2, Package, Image as ImageIcon, Tag, Hash, Upload, X as CloseIcon, Lock, LayoutDashboard, List, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Product } from '../types';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../hooks/useAuth';
import { CONTACT_INFO } from '../constants';

export default function Admin() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<'products' | 'dashboard'>('dashboard');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'dashboard' || tab === 'products') {
      setActiveTab(tab as 'dashboard' | 'products');
    }
  }, [searchParams]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for existing session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'Nayem@017') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'Men',
    image: '',
    stock: 10,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newProduct.image) {
      alert('Please upload an image for the product.');
      return;
    }
    if (newProduct.price === undefined || newProduct.price <= 0) {
      alert('Please enter a valid price.');
      return;
    }
    if (newProduct.stock === undefined || newProduct.stock < 0) {
      alert('Please enter a valid stock amount.');
      return;
    }
    const product: Product = {
      ...newProduct as Product,
      id: 'p-' + Date.now(),
      price: newProduct.price, // Explicitly assign to ensure number
      stock: newProduct.stock, // Explicitly assign to ensure number
    };
    addProduct(product);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      description: '',
      category: 'Men',
      image: '',
      stock: 10,
    });
  };

  if (user?.email !== CONTACT_INFO.email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex p-4 bg-rose-50 text-rose-600 rounded-2xl mb-6">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-8">This area is reserved for the store administrator. Please sign in with an authorized account.</p>
          <a href="/" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
            Return to Homepage
          </a>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-rose-50 rounded-2xl mb-4">
              <Lock className="h-8 w-8 text-rose-600" />
            </div>
            <h1 className="font-serif text-2xl text-gray-900">Admin Login</h1>
            <p className="text-gray-500 text-sm">Enter password to access dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <input
                autoFocus
                type="password"
                placeholder="••••••••"
                className={`w-full p-4 bg-gray-50 border-2 rounded-xl focus:ring-0 transition-all ${
                  loginError ? 'border-rose-500 bg-rose-50' : 'border-transparent focus:border-rose-500'
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
              />
              {loginError && (
                <p className="text-rose-500 text-xs font-medium mt-1 ml-1">Incorrect password. Please try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900">Admin Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <Lock className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600">Manage your business, monitor sales, and update catalog.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'products' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="h-4 w-4" />
            Products
          </button>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-rose-600 text-white rounded-2xl md:rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AdminDashboard orders={orders} />
          </motion.div>
        ) : (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-gray-50">
          {products.map((product) => (
            <div key={product.id} className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img src={product.image} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-xs text-rose-600 font-medium">{product.category}</p>
                </div>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500">Price: <span className="font-bold text-gray-900">৳ {product.price.toLocaleString()}</span></span>
                <span className="text-gray-500">Stock: <span className="font-bold text-gray-900">{product.stock} pcs</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">৳ {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.stock} pcs</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            >
              <h2 className="font-serif text-2xl text-gray-900 mb-6">Add New Piece</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                  <input
                    required
                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500"
                    placeholder="Premium Silk Panjabi"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Category })}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Price (৳)</label>
                    <input
                      required
                      type="number"
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500"
                      value={newProduct.price ?? ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value === '' ? undefined : Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                    <input
                      required
                      type="number"
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500"
                      value={newProduct.stock ?? ''}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value === '' ? undefined : Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Product Image</label>
                  <div className="flex items-center gap-4">
                    {newProduct.image ? (
                      <div className="relative group/img w-full">
                        <img
                          src={newProduct.image}
                          className="w-full h-48 object-cover rounded-xl border border-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image: '' })}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <CloseIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-all hover:bg-rose-50"
                      >
                        <Upload className="h-8 w-8" />
                        <span className="text-sm font-medium">Click to upload from device</span>
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 resize-none"
                    placeholder="Product details..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
