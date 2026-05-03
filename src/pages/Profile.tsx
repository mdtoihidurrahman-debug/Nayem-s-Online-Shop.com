/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, MapPin, Package, Heart, LogOut, ChevronRight, Save, Loader2, AlertCircle, CheckCircle2, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { db, storage } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const { orders } = useOrders();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' || tab === 'info') {
      setActiveTab(tab as 'orders' | 'info');
    }
  }, [searchParams]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatarUrl: profile.avatarUrl || '',
      });
    }
  }, [profile]);

  const userOrders = orders.filter(order => order.email === user?.email);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB.');
      return;
    }

    // Optimistic Update: Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatarUrl: previewUrl }));
    
    setError(null);

    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      // Update firestore in background
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { avatarUrl: url });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError('Background upload failed. Please try again.');
      // Revert to profile image if failed
      if (profile?.avatarUrl) {
        setFormData(prev => ({ ...prev, avatarUrl: profile.avatarUrl || '' }));
      }
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setSuccess(true);
      setIsEditing(false);
      // Success message timeout
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-4 bg-gray-50 rounded-full mb-6">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Please Login</h2>
        <p className="text-gray-500 mb-8">You need to be logged in to view your profile.</p>
        <a href="/login" className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
          Sign In Now
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Profile Card */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 blur-3xl opacity-50" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 bg-amber-100 rounded-[40px] flex items-center justify-center text-amber-700 text-4xl md:text-5xl font-serif overflow-hidden relative group">
              {formData.avatarUrl ? (
                <img 
                  src={formData.avatarUrl} 
                  alt={profile?.displayName} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                profile?.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
              )}
              
              {/* Overlay for editing */}
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-8 w-8 text-white mb-1" />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
              {profile?.displayName || 'Valued Customer'}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 mb-6">
              <span className="flex items-center gap-1.5 text-sm">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              {profile?.phone && (
                <span className="flex items-center gap-1.5 text-sm">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button 
                onClick={logout}
                className="px-6 py-2.5 border-2 border-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'info' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-3">
              <User className="h-5 w-5" />
              My Account
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'info' ? 'rotate-90' : ''}`} />
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === 'orders' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="h-5 w-5" />
              Order History
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === 'orders' ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Profile Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <h2 className="text-xl font-serif text-gray-900 mb-6 flex items-center gap-3">
                    Personal Information
                    {success && (
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 animate-in fade-in slide-in-from-left-2 transition-all">
                        <CheckCircle2 className="h-3 w-3" /> Updated
                      </span>
                    )}
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm">
                      <AlertCircle className="h-5 w-5" />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          disabled={!isEditing}
                          className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Default Address</label>
                      <textarea
                        rows={3}
                        disabled={!isEditing}
                        className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 transition-all disabled:opacity-75 disabled:cursor-not-allowed resize-none"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="House no, Road no, Area, City"
                      />
                    </div>

                    {isEditing && (
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    )}
                  </form>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Package className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Orders</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
                    <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Wishlist</p>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center col-span-2 sm:col-span-1">
                    <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate px-2">
                      {profile?.address ? 'Verified' : 'Not Set'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {userOrders.length > 0 ? (
                  <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {userOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                              <td className="px-6 py-6 font-mono text-sm font-bold text-gray-900">
                                {order.id.substring(0, 8).toUpperCase()}
                              </td>
                              <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-sm font-bold text-gray-900">
                                ৳ {order.total.toLocaleString()}
                              </td>
                              <td className="px-6 py-6 text-right">
                                <a 
                                  href={`/track?id=${order.id}`}
                                  className="text-xs font-bold text-gray-900 underline underline-offset-4 hover:text-rose-600 transition-colors"
                                >
                                  Track Order
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
                    <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-serif text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't made any purchases yet. Explore our latest collection!</p>
                    <a href="/shop" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                      Browse Shop
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
