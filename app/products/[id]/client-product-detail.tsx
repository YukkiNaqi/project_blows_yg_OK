'use client';

import { useState, useEffect } from 'react';
import { type Product } from '@/lib/server-db';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { ShoppingCart, Package, Tag, Ruler, Wrench, Cpu, Wifi, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [imageSrc, setImageSrc] = useState(`/api/images?productId=${product.id}`);

  const handleImageError = () => {
    setImageSrc("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTlFOUU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzc1NzU3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPktvbnRlbiBLYWxpIE5vcm1hbDwvdGV4dD48L3N2Zz4=");
  };

  // Parse specifications dari JSON string
  const [specifications, setSpecifications] = useState<Record<string, any>>({});

  useEffect(() => {
    try {
      const parsedSpecs = typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications || {};
      setSpecifications(parsedSpecs);
    } catch (e) {
      console.error('Error parsing specifications:', e);
      setSpecifications({});
    }
  }, [product.specifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link href="/products" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Produk
          </Link>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:underline">Produk</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gambar Produk */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-navy-100 flex items-center justify-center aspect-square">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={handleImageError}
              />
            </div>

            {/* Thumbnails - jika ada */}
          </div>

          {/* Info Produk */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-navy-100">
              <Badge variant="secondary" className="bg-navy-100 text-navy-900 mb-3">
                {product.brand}
              </Badge>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-navy-800">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(product.price)}
                </span>
                {product.cost_price && product.price > product.cost_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(product.cost_price)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center bg-navy-50 p-3 rounded-lg">
                  <Package className="h-5 w-5 mr-2 text-navy-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">Stok Tersedia</p>
                    <p className={`font-medium ${product.stock_quantity <= product.min_stock_level ? 'text-destructive' : 'text-navy-800'}`}>
                      {product.stock_quantity} unit
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-navy-50 p-3 rounded-lg">
                  <Tag className="h-5 w-5 mr-2 text-navy-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">SKU Produk</p>
                    <p className="font-medium text-navy-800">{product.sku}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-navy-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <AddToCartButton
                  product={{
                    ...product,
                    image_url: `/api/images?productId=${product.id}`
                  }}
                  variant="default"
                  size="lg"
                  className="flex-1 bg-navy-800 hover:bg-navy-900 text-white"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Masukkan Keranjang
                </AddToCartButton>
                <Button variant="outline" size="lg" className="border-navy-800 text-navy-800 hover:bg-navy-50">
                  <Wrench className="h-5 w-5 mr-2" />
                  Beli Sekarang
                </Button>
              </div>

              {/* Status Produk */}
              <div className="mt-4 flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-navy-700">
                  {product.is_active ? 'Tersedia untuk Pembelian' : 'Tidak Aktif/Tidak Tersedia'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Produk */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spesifikasi Teknis */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-navy-100 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-navy-900">
                <Ruler className="h-5 w-5 mr-2 text-navy-700" />
                Spesifikasi Teknis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(specifications).length > 0 ? (
                  Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-navy-100 pb-3">
                      <div className="text-sm text-navy-600 font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                      <div className="font-medium text-navy-900">{String(value)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic col-span-2 py-4 text-center bg-navy-50 rounded-lg">
                    Tidak ada spesifikasi teknis yang tersedia untuk produk ini.
                  </div>
                )}

                {/* Spesifikasi utama dari database */}
                <div className="border-b border-navy-100 pb-3">
                  <div className="text-sm text-navy-600 font-medium">Kategori ID</div>
                  <div className="font-medium text-navy-900">{product.category_id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-navy-100 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-navy-900">
                <Cpu className="h-5 w-5 mr-2 text-navy-700" />
                Informasi Produk
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-navy-600 font-medium">Brand</div>
                  <div className="font-medium text-navy-900">{product.brand}</div>
                </div>

                <div>
                  <div className="text-sm text-navy-600 font-medium">SKU</div>
                  <div className="font-medium text-navy-900">{product.sku}</div>
                </div>

                <div>
                  <div className="text-sm text-navy-600 font-medium">Stok Tersedia</div>
                  <div className={`font-medium ${product.stock_quantity <= product.min_stock_level ? 'text-destructive' : 'text-navy-900'}`}>
                    {product.stock_quantity} unit
                  </div>
                </div>

                <div>
                  <div className="text-sm text-navy-600 font-medium">Minimal Stok</div>
                  <div className="font-medium text-navy-900">{product.min_stock_level} unit</div>
                </div>

                <div>
                  <div className="text-sm text-navy-600 font-medium">Status</div>
                  <div className={`font-medium capitalize ${product.is_active ? 'text-green-600' : 'text-destructive'}`}>
                    {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-navy-600 font-medium">Tanggal Ditambahkan</div>
                  <div className="font-medium text-navy-900">{new Date(product.created_at).toLocaleDateString('id-ID')}</div>
                </div>
              </div>
            </div>

            {/* Fitur Khusus */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-navy-800">
              <h3 className="text-xl font-bold mb-4 flex items-center text-navy-900">
                <Wifi className="h-5 w-5 mr-2 text-electric-cyan" />
                Keunggulan Produk
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-electric-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-navy-900">Garansi resmi dari produsen</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-electric-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-navy-900">Kualitas terjamin dan tahan lama</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-electric-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-navy-900">Dukungan teknis purna jual</span>
                </li>
                <li className="flex items-start">
                  <div className="h-2 w-2 bg-electric-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-navy-900">Kompatibel dengan standar industri</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}