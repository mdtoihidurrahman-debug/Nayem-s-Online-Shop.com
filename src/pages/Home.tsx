/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { CONTACT_INFO } from '../constants';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div id="home-page">
      <SEO 
        title="Nayem's Online Shop | Home" 
        description="Shop the latest premium clothing collections for men, women, and kids at Nayem's Online Shop. Best quality fashion in Bangladesh."
      />
      <Hero />
      
      {/* Featured Collections */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-rose-600 font-bold tracking-widest uppercase text-xs mb-3 block">Curated Selection</span>
            <h2 className="font-serif text-4xl text-gray-900">Featured Collections</h2>
          </div>
          <Link to="/shop" className="text-gray-900 font-medium hover:text-rose-600 transition-colors flex items-center gap-2 group">
            View All Products
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} onAddToCart={addToCart} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-gray-50 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            {[
              { icon: "✨", title: "Premium Quality", desc: "We source the finest fabrics from local weavers and global suppliers to ensure lasting quality." },
              { icon: "🚚", title: "Fast Delivery", desc: "Get your favorite pieces delivered to your doorstep within 48-72 hours across Bangladesh." },
              { icon: "🛡️", title: "Secure Payments", desc: "Pay with confidence using bKash, Nagad, or traditional banking methods with encrypted security." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 }
                }}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transition-shadow group-hover:shadow-xl"
                >
                  <span className="text-2xl">{value.icon}</span>
                </motion.div>
                <h3 className="font-serif text-xl mb-4">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Connect Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="py-24 max-w-3xl mx-auto px-4 text-center"
      >
        <h2 className="font-serif text-4xl text-gray-900 mb-6">Let's Stay Connected</h2>
        <p className="text-gray-600 mb-12">
          Join our community on social media for the latest arrivals, exclusive offers, and styling tips.
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <motion.a 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl font-bold hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:shadow-lg"
          >
            <Facebook className="h-6 w-6" />
            Facebook
          </motion.a>
          <motion.a 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-[#E4405F]/10 text-[#E4405F] rounded-2xl font-bold hover:bg-[#E4405F] hover:text-white transition-all shadow-sm hover:shadow-lg"
          >
            <Instagram className="h-6 w-6" />
            Instagram
          </motion.a>
          <motion.a 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={CONTACT_INFO.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-black rounded-2xl font-bold hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.59-5.71-.29-2.63.85-5.21 2.86-6.93 1.47-1.26 3.39-1.93 5.32-1.78.01 1.4 0 2.81 0 4.21-.87-.3-1.84-.33-2.69.09-1.08.49-1.85 1.57-1.95 2.76-.07 1.25.56 2.47 1.57 3.14.79.52 1.77.71 2.71.65 1.19-.01 2.37-.59 3-1.6.43-.65.65-1.42.66-2.21-.01-5.72-.01-11.45-.01-17.17z" />
            </svg>
            TikTok
          </motion.a>
          <motion.a 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 px-8 py-4 bg-amber-100 text-amber-600 rounded-2xl font-bold hover:bg-amber-600 hover:text-white transition-all shadow-sm hover:shadow-lg"
          >
            <Mail className="h-6 w-6" />
            Email Us
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
}
