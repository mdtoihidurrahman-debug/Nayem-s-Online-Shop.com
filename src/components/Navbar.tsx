/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, Search, Menu, X, User, Package } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { LogOut, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface NavbarProps {
  cartCount: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Track Order', path: '/track' },
  ];

  if (user?.email === CONTACT_INFO.email) {
    navLinks.push({ name: 'Admin Panel', path: '/admin' });
    navLinks.push({ name: 'Sells dashboard', path: '/admin?tab=dashboard' });
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      id="navbar" 
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo className="scale-90" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                  location.pathname === link.path ? 'text-rose-600' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button id="search-btn" className="hidden sm:block p-2 text-gray-600 hover:text-rose-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:text-rose-600 transition-colors relative"
              id="cart-btn"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-rose-600 text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group flex items-center gap-2">
                <button className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-full transition-all">
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-xs overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img 
                        src={profile.avatarUrl} 
                        alt={profile.displayName} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      profile?.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">My Account</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{profile?.displayName || user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link 
                    to="/profile?tab=orders" 
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                  {user.email === CONTACT_INFO.email && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="p-2 text-gray-600 hover:text-rose-600 transition-colors flex items-center gap-1"
                title="Profile"
              >
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all">
                  <User className="h-4 w-4" />
                </div>
              </Link>
            )}

            <button
              id="mobile-menu-btn"
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-4 text-base font-medium border-b border-gray-50 ${
                    location.pathname === link.path ? 'text-rose-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-4 text-base font-medium border-b border-gray-50 text-gray-600 flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-4 text-base font-medium border-b border-gray-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-4 text-base font-medium border-b border-gray-50 text-gray-600 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In / Profile
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
