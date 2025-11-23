import { dbDirect } from "@/lib/server-db";
import ClientAdminOrdersPage from "@/components/admin/client-admin-orders-page";

export default async function AdminOrdersPage() {
  // Fetch orders from the database
  const orders = await dbDirect.orders.findAll();

  return <ClientAdminOrdersPage initialOrders={orders} />;
}