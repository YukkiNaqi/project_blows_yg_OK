import { AnimatedSection } from "./animated-section";
import FeaturedProductsAsync from "./featured-products-async";

export default async function FeaturedProducts() {
  return (
    <AnimatedSection delay={0.4}>
      <FeaturedProductsAsync />
    </AnimatedSection>
  );
}