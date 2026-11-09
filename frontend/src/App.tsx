import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { useRouter } from '@/lib/router';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { EnquiryPopup } from '@/components/EnquiryPopup';

import { HomePage } from "@/pages/HomePage";
import { CategoryPage } from '@/pages/CategoryPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { SearchPage } from '@/pages/SearchPage';
import { AdminPage } from '@/pages/AdminPage';
import { BlogPage } from '@/pages/BlogPage';
import { BlogArticlePage } from '@/pages/BlogArticlePage';

function RouteRenderer() {
  const { route } = useRouter();

  switch (route.name) {
    case 'home':
      return <HomePage />;

    case 'category':
      return <CategoryPage categorySlug={route.categorySlug} />;

    case 'subcategory':
      return <CategoryPage categorySlug={route.categorySlug} subcategorySlug={route.subcategorySlug} />;

    case 'product':
      return <ProductPage productSlug={route.productSlug} />;

    case 'cart':
      return <CartPage />;

    case 'search':
      return <SearchPage query={route.query} />;

    case 'admin':
      return <AdminPage />;

    case 'blog':
      return <BlogPage />;

    case 'blogArticle':
      return <BlogArticlePage slug={route.slug} />;

    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-stone-50">
          <Header />

          <main className="flex-1">
            <RouteRenderer />
          </main>

          <Footer />
          <CartDrawer />
          <EnquiryPopup />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
