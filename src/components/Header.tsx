'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
// import MaintenanceModal from './MaintenanceModal';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useGeneralSettings } from '@/context/GeneralSettingsContext';

interface HeaderProps {
  variant?: 'home' | 'inner';
}

export default function Header({ variant = 'home' }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();
  const { data: session, status } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const generalSettings = useGeneralSettings();

  const { siteTitle } = generalSettings;
  const logoSrc = '/images/logo.svg';
  const logoAlt = siteTitle ? `${siteTitle} logo` : '3 Star Foods logo';

  const isAdmin = session?.user?.role === 'ADMIN';

  // Calculate total cart count (only after mount to avoid hydration mismatch)
  const cartCount = mounted ? items.reduce((total, item) => total + item.qty, 0) : 0;

  // Get user info for display
  const userName = session?.user?.name || '';
  const userImage = session?.user?.image;
  const firstName = userName.split(' ')[0] || '';
  const firstInitial = firstName.charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = variant === 'home';
  const headerClass = isHome
    ? 'tsf-bg-black home tsf-box-shadow relative'
    : 'tsf-bg-white inner-header tsf-box-shadow relative';

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

  function handleUserClick(e: React.MouseEvent) {
    e.preventDefault();
    if (status !== 'authenticated') {
      const cb = encodeURIComponent(pathname || '/');
      router.push(`/auth/login?callbackUrl=${cb}`);
      return;
    }
    setUserMenuOpen(v => !v);
  }

  function handleLogout() {
    setUserMenuOpen(false);
    signOut({ callbackUrl: '/' });
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    if (menuToggle && navMenu && navMenuWrapper) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navMenuWrapper.classList.remove('active');
      setMobileMenuOpen(false);

      // Reset hamburger animation
      const bars = document.querySelectorAll('.bar') as NodeListOf<HTMLElement>;
      if (bars[0]) bars[0].style.transform = 'none';
      if (bars[1]) bars[1].style.opacity = '1';
      if (bars[2]) bars[2].style.transform = 'none';
    }
  };

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    
    if (menuToggle && navMenu && navMenuWrapper) {
      const isActive = menuToggle.classList.contains('active');
      
      if (isActive) {
        closeMobileMenu();
      } else {
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        navMenuWrapper.classList.add('active');
        setMobileMenuOpen(true);

        // Animate hamburger
        const bars = document.querySelectorAll('.bar') as NodeListOf<HTMLElement>;
        if (bars[0]) bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        if (bars[1]) bars[1].style.opacity = '0';
        if (bars[2]) bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
      }
    }
  };

  useEffect(() => {
    // Sync with vanilla JS menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');

    if (menuToggle && navMenu && navMenuWrapper) {
      const handleToggle = () => {
        const isActive = navMenu.classList.contains('active');
        setMobileMenuOpen(isActive);

        // Sync wrapper class
        if (isActive) {
          navMenuWrapper.classList.add('active');
        } else {
          navMenuWrapper.classList.remove('active');
        }
      };

      // Listen for changes
      const observer = new MutationObserver(handleToggle);
      observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });

      // Initial check
      handleToggle();

      return () => observer.disconnect();
    }
  }, [pathname]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      closeMobileMenu();
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <header className={headerClass} suppressHydrationWarning>
        <div className="container-fluid mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center pt-4 pb-14">
            <div className="hidden md:flex justify-end items-center flex-1">
              {/* Desktop Navigation Menu */}
              <ul className="flex items-center gap-10">
                <li className="nav-item dropdown">
                  <Link href="/about-us" className={getLinkClass('/about-us')} data-index="1">about</Link>
                </li>
                <li className="nav-item">
                  <Link href="/products" className={getLinkClass('/products')} data-index="0">our products</Link>
                </li>
                <li className="nav-item">
                  <Link href="/our-dealers" className={getLinkClass('/our-dealers')} data-index="2">our dealers</Link>
                </li>
                <li className="nav-item">
                  <Link href="/contact" className={getLinkClass('/contact')} data-index="4">contact</Link>
                </li>
              </ul>
            </div>
            <div className="logo-wrap flex justify-center items-center flex-1">
              <Link href="/" className="tsf-logo">
                <Image src={logoSrc} alt={logoAlt} width={120} height={40} className="h-12 w-auto" priority={variant === 'home'} />
              </Link>
            </div>
            <div className="flex-1 flex justify-end items-center gap-6">
              {/* Today's Rate - Desktop Only */}
              <a 
                href="/api/todays-rate" 
                target="_blank" 
                className={`hidden md:block text-normal font-medium relative ${isHome ? 'text-white' : 'text-black'} pb-0.5 border-b border-dashed ${
                  isHome ? 'border-white/40' : 'border-black/30'
                } hover:opacity-80 transition-opacity`}
                style={{
                  textDecoration: 'none',
                }}
              >
                Today&apos;s Rate
              </a>

              {/* Cart and User Icons - Visible on all screens */}
              <a href="#" onClick={openCart} className="relative">
                <Image src={isHome ? '/images/cart.svg' : '/images/cart-b.svg'} alt="cart" width={24} height={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff4900] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </a>

              <div className="relative">
                {status === 'authenticated' ? (
                  <a 
                    href="#" 
                    onClick={handleUserClick} 
                    className="relative flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 transition-colors"
                  >
                    {userImage ? (
                      <Image 
                        src={userImage} 
                        alt={firstName || 'User'} 
                        width={32} 
                        height={32} 
                        className={`rounded-full object-cover border-2 ${
                          isHome ? 'border-white/20' : 'border-gray-200'
                        }`}
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isHome 
                          ? 'bg-white/20 text-white border-2 border-white/20' 
                          : 'bg-gray-200 text-gray-700 border-2 border-gray-300'
                      }`}>
                        {firstInitial}
                      </div>
                    )}
                    <div className="flex flex-col items-start hidden md:flex">
                      <span className={`text-xs font-normal ${
                        isHome ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        My Account
                      </span>
                      {firstName && (
                        <span className={`text-xs font-normal ${
                          isHome ? 'text-white' : 'text-gray-700'
                        }`}>
                          {firstName}
                        </span>
                      )}
                    </div>
                  </a>
                ) : (
                  <a href="#" onClick={handleUserClick} className="relative">
                    <Image src={isHome ? '/images/user.svg' : '/images/user-b.svg'} alt="user" width={24} height={24} />
                  </a>
                )}
                {status === 'authenticated' && userMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg ring-1 ring-black/5 z-50 ${isHome ? 'bg-white' : 'bg-white'}`}>
                    <div className="py-2 text-sm">
                      {isAdmin ? (
                        <Link href="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</Link>
                      ) : (
                        <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Wrapper - Separate from desktop */}
              <div className="nav-menu-wrapper md:hidden">
                {/* Mobile Menu Header */}
                <div className="mobile-menu-header md:hidden">
                  <Link href="/" className="mobile-menu-logo" onClick={closeMobileMenu}>
                    <Image src={logoSrc} alt={logoAlt} width={160} height={53} className="h-14 w-auto" />
                  </Link>
                  <button className="mobile-menu-close" onClick={closeMobileMenu} aria-label="Close menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <ul className="nav-menu flex justify-between items-center">
                  {/* Navigation Items */}
                  <li className="nav-item dropdown">
                    <Link href="/about-us" className={getLinkClass('/about-us') + ' pr-8'} data-index="1" onClick={closeMobileMenu}>about</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/products" className={getLinkClass('/products') + ' pr-8'} data-index="0" onClick={closeMobileMenu}>our
                      products</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/our-dealers" className={getLinkClass('/our-dealers') + ' pr-8'} data-index="2" onClick={closeMobileMenu}>our
                      dealers</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/contact" className={getLinkClass('/contact') + ' pr-8'} data-index="4" onClick={closeMobileMenu}>contact</Link>
                  </li>

                  {/* Today's Rate Button */}
                  <li className="nav-item mobile-menu-button md:hidden">
                    <a href="/api/todays-rate" target="_blank" className="mobile-todays-rate-btn" onClick={closeMobileMenu}>
                      Today&apos;s Rate
                    </a>
                  </li>
                </ul>
              </div>

              {/* Menu Toggle (Mobile Only) */}
              <div className="menu-toggle" onClick={toggleMobileMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          </div>
        </div>
        {/* <MaintenanceModal /> */}
      </header>
    </>
  );
}
