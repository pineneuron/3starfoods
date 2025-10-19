'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  discountPercent: number;
  image: string;
  variation?: string;
}

export interface CartLineItem extends CartProduct {
  qty: number;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
}

interface CartContextValue {
  items: CartLineItem[];
  appliedCoupon: AppliedCoupon | null;
  addItem: (product: CartProduct, qty?: number) => void;
  removeItem: (id: string, variation?: string) => void;
  increment: (id: string, variation?: string) => void;
  decrement: (id: string, variation?: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; coupon?: Coupon }>;
  removeCoupon: () => void;
  subtotal: number;
  total: number;
  discountAmount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tsf-cart');
      if (savedCart) {
        const { items: savedItems, appliedCoupon: savedCoupon } = JSON.parse(savedCart);
        setItems(savedItems || []);
        setAppliedCoupon(savedCoupon || null);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items or appliedCoupon changes
  useEffect(() => {
    try {
      localStorage.setItem('tsf-cart', JSON.stringify({ items, appliedCoupon }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items, appliedCoupon]);

  function addItem(product: CartProduct, qty: number = 1) {
    setItems(prev => {
      // Create a unique key that includes both product ID and variation
      const uniqueKey = product.variation ? `${product.id}-${product.variation}` : product.id;
      const existing = prev.find(p => {
        const pKey = p.variation ? `${p.id}-${p.variation}` : p.id;
        return pKey === uniqueKey;
      });
      
      if (existing) {
        return prev.map(p => {
          const pKey = p.variation ? `${p.id}-${p.variation}` : p.id;
          return pKey === uniqueKey ? { ...p, qty: p.qty + qty } : p;
        });
      }
      return [...prev, { ...product, qty }];
    });
  }

  function removeItem(id: string, variation?: string) {
    setItems(prev => {
      if (variation) {
        return prev.filter(p => !(p.id === id && p.variation === variation));
      }
      return prev.filter(p => p.id !== id);
    });
  }

  function increment(id: string, variation?: string) {
    setItems(prev => prev.map(p => {
      if (variation) {
        return (p.id === id && p.variation === variation) ? { ...p, qty: p.qty + 1 } : p;
      }
      return p.id === id ? { ...p, qty: p.qty + 1 } : p;
    }));
  }

  function decrement(id: string, variation?: string) {
    setItems(prev => prev.map(p => {
      if (variation) {
        return (p.id === id && p.variation === variation) ? { ...p, qty: Math.max(1, p.qty - 1) } : p;
      }
      return p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p;
    }));
  }

  function clear() {
    setItems([]);
    setAppliedCoupon(null);
  }

  async function applyCoupon(code: string): Promise<{ success: boolean; message: string; coupon?: Coupon }> {
    try {
      const response = await fetch('/data/coupon_codes.json');
      const data = await response.json();
      
      const coupon = data.coupons.find((c: Coupon) => c.code.toUpperCase() === code.toUpperCase());
      
      if (!coupon) {
        return { success: false, message: 'Invalid coupon code' };
      }

      if (!coupon.isActive) {
        return { success: false, message: 'This coupon is not active' };
      }

      const now = new Date();
      const startDate = new Date(coupon.startDate);
      const endDate = new Date(coupon.endDate);

      if (now < startDate) {
        return { success: false, message: 'This coupon is not yet valid' };
      }

      if (now > endDate) {
        return { success: false, message: 'This coupon has expired' };
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return { success: false, message: 'This coupon has reached its usage limit' };
      }

      const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
      
      if (subtotal < coupon.minOrderAmount) {
        return { 
          success: false, 
          message: `Minimum order amount of Rs. ${coupon.minOrderAmount} required for this coupon` 
        };
      }

      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (subtotal * coupon.value) / 100;
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      } else {
        discountAmount = Math.min(coupon.value, coupon.maxDiscountAmount);
      }

      setAppliedCoupon({ coupon, discountAmount });
      return { success: true, message: 'Coupon applied successfully!', coupon };
    } catch {
      return { success: false, message: 'Error applying coupon. Please try again.' };
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
  }

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);
  const discountAmount = useMemo(() => appliedCoupon?.discountAmount || 0, [appliedCoupon]);
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const value: CartContextValue = {
    items,
    appliedCoupon,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
    applyCoupon,
    removeCoupon,
    subtotal,
    total,
    discountAmount
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
