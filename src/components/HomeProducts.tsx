'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  discountPercent: number;
  image: string;
  featured?: boolean;
  bestseller?: boolean;
}

interface HomeProductsProps {
  products: ProductItem[];
  type: 'featured' | 'bestseller';
}

// Wrapper component that safely uses cart context
function HomeProductsWithCart({ products, type }: HomeProductsProps) {
  const { addItem } = useCart();

  const handleAddToCart = (product: ProductItem) => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      unit: product.unit, 
      discountPercent: product.discountPercent, 
      image: product.image 
    }, 1);
    window.dispatchEvent(new CustomEvent('tsf:cart-open'));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const hasDiscount = product.discountPercent > 0;
        const discountedPrice = hasDiscount
          ? Math.round(product.price * (1 - product.discountPercent / 100))
          : product.price;
        
        return (
          <div className="tsf-product_list" key={product.id}>
            <figure className="tsf-box-shodow tsf-font-bebas">
              <div className="tsf-product-img">
                <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                  <img src={product.image} alt={product.name} className="rounded-t-md" />
                </a>
              </div>
              <figcaption className="p-5 text-center rounded-t-md">
                <div className="tsf-product-name">
                  <a className="text-3xl capitalize" href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                    {product.name}
                  </a>
                </div>
                <div className="price text-xl font-normal py-4">
                  RS {product.price.toFixed(2)} -{' '}
                  <span className="pre-price tsf-text-color tsf-font-bebas">
                    RS {discountedPrice.toFixed(2)} ({product.unit})
                  </span>
                  {hasDiscount && (
                    <span className="tsf-discount tsf-bgred-color text-md text-white font-normal rounded-sm p-1 ml-2">
                      {product.discountPercent}%
                    </span>
                  )}
                </div>
                <div className="tsf-add_cart mt-2">
                  <button 
                    className="tsf-button uppercase inline-block text-2xl" 
                    onClick={() => handleAddToCart(product)}
                  >
                    add to cart
                  </button>
                </div>
              </figcaption>
            </figure>
          </div>
        );
      })}
    </div>
  );
}

// Main component that handles cart context safely
export default function HomeProducts({ products, type }: HomeProductsProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR, render without cart functionality
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const hasDiscount = product.discountPercent > 0;
          const discountedPrice = hasDiscount
            ? Math.round(product.price * (1 - product.discountPercent / 100))
            : product.price;
          
          return (
            <div className="tsf-product_list" key={product.id}>
              <figure className="tsf-box-shodow tsf-font-bebas">
                <div className="tsf-product-img">
                  <img src={product.image} alt={product.name} className="rounded-t-md" />
                </div>
                <figcaption className="p-5 text-center rounded-t-md">
                  <div className="tsf-product-name">
                    <span className="text-3xl capitalize">{product.name}</span>
                  </div>
                  <div className="price text-xl font-normal py-4">
                    RS {product.price.toFixed(2)} -{' '}
                    <span className="pre-price tsf-text-color tsf-font-bebas">
                      RS {discountedPrice.toFixed(2)} ({product.unit})
                    </span>
                    {hasDiscount && (
                      <span className="tsf-discount tsf-bgred-color text-md text-white font-normal rounded-sm p-1 ml-2">
                        {product.discountPercent}%
                      </span>
                    )}
                  </div>
                  <div className="tsf-add_cart mt-2">
                    <button className="tsf-button uppercase inline-block text-2xl" disabled>
                      add to cart
                    </button>
                  </div>
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>
    );
  }

  // After client-side hydration, render with cart functionality
  return <HomeProductsWithCart products={products} type={type} />;
}
