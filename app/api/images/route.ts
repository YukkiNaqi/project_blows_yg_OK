import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const file = formData.get('image') as File;

    if (!productId || !file) {
      return NextResponse.json(
        { error: 'Product ID and image file are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save image data to database
    const connection = await createDbConnection();
    await connection.execute(
      'UPDATE products SET image_data = ? WHERE id = ?',
      [buffer, parseInt(productId)]
    );
    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      productId: parseInt(productId)
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Retrieve image data from database
    const connection = await createDbConnection();
    const [results] = await connection.execute(
      'SELECT image_data, name FROM products WHERE id = ?',
      [parseInt(productId)]
    );
    
    if (Array.isArray(results) && results.length > 0) {
      const product = results[0] as { image_data: Buffer | null; name: string };
      
      if (product.image_data) {
        // Return the image
        const response = new Response(product.image_data, {
          headers: {
            'Content-Type': 'image/jpeg', // Adjust based on actual image type
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          },
        });
        return response;
      } else {
        return NextResponse.json(
          { error: 'Image not found for this product' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve image' },
      { status: 500 }
    );
  }
}