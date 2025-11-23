// API route untuk mengambil kategori
// D:\DOCUMENTS\CODING\APLIKASI BLOWS 2\CLONE full-stack-blows-yang-kedua\app\api\admin\categories\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  try {
    const connection = await createDbConnection();

    // Get all categories
    const [rows] = await connection.execute(
      'SELECT id, name, description, image_url, created_at FROM categories ORDER BY name'
    );
    
    const categories = Array.isArray(rows) ? rows : [];

    await connection.end();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}