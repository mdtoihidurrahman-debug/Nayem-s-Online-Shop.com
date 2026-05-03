/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Men' | 'Women' | 'Kids' | 'General';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 
  | 'bKash' 
  | 'Nagad' 
  | 'Rocket' 
  | 'Bank Transfer' 
  | 'Visa' 
  | 'Mastercard';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: any;
  trackingNumber: string;
}
