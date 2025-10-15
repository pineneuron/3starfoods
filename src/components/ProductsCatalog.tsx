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
}

export interface Category {
  id: string;
  name: string;
  products: ProductItem[];
}

interface ProductsCatalogProps {
  categories: Category[];
}

export default function ProductsCatalog({ categories }: ProductsCatalogProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id ?? '');
  const { addItem } = useCart();

  useEffect(() => {
    function onSetCategory(e: Event) {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setActiveCategoryId(custom.detail);
      }
    }
    window.addEventListener('tsf:set-category', onSetCategory as EventListener);
    return () => {
      window.removeEventListener('tsf:set-category', onSetCategory as EventListener);
    };
  }, []);

  useEffect(() => {
    const evt = new CustomEvent('tsf:active-category-changed', { detail: activeCategoryId });
    window.dispatchEvent(evt);
  }, [activeCategoryId]);

  function handleAddToCart(p: ProductItem) {
    addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, discountPercent: p.discountPercent, image: p.image }, 1);
    window.dispatchEvent(new CustomEvent('tsf:cart-open'));
  }

  return (
    <div className="tsf-product_heading py-10" suppressHydrationWarning>
      <div className="flex justify-between items-center">
        <div className="mb-10">
          <ul className="flex flex-wrap text-xl text-center" role="tablist">
            {categories.map((cat, idx) => {
              const isActive = cat.id === activeCategoryId;
              const baseClasses = 'inline-block py-5 px-8 capitalize cursor-pointer tsf-font-sora';
              const rounded = idx === 0 ? ' rounded-l-full' : idx === categories.length - 1 ? ' rounded-r-full' : '';
              const activeClasses = isActive ? ' tsf-bg-red text-white' : '';
              return (
                <li key={cat.id} className="me-2" role="presentation">
                  <button
                    className={baseClasses + rounded + activeClasses}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-tabs-target={`#styled-${cat.id}`}
                    onClick={() => setActiveCategoryId(cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {categories.map((cat) => {
        const isActive = cat.id === activeCategoryId;
        return (
          <div key={cat.id} id={`styled-${cat.id}`} className={isActive ? 'block rounded-lg' : 'hidden rounded-lg'} role="tabpanel">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cat.products.map((p) => {
                const hasDiscount = p.discountPercent > 0;
                const discountedPrice = hasDiscount
                  ? Math.round(p.price * (1 - p.discountPercent / 100))
                  : p.price;
                return (
                  <div className="tsf-product_list" key={p.id}>
                    <figure className="tsf-box-shodow tsf-font-bebas">
                      <div className="tsf-product-img">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}>
                          <img src={p.image} alt={p.name} className="rounded-t-md" />
                        </a>
                      </div>
                      <figcaption className="p-5 text-center rounded-t-md">
                        <div className="tsf-product-name">
                          <a className="text-3xl capitalize" href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}>{p.name}</a>
                        </div>
                        <div className="price text-xl font-normal py-4">
                          RS {p.price.toFixed(2)} -{' '}
                          <span className="pre-price tsf-text-color tsf-font-bebas">
                            RS {discountedPrice.toFixed(2)} ({p.unit})
                          </span>
                          {hasDiscount && (
                            <span className="tsf-discount tsf-bgred-color text-md text-white font-normal rounded-sm p-1 ml-2">
                              {p.discountPercent}%
                            </span>
                          )}
                        </div>
                        <div className="tsf-add_cart mt-2">
                          <a className="tsf-button uppercase inline-block text-2xl" href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}>add to cart</a>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
