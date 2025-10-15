'use client';

import { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'owl.carousel/dist/assets/owl.carousel.css';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  options?: any;
}

const Carousel: React.FC<CarouselProps> = ({ children, className = '', options = {} }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current || typeof window === 'undefined') return;

    const init = async () => {
      (window as any).jQuery = $;
      (window as any).$ = $;
      await import('owl.carousel');

      const $carousel = $(carouselRef.current as HTMLDivElement);

      const defaultOptions = {
        loop: true,
        margin: 10,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 }
        },
        ...options
      };

      $carousel.owlCarousel(defaultOptions as any);

      return () => {
        if ($carousel.data('owl.carousel')) {
          $carousel.trigger('destroy.owl.carousel');
        }
      };
    };

    let cleanup: (() => void) | undefined;
    init().then((fn) => {
      // dynamic import initializer returns cleanup or undefined
      if (typeof fn === 'function') cleanup = fn as unknown as () => void;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [options]);

  return (
    <div ref={carouselRef} className={`owl-carousel ${className}`}>
      {children}
    </div>
  );
};

export default Carousel;
