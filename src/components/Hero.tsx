/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="hero" className="relative md:h-[80vh] min-h-[500px] flex items-center overflow-hidden bg-gray-50">
      <div className="absolute inset-0 block md:hidden opacity-20">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
          alt="Fashion Background"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
              alt="Fashion Hero"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="max-w-2xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                }
              }
            }}
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="font-serif text-6xl md:text-8xl text-gray-900 leading-[1.1] tracking-tight mb-8"
            >
              Redefining <span className="text-rose-600 block italic">Elegance.</span>
            </motion.h1>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed"
            >
              Discover Nayem's exclusive collection of premium clothing. From traditional Panjabis to modern designer sarees.
            </motion.p>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-rose-600 transition-all duration-300 group shadow-lg shadow-gray-900/10 hover:shadow-rose-600/20"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
              >
                Track Order
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
