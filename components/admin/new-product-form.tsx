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
import { type Category } from '@/lib/server-db';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    min_stock_level: '5', // Default value
    sku: '',
    brand: '',
    specifications: '{}', // JSON string
    is_active: true,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API...'); // Logging untuk debugging
        const response = await fetch('/api/admin/categories');

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }

        const data: Category[] = await response.json();
        console.log('Categories fetched from API:', data); // Logging untuk debugging
        console.log('Number of categories:', data.length); // Logging tambahan
        setCategories(data);

        // Set loading ke false setelah kategori diambil
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
        setLoading(false); // Pastikan loading di-set false walaupun error
      }
    };

    fetchCategories();

    // Cleanup function untuk membersihkan URL pratinjau gambar
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    console.log(`Input change - ${id}: ${value}`); // Logging untuk debugging
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      console.log('File selected:', file.name, 'Size:', file.size, 'bytes'); // Debug log
      console.log('File size in KB:', (file.size / 1024).toFixed(2)); // Debug log

      // Batasi ukuran file maksimal 800 KB
      const maxSize = 800 * 1024; // 800 KB dalam bytes
      console.log('Max allowed size:', maxSize, 'bytes'); // Debug log

      if (file.size > maxSize) {
        console.log('File is too large, showing alert'); // Debug log
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

      console.log('File size is acceptable, creating preview'); // Debug log
      // Buat URL pratinjau untuk file yang valid
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      console.log(`Image selected: ${file.name}, size: ${file.size} bytes (${(file.size / 1024).toFixed(2)} KB)`); // Logging untuk debugging
    } else {
      // Jika tidak ada file yang dipilih (misalnya pengguna membatalkan pemilihan), hapus pratinjau
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Form Data:', formData); // Logging untuk debugging

      // Validasi data sebelum dikirim
      if (!formData.category_id || !formData.category_id.trim() ||
          !formData.name || !formData.name.trim() ||
          !formData.sku || !formData.sku.trim() ||
          !formData.brand || !formData.brand.trim() ||
          !formData.price || !formData.price.toString().trim() ||
          !formData.cost_price || !formData.cost_price.toString().trim() ||
          !formData.stock_quantity || !formData.stock_quantity.toString().trim()) {
        throw new Error('All required fields must be filled');
      }

      // Validasi ukuran file gambar jika ada
      if (formData.image) {
        if (formData.image.size > 800 * 1024) {
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
          return;
        } else {
          console.log(`Valid image size: ${(formData.image.size / 1024).toFixed(2)} KB`); // Logging untuk debugging
        }
      }

      console.log('All required fields exist'); // Logging untuk debugging

      const price = parseFloat(formData.price);
      const costPrice = parseFloat(formData.cost_price);
      const stockQuantity = parseInt(formData.stock_quantity);
      const minStockLevel = parseInt(formData.min_stock_level || '5');

      console.log('Parsed values:', { price, costPrice, stockQuantity, minStockLevel }); // Logging tambahan

      if (isNaN(price) || isNaN(costPrice) || isNaN(stockQuantity) || isNaN(minStockLevel)) {
        throw new Error('Price, cost price, and stock quantity must be valid numbers');
      }

      if (price <= 0 || costPrice <= 0 || stockQuantity < 0) {
        throw new Error('Price and cost price must be greater than 0, stock quantity must be at least 0');
      }

      console.log('Values are valid'); // Logging untuk debugging

      const formDataToSend = new FormData();
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim() || '');
      formDataToSend.append('price', price.toString());
      formDataToSend.append('cost_price', costPrice.toString());
      formDataToSend.append('stock_quantity', stockQuantity.toString());
      formDataToSend.append('min_stock_level', minStockLevel.toString());
      formDataToSend.append('sku', formData.sku.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('specifications', formData.specifications || '{}');
      formDataToSend.append('is_active', formData.is_active.toString());

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Sending form data to API...'); // Logging untuk debugging

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Response status:', response.status); // Logging status
      const result = await response.json();
      console.log('API Response:', result); // Logging untuk debugging

      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
        // Set flag to indicate refresh is needed
        window.sessionStorage.setItem('shouldRefreshProducts', 'true');
        router.push('/admin/products'); // Redirect to products list
      } else {
        throw new Error(result.message || 'Failed to create product');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      // Hapus pratinjau gambar setelah pengiriman selesai
      setImagePreview(null);
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  console.log('Rendering form - Categories:', categories); // Logging untuk debugging
  console.log('Rendering form - Categories length:', categories.length); // Logging tambahan

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => {
                  console.log('Category selected:', value); // Logging untuk debugging
                  setFormData(prev => ({...prev, category_id: value}));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="no-category" value="no-category" disabled>
                        No categories available (count: {categories.length})
                      </SelectItem>
                    )}
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
              <Label htmlFor="image">Product Image</Label>
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
                onCheckedChange={(checked) => setFormData(prev => ({...prev, is_active: Boolean(checked)}))}
              />
              <Label htmlFor="is_active">Product is Active</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}