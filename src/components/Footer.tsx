import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="tsf-footer relative tsf-bg-black lg:pt-40 lg:pb-10 md:pt-20 md:pb-10 sm:pt-20 sm:pb-10" suppressHydrationWarning>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 gap-10">
          <div className="footer-left">
            <Link href="/">
              <Image className="w-40 h-40" src="/design/src/assets/img/logo.svg" alt="logo" width={160} height={160} />
            </Link>
            <p className="text-white mt-4 line-height-8">
              Our wide selection of delectable options ensures there&apos;s something for everyone. Join us in savoring the best flavors while contributing to a better food ecosystem.
            </p>
            <form action="" className="flex items-center mt-8 relative">
              <input type="email" placeholder="Email" className="bg-white py-5 pl-8 pr-16 w-full rounded-full outline-none" />
              <Image src="/design/src/assets/img/arrow-right.svg" alt="send" width={20} height={20} className="absolute right-6 z-10" />
            </form>
          </div>
          <div className="footer-right col-span-2 ml-20">
            <div className="grid grid-cols-3 gap-10">
              <div className="footer-right-quicklinks">
                <h3 className="text-xl font-bold text-white tsf-font-sora uppercase">Quick Links</h3>
                  <ul className="mt-10 mr-10">
                    <li className="pb-5 text-white capitalize"><Link href="/">home</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/about">about</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">products</Link></li>
                    <li className="pb-5 text-white capitalize"><a href="/our-dealers">our dealers</a></li>
                    <li className="pb-5 text-white capitalize"><Link href="/contact">contact</Link></li>
                  </ul>
              </div>
              <div className="footer-right-productcategory">
                <h3 className="text-xl font-bold text-white tsf-font-sora uppercase">Product Categories</h3>
                <div className="grid grid-cols-2 gap-10">
                  <ul className="mt-10">
                    <li className="pb-5 text-white capitalize"><Link href="/products">ham & cutlet</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">frozen momo</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">salami</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">sausage</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">mutton items</Link></li>
                  </ul>
                  <ul className="mt-10">
                    <li className="pb-5 text-white capitalize"><Link href="/products">burger patty</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">chicken items</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">buff items</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">pork items</Link></li>
                    <li className="pb-5 text-white capitalize"><Link href="/products">ready to eat</Link></li>
                  </ul>
                </div>
              </div>
              <div className="footer-right-location ml-20">
                <h3 className="text-xl font-bold text-white tsf-font-sora uppercase">Location</h3>
                <div className="mt-10">
                  <p className="text-white mb-5">
                    Tokha-6, Kathmandu, Greenland, Triyog Marg
                  </p>
                  <p className="text-white mb-5">
                    3starmeat@gmail.com
                  </p>
                  <p className="text-white">
                    +977 14988879, 4963659
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="social-certificate flex items-center justify-between gap-10 mt-10">
          <div className="footer-left-social">
            <ul className="inline-flex items-center justify-between gap-6">
              <li>
                <a className="bg-white py-5 px-6 inline-flex items-center justify-center w-16 h-16 rounded-full hover:bg-gray-100 transition-colors" href="https://www.facebook.com/3starfoodspvtltd" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="text-black" size={28} />
                </a>
              </li>
              <li>
                <a className="bg-white py-5 px-6 inline-flex items-center justify-center w-16 h-16 rounded-full hover:bg-gray-100 transition-colors" href="https://www.instagram.com/3starfoods/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="text-black" size={28} />
                </a>
              </li>
              <li>
                <a className="bg-white py-5 px-6 inline-flex items-center justify-center w-16 h-16 rounded-full hover:bg-gray-100 transition-colors" href="https://www.youtube.com/@threestar6309" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                  <Youtube className="text-black" size={28} />
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-right-certificate">
            <div className="flex items-space-between gap-10">
              <Image src="/design/src/assets/img/iso.svg" alt="iso" width={120} height={120} />
              <Image src="/design/src/assets/img/certificate.svg" alt="certificate" width={120} height={120} />
            </div>
          </div>
        </div>
        <div className="footer-copyright border-t border-white pt-10 mt-10">
          <div className="flex items-center justify-between">
            <div className="tsf-copyright">
              <p className="text-white">
                © 2023 Three Star Foods Private Limited.
              </p>
            </div>
            <div className="tsf-payment">
              <div className="flex items-center gap-10">
                <div className="tsf-payment-img">
                  <Image src="/design/src/assets/img/esewa.svg" alt="esewa" width={80} height={60} />
                </div>
                <div className="tsf-payment-img">
                  <Image src="/design/src/assets/img/khalti.svg" alt="khalti" width={80} height={60} />
                </div>
                <div className="tsf-payment-img">
                  <Image src="/design/src/assets/img/visacard.svg" alt="visacard" width={80} height={60} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
