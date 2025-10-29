'use client';

import { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import Image from 'next/image';

interface ProductVariation {
  name: string;
  price: number;
  discountPercent?: number;
}

interface DealProduct {
  id: string;
  name: string;
  slug: string;
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

// Wrapper component that safely uses cart context
function TodaysDealWithCart({ products }: { products: DealProduct[] }) {
  const [selectedProduct, setSelectedProduct] = useState<DealProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: DealProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="tsf-banner-list px-10 rounded-lg">
        <h2 className="tsf-dark-color text-4xl font-bold pb-5">Today&apos;s Deal</h2>
        <div className="tsf-banner-list-item tsf-box-shodow">
          {products.map((product, index) => {
            const hasDiscount = product.discountPercent > 0;
            const discountedPrice = hasDiscount
              ? Math.round(product.price * (1 - product.discountPercent / 100))
              : product.price;
            const isLast = index === products.length - 1;

            return (
              <div 
                key={product.id}
                className={`flex justify-start items-center tsf-font-bebas p-5 ${!isLast ? 'border-b border-gray-200' : ''}`}
              >
                <div className="tsf-product-img">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleProductClick(product); }}>
                    <Image src={product.image} alt={product.name} width={120} height={120} className="rounded-md cursor-pointer" />
                  </a>
                </div>
                <div className="pl-6 flex-1">
                  <div className="tsf-product-name">
                    <a 
                      className="text-2xl font-bold capitalize cursor-pointer hover:text-blue-600" 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); handleProductClick(product); }}
                    >
                      {product.name}
                    </a>
                  </div>
                  <div className="price text-md mt-2">
                    RS {product.price.toFixed(2)} -{' '}
                    <span className="pre-price text-gray-400">
                      RS {discountedPrice.toFixed(2)} ({product.unit})
                    </span>
                    {hasDiscount && (
                      <span className="tsf-discount tsf-bgred-color text-sm text-white font-normal rounded-sm p-1 ml-2">
                        {product.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </>
  );
}

const TodaysDeal: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [dealProducts, setDealProducts] = useState<DealProduct[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Load today's deal products from the JSON file
    const loadDealProducts = async () => {
      const response = await fetch('/data/products.json');
      const data = await response.json();
      
      // Get bestseller products for today's deals (only with real images)
      const allProducts = data.categories.flatMap((cat: { products: DealProduct[] }) => cat.products);
      const bestsellerProducts = allProducts
        .filter((product: DealProduct) => 
          product.bestseller === true && 
          product.image !== '/images/placeholder.png'
        )
        .slice(0, 3); // Take top 3 bestsellers with real images
      
      setDealProducts(bestsellerProducts);
    };

    loadDealProducts();
  }, []);

  // During SSR, render without cart functionality
  if (!isClient) {
    return (
      <div className="tsf-banner-list px-10 rounded-lg">
        <h2 className="tsf-dark-color text-4xl font-bold pb-5">Today&apos;s Deal</h2>
        <div className="tsf-banner-list-item tsf-box-shodow">
          {dealProducts.map((product, index) => {
            const hasDiscount = product.discountPercent > 0;
            const discountedPrice = hasDiscount
              ? Math.round(product.price * (1 - product.discountPercent / 100))
              : product.price;
            const isLast = index === dealProducts.length - 1;

            return (
              <div 
                key={product.id}
                className={`flex justify-start items-center tsf-font-bebas p-5 ${!isLast ? 'border-b border-gray-200' : ''}`}
              >
                <div className="tsf-product-img">
                  <Image src={product.image} alt={product.name} width={120} height={120} className="rounded-md" />
                </div>
                <div className="pl-6 flex-1">
                  <div className="tsf-product-name">
                    <span className="text-2xl font-bold capitalize">{product.name}</span>
                  </div>
                  <div className="price text-md mt-2">
                    RS {product.price.toFixed(2)} -{' '}
                    <span className="pre-price text-gray-400">
                      RS {discountedPrice.toFixed(2)} ({product.unit})
                    </span>
                    {hasDiscount && (
                      <span className="tsf-discount tsf-bgred-color text-sm text-white font-normal rounded-sm p-1 ml-2">
                        {product.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // After client-side hydration, render with cart functionality
  return <TodaysDealWithCart products={dealProducts} />;
};

export default TodaysDeal;
