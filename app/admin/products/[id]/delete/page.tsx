import { dbDirect } from '@/lib/server-db';
import DeleteProductPage from "@/components/admin/delete-product-form";

export default async function AdminDeleteProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id);
  
  // Fetch product data to pass to client component
  const product = await dbDirect.products.findById(productId);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  return <DeleteProductPage productId={productId} productName={product.name} />;
}