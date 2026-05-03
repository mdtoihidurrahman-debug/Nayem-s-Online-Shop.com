/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
      id={`product-${product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-gray-900 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-gray-900">
            ৳ {product.price.toLocaleString()}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddToCart(product)}
            className="p-3.5 bg-gray-900 text-white rounded-2xl hover:bg-rose-600 transition-all duration-300 flex items-center gap-2 group/btn shadow-lg shadow-gray-900/10 hover:shadow-rose-600/20"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="max-w-0 overflow-hidden group-hover/btn:max-w-[100px] transition-all duration-500 whitespace-nowrap text-sm font-bold uppercase tracking-tight">
              Add to Cart
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
