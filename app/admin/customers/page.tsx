import { dbDirect } from "@/lib/server-db";
import ClientAdminCustomersPage from "@/components/admin/client-admin-customers-page";

export default async function AdminCustomersPage() {
  // Fetch customers from the database
  const customers = await dbDirect.customers.findAll();

  return <ClientAdminCustomersPage initialCustomers={customers} />;
}
