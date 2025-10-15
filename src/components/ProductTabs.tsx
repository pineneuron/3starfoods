'use client';

import { useState } from 'react';

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bestseller');

  const tabs = [
    { id: 'bestseller', label: 'bestseller', content: 'bestseller' },
    { id: 'featured', label: 'featured', content: 'featured' }
  ];

  const bestsellerProducts = [
    {
      id: 1,
      name: 'chicken sausage bratwurst',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      discount: '10%',
      image: '/images/product01.svg'
    },
    {
      id: 2,
      name: 'basa fish steaks',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product02.svg'
    },
    {
      id: 3,
      name: 'chicken drumstick',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product03.svg'
    },
    {
      id: 4,
      name: 'chicken gizzard',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product04.svg'
    },
    {
      id: 5,
      name: 'chicken gizzard',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product04.svg'
    },
    {
      id: 6,
      name: 'chicken drumstick',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product03.svg'
    },
    {
      id: 7,
      name: 'chicken sausage bratwurst',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product01.svg'
    },
    {
      id: 8,
      name: 'basa fish steaks',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product02.svg'
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'chicken gizzard',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product04.svg'
    },
    {
      id: 2,
      name: 'chicken drumstick',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product03.svg'
    },
    {
      id: 3,
      name: 'chicken sausage bratwurst',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product01.svg'
    },
    {
      id: 4,
      name: 'basa fish steaks',
      price: 'RS 380.00',
      originalPrice: 'RS 342.00',
      image: '/images/product02.svg'
    }
  ];

  const currentProducts = activeTab === 'bestseller' ? bestsellerProducts : featuredProducts;

  return (
    <div className="tsf-product py-20" suppressHydrationWarning>
      <div className="container mx-auto px-10">
        <div className="tsf-product_heading py-10">
          <div className="flex justify-between items-center">
            <div className="mb-4">
              <ul className="flex flex-wrap -mb-px text-3xl font-medium text-center" role="tablist">
                {tabs.map((tab) => (
                  <li key={tab.id} className="me-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg tsf-font-bebas ${
                        activeTab === tab.id
                          ? 'tsf-dark-color border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tsf-all_more text-right">
              <a className="text-3xl capitalize tsf-border_bottom tsf-font-bebas" href="/products">all products</a>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="rounded-lg">
              <div className="grid grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div key={product.id} className="tsf-product_list">
                    <figure className="tsf-box-shodow tsf-font-bebas">
                      <div className="tsf-product-img">
                        <a href="#">
                          <img src={product.image} alt={product.name} className="rounded-t-md" />
                        </a>
                      </div>
                      <figcaption className="p-5 text-center rounded-t-md">
                        <div className="tsf-product-name">
                          <a className="text-3xl capitalize" href="">{product.name}</a>
                        </div>
                        <div className="price text-xl font-normal py-4">
                          {product.price} - <span className="pre-price tsf-text-color tsf-font-bebas">{product.originalPrice} (per kg)</span>
                          {product.discount && (
                            <span className="tsf-discount tsf-bgred-color text-md text-white font-normal rounded-sm p-1 ml-2">{product.discount}</span>
                          )}
                        </div>
                        <div className="tsf-add_cart mt-2">
                          <a className="tsf-button uppercase inline-block text-2xl" href="#">add to cart</a>
                        </div>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
