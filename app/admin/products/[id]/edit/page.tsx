import { dbDirect } from '@/lib/server-db';
import EditProductPage from "@/components/admin/edit-product-form";

export default async function AdminEditProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  console.log('Edit page received params id:', params.id); // Debug log
  console.log('Parsed product ID:', productId); // Debug log

  // Validasi apakah ID adalah angka valid
  if (isNaN(productId)) {
    console.log('Invalid product ID - not a number'); // Debug log
    return <div>Invalid product ID</div>;
  }

  // Fetch product data using the same method as dbDirect but with more debugging
  let product = null;
  try {
    console.log('About to fetch product from database with ID:', productId); // Debug log
    // Using dbDirect for consistency
    product = await dbDirect.products.findById(productId);
  } catch (error) {
    console.error('Error in dbDirect.products.findById:', error); // Debug log
    return <div>Error loading product data</div>;
  }

  console.log('Product fetched from database:', product); // Debug log

  if (!product) {
    // Try fetching using the API method as a fallback to check for consistency
    try {
      console.log('Product not found via dbDirect, checking with direct query...'); // Debug log
      const { createDbConnection } = await import('@/lib/db-config');
      const connection = await createDbConnection();
      const [rows] = await connection.execute(
        'SELECT id, category_id, name, description, image_url, image_data, price, cost_price, stock_quantity, min_stock_level, sku, brand, specifications, is_active, created_at FROM products WHERE id = ?',
        [productId]
      );
      await connection.end();

      console.log('Direct DB query result:', rows); // Debug log

      if (Array.isArray(rows) && rows.length > 0) {
        console.log('Product exists in DB but not accessible via dbDirect'); // Debug log
      }
    } catch (error) {
      console.error('Error in direct DB query:', error); // Debug log
    }

    console.log('Product not found in database for ID:', productId); // Debug log
    return <div>Product not found</div>;
  }

  return <EditProductPage productId={productId} />;
}