import { notFound } from 'next/navigation'
import { dbDirect, type Product } from '@/lib/server-db'
import ProductDetailClient from './client-product-detail'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = parseInt(params.id)

  if (isNaN(productId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">ID Produk Tidak Valid</h2>
          <p className="text-muted-foreground mb-4">ID produk yang dimasukkan tidak valid</p>
          <Link href="/products" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Produk
          </Link>
        </div>
      </div>
    )
  }

  // Ambil data produk dari database
  const product = await dbDirect.products.findById(productId)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-4">Produk dengan ID {productId} tidak ditemukan di database</p>
          <Link href="/products" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Produk
          </Link>
        </div>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}