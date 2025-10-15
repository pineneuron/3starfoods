'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  discountPercent: number;
  image: string;
}

export interface CartLineItem extends CartProduct {
  qty: number;
}

interface CartContextValue {
  items: CartLineItem[];
  addItem: (product: CartProduct, qty?: number) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  function addItem(product: CartProduct, qty: number = 1) {
    setItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { ...product, qty }];
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(p => p.id !== id));
  }

  function increment(id: string) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  }

  function decrement(id: string) {
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p));
  }

  function clear() {
    setItems([]);
  }

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
    total
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
