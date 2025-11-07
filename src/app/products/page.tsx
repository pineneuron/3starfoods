import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductsCatalog, { Category } from '../../components/ProductsCatalog';
import StickyTabMenu from '../../components/StickyTabMenu';
import CartSidebar from '../../components/CartSidebar';
import { CartProvider } from '../../context/CartContext';
import { ProductService } from '@/lib/services';

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

export default async function ProductsPage() {
  const dbCategories = await ProductService.getAllCategories();
  const categories = transformDbToCategory(dbCategories);
  return (
    <CartProvider>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="w-full mx-auto container">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">Our Products</h1>
          </div>
        </div>
      </div>

      <StickyTabMenu
        categories={[
          { id: 'chicken', icon: '/images/product-tab01.svg' },
          { id: 'mutton', icon: '/images/product-tab05.svg' },
          { id: 'pork', icon: '/images/product-tab03.svg' },
          { id: 'fish', icon: '/images/product-tab04.svg' },
          { id: 'buff', icon: '/images/product-tab06.svg' }
        ]}
      />

      <div className="tsf-our-product py-20">
        <div className="container px-4 md:px-6 lg:px-7 mx-auto">
          <ProductsCatalog categories={categories} />
        </div>
      </div>

      <CartSidebar />

      <Footer />
    </CartProvider>
  );
}
