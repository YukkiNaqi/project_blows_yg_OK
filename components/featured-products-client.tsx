'use client';

import { useState, useEffect } from 'react';
import { HomepageProductCard } from './homepage-product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeaturedProductsClientProps {
  initialProducts: any[]; // Sesuaikan dengan type Product
}

export default function FeaturedProductsClient({ initialProducts }: FeaturedProductsClientProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="py-16 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Produk Unggulan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Pilihan terbaik peralatan jaringan dengan kualitas premium dan harga kompetitif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialProducts.map((product, index) => (
            <HomepageProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">Lihat Semua Produk</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}