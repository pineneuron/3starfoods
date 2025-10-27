'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StickyTabMenuProps {
  categories: { id: string; icon: string }[];
}

export default function StickyTabMenu({ categories }: StickyTabMenuProps) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? '');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    function onActiveChanged(e: Event) {
      const custom = e as CustomEvent<string>;
      if (custom.detail) setActiveId(custom.detail);
    }
    window.addEventListener('tsf:active-category-changed', onActiveChanged as EventListener);
    return () => window.removeEventListener('tsf:active-category-changed', onActiveChanged as EventListener);
  }, []);

  useEffect(() => {
    let ticking = false;

    function updateVisibility() {
      const headerEl = document.querySelector('header') as HTMLElement | null;
      const productSection = document.querySelector('.tsf-our-product') as HTMLElement | null;
      const footerEl = document.querySelector('.tsf-footer') as HTMLElement | null;

      if (!productSection || !footerEl) {
        setVisible(false);
        ticking = false;
        return;
      }

      const scrollTop = window.scrollY;
      const headerHeight = headerEl?.offsetHeight ?? 0;
      const windowHeight = window.innerHeight;

      const rectProduct = productSection.getBoundingClientRect();
      const productTop = rectProduct.top + scrollTop;
      const rectFooter = footerEl.getBoundingClientRect();
      const footerTop = rectFooter.top + scrollTop;

      const isInProductSection = scrollTop >= productTop - headerHeight - 50;
      const isInFooterArea = scrollTop + windowHeight >= footerTop - 100;

      setVisible(isInProductSection && !isInFooterArea);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll);
    // Run once on mount
    updateVisibility();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function handleClick(id: string) {
    const evt = new CustomEvent('tsf:set-category', { detail: id });
    window.dispatchEvent(evt);
  }

  return (
    <div className={`tsf-sticky-tabmenu${visible ? ' show' : ''}`} suppressHydrationWarning>
      <div className="absolute top-50 left-0 z-10">
        <ul className="-mb-px text-3xl font-medium text-center" role="tablist">
          {categories.map((c) => (
            <li key={c.id} className="me-2 pb-4" role="presentation">
              <button
                id={`${c.id}-sticky-tab`}
                className={`inline-block p-4 cursor-pointer tsf-box-shodow rounded-r-md${activeId === c.id ? ' active' : ''}`}
                type="button"
                role="tab"
                aria-controls={c.id}
                aria-selected={activeId === c.id}
                data-tabs-target={`#styled-${c.id}`}
                onClick={() => handleClick(c.id)}
              >
                <Image src={c.icon} alt={`${c.id}-tab`} width={60} height={60} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
