import { dbDirect, type Category } from '@/lib/server-db';
import CategoryIntroSectionClient from './category-intro-section-client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function CategoryIntroSectionAsync() {
  try {
    const categories = await dbDirect.categories.findAll();
    // Ambil 6 kategori pertama untuk ditampilkan
    const displayedCategories = categories.slice(0, 6);

    return <CategoryIntroSectionClient initialCategories={displayedCategories} />;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return (
      <div className="py-8 px-4">
        <Alert className="max-w-4xl mx-auto">
          <AlertDescription>
            Gagal memuat kategori produk. Silakan coba lagi nanti.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}