"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, CheckCircle, XCircle, Clock, Truck, Package, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/database"

// Mock orders data
const mockOrders = [
  {
    id: 1,
    order_number: "ORD-001234",
    customer_name: "PT. Teknologi Maju",
    customer_email: "admin@teknologimaju.com",
    status: "pending",
    payment_method: "transfer",
    payment_status: "pending",
    total_amount: 2500000,
    created_at: "2024-01-15T10:30:00Z",
    items: [
      { product_name: "TP-Link Archer C6 AC1200", quantity: 2, unit_price: 450000 },
      { product_name: "Netgear GS108 8-Port Switch", quantity: 5, unit_price: 320000 },
    ],
  },
  {
    id: 2,
    order_number: "ORD-001235",
    customer_name: "CV. Solusi Digital",
    customer_email: "order@solusidigitak.com",
    status: "confirmed",
    payment_method: "transfer",
    payment_status: "paid",
    total_amount: 1800000,
    created_at: "2024-01-14T14:20:00Z",
    items: [
      { product_name: "ASUS RT-AX55 AX1800", quantity: 2, unit_price: 850000 },
      { product_name: "Kabel LAN Cat5e 1 Meter", quantity: 10, unit_price: 15000 },
    ],
  },
  {
    id: 3,
    order_number: "ORD-001236",
    customer_name: "Toko Komputer Jaya",
    customer_email: "jaya@tokojaya.com",
    status: "shipped",
    payment_method: "cod",
    payment_status: "pending",
    total_amount: 3200000,
    created_at: "2024-01-13T09:15:00Z",
    items: [
      { product_name: "Ubiquiti UniFi AP AC Lite", quantity: 2, unit_price: 1250000 },
      { product_name: "D-Link DGS-1016A 16-Port Switch", quantity: 1, unit_price: 580000 },
    ],
  },
]

export default function AdminOrdersPage() {
  const [orders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-yellow-500">
            <Package className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge className="bg-purple-500">
            <Truck className="h-3 w-3 mr-1" />
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua pesanan pelanggan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "confirmed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Nilai</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.total_amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor pesanan atau pelanggan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Pesanan</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                    <TableCell className="capitalize">
                      {order.payment_method === "transfer" ? "Transfer" : "COD"}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.total_amount)}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detail Pesanan {selectedOrder?.order_number}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Informasi Pelanggan</h4>
                                  <p className="text-sm">
                                    <strong>Nama:</strong> {selectedOrder.customer_name}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Email:</strong> {selectedOrder.customer_email}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Status Pesanan</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">Status:</span>
                                      {getStatusBadge(selectedOrder.status)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">Pembayaran:</span>
                                      {getPaymentStatusBadge(selectedOrder.payment_status)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold mb-2">Item Pesanan</h4>
                                <div className="border rounded-lg">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.items.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>{item.product_name}</TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                                          <TableCell>{formatCurrency(item.quantity * item.unit_price)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                <div className="flex justify-end mt-4">
                                  <div className="text-right">
                                    <p className="text-lg font-bold">
                                      Total: {formatCurrency(selectedOrder.total_amount)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-4 border-t">
                                {selectedOrder.status === "pending" && (
                                  <>
                                    <Button className="bg-green-500 hover:bg-green-600">Konfirmasi Pesanan</Button>
                                    <Button variant="destructive">Batalkan Pesanan</Button>
                                  </>
                                )}
                                {selectedOrder.status === "confirmed" && (
                                  <Button className="bg-blue-500 hover:bg-blue-600">Proses Pesanan</Button>
                                )}
                                {selectedOrder.status === "processing" && (
                                  <Button className="bg-purple-500 hover:bg-purple-600">Kirim Pesanan</Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
