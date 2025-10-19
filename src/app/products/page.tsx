import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductsCatalog, { Category } from '../../components/ProductsCatalog';
import StickyTabMenu from '../../components/StickyTabMenu';
import CartSidebar from '../../components/CartSidebar';
import { CartProvider } from '../../context/CartContext';
import { promises as fs } from 'fs';
import path from 'path';

async function getProductsData(): Promise<{ categories: Category[] }> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'products.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

export default async function ProductsPage() {
  const { categories } = await getProductsData();
  return (
    <CartProvider>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="container mx-auto">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora capitalize">our products</h1>
          </div>
        </div>
      </div>

      <StickyTabMenu
        categories={[
          { id: 'chicken', icon: '/images/product-tab01.svg' },
          { id: 'fish', icon: '/images/product-tab02.svg' },
          { id: 'pork', icon: '/images/product-tab03.svg' },
          { id: 'mutton', icon: '/images/product-tab04.svg' },
          { id: 'buff', icon: '/images/product-tab05.svg' }
        ]}
      />

      <div className="tsf-our-product py-20">
        <div className="container mx-auto">
          <ProductsCatalog categories={categories} />
        </div>
      </div>

      <CartSidebar />

      <Footer />
    </CartProvider>
  );
}
