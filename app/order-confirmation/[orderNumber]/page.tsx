"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, CreditCard, Truck, Copy, Phone, Mail } from "lucide-react"
import { formatCurrency } from "@/lib/database"
import { orderService, type Order, type PaymentInfo } from "@/lib/orders"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)

  useEffect(() => {
    // In production, fetch order from API
    // Mock order data for demonstration
    const mockOrder: Order = {
      id: 1,
      order_number: orderNumber,
      customer_name: "John Doe",
      customer_email: "john@example.com",
      customer_phone: "08123456789",
      shipping_address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
      payment_method: "transfer",
      payment_status: "pending",
      status: "pending",
      subtotal: 2500000,
      tax_amount: 275000,
      shipping_cost: 0,
      total_amount: 2775000,
      items: [
        {
          product_id: 1,
          product_name: "TP-Link Archer C6 AC1200",
          quantity: 2,
          unit_price: 450000,
          total_price: 900000,
        },
        {
          product_id: 2,
          product_name: "Netgear GS108 8-Port Switch",
          quantity: 5,
          unit_price: 320000,
          total_price: 1600000,
        },
      ],
      created_at: new Date().toISOString(),
    }

    setOrder(mockOrder)

    // Generate payment info for transfer orders
    if (mockOrder.payment_method === "transfer") {
      const payment = orderService.generatePaymentInfo(mockOrder)
      setPaymentInfo(payment)
    }
  }, [orderNumber])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Berhasil disalin",
      description: `${label} telah disalin ke clipboard`,
    })
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Pesanan Berhasil Dibuat!</h1>
              <p className="text-muted-foreground">
                Terima kasih atas pesanan Anda. Berikut adalah detail pesanan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Nomor Pesanan</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{order.order_number}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 bg-transparent"
                          onClick={() => copyToClipboard(order.order_number, "Nomor pesanan")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Menunggu Pembayaran
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tanggal Pesanan</span>
                      <span>{new Date(order.created_at!).toLocaleDateString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Metode Pembayaran</span>
                      <span className="capitalize">
                        {order.payment_method === "transfer" ? "Transfer Bank" : "COD"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Pengiriman</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm">{order.shipping_address}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Item Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.total_price)}</p>
                        </div>
                      ))}
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ongkir</span>
                          <span>{order.shipping_cost === 0 ? "Gratis" : formatCurrency(order.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PPN (11%)</span>
                          <span>{formatCurrency(order.tax_amount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-6">
                {order.payment_method === "transfer" && paymentInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Instruksi Pembayaran
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800 mb-2">Selesaikan pembayaran sebelum:</p>
                        <p className="text-lg font-bold text-yellow-900">
                          {new Date(paymentInfo.deadline).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Bank</p>
                          <p className="font-medium">{paymentInfo.bank_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nomor Rekening</p>
                          <div className="flex items-center gap-2">
                            <p className="font-mono font-medium">{paymentInfo.account_number}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => copyToClipboard(paymentInfo.account_number, "Nomor rekening")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Atas Nama</p>
                          <p className="font-medium">{paymentInfo.account_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Jumlah Transfer</p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-primary">{formatCurrency(paymentInfo.amount)}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => copyToClipboard(paymentInfo.amount.toString(), "Jumlah transfer")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Kode Pembayaran</p>
                          <div className="flex items-center gap-2">
                            <p className="font-mono font-medium">{paymentInfo.payment_code}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => copyToClipboard(paymentInfo.payment_code, "Kode pembayaran")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Catatan:</strong> Sertakan kode pembayaran dalam berita transfer untuk mempercepat
                          verifikasi.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {order.payment_method === "cod" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Informasi COD
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          Pesanan Anda akan diproses dan dikirim. Pembayaran dilakukan saat barang diterima.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Estimasi pengiriman: 1-3 hari kerja</p>
                        <p className="text-sm text-muted-foreground">
                          Total yang harus dibayar: {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Butuh Bantuan?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">088229157588</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">BlowsSystem@gmail.com</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/contact">Hubungi Customer Service</Link>
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/products">Lanjut Belanja</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/">Kembali ke Beranda</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
