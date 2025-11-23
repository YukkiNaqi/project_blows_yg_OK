"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, CreditCard, Truck, AlertCircle, MapPin } from "lucide-react"
import { useCart } from "@/lib/cart"
import { orderServiceClient, type Order } from "@/lib/order-service-client"
import { formatCurrency } from "@/lib/database"
import { toast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "transfer" as "transfer" | "cod",
    notes: "",
  })

  const [costs, setCosts] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/products")
    }
  }, [cart.items.length, router])

  // Calculate costs when form data changes
  useEffect(() => {
    const subtotal = cart.total
    const calculateCosts = async () => {
      let shipping = 0
      if (formData.shipping_address) {
        shipping = await orderServiceClient.calculateShipping(formData.shipping_address)
      }
      const tax = await orderServiceClient.calculateTax(subtotal)
      const total = subtotal + shipping + tax

      setCosts({ subtotal, shipping, tax, total })
    }
    calculateCosts()
  }, [cart.total, formData.shipping_address])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = async (): Promise<string | null> => {
    if (!formData.customer_name.trim()) return "Nama lengkap harus diisi"
    if (!formData.customer_email.trim()) return "Email harus diisi"
    if (!formData.customer_phone.trim()) return "Nomor telepon harus diisi"
    if (!formData.shipping_address.trim()) return "Alamat pengiriman harus diisi"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.customer_email)) {
      return "Format email tidak valid"
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/
    if (!phoneRegex.test(formData.customer_phone)) {
      return "Format nomor telepon tidak valid"
    }

    // COD area validation
    if (formData.payment_method === "cod" && !(await orderServiceClient.isCODAvailable(formData.shipping_address))) {
      return "COD hanya tersedia untuk area Jakarta"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      const validationError = await validateForm()
      if (validationError) {
        toast({
          title: "Form tidak valid",
          description: validationError,
          variant: "destructive",
        })
        return
      }

      // Create order
      const orderData: Omit<Order, "id" | "order_number" | "created_at"> = {
        ...formData,
        status: "pending",
        payment_status: formData.payment_method === "cod" ? "pending" : "pending",
        subtotal: costs.subtotal,
        tax_amount: costs.tax,
        shipping_cost: costs.shipping,
        total_amount: costs.total,
        items: cart.items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        })),
      }

      const order = await orderServiceClient.createOrder(orderData)

      // Clear cart
      clearCart()

      // Redirect to order confirmation
      router.push(`/order-confirmation/${order.order_number}`)

      toast({
        title: "Pesanan berhasil dibuat",
        description: `Nomor pesanan: ${order.order_number}`,
      })
    } catch (error) {
      toast({
        title: "Gagal membuat pesanan",
        description: "Terjadi kesalahan saat memproses pesanan Anda",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const [codAvailable, setCodAvailable] = useState(false)

  useEffect(() => {
    const checkCOD = async () => {
      if (formData.payment_method === "cod" && formData.shipping_address) {
        const isAvailable = await orderServiceClient.isCODAvailable(formData.shipping_address)
        setCodAvailable(isAvailable)
      }
    }
    checkCOD()
  }, [formData.payment_method, formData.shipping_address])

  if (cart.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Informasi Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customer_name">Nama Lengkap *</Label>
                        <Input
                          id="customer_name"
                          value={formData.customer_name}
                          onChange={(e) => handleInputChange("customer_name", e.target.value)}
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customer_phone">Nomor Telepon *</Label>
                        <Input
                          id="customer_phone"
                          value={formData.customer_phone}
                          onChange={(e) => handleInputChange("customer_phone", e.target.value)}
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="customer_email">Email *</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => handleInputChange("customer_email", e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_address">Alamat Lengkap *</Label>
                      <Textarea
                        id="shipping_address"
                        value={formData.shipping_address}
                        onChange={(e) => handleInputChange("shipping_address", e.target.value)}
                        placeholder="Masukkan alamat lengkap termasuk kota dan kode pos"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Catatan (Opsional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Catatan tambahan untuk pesanan"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Metode Pembayaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.payment_method}
                      onValueChange={(value) => handleInputChange("payment_method", value)}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">Transfer Bank</p>
                            <p className="text-sm text-muted-foreground">
                              Transfer ke rekening BCA - Konfirmasi dalam 24 jam
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">COD (Cash on Delivery)</p>
                            <p className="text-sm text-muted-foreground">
                              Bayar saat barang diterima - Khusus area Jakarta
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {formData.payment_method === "cod" &&
                      formData.shipping_address &&
                      !codAvailable && (
                        <Alert className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>COD hanya tersedia untuk area Jakarta</AlertDescription>
                        </Alert>
                      )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Ringkasan Pesanan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(costs.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Ongkir
                        </span>
                        <span>{costs.shipping === 0 ? "Gratis" : formatCurrency(costs.shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PPN (11%)</span>
                        <span>{formatCurrency(costs.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(costs.total)}</span>
                      </div>
                    </div>

                    <Button onClick={handleSubmit} className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Memproses..." : "Buat Pesanan"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p className="font-medium">Informasi Pengiriman:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Gratis ongkir untuk area Jakarta</li>
                        <li>• Estimasi pengiriman 1-3 hari kerja</li>
                        <li>• COD hanya tersedia untuk Jakarta</li>
                        <li>• Barang akan dikirim setelah pembayaran dikonfirmasi</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
