/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Logo from './Logo';
import { useCart } from '../hooks/useCart';
import { CONTACT_INFO } from '../constants';
import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { cart } = useCart();
  const { user } = useAuth();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = user?.email === CONTACT_INFO.email;

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cartCount} />
      <main id="main-content">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Logo variant="dark" className="!items-start mb-6" />
              <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
                Your destination for premium Bangladeshi fashion. We blend tradition with contemporary style for every occasion.
              </p>
              <div className="flex space-x-6">
                <a href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-500 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href={CONTACT_INFO.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  {/* Using MessageCircle as a generic substitute for TikTok if icon missing, 
                      though many lucide versions have it now. Let's use a custom path if needed, 
                      but standard icons are safer. */}
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-6 w-6"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Categories</h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/shop?cat=Men" className="hover:text-amber-500 transition-colors">Men's Collection</a></li>
                <li><a href="/shop?cat=Women" className="hover:text-amber-500 transition-colors">Women's Collection</a></li>
                <li><a href="/shop?cat=Kids" className="hover:text-amber-500 transition-colors">Kids' Collection</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/track" className="hover:text-amber-500 transition-colors">Track Order</a></li>
                <li>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </a>
                </li>
                {isAdmin && (
                  <>
                    <li><a href="/admin" className="hover:text-amber-500 transition-colors">Admin Panel</a></li>
                    <li><a href="/admin?tab=dashboard" className="hover:text-amber-500 transition-colors">Sells dashboard</a></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Nayem's Online Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
