// API route for product operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get('operation');
  const id = searchParams.get('id');
  const category = searchParams.get('category');

  try {
    const connection = await createDbConnection();

    let result;
    switch (operation) {
      case 'allProducts':
        const [products] = await connection.execute(`
          SELECT id, category_id, name, description, image_url, price, cost_price, stock_quantity,
                 min_stock_level, sku, brand, specifications, is_active, created_at
          FROM products
          WHERE is_active = TRUE
          ORDER BY created_at DESC
        `);
        result = products;
        break;

      case 'productById':
        if (!id) {
          return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const [product] = await connection.execute(
          'SELECT id, category_id, name, description, image_url, image_data, price, cost_price, stock_quantity,
                  min_stock_level, sku, brand, specifications, is_active, created_at
           FROM products WHERE id = ?',
          [Number(id)]
        );
        result = product;
        break;

      case 'productsByCategory':
        if (!category) {
          return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }
        const [catProducts] = await connection.execute(`
          SELECT id, category_id, name, description, image_url, price, cost_price, stock_quantity,
                 min_stock_level, sku, brand, specifications, is_active, created_at
          FROM products
          WHERE category_id = ? AND is_active = TRUE
          ORDER BY created_at DESC
        `, [Number(category)]);
        result = catProducts;
        break;

      case 'featuredProducts':
        const [featured] = await connection.execute(`
          SELECT id, category_id, name, description, image_url, price, cost_price, stock_quantity,
                 min_stock_level, sku, brand, specifications, is_active, created_at
          FROM products
          WHERE is_active = TRUE
          ORDER BY created_at DESC
          LIMIT 4
        `);
        result = featured;
        break;

      case 'allCategories':
        const [categories] = await connection.execute('SELECT * FROM categories ORDER BY name');
        result = categories;
        break;

      case 'categoryById':
        if (!id) {
          return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }
        const [categoryResult] = await connection.execute(
          'SELECT * FROM categories WHERE id = ?',
          [Number(id)]
        );
        result = categoryResult;
        break;

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    await connection.end();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}