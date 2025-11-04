'use client';

import Image from 'next/image';
import Link from 'next/link';

const CategoryGridV1: React.FC = () => {
  return (
    <div className="tsf-category relative tsf-bg-primary py-20 mt-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-category_heading">
            <h2 className="tsf-dark-color text-4xl font-bold z-10">explore by category</h2>
          </div>
          <div className="grid grid-cols-6 gap-8">
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category01.svg" alt="category01" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Ham & Cutlet</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category02.svg" alt="category02" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Frozen Momo</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category03.svg" alt="category03" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Salami</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category04.svg" alt="category04" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Sausage</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category05.svg" alt="category05" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Mutton Items</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category06.svg" alt="category06" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Burger Patty</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category04.svg" alt="category04" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Chicken Items</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category03.svg" alt="category03" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Buff Items</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category02.svg" alt="category02" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Pork Items</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category03.svg" alt="category03" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Ready to Eat</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category01.svg" alt="category01" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Ham & Cutlet</h3>
              </Link>
            </div>
            <div className="tsf-category-item mt-10 m-auto text-center">
              <Link href="/products">
                <div className="rounded-full">
                  <Image src="/images/category03.svg" alt="category03" width={60} height={60} />
                </div>
                <h3 className="text-2xl font-bold capitalize mt-4">Ham & Cutlet</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CategoryGridV1;
