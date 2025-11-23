// API route for product CRUD operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const connection = await createDbConnection();

    let result;
    if (id) {
      // Get single product by ID
      const [rows] = await connection.execute(
        'SELECT id, category_id, name, description, image_url, image_data, price, cost_price, stock_quantity, min_stock_level, sku, brand, specifications, is_active, created_at FROM products WHERE id = ?',
        [parseInt(id)]
      );
      result = Array.isArray(rows) ? rows[0] : null;
    } else {
      // Get all products
      const [rows] = await connection.execute(
        'SELECT id, category_id, name, description, image_url, image_data, price, cost_price, stock_quantity, min_stock_level, sku, brand, specifications, is_active, created_at FROM products ORDER BY created_at DESC'
      );
      result = Array.isArray(rows) ? rows : [];
    }

    await connection.end();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const connection = await createDbConnection();

    // Parse form data
    const formData = await request.formData();
    const category_id = parseInt(formData.get('category_id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const cost_price = parseFloat(formData.get('cost_price') as string);
    const stock_quantity = parseInt(formData.get('stock_quantity') as string);
    const min_stock_level = parseInt(formData.get('min_stock_level') as string);
    const sku = formData.get('sku') as string;
    const brand = formData.get('brand') as string;
    const specifications = formData.get('specifications') as string; // JSON string
    const is_active = formData.get('is_active') === 'true';
    const image = formData.get('image') as File | null;

    // Log data sebelum disimpan untuk debugging
    console.log('Creating product with data:', {
      category_id,
      name,
      description,
      price,
      cost_price,
      stock_quantity,
      min_stock_level,
      sku,
      brand,
      specifications,
      is_active
    });

    // Validasi data sebelum disimpan
    if (!category_id || !name || !sku || !brand || isNaN(price) || isNaN(cost_price) || isNaN(stock_quantity)) {
      console.error('Validation failed for product data:', {
        category_id, name, sku, brand, price, cost_price, stock_quantity
      });
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'All required fields must have valid values'
        },
        { status: 400 }
      );
    }

    // Handle image upload if present
    let imageData: Buffer | null = null;
    if (image) {
      // Batasi ukuran file maksimal 800 KB di server
      const maxSize = 800 * 1024; // 800 KB dalam bytes
      if (image.size > maxSize) {
        return NextResponse.json(
          {
            error: 'Failed to create product',
            message: 'Ukuran gambar terlalu besar. Maksimal 800 KB.'
          },
          { status: 400 }
        );
      }

      const bytes = await image.arrayBuffer();
      imageData = Buffer.from(bytes);
    }

    // Parse specifications JSON if provided
    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = JSON.parse(specifications);
      } catch (e) {
        console.error('Error parsing specifications:', e);
        // If JSON parsing fails, store as empty object
        parsedSpecifications = {};
      }
    }

    // Insert product into database
    const [result] = await connection.execute(`
      INSERT INTO products
      (category_id, name, description, price, cost_price, stock_quantity, min_stock_level, sku, brand, specifications, is_active, image_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id,
      name,
      description,
      price,
      cost_price,
      stock_quantity,
      min_stock_level,
      sku,
      brand,
      JSON.stringify(parsedSpecifications),
      is_active,
      imageData
    ]);

    const productId = (result as any).insertId;

    await connection.end();

    console.log('Product created successfully with ID:', productId);

    return NextResponse.json({
      success: true,
      id: productId,
      message: 'Product created successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create product',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();
    
    // Parse form data
    const formData = await request.formData();
    const category_id = parseInt(formData.get('category_id') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const cost_price = parseFloat(formData.get('cost_price') as string);
    const stock_quantity = parseInt(formData.get('stock_quantity') as string);
    const min_stock_level = parseInt(formData.get('min_stock_level') as string);
    const sku = formData.get('sku') as string;
    const brand = formData.get('brand') as string;
    const specifications = formData.get('specifications') as string; // JSON string
    const is_active = formData.get('is_active') === 'true';
    const image = formData.get('image') as File | null;

    // Parse specifications JSON if provided
    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = JSON.parse(specifications);
      } catch (e) {
        console.error('Error parsing specifications:', e);
        // If JSON parsing fails, keep existing specifications or use empty object
        parsedSpecifications = {};
      }
    }

    // Handle image upload if present
    let imageData: Buffer | null = null;
    if (image) {
      // Batasi ukuran file maksimal 800 KB di server untuk update
      const maxSize = 800 * 1024; // 800 KB dalam bytes
      if (image.size > maxSize) {
        return NextResponse.json(
          {
            error: 'Failed to update product',
            message: 'Ukuran gambar terlalu besar. Maksimal 800 KB.'
          },
          { status: 400 }
        );
      }

      const bytes = await image.arrayBuffer();
      imageData = Buffer.from(bytes);

      // Update with new image
      await connection.execute(`
        UPDATE products
        SET category_id=?, name=?, description=?, price=?, cost_price=?,
            stock_quantity=?, min_stock_level=?, sku=?, brand=?,
            specifications=?, is_active=?, image_data=?
        WHERE id=?
      `, [
        category_id,
        name,
        description,
        price,
        cost_price,
        stock_quantity,
        min_stock_level,
        sku,
        brand,
        JSON.stringify(parsedSpecifications),
        is_active,
        imageData,
        id
      ]);
    } else {
      // Update without changing image
      await connection.execute(`
        UPDATE products
        SET category_id=?, name=?, description=?, price=?, cost_price=?,
            stock_quantity=?, min_stock_level=?, sku=?, brand=?,
            specifications=?, is_active=?
        WHERE id=?
      `, [
        category_id,
        name,
        description,
        price,
        cost_price,
        stock_quantity,
        min_stock_level,
        sku,
        brand,
        JSON.stringify(parsedSpecifications),
        is_active,
        id
      ]);
    }

    await connection.end();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully' 
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();
    
    // Delete product from database
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    
    await connection.end();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}