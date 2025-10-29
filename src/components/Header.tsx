'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import MaintenanceModal from './MaintenanceModal';
import Image from 'next/image';

interface HeaderProps {
  variant?: 'home' | 'inner';
}

export default function Header({ variant = 'home' }: HeaderProps) {
  const pathname = usePathname();
  const { items } = useCart();
  
  // Calculate total cart count
  const cartCount = items.reduce((total, item) => total + item.qty, 0);
  
  const isHome = variant === 'home';
  const headerClass = isHome 
    ? 'tsf-bg-black home tsf-box-shodow relative'
    : 'tsf-bg-white inner-header tsf-box-shodow relative';
  
  const navLinkClass = isHome 
    ? 'nav-link text-white capitalize'
    : 'nav-link text-black capitalize';
  
  const activeNavLinkClass = isHome 
    ? 'nav-link active text-white capitalize'
    : 'nav-link active text-black capitalize';
  
  const getLinkClass = (href: string) => (pathname === href ? activeNavLinkClass : navLinkClass);

  useEffect(() => {
    const timer = setTimeout(() => {
      const navIndicator = document.querySelector('.nav-indicator') as HTMLElement;
      if (navIndicator) {
        navIndicator.style.display = 'none';
        // Force reflow to ensure the display change takes effect
        void navIndicator.offsetHeight;
        navIndicator.style.display = '';
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  function openCart(e: React.MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('tsf:cart-open'));
  }

  return (
    <header className={headerClass} suppressHydrationWarning>
        <div className="container-fluid mx-auto px-10">
            <div className="flex justify-between items-center pt-4 pb-14">
                <div className="flex justify-start items-center flex-1">
                    <ul className="nav-menu flex justify-between items-center">
                        <li className="nav-item dropdown">
                            <Link href="/about" className={getLinkClass('/about') + ' pr-14'} data-index="1">about</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/products" className={getLinkClass('/products') + ' pr-14'} data-index="0">our
                                products</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/our-dealers" className={getLinkClass('/our-dealers') + ' pr-14'} data-index="2">our
                                dealers</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/contact" className={getLinkClass('/contact')} data-index="4">contact</Link>
                        </li>
                    </ul>
                    <div className="menu-toggle pl-8">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                </div>
                <div className="logo-wrap flex justify-center items-center flex-1">
                    <Link href="/" className="tsf-logo">
                        <Image src="/images/logo.svg" alt="logo" width={120} height={40} />
                    </Link>
                </div>
                <div className="flex-1 cart-icon">
                    <ul className="flex justify-end items-center gap-4">
                        <li>
                            <a href="#" onClick={openCart} className="relative">
                                <Image src={isHome ? '/images/cart.svg' : '/images/cart-b.svg'} alt="cart" width={24} height={24} className="pl-4" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#ff4900] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image src={isHome ? '/images/user.svg' : '/images/user-b.svg'} alt="user" width={24} height={24} className="pl-4" />
                            </a>
                        </li>
                        <li>
                            <a href="/api/todays-rate" target="_blank" className={`text-sm font-medium underline ${isHome ? 'text-white' : 'text-black'}`}>
                                Today&apos;s Rate
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      <MaintenanceModal />
    </header>
  );
}
