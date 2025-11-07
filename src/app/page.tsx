import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import FrozenItemsCarousel from '../components/FrozenItemsCarousel';
import TestimonialCarousel from '../components/TestimonialCarousel';
import FAQAccordion from '../components/FAQAccordion';
import HomeProductTabs from '../components/HomeProductTabs';
import CartSidebar from '../components/CartSidebar';
import TodaysDeal from '../components/TodaysDeal';
import CategoryGridV1 from '../components/CategoryGridV1';
// import CategoryGridV2 from '../components/CategoryGrid';
import { CartProvider } from '../context/CartContext';
import { Category } from '../components/ProductsCatalog';
import { ProductService } from '@/lib/services';
import Image from 'next/image';

function transformDbToCategory(dbCategories: Awaited<ReturnType<typeof ProductService.getAllCategories>>): Category[] {
  return dbCategories
    .filter(cat => cat.isActive)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      products: cat.products
        .filter(p => p.isActive)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.basePrice),
          unit: p.unit,
          discountPercent: p.discountPercent,
          image: p.imageUrl || '/images/placeholder.png',
          images: p.images.length > 0 ? p.images.sort((a, b) => (a.isPrimary ? -1 : 0) - (b.isPrimary ? -1 : 0)).map(img => img.imageUrl) : undefined,
          shortDescription: p.shortDescription || undefined,
          variations: p.variations.length > 0 ? p.variations.map(v => ({ name: v.name, price: Number(v.price), discountPercent: v.discountPercent })) : undefined,
          defaultVariation: p.variations.find(v => v.isDefault)?.name || undefined,
          featured: p.isFeatured,
          bestseller: p.isBestseller,
        }))
    }))
    .filter(cat => cat.products.length > 0)
}

