"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/server-db"

interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "outline"
  size?: "sm" | "default" | "lg"
  disabled?: boolean
}

export function AddToCartButton({ product, variant = "default", size = "default" }: AddToCartButtonProps) {
  const { addToCart, getItemQuantity, updateQuantity } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const currentQuantity = getItemQuantity(product.id)

  const handleAddToCart = async () => {
    if (product.stock_quantity <= 0) {
      toast({
        title: "Stok Habis",
        description: "Produk ini sedang tidak tersedia",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url || "/placeholder.svg",
          brand: product.brand,
          stock_quantity: product.stock_quantity,
        },
        1,
      )

      toast({
        title: "Berhasil ditambahkan",
        description: `${product.name} telah ditambahkan ke keranjang`,
      })
    } catch (error) {
      toast({
        title: "Gagal menambahkan",
        description: "Terjadi kesalahan saat menambahkan produk ke keranjang",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (currentQuantity > 0) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-transparent"
          onClick={() => updateQuantity(product.id, currentQuantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm font-medium w-8 text-center">{currentQuantity}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-transparent"
          onClick={() => updateQuantity(product.id, currentQuantity + 1)}
          disabled={currentQuantity >= product.stock_quantity}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading || product.stock_quantity <= 0}
      className="flex-1"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isLoading ? "Menambahkan..." : product.stock_quantity <= 0 ? "Stok Habis" : "Beli"}
    </Button>
  )
}
