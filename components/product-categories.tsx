import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { dbDirect, type Category } from "@/lib/server-db";
import { CategoryCard } from "./category-card";

export async function ProductCategories() {
  const categories = await dbDirect.categories.findAll();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Kategori Produk</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Temukan peralatan jaringan yang Anda butuhkan dari berbagai kategori produk berkualitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/products">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}