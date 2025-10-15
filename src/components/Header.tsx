'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  variant?: 'home' | 'inner';
}

export default function Header({ variant = 'home' }: HeaderProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLUListElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; left: number } | null>(null);
  
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
        navIndicator.offsetHeight;
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
                </div>
                <div className="logo-wrap flex justify-center items-center flex-1">
                    <Link href="/" className="tsf-logo">
                        <img src="/images/logo.svg" alt="logo" />
                    </Link>
                </div>
                <div className="flex-1 cart-icon">
                    <ul className="flex justify-end items-center gap-4">
                        <li>
                            <a href="#" onClick={openCart}>
                                <img src={isHome ? '/images/cart.svg' : '/images/cart-b.svg'} alt="cart" className="pl-4" />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src={isHome ? '/images/user.svg' : '/images/user-b.svg'} alt="user" className="pl-4" />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src={isHome ? '/images/search.svg' : '/images/search-b.svg'} alt="search" className="pl-4" />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="menu-toggle pl-8">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
        </div>
    </header>
  );
}
