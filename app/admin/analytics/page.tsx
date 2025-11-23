import { dbDirect } from "@/lib/server-db";
import ClientAdminAnalyticsPage from "@/components/admin/client-admin-analytics-page";

export default async function AdminAnalyticsPage() {
  // Fetch data for analytics
  const products = await dbDirect.products.findAll();
  const orders = await dbDirect.orders.findAll();
  const customers = await dbDirect.customers.findAll();

  // Calculate analytics data
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Prepare data for charts
  const salesData = [
    { month: "Jan", sales: 45000000, orders: 23 },
    { month: "Feb", sales: 52000000, orders: 28 },
    { month: "Mar", sales: 48000000, orders: 25 },
    { month: "Apr", sales: 61000000, orders: 32 },
    { month: "May", sales: 55000000, orders: 29 },
    { month: "Jun", sales: 67000000, orders: 35 },
  ];

  const categoryData = [
    { name: "Router", value: 35, color: "#0ea5e9" },
    { name: "Switch", value: 25, color: "#3b82f6" },
    { name: "Kabel LAN", value: 20, color: "#6366f1" },
    { name: "Access Point", value: 15, color: "#8b5cf6" },
    { name: "Modem", value: 5, color: "#a855f7" },
  ];

  const topProducts = products
    .sort((a, b) => b.stock_quantity - a.stock_quantity)
    .slice(0, 3)
    .map(product => ({
      name: product.name,
      sold: 0, // This would come from order items in a real implementation
      revenue: 0 // This would come from order items in a real implementation
    }));

  const lowStockProductsList = products
    .filter(p => p.stock_quantity <= p.min_stock_level)
    .slice(0, 5);

  return (
    <ClientAdminAnalyticsPage 
      initialStats={{
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        lowStockProducts,
        pendingOrders,
        monthlyGrowth: 12.5,
      }}
      salesData={salesData}
      categoryData={categoryData}
      topProducts={topProducts}
      lowStockProductsList={lowStockProductsList}
    />
  );
}
