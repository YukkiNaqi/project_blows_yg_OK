import { dbDirect, type Product } from '@/lib/server-db';
import FeaturedProductsClient from './featured-products-client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function FeaturedProductsAsync() {
  try {
    const products = await dbDirect.products.findFeatured();
    return <FeaturedProductsClient initialProducts={products} />;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return (
      <div className="py-8 px-4">
        <Alert className="max-w-4xl mx-auto">
          <AlertDescription>
            Gagal memuat produk unggulan. Silakan coba lagi nanti.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}