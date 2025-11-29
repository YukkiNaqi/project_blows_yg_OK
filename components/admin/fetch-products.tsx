'use client';

import { useState, useEffect } from 'react';
import { type Product } from '@/lib/server-db';
import ClientAdminProductsPage from '@/components/admin/client-admin-products-page';

export default function FetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from API...'); // Debug log
        const response = await fetch('/api/admin/products');
        console.log('Response status:', response.status); // Debug log
        const data = await response.json();
        console.log('Fetched products:', data); // Debug log
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Periksa apakah perlu menyegarkan data setelah penambahan produk
    const shouldRefresh = window.sessionStorage.getItem('shouldRefreshProducts');
    if (shouldRefresh === 'true') {
      window.sessionStorage.removeItem('shouldRefreshProducts');
      refreshProducts();
    }
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  // Fungsi untuk memperbarui daftar produk
  const refreshProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ClientAdminProductsPage initialProducts={products} refreshProducts={refreshProducts} />;
}