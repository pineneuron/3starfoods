import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FAQAccordion from '../../components/FAQAccordion';
import { CartProvider } from '../../context/CartContext';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <CartProvider>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="w-full mx-auto 2xl:container">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">about (Who We Are)</h1>
          </div>
        </div>
      </div>

      <div className="tsf-about tsf-bg-lightgreen relative py-20">
        <div className="w-full mx-auto 2xl:container">
          <div className="tsf-video">
            <video src="/images/video.mp4" controls autoPlay loop className="w-full h-auto rounded-md"></video>
          </div>
        </div>
      </div>

      <div className="tsf-about-video relative py-40 tsf-bg-secondary">
        <div className="w-full mx-auto 2xl:container">
          <div className="grid grid-cols-3 gap-10">
            <div id="count" className="client text-center">
              <span className="count tsf-font-sora text-6xl font-bold text-white">100+</span>
              <p className="tsf-font-sora text-xl text-white">Food Items</p>
            </div>
            <div id="count" className="client text-center">
              <span className="count tsf-font-sora text-6xl font-bold text-white">3000+</span>
              <p className="tsf-font-sora text-xl text-white">Happy Customers</p>
            </div>
            <div id="count" className="client text-center">
              <span className="count tsf-font-sora text-6xl font-bold text-white">15+</span>
              <p className="tsf-font-sora text-xl text-white">Years</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tsf-about relative py-20">
        <div className="w-full mx-auto 2xl:container">
          <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1">
              <div className="tsf-about-content">
                <h2 className="tsf-font-sora text-4xl font-bold uppercase">Who We Are</h2>
                <p className="tsf-font-sora mt-5 text-xl/8">
                  Discover excellence in every bite with Three Star Foods Pvt. Ltd.<br />
                  As a premier manufacturer and trader of premium meat products in Kathmandu, Nepal, we elevate your dining experience with a wide range of meticulously crafted offerings. Our state-of-the-art facility merges cutting-edge technology with unwavering dedication to quality and hygiene. With a seasoned team of experts, we&apos;re committed to delivering nothing short of perfection to your table.
                  At Three Star Foods, we&apos;re not just about products; we&apos;re about forging enduring relationships built on trust, quality, and reliability. Experience the epitome of taste and satisfaction, all at competitive prices.
                </p>
              </div>
            </div>
            <div className="col-span-1">
              <Image src="/images/bg-about.webp" className="rounded-md" alt="About" width={800} height={800} />
            </div>
          </div>
        </div>
      </div>

      <div className="tsf-choose-us tsf-bg-secondary relative py-20">
        <div className="w-full mx-auto 2xl:container">
          <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1">
              <div className="tsf-choose-us-content">
                <h2 className="tsf-font-sora text-4xl font-bold uppercase text-white">Why Choose Us</h2>
                <p className="tsf-font-sora mt-5 text-xl/8 text-white">When you choose Three Star Foods, you're choosing top-notch taste and quality. Our wide selection of delectable options ensures there's something for everyone. We take pride in our punctuality, guaranteeing that your orders are always on time.</p>
                <Image src="/images/team.webp" className="rounded-md pt-10" alt="About" width={800} height={800} />
              </div>
            </div>
            <div className="col-span-1">
              <div className="tsf-choose-us-content">
                <div className="tsf-bg-red tsf-box-shodow flex items-center gap-5 p-5 rounded-md">
                  <Image src="/images/quality.webp" className="rounded-md" alt="About" width={50} height={50} />
                  <h4 className="tsf-font-sora text-2xl font-bold uppercase text-white">Uncompromising Quality</h4>
                </div>
                <div className="tsf-bg-red tsf-box-shodow flex items-center gap-5 p-5 rounded-md mt-5">
                  <Image src="/images/quality.webp" className="rounded-md" alt="About" width={50} height={50} />
                  <h4 className="tsf-font-sora text-2xl font-bold uppercase text-white">Punctuality</h4>
                </div>
                <div className="tsf-bg-red tsf-box-shodow flex items-center gap-5 p-5 rounded-md mt-5">
                  <Image src="/images/quality.webp" className="rounded-md" alt="About" width={50} height={50} />
                  <h4 className="tsf-font-sora text-2xl font-bold uppercase text-white">Punctuality</h4>
                </div>
                <div className="tsf-bg-red tsf-box-shodow flex items-center gap-5 p-5 rounded-md mt-5">
                  <Image src="/images/quality.webp" className="rounded-md" alt="About" width={50} height={50} />
                  <h4 className="tsf-font-sora text-2xl font-bold uppercase text-white">Punctuality</h4>
                </div>
                <div className="tsf-bg-red tsf-box-shodow flex items-center gap-5 p-5 rounded-md mt-5">
                  <Image src="/images/quality.webp" className="rounded-md" alt="About" width={50} height={50} />
                  <h4 className="tsf-font-sora text-2xl font-bold uppercase text-white">Punctuality</h4>
                </div>
                <div className="tsf-bg-red tsf-box-shodow flex items-center gap-5 p-5 rounded-md mt-5">
                  <Image src="/images/quality.webp" className="rounded-md" alt="About" width={50} height={50} />
                  <h4 className="tsf-font-sora text-2xl font-bold uppercase text-white">Punctuality</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQAccordion />

      <Footer />
    </CartProvider>
  );
}
