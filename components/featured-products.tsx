import { dbDirect, type Product, formatCurrency } from "@/lib/server-db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";

export async function FeaturedProducts() {
  const products = await dbDirect.products.findFeatured();

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
            <ProductCard
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
    </section>
  );
}