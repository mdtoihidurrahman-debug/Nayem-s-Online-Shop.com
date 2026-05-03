/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Premium Silk Panjabi',
    description: 'Elegant and comfortable Panjabi made from high-quality mixed silk. Perfect for weddings and festivals.',
    price: 3500,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800',
    stock: 15,
  },
  {
    id: 'm2',
    name: 'Classic White Formal Shirt',
    description: 'Crisp white formal shirt made from pure Egyptian cotton. Tailored fit for a sharp look.',
    price: 1800,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    stock: 20,
  },
  {
    id: 'w1',
    name: 'Designer Jamdani Saree',
    description: 'Exquisite hand-woven Dhakai Jamdani saree with intricate floral motifs. A masterpiece of craftsmanship.',
    price: 12000,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1610030469915-9a88edc1c307?auto=format&fit=crop&q=80&w=800',
    stock: 5,
  },
  {
    id: 'w2',
    name: 'Embroidered Salwar Kameez',
    description: 'Stylish three-piece set with heavy thread work and mirror detailing on Georgette fabric.',
    price: 4500,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    stock: 10,
  },
  {
    id: 'k1',
    name: 'Kids Cotton Kurta Set',
    description: 'Soft and breathable cotton Kurta set for boys. Gentle on skin and easy to move in.',
    price: 1200,
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bbe197c904?auto=format&fit=crop&q=80&w=800',
    stock: 25,
  },
  {
    id: 'k2',
    name: 'Floral Print Party Dress',
    description: 'Charming floral print dress for girls with a satin bow. Perfect for birthdays.',
    price: 2200,
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
    stock: 12,
  },
];

export const CATEGORIES = ['All', 'Men', 'Women', 'Kids'] as const;

export const CONTACT_INFO = {
  email: 'mdtoihidurrahman@gmail.com',
  facebook: 'https://www.facebook.com/share/18XnJZREYG/',
  instagram: 'https://www.instagram.com/nayem0172026?igsh=YTc1Nm5hMTB4Z3pk',
  tiktok: 'https://www.tiktok.com/@nayems_onlineshop?_r=1&_t=ZS-9633t1fA2ya',
};
