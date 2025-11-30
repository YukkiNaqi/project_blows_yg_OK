'use client';

import { type Category } from "@/lib/server-db";
import { HomepageCategoryCard } from "./homepage-category-card"; // Menggunakan komponen yang sudah ada
import { Network, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CategoryIntroSectionClient({ initialCategories }: { initialCategories: Category[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-16 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Network className="h-4 w-4 mr-2" />
            <span>Kategori Produk</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Jelajahi Kategori Produk Kami</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Temukan berbagai peralatan jaringan sesuai kebutuhan Anda dalam kategori-kategori berikut
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {initialCategories.map((category, index) => (
            <HomepageCategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">
              <Package className="h-4 w-4 mr-2" />
              Lihat Semua Kategori
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}