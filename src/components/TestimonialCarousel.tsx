'use client';

import React from 'react';
import Carousel from './Carousel';

const TestimonialCarousel: React.FC = () => {
  const options = {
    loop: true,
    margin: 0,
    nav: false, // match original (no nav arrows)
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    items: 1,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    },
    animateOut: 'fadeOut',
    animateIn: 'fadeIn'
  };

  return (
    <Carousel options={options} className="h-full">
      <div className="item h-full">
        <div className="tsf-testimonialitem-list h-full">
          <div className="tsf-testimonialitem-content relative bg-white rounded-md p-10 h-full flex flex-col">
              <div className="tsf-testimonialitem-imgquote">
                <div className="flex items-center justify-start gap-2">
                  <img src="/images/f-star.svg" alt="quote" className="tsf-star-icon" />
                  <img src="/images/f-star.svg" alt="quote" className="tsf-star-icon" />
                  <img src="/images/f-star.svg" alt="quote" className="tsf-star-icon" />
                  <img src="/images/f-star.svg" alt="quote" className="tsf-star-icon" />
                  <img src="/images/h-star.svg" alt="quote" className="tsf-star-icon" />
                </div>
              </div>
              <p className="text-xl text-black mt-6 flex-1">Best meat products. On good price. The
                variety of fresh meat products that they have is just so good. Best for
                wholesale as well as retail.I get my supplies here every-time.</p>
              <div className="flex items-center gap-2">
                <div className="mt-5">
                  <img src="/images/user01.svg" alt="user01"
                    className="w-10 h-10 rounded-full" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-black tsf-font-sora mt-6">Aakash
                    SKYmiester</h3>
                </div>
              </div>
              <div className="tsf-testimonialitem-imgquote absolute bottom-5 right-10">
                <img src="/images/quote.svg" alt="quote"
                  className="w-20 h-20 rounded-md" />
              </div>
            </div>
          </div>
      </div>
    </Carousel>
  );
};

export default TestimonialCarousel;
