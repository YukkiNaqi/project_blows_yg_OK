import { dbDirect, type Product } from '@/lib/server-db';
import TopProductsSectionClient from './top-products-section-client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function TopProductsSectionAsync() {
  try {
    const products = await dbDirect.products.findAll();
    // Ambil 4 produk pertama sebagai produk unggulan
    const topProducts = products.slice(0, 4);

    return <TopProductsSectionClient initialProducts={topProducts} />;
  } catch (error) {
    console.error('Error fetching top products:', error);
    return (
      <div className="py-8 px-4">
        <Alert className="max-w-4xl mx-auto">
          <AlertDescription>
            Gagal memuat produk teratas. Silakan coba lagi nanti.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}