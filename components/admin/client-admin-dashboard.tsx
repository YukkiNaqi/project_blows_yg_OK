"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, DollarSign, Wrench } from "lucide-react";
import { formatCurrency, type Product } from "@/lib/server-db";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for charts
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

export default function ClientAdminDashboard({ products }: { products: Product[] }) {
  // Calculate low stock products
  const lowStockProducts = products.filter((p) => p.stock_quantity <= p.min_stock_level);

  // Mock calculations - in real app, these would come from actual database queries
  const stats = {
    totalProducts: products.length,
    totalOrders: 156,
    totalCustomers: 89,
    totalRevenue: 125000000,
    lowStockProducts: lowStockProducts.length,
    pendingOrders: 12,
    totalServices: 5,
    monthlyGrowth: 12.5,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas dan performa bisnis BLOWS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{stats.lowStockProducts} produk stok rendah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingOrders} menunggu konfirmasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+{Math.round(stats.monthlyGrowth)}% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Penjualan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), "Penjualan"]} />
                <Bar dataKey="sales" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Peringatan Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 2).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Stok: {product.stock_quantity} unit</p>
                  </div>
                  <Badge variant={product.stock_quantity === 0 ? "destructive" : "secondary"}>
                    {product.stock_quantity === 0 ? "Habis" : "Rendah"}
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Tidak ada produk dengan stok rendah
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">#ORD-001234</p>
                  <p className="text-sm text-muted-foreground">PT. Teknologi Maju</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(2500000)}</p>
                  <Badge>Pending</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">#ORD-001235</p>
                  <p className="text-sm text-muted-foreground">CV. Solusi Digital</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(1800000)}</p>
                  <Badge className="bg-green-500">Paid</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Tambah Produk</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Lihat Pesanan</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Kelola Layanan</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Lihat Statistik</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}