'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { type Category, type Product } from '@/lib/server-db';

export default function EditProductPage({ productId }: { productId: number }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    min_stock_level: '5',
    sku: '',
    brand: '',
    specifications: '{}',
    is_active: true,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for product ID:', productId); // Debug log
        // Fetch categories using API
        const categoriesResponse = await fetch('/api/admin/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData: Category[] = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch product details using API
        console.log('About to fetch product with ID:', productId); // Debug log
        const productResponse = await fetch(`/api/admin/products?id=${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData: Product | null = await productResponse.json();
        console.log('Product data received:', productData); // Debug log

        if (productData) {
          setProduct(productData);
          setFormData({
            category_id: productData.category_id.toString(),
            name: productData.name,
            description: productData.description,
            price: productData.price.toString(),
            cost_price: productData.cost_price.toString(),
            stock_quantity: productData.stock_quantity.toString(),
            min_stock_level: productData.min_stock_level.toString(),
            sku: productData.sku,
            brand: productData.brand,
            specifications: JSON.stringify(productData.specifications),
            is_active: productData.is_active,
            image: null, // We don't load the image file, just reference
          });
        } else {
          // Product not found - display error and redirect after delay
          console.log('Product not found for ID:', productId); // Debug log
          toast({
            title: 'Error',
            description: 'Product not found. Redirecting...',
            variant: 'destructive',
          });
          setTimeout(() => {
            router.push('/admin/products');
          }, 2000);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Cleanup function untuk membersihkan URL pratinjau gambar
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Batasi ukuran file maksimal 800 KB
      const maxSize = 800 * 1024; // 800 KB dalam bytes
      if (file.size > maxSize) {
        toast({
          title: 'Error',
          description: 'Ukuran gambar maksimal 800kb, coba untuk menggunakan gambar lain',
          variant: 'destructive',
        });
        // Reset input file agar pengguna bisa memilih file lain
        e.target.value = '';
        // Hapus pratinjau gambar jika sebelumnya sudah ada
        setImagePreview(null);
        return;
      }

      // Buat URL pratinjau untuk file yang valid
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setFormData(prev => ({
        ...prev,
        image: file
      }));
    } else {
      // Jika tidak ada file yang dipilih (misalnya pengguna membatalkan pemilihan), hapus pratinjau
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi ukuran file gambar jika ada
      if (formData.image) {
        const maxSize = 800 * 1024; // 800 KB dalam bytes
        if (formData.image.size > maxSize) {
          toast({
            title: 'Error',
            description: 'Ukuran gambar maksimal 800kb, coba untuk menggunakan gambar lain',
            variant: 'destructive',
          });
          // Reset input file agar pengguna bisa memilih file lain
          const imageInput = document.getElementById('image') as HTMLInputElement;
          if (imageInput) {
            imageInput.value = '';
          }
          // Hapus pratinjau gambar
          setImagePreview(null);
          // Tidak melanjutkan proses
          setLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('cost_price', formData.cost_price);
      formDataToSend.append('stock_quantity', formData.stock_quantity);
      formDataToSend.append('min_stock_level', formData.min_stock_level);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('specifications', formData.specifications);
      formDataToSend.append('is_active', formData.is_active.toString());

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
        router.push('/admin/products'); // Redirect to products list
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      // Hapus pratinjau gambar setelah pengiriman selesai
      setImagePreview(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">The product you are trying to edit does not exist or may have been deleted.</p>
        <Button onClick={() => router.push('/admin/products')}>Go Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  required
                />
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cost_price">Cost Price *</Label>
                <Input
                  id="cost_price"
                  type="number"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  placeholder="Enter cost price"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  required
                />
              </div>

              <div>
                <Label htmlFor="min_stock_level">Minimum Stock Level</Label>
                <Input
                  id="min_stock_level"
                  type="number"
                  value={formData.min_stock_level}
                  onChange={handleInputChange}
                  placeholder="Enter minimum stock level"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />
            </div>

            <div>
              <Label htmlFor="specifications">Specifications (JSON)</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                placeholder='Enter specifications as JSON (e.g., {"color": "black", "weight": "1kg"})'
              />
            </div>

            <div>
              <Label htmlFor="image">Product Image (leave empty to keep current)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG, WEBP. Maksimal ukuran file: 800 KB</p>

              {/* Pratinjau Gambar */}
              {imagePreview && (
                <div className="mt-4">
                  <Label>Preview Gambar:</Label>
                  <div className="mt-2 border rounded p-2 inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: Boolean(checked)})}
              />
              <Label htmlFor="is_active">Product is Active</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}