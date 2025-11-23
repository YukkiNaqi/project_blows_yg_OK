import { dbDirect, type Product } from "@/lib/server-db";
import ClientAdminProductsPage from "@/components/admin/client-admin-products-page";

export default async function AdminProductsPage() {
  const products = await dbDirect.products.findAll();

  return <ClientAdminProductsPage initialProducts={products} />;
}