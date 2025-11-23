import { dbDirect, type Product } from "@/lib/server-db";
import ClientAdminDashboard from "@/components/admin/client-admin-dashboard";

export default async function AdminDashboard() {
  const products = await dbDirect.products.findAll();

  return <ClientAdminDashboard products={products} />;
}