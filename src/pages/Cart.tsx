/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, PaymentMethod } from '../types';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'bKash' as PaymentMethod,
  });

  // Pre-populate if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: profile?.displayName || user.displayName || '',
      }));
    }
  }, [user, profile]);

  const [trackingNumber, setTrackingNumber] = useState('');

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newTrackingNumber = 'NY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const orderData: Partial<Order> = {
        items: [...cart],
        total: total + 80, // Including delivery charge
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        status: 'Pending',
        trackingNumber: newTrackingNumber,
        userId: user?.uid || 'guest',
      };
      
      await addOrder(orderData);
      setTrackingNumber(newTrackingNumber);
      setStep('success');
      clearCart();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-serif text-3xl text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for shopping with Nayem's Online Shop. Your order is being processed.
          </p>
          <div className="bg-gray-50 p-6 rounded-2xl mb-8">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Tracking Number</p>
            <p className="text-2xl font-mono font-bold text-rose-600">{trackingNumber}</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              to="/track"
              state={{ trackingNumber }}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
            >
              Track Order Status
            </Link>
            <Link
              to="/shop"
              className="w-full py-4 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => step === 'cart' ? navigate('/shop') : setStep('cart')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="font-serif text-3xl text-gray-900">
          {step === 'cart' ? 'Your Shopping Cart' : 'Checkout & Shipping'}
        </h1>
      </div>

      {cart.length === 0 && step === 'cart' ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 'cart' ? (
                <motion.div
                  key="cart-step"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-32 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <h3 className="font-serif text-lg text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">{item.category}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:text-rose-600"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:text-rose-600"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 uppercase text-xs mb-1">Price</p>
                          <p className="text-lg font-bold text-rose-600">৳ {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.form
                  key="checkout-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleCheckout}
                  className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Full Name</label>
                      <input
                        required
                        type="text"
                        className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all"
                        placeholder="e.g. Nayem Ahmed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email Address</label>
                      <input
                        required
                        type="email"
                        className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all"
                        placeholder="nayem@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Phone Number</label>
                      <input
                        required
                        type="tel"
                        className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all"
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Payment Method</label>
                      <select
                        className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                      >
                        <optgroup label="Mobile Banking">
                          <option value="bKash">bKash</option>
                          <option value="Nagad">Nagad</option>
                          <option value="Rocket">Rocket</option>
                        </optgroup>
                        <optgroup label="Bank Payment">
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Visa">Visa Card</option>
                          <option value="Mastercard">Master Card</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Delivery Address</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 transition-all resize-none"
                      placeholder="Street address, City, Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gray-900 text-white rounded-xl font-bold hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Order & Pay'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 p-8 rounded-3xl sticky top-24">
              <h2 className="font-serif text-2xl text-gray-900 mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>৳ 80</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">৳ {(total + 80).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {step === 'cart' && (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                >
                  Proceed to Checkout
                </button>
              )}
              <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
                By proceeding, you agree to Nayem's Online Shop Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
