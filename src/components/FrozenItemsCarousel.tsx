'use client';

import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import ProductModal from './ProductModal';
import Image from 'next/image';

interface ProductVariation {
  name: string;
  price: number;
  discountPercent?: number;
}

interface FrozenProduct {
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
}

// Wrapper component that safely uses cart context
function FrozenItemsWithCart({ products }: { products: FrozenProduct[] }) {
  const [selectedProduct, setSelectedProduct] = useState<FrozenProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: FrozenProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const options = {
    loop: true,
    margin: 20,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    }
  };

  return (
    <>
      <Carousel options={options}>
        {products.map((product) => {
          const hasDiscount = product.discountPercent > 0;
          const discountedPrice = hasDiscount
            ? Math.round(product.price * (1 - product.discountPercent / 100))
            : product.price;

          return (
            <div className="item" key={product.id}>
              <div className="tsf-product_list">
                <figure className="tsf-box-shodow tsf-font-bebas">
                  <div className="tsf-wrapper"> 
                    <div className="tsf-product-img">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleProductClick(product); }}>
                        <Image src={product.image} alt={product.name}
                          width={384} height={384} className="rounded-t-md cursor-pointer" />
                      </a>
                    </div>
                  </div>
                  <figcaption className="p-5 text-center rounded-t-md">
                    <div className="tsf-product-name">
                      <a 
                        className="text-3xl capitalize cursor-pointer" 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleProductClick(product); }}
                      >
                        {product.name}
                      </a>
                    </div>
                    <div className="price text-xl py-4">
                      RS {product.price.toFixed(2)} -{' '}
                      <span className="pre-price">
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
                        className="tsf-button holographic-card uppercase inline-block text-2xl cursor-pointer" 
                        onClick={() => handleProductClick(product)}
                      >
                        view details
                      </button>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          );
        })}
      </Carousel>
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
}

const FrozenItemsCarousel: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [frozenProducts, setFrozenProducts] = useState<FrozenProduct[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Load frozen products from the JSON file
    const loadFrozenProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        
        // Find vegetable category (frozen items)
        const vegetableCategory = data.categories.find((cat: { id: string; products: FrozenProduct[] }) => cat.id === 'vegetable');
        if (vegetableCategory) {
          setFrozenProducts(vegetableCategory.products.slice(0, 8)); // Take first 8 items
        }
      } catch (error) {
        console.error('Error loading frozen products:', error);
        // Fallback to static products if JSON fails
        setFrozenProducts([
          {
            id: 'frozen-peas',
            name: 'frozen peas',
            price: 180,
            unit: 'per kg',
            discountPercent: 0,
            image: '/images/category01.svg'
          },
          {
            id: 'frozen-corn',
            name: 'frozen corn',
            price: 160,
            unit: 'per kg',
            discountPercent: 5,
            image: '/images/category02.svg'
          },
          {
            id: 'frozen-mixed-veg',
            name: 'frozen mixed veg',
            price: 200,
            unit: 'per kg',
            discountPercent: 8,
            image: '/images/category06.svg'
          },
          {
            id: 'frozen-broccoli',
            name: 'frozen broccoli',
            price: 240,
            unit: 'per kg',
            discountPercent: 6,
            image: '/images/category05.svg'
          }
        ]);
      }
    };

    loadFrozenProducts();
  }, []);

  // During SSR, render without cart functionality
  if (!isClient) {
    const options = {
      loop: true,
      margin: 20,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 4 }
      }
    };

    return (
      <Carousel options={options}>
        {frozenProducts.map((product) => {
          const hasDiscount = product.discountPercent > 0;
          const discountedPrice = hasDiscount
            ? Math.round(product.price * (1 - product.discountPercent / 100))
            : product.price;

          return (
            <div className="item" key={product.id}>
              <div className="tsf-product_list">
                <figure className="tsf-box-shodow tsf-font-bebas">
                  <div className="tsf-wrapper">
                    <div className="tsf-product-img">
                      <Image src={product.image} alt={product.name}
                        width={384} height={384} className="rounded-t-md" />
                    </div>
                  </div>
                  <figcaption className="p-5 text-center rounded-t-md">
                    <div className="tsf-product-name">
                      <span className="text-3xl capitalize">{product.name}</span>
                    </div>
                    <div className="price text-xl py-4">
                      RS {product.price.toFixed(2)} -{' '}
                      <span className="pre-price">
                        RS {discountedPrice.toFixed(2)} ({product.unit})
                      </span>
                      {hasDiscount && (
                        <span className="tsf-discount tsf-bgred-color text-md text-white font-normal rounded-sm p-1 ml-2">
                          {product.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="tsf-add_cart mt-2">
                      <button className="tsf-button uppercase inline-block text-2xl cursor-pointer" disabled>
                        add to cart
                      </button>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          );
        })}
      </Carousel>
    );
  }

  // After client-side hydration, render with cart functionality
  return <FrozenItemsWithCart products={frozenProducts} />;
};

export default FrozenItemsCarousel;
