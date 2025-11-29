'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { Plus, Edit, Trash2, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/database';
import { type Product } from '@/lib/server-db';

interface ClientAdminProductsPageProps {
  initialProducts: Product[];
  refreshProducts?: () => void;
}

export default function ClientAdminProductsPage({ initialProducts, refreshProducts }: ClientAdminProductsPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Define columns for the data table
  const columns = [
    {
      accessorKey: 'image_data',
      header: 'Image',
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
        // Display image if available in database, otherwise show placeholder
        return (
          <div className="w-12 h-12 rounded overflow-hidden">
            {product.image_data ? (
              <img
                src={`/api/images?productId=${product.id}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-500" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
        return <span>{formatCurrency(product.price)}</span>;
      },
    },
    {
      accessorKey: 'stock_quantity',
      header: 'Stock',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.is_active ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
        console.log('Rendering action buttons for product ID:', product.id); // Debug log
        return (
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/products/${product.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-destructive">
              <Link href={`/admin/products/${product.id}/delete`}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  // Fungsi untuk menambah produk baru ke daftar
  const addProductToList = (newProduct: Product) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button asChild>
          <Link href="/admin/products/new" onClick={() => {
            // Set callback untuk memperbarui daftar produk setelah penambahan
            window.sessionStorage.setItem('addProductCallback', 'true');
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  );
}