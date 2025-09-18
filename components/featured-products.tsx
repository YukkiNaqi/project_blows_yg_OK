"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { db, type Product, formatCurrency } from "@/lib/database"
import { AddToCartButton } from "@/components/product/add-to-cart-button"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await db.products.findFeatured()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Produk Unggulan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Pilihan terbaik peralatan jaringan dengan kualitas premium dan harga kompetitif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock_quantity <= product.min_stock_level && (
                    <Badge className="absolute top-2 right-2 bg-destructive">Stok Terbatas</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.brand}
                  </Badge>
                  <h3 className="font-semibold text-sm leading-tight text-balance">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                    <span className="text-xs text-muted-foreground">Stok: {product.stock_quantity}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Link>
                </Button>
                <AddToCartButton product={product} size="sm" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">Lihat Semua Produk</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
