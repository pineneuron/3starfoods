'use client';

import React from 'react';
import Carousel from './Carousel';
import Image from 'next/image';

const TestimonialCarousel: React.FC = () => {
  const options = {
    loop: true,
    margin: 10,
    nav: false,
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
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/h-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                </div>
              </div>
              <p className="text-xl text-black mt-6 flex-1">5 star for butchery and 2 star for restaurant. This is one of the best and most hygienic meat shops in Kathmandu—I haven’t come across anything better. The variety of fresh and frozen meat products is impressive. They’ve also introduced a deli counter that serves a range of cooked chicken and mutton dishes, perfect for when you’re not in the mood to cook.</p>
              <div className="flex items-center gap-2">
                <div className="mt-5">
                  <Image src="/images/user01.svg" alt="user01"
                    width={40} height={40} className="rounded-full" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-black tsf-font-sora mt-6">Deepak Pokhrel</h3>
                </div>
              </div>
              <div className="tsf-testimonialitem-imgquote absolute bottom-5 right-10">
                <Image src="/images/quote.svg" alt="quote"
                  width={80} height={80} className="rounded-md" />
              </div>
            </div>
          </div>
      </div>
      <div className="item h-full">
        <div className="tsf-testimonialitem-list h-full">
          <div className="tsf-testimonialitem-content relative bg-white rounded-md p-10 h-full flex flex-col">
              <div className="tsf-testimonialitem-imgquote">
                <div className="flex items-center justify-start gap-2">
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/h-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                </div>
              </div>
              <p className="text-xl text-black mt-6 flex-1">Best meat products. On good price. The
                variety of fresh meat products that they have is just so good. Best for
                wholesale as well as retail.I get my supplies here every-time.</p>
              <div className="flex items-center gap-2">
                <div className="mt-5">
                  <Image src="/images/user01.svg" alt="user01"
                    width={40} height={40} className="rounded-full" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-black tsf-font-sora mt-6">Aakash
                    SKYmiester</h3>
                </div>
              </div>
              <div className="tsf-testimonialitem-imgquote absolute bottom-5 right-10">
                <Image src="/images/quote.svg" alt="quote"
                  width={80} height={80} className="rounded-md" />
              </div>
          </div>
        </div>
      </div>
      <div className="item h-full">
        <div className="tsf-testimonialitem-list h-full">
          <div className="tsf-testimonialitem-content relative bg-white rounded-md p-10 h-full flex flex-col">
              <div className="tsf-testimonialitem-imgquote">
                <div className="flex items-center justify-start gap-2">
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/f-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                  <Image src="/images/h-star.svg" alt="quote" width={16} height={16} className="tsf-star-icon" />
                </div>
              </div>
              <p className="text-xl text-black mt-6 flex-1">Best meat products. On good price. The
                variety of fresh meat products that they have is just so good. Best for
                wholesale as well as retail.I get my supplies here every-time.</p>
              <div className="flex items-center gap-2">
                <div className="mt-5">
                  <Image src="/images/user01.svg" alt="user01"
                    width={40} height={40} className="rounded-full" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-black tsf-font-sora mt-6">Aakash
                    SKYmiester</h3>
                </div>
              </div>
              <div className="tsf-testimonialitem-imgquote absolute bottom-5 right-10">
                <Image src="/images/quote.svg" alt="quote"
                  width={80} height={80} className="rounded-md" />
              </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
};

export default TestimonialCarousel;
