/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Shop() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="shop-page" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Shop Collections" 
        description="Browse our wide range of traditional and modern clothing. Filter by Men, Women, and Kids collections."
      />
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for clothes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <SlidersHorizontal className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 min-h-[400px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05
                }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-serif text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