export default async function Home() {
  const dbCategories = await ProductService.getAllCategories();
  const categories = transformDbToCategory(dbCategories);

  const allProducts = categories.flatMap(cat => cat.products);
  const featuredProducts = allProducts.filter(p => p.featured).slice(0, 8);
  const bestsellerProducts = allProducts.filter(p => p.bestseller).slice(0, 8);
  return (
    <CartProvider>
      <Header variant="home" />

      <div className="tsf-banner relative py-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="grid grid-cols-12 gap-10 items-stretch">
            <div className="tsf-slider col-span-9 h-full">
              <HeroCarousel />
            </div>
            <div className="col-span-3 h-full">
              <TodaysDeal />
            </div>
          </div>
        </div>
      </div>

      <CategoryGridV1 />
      {/* <CategoryGridV2 /> */}

      <HomeProductTabs
        bestsellerProducts={bestsellerProducts}
        featuredProducts={featuredProducts}
      />

      <div className="tsf-frozen pb-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-category_heading">
            <h2 className="tsf-dark-color text-4xl font-bold pb-10">Frozen Items</h2>
          </div>
          <div className="tsf-frozen_slider relative carousel-navigation">
            <FrozenItemsCarousel />
          </div>
        </div>
      </div>

      <div className="tsf-how_order relative tsf-bg-secondary py-40">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-howorder_heading text-center">
            <h2 className="tsf-dark-color text-4xl font-bold uppercase text-white">how to order?</h2>
            <p className="text-xl mt-5 text-white">We&apos;ll show you stores and restaurants nearby you can order from.</p>
          </div>
          <div className="grid grid-cols-3 gap-20 mt-20">
            <div className="tsf-how_orderitem tsf-box-shodow rounded-md tsf-bg-white p-10">
              <div className="order_item rounded-full tsf-bg-red p-10 inline-block">
                <Image src="/images/order01.svg" alt="order01" width={40} height={40} />
              </div>
              <div className="order_titlename mt-10">
                <h4 className="text-3xl">Choose your product</h4>
                <p className="pt-2">We&apos;ll show you stores and restaurants nearby you can order from.</p>
              </div>
            </div>
            <div className="tsf-how_orderitem tsf-box-shodow rounded-md tsf-bg-white p-10">
              <div className="order_item rounded-full tsf-bg-red p-10 inline-block">
                <Image src="/images/order02.svg" alt="order02" width={40} height={40} />
              </div>
              <div className="order_titlename mt-10">
                <h4 className="text-3xl">Choose your product</h4>
                <p className="pt-2">We&apos;ll show you stores and restaurants nearby you can order from.</p>
              </div>
            </div>
            <div className="tsf-how_orderitem tsf-box-shodow rounded-md tsf-bg-white p-10">
              <div className="order_item rounded-full tsf-bg-red p-10 inline-block">
                <Image src="/images/order03.svg" alt="order03" width={40} height={40} />
              </div>
              <div className="order_titlename mt-10">
                <h4 className="text-3xl">Choose your product</h4>
                <p className="pt-2">We&apos;ll show you stores and restaurants nearby you can order from.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tsf-quality py-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-howorder_heading text-left">
            <h2 className="tsf-dark-color text-4xl font-bold uppercase text-black">Quality & innovation</h2>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="tsf-qualityitem-left pt-10">
              <Image src="/images/quality01.svg" alt="quality01"
                width={708} height={626} className="object-cover rounded-md" />
            </div>
            <div className="tsf-qualityitem-right tsf-bg-gray p-10 mt-10 rounded-md">
              <div className="tsf-qualityitem-right-content-list">
                <div className="flex items-center gap-10 border-b border-gray-200 pb-10">
                  <div className="tsf-qualityitem-right-icon">
                    <span className="tsf-bg-red text-white w-12 h-12 p-8 text-2xl rounded-full">01</span>
                  </div>
                  <div className="tsf-qualityitem-right-content">
                    <h3 className="text-3xl font-bold">ISO & PRE-HACCAP Certification</h3>
                    <p className="text-md mt-2">We are ISO 22000:2018 Food Safety Certified Company that ensures
                      our products meets international food standards.</p>
                  </div>
                </div>
                <div className="flex items-center gap-10 border-b border-gray-200 pb-10 pt-10">
                  <div className="tsf-qualityitem-right-icon">
                    <span className="tsf-bg-blue text-white w-12 h-12 p-8 text-2xl rounded-full">02</span>
                  </div>
                  <div className="tsf-qualityitem-right-content">
                    <h3 className="text-3xl font-bold">Halal Certification</h3>
                    <p className="text-md mt-2">Our Company is proudly Halal certified, ensuring that all our
                      Chicken and Mutton products meet the highest standards of Halal integrity. Trust us
                      for quality, ethically sourced Halal meat.</p>
                  </div>
                </div>
                <div className="flex items-center gap-10 border-b border-gray-200 pb-10 pt-10">
                  <div className="tsf-qualityitem-right-icon">
                    <span className="tsf-bg-secondary text-white w-12 h-12 p-8 text-2xl rounded-full">03</span>
                  </div>
                  <div className="tsf-qualityitem-right-content">
                    <h3 className="text-3xl font-bold">QC Laboratory</h3>
                    <p className="text-md mt-2">Testing our product in our own QC Laboratory handled by food
                      technician, we ensure that quality product is produced which meets the food safety
                      standards.</p>
                  </div>
                </div>
                <div className="flex items-center gap-10 pt-10">
                  <div className="tsf-qualityitem-right-icon">
                    <span className="tsf-bg-primary text-white w-12 h-12 p-8 text-2xl rounded-full">04</span>
                  </div>
                  <div className="tsf-qualityitem-right-content">
                    <h3 className="text-3xl font-bold uppercase">infrastructure</h3>
                    <p className="text-md mt-2">Our infrastructure ensures the efficient transformation of raw
                      ingredients into nourishing products, meeting the demands of valued customers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tsf-testimonial relative tsf-bg-blue py-40">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-howorder_heading text-left">
            <h2 className="text-white text-4xl font-bold uppercase">What our customer say</h2>
          </div>
          <div className="grid grid-cols-3 gap-10 items-stretch">
            <div className="tsf-testimonialleft col-span-2 pt-10 pr-0 h-full">
              <div className="grid grid-cols-3 gap-10 h-full items-stretch">
                <div className="tsf-testimonialitem-img-left h-full flex">
                  <Image src="/images/testimonial01.svg" alt="testimonial01" width={300} height={200} className="object-cover rounded-md" />
                </div>
                <div className="col-span-2 h-full flex">
                  <div className="tsf-testimonialitem-slider relative carousel-navigation h-full w-full">
                    <TestimonialCarousel />
                  </div>
                </div>
              </div>
            </div>
            <div className="tsf-testimonialright tsf-bg-red rounded-md p-10">
              <div className="tsf-testimonialitem-img-right">
                <Image src="/images/testimonial02.svg" alt="testimonial02"
                  width={300} height={400} className="object-cover rounded-md m-auto" />
              </div>
              <div className="tsf-testimonialitem-content text-center">
                <p className="text-md text-white mt-2 pb-5">Satisfied Clients</p>
                <h3 className="text-6xl font-bold text-white tsf-font-sora">99%</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="tsf-motion py-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-howorder_heading text-left">
            <h2 className="tsf-dark-color text-4xl font-bold uppercase text-black">products in motion</h2>
          </div>
          <div className="tsf-motionitem-slider relative carousel-navigation pt-10">
            <MotionCarousel />
          </div>
        </div>
      </div> */}

      <FAQAccordion />

      <Footer />

      <CartSidebar />
    </CartProvider>
  );
}
