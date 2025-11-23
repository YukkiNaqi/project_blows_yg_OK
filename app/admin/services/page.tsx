import { dbDirect } from "@/lib/server-db";
import ClientAdminServicesPage from "@/components/admin/client-admin-services-page";

export default async function AdminServicesPage() {
  // Fetch service bookings from the database
  const bookings = await dbDirect.serviceBookings.findAll();

  return <ClientAdminServicesPage initialBookings={bookings} />;
}