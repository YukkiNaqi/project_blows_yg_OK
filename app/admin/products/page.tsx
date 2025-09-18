"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, Eye } from "lucide-react"
import { db, type Product, formatCurrency, calculateMargin } from "@/lib/database"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await db.products.findAll()
      setProducts(data)
      setFilteredProducts(data)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { label: "Habis", variant: "destructive" as const }
    } else if (product.stock_quantity <= product.min_stock_level) {
      return { label: "Rendah", variant: "secondary" as const }
    } else {
      return { label: "Tersedia", variant: "default" as const }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Produk</h1>
          <p className="text-muted-foreground">Kelola inventori dan informasi produk</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Produk</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Stok Rendah</p>
                <p className="text-2xl font-bold">
                  {products.filter((p) => p.stock_quantity <= p.min_stock_level).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">₹</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Nilai Inventori</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">%</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Rata-rata Margin</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    products.reduce((sum, p) => sum + calculateMargin(p.price, p.cost_price), 0) / products.length,
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk, brand, atau SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  const margin = calculateMargin(product.price, product.cost_price)

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.stock_quantity}</p>
                          <p className="text-xs text-muted-foreground">Min: {product.min_stock_level}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${margin > 30 ? "text-green-600" : margin > 15 ? "text-yellow-600" : "text-red-600"}`}
                        >
                          {margin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail Produk</DialogTitle>
                              </DialogHeader>
                              {selectedProduct && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <img
                                      src={selectedProduct.image_url || "/placeholder.svg"}
                                      alt={selectedProduct.name}
                                      className="w-full h-48 object-cover rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                                      <p className="text-muted-foreground">{selectedProduct.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-muted-foreground">SKU</p>
                                        <p className="font-medium">{selectedProduct.sku}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Brand</p>
                                        <p className="font-medium">{selectedProduct.brand}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Harga Jual</p>
                                        <p className="font-medium">{formatCurrency(selectedProduct.price)}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Harga Beli</p>
                                        <p className="font-medium">{formatCurrency(selectedProduct.cost_price)}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Stok</p>
                                        <p className="font-medium">{selectedProduct.stock_quantity} unit</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">Margin</p>
                                        <p className="font-medium text-green-600">
                                          {calculateMargin(selectedProduct.price, selectedProduct.cost_price).toFixed(
                                            1,
                                          )}
                                          %
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
