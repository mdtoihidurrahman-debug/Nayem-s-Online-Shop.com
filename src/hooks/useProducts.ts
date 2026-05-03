/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nayem_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('nayem_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return { products, addProduct, deleteProduct, updateProduct };
}
