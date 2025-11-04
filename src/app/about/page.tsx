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
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">about</h1>
          </div>
        </div>
      </div>

      <div className="tsf-about relative py-20">
        <div className="w-full mx-auto 2xl:container">
          <div className="grid grid-cols-2 gap-10">
            <div className="tsf-about-img">
              <Image src="/images/bg-about.webp" className="rounded-md" alt="About" width={800} height={800} />
            </div>
            <div className="tsf-about-content">
              <h2 className="tsf-font-sora text-3xl font-bold capitalize">about three star foods</h2>
              <p className="tsf-font-sora mt-5 text-xl/8">
                Discover excellence in every bite with Three Star Foods Pvt. Ltd.<br />
                As a premier manufacturer and trader of premium meat products in Kathmandu, Nepal, we elevate your dining experience with a wide range of meticulously crafted offerings. Our state-of-the-art facility merges cutting-edge technology with unwavering dedication to quality and hygiene. With a seasoned team of experts, we&apos;re committed to delivering nothing short of perfection to your table.
                At Three Star Foods, we&apos;re not just about products; we&apos;re about forging enduring relationships built on trust, quality, and reliability. Experience the epitome of taste and satisfaction, all at competitive prices.
              </p>
            </div>
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
              <span className="count tsf-font-sora text-6xl font-bold text-white">1000+</span>
              <p className="tsf-font-sora text-xl text-white">Happy Customers</p>
            </div>
            <div id="count" className="client text-center">
              <span className="count tsf-font-sora text-6xl font-bold text-white">10+</span>
              <p className="tsf-font-sora text-xl text-white">Years</p>
            </div>
          </div>
          {/* <video src="/images/video.mp4" controls autoPlay loop className="w-full h-auto rounded-md"></video> */}
        </div>
      </div>

      <FAQAccordion />

      <Footer />
    </CartProvider>
  );
}
