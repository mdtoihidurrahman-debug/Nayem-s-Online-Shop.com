/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import SEO from '../components/SEO';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

export default function TrackOrder() {
  const location = useLocation();
  const { getOrder } = useOrders();
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fromState = (location.state as any)?.trackingNumber;
    if (fromState) {
      setTrackingId(fromState);
      const found = getOrder(fromState);
      setOrder(found || null);
      setSearched(true);
    }
  }, [location.state, getOrder]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const found = getOrder(trackingId);
    setOrder(found || null);
    setSearched(true);
  };

  const statusSteps = [
    { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Processing', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Shipped', icon: Truck, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Delivered', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.label === order?.status);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Track Your Order" 
        description="Check the real-time status of your Nayem's Online Shop order using your tracking ID."
      />
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-gray-600">Enter your tracking number to see your order status.</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-16">
        <input
          type="text"
          placeholder="Enter Tracking Number (e.g. NY-XXXXXX)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
          className="w-full pl-6 pr-32 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-xl focus:border-rose-500 focus:ring-0 transition-all font-mono tracking-wider"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-8 bg-gray-900 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors flex items-center gap-2"
        >
          <Search className="h-5 w-5" />
          Track
        </button>
      </form>

      <AnimatePresence mode="wait">
        {searched && order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Status Progress */}
            <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gray-100 -z-10" />
                
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStatusIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive ? `${step.bg} ${step.color}` : 'bg-gray-50 text-gray-300'
                      } ${isActive && index === currentStatusIndex ? 'ring-4 ring-rose-100' : ''}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-left md:text-center">
                        <p className={`text-sm font-bold tracking-wide uppercase ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {isActive && index === currentStatusIndex && (
                          <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">Current Status</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm">
                <h3 className="font-serif text-xl mb-6">Delivery Information</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Customer</p>
                      <p className="text-gray-900 font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Order Date</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CreditCard className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Payment Method</p>
                      <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm">
                <h3 className="font-serif text-xl mb-6">Order Summary</h3>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-bold text-gray-900">৳ {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-end">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total</p>
                  <p className="text-2xl font-bold text-rose-600">৳ {(order.total + 80).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {searched && !order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
          >
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-serif text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find an order with the tracking number <span className="font-mono font-bold text-gray-900">{trackingId}</span>. Please check for typos.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
