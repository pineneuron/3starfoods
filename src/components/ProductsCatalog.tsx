'use client';

import { useEffect, useState, useRef } from 'react';
import ProductModal from './ProductModal';
import Image from 'next/image';

export interface ProductVariation {
  name: string;
  price: number;
  discountPercent?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  discountPercent: number;
  image: string;
  images?: string[];
  shortDescription?: string;
  variations?: ProductVariation[];
  defaultVariation?: string;
  featured?: boolean;
  bestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  products: ProductItem[];
}

interface ProductsCatalogProps {
  categories: Category[];
}

export default function ProductsCatalog({ categories }: ProductsCatalogProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id ?? '');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onSetCategory(e: Event) {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setActiveCategoryId(custom.detail);
        
        // Scroll to products section if not already visible
        const productHeading = document.querySelector('.tsf-product_heading') as HTMLElement | null;
        const headerEl = document.querySelector('header') as HTMLElement | null;
        const headerHeight = headerEl?.offsetHeight ?? 0;
        
        if (productHeading) {
          const rect = productHeading.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - headerHeight - 20; // 20px extra spacing
          
          // Only scroll if the section is not already in view
          if (rect.top < headerHeight + 50 || rect.top > window.innerHeight) {
            window.scrollTo({
              top: targetY,
              behavior: 'smooth'
            });
          }
        }
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

  function handleProductClick(p: ProductItem) {
    setSelectedProduct(p);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    // Scroll to products section
    setTimeout(() => {
      // Get dropdown height on mobile (if visible)
      const dropdownHeight = dropdownRef.current && window.innerWidth < 768 ? dropdownRef.current.offsetHeight : 0;
      
      // Find the products grid container (first visible category content)
      const productsGrid = document.querySelector('.tsf-product_heading .grid') as HTMLElement | null;
      
      if (productsGrid) {
        const rect = productsGrid.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - dropdownHeight - 20;
        
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="tsf-product_heading" suppressHydrationWarning>
      {/* Mobile Dropdown - Sticky */}
      <div ref={dropdownRef} className="sticky top-0 z-40 bg-white shadow-md md:hidden mb-6 -mx-4 px-4 py-3">
        <div className="relative">
          <select
            value={activeCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-full px-6 py-3.5 capitalize cursor-pointer tsf-font-sora text-base font-semibold appearance-none focus:outline-none focus:border-[#FF4900] bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 text-gray-500">
              <path fillRule="evenodd" d="M10 12a1 1 0 0 1-.7-.29l-4-4a1 1 0 1 1 1.4-1.42L10 9.59l3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4A1 1 0 0 1 10 12Z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex justify-center items-center mb-10">
        <div className="w-full">
          <ul className="flex flex-wrap justify-center gap-3 text-center" role="tablist">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <li key={cat.id} role="presentation">
                  <button
                    className={`
                      relative inline-block px-8 py-3.5 capitalize cursor-pointer tsf-font-sora
                      text-base font-semibold rounded-full min-w-[140px]
                      transition-all duration-300 ease-in-out transform
                      ${isActive 
                        ? 'bg-[#FF4900] text-white shadow-lg shadow-[#FF4900]/40 scale-105' 
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF4900] hover:text-[#FF4900] hover:bg-gray-50 hover:shadow-md active:scale-95'
                      }
                    `}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-tabs-target={`#styled-${cat.id}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <span className="relative z-10 whitespace-nowrap">{cat.name}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {cat.products.map((p) => {
                const hasDiscount = p.discountPercent > 0;
                const discountedPrice = hasDiscount
                  ? Math.round(p.price * (1 - p.discountPercent / 100))
                  : p.price;
                return (
                  <div className="tsf-product_list h-full" key={p.id}>
                    <figure className="tsf-box-shadow tsf-font-bebas h-full flex flex-col">
                      <div className="tsf-wrapper">
                        <div className="tsf-product-img">
                          <a href="#" onClick={(e) => { e.preventDefault(); handleProductClick(p); }}>
                            <Image src={p.image} alt={p.name} width={300} height={200} className="rounded-t-md cursor-pointer w-full h-auto" />
                          </a>
                        </div>
                      </div>
                      <figcaption className="p-5 text-center rounded-t-md flex flex-col flex-grow">
                        <div className="tsf-product-name">
                          <a
                            className="text-3xl capitalize cursor-pointer"
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleProductClick(p); }}
                          >
                            {p.name}
                          </a>
                        </div>
                        <div className="price text-xl font-normal py-4">
                          {hasDiscount ? (
                            <>
                              <span className="pre-price tsf-text-color tsf-font-bebas line-through">
                                RS {p.price.toFixed(2)}
                              </span>
                              {' '}
                              <span className="text-red-600 font-bold">
                                RS {discountedPrice.toFixed(2)}
                              </span>
                              {' '}
                              <span className="tsf-discount tsf-bgred-color text-md text-white font-normal rounded-sm p-1 ml-2">
                                {p.discountPercent}%
                              </span>
                            </>
                          ) : (
                            <span>
                              RS {p.price.toFixed(2)}
                            </span>
                          )}
                          {' '}({p.unit})
                        </div>
                        <div className="tsf-add_cart mt-auto pt-2">
                          <a
                            className="tsf-button holographic-card uppercase inline-block text-2xl cursor-pointer"
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleProductClick(p); }}
                          >
                            view details
                          </a>
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
}
