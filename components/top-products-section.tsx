'use client';

import { useState, useEffect } from 'react';
import { type Product } from "@/lib/server-db";
import { HomepageProductCard } from "./homepage-product-card";
import { Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TopProductsSection({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-16 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Zap className="h-4 w-4 mr-2" />
            <span>Produk Terlaris</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Produk Paling Diminati</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Temukan produk-produk unggulan kami yang paling banyak dibeli oleh pelanggan
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
          <Button asChild size="lg" variant="default">
            <Link href="/products">
              <TrendingUp className="h-4 w-4 mr-2" />
              Lihat Semua Produk Terlaris
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}