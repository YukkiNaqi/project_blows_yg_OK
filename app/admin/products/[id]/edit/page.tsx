import { dbDirect } from '@/lib/server-db';
import EditProductPage from "@/components/admin/edit-product-form";

export default async function AdminEditProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  
  // Fetch product data to pass to client component
  const product = await dbDirect.products.findById(productId);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  return <EditProductPage productId={productId} />;
}