/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Logo({ className = "", variant = "light" }: { className?: string, variant?: "light" | "dark" }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src="/logo.png" 
        alt="Nayem's Online Shop Logo" 
        className="h-12 w-auto object-contain"
        onError={(e) => {
          // Fallback if image not found
          e.currentTarget.src = 'https://placehold.co/200x200/white/orange?text=Nayem%27s';
        }}
      />
    </div>
  );
}
