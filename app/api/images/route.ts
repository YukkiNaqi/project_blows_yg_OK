// API route untuk mengambil gambar produk
// D:\DOCUMENTS\CODING\APLIKASI BLOWS 2\CLONE full-stack-blows-yang-kedua\app\api\images\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    // Ambil image_data dari produk
    const [rows] = await connection.execute(
      'SELECT image_data, image_url FROM products WHERE id = ?',
      [parseInt(productId)]
    );

    const product = Array.isArray(rows) && rows[0] ? rows[0] : null;

    if (!product) {
      await connection.end();
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Jika tidak ada image_data di database, coba gunakan image_url
    if (!product.image_data && product.image_url) {
      await connection.end();
      // Redirect ke URL gambar eksternal jika tersedia
      return NextResponse.redirect(product.image_url);
    }

    if (!product.image_data) {
      // Jika tidak ada gambar sama sekali, kembalikan placeholder
      await connection.end();
      return NextResponse.json({ error: 'No image available' }, { status: 404 });
    }

    // Jika image_data ada, kirim sebagai response
    await connection.end();

    // Konversi Buffer dan kembalikan sebagai response image
    const imageBuffer = Buffer.isBuffer(product.image_data) ? product.image_data : Buffer.from(product.image_data, 'base64');

    // Deteksi tipe konten dari header pertama dari buffer
    let contentType = 'image/jpeg'; // default

    if (imageBuffer.length > 0) {
        // Cek header untuk menentukan jenis gambar
        if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 && imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47) {
            contentType = 'image/png';
        } else if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
            contentType = 'image/jpeg';
        } else if (imageBuffer[0] === 0x47 && imageBuffer[1] === 0x49 && imageBuffer[2] === 0x46) {
            contentType = 'image/gif';
        } else if (imageBuffer[0] === 0x52 && imageBuffer[1] === 0x49 && imageBuffer[2] === 0x46 && imageBuffer[3] === 0x46 &&
                   imageBuffer[8] === 0x57 && imageBuffer[9] === 0x45 && imageBuffer[10] === 0x42 && imageBuffer[11] === 0x50) {
            contentType = 'image/webp';
        }
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}