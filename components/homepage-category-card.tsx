'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type Category } from "@/lib/server-db";
import { motion } from "framer-motion";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export const HomepageCategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <CardContent className="p-6 text-center flex-1 flex flex-col">
          <div className="mb-4 overflow-hidden rounded-lg flex-1 flex items-center justify-center">
            <img
              src={category.image_url || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTlFOUU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzc1NzU3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPktvbnRlbiBLYWxpIE5vcm1hbDwvdGV4dD48L3N2Zz4=";
              }}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 text-balance flex-1">{category.description}</p>
          <Button asChild variant="outline" size="sm" className="w-full bg-transparent mt-auto">
            <Link href={`/products?category=${category.id}`}>
              Lihat Produk
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};