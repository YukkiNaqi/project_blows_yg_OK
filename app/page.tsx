import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { AboutSection } from "@/components/about-section"
import TopProductsSection from "@/components/top-products-section"
import CategoryIntroSectionClient from "@/components/category-intro-section-client"
import { dbDirect, type Product, type Category } from '@/lib/server-db';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedSection } from "@/components/animated-section"

export default async function HomePage() {
  // Fetch data di dalam page component
  let topProducts: Product[] = [];
  let categories: Category[] = [];
  let productsFetchError = false;
  let categoriesFetchError = false;

  try {
    const allProducts = await dbDirect.products.findAll();
    topProducts = allProducts.slice(0, 4); // Ambil 4 produk pertama sebagai produk unggulan
  } catch (error) {
    console.error('Error fetching top products:', error);
    productsFetchError = true;
  }

  try {
    const allCategories = await dbDirect.categories.findAll();
    categories = allCategories.slice(0, 6); // Ambil 6 kategori pertama
  } catch (error) {
    console.error('Error fetching categories:', error);
    categoriesFetchError = true;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedSection>
          <HeroSection />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <FeaturesSection />
        </AnimatedSection>

        {/* Produk-produk teratas */}
        {productsFetchError ? (
          <div className="py-8 px-4">
            <Alert className="max-w-4xl mx-auto">
              <AlertDescription>
                Gagal memuat produk teratas. Silakan coba lagi nanti.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <TopProductsSection initialProducts={topProducts} />
        )}

        {/* Kategori-kategori produk */}
        {categoriesFetchError ? (
          <div className="py-8 px-4">
            <Alert className="max-w-4xl mx-auto">
              <AlertDescription>
                Gagal memuat kategori produk. Silakan coba lagi nanti.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <CategoryIntroSectionClient initialCategories={categories} />
        )}

        <AnimatedSection delay={0.4}>
          <TestimonialsSection />
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <AboutSection />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}