/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addOrder = async (orderData: Partial<Order>) => {
    try {
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const getOrder = (trackingNumber: string) => {
    return orders.find((o) => o.trackingNumber === trackingNumber);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  return { orders, addOrder, getOrder, updateOrderStatus, loading };
}
