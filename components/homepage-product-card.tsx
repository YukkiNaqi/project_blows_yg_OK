'use client';

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { type Product, formatCurrency } from "@/lib/server-db";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index: number;
}

export const HomepageProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <CardContent className="p-4 flex-1">
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <img
              src={`/api/images?productId=${product.id}`}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTlFOUU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzc1NzU3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPktvbnRlbiBLYWxpIE5vcm1hbDwvdGV4dD48L3N2Zz4=";
              }}
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
        <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
            <Link href={`/products/${product.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Detail
            </Link>
          </Button>
          <AddToCartButton product={product} size="sm" />
        </CardFooter>
      </Card>
    </motion.div>
  );
};