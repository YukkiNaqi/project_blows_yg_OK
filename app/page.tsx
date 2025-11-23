import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ProductCategories } from "@/components/product-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { AnimatedSection } from "@/components/animated-section"

export default async function HomePage() {
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

        <AnimatedSection delay={0.2}>
          
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
         
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}
