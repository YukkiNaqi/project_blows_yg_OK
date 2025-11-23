// API route for service operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get('operation');
  const id = searchParams.get('id');

  try {
    const connection = await createDbConnection();

    let result;
    switch (operation) {
      case 'allServices':
        const [services] = await connection.execute('SELECT * FROM services WHERE is_active = TRUE ORDER BY name');
        result = services;
        break;

      case 'serviceById':
        if (!id) {
          return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
        }
        const [service] = await connection.execute(
          'SELECT * FROM services WHERE id = ? AND is_active = TRUE',
          [Number(id)]
        );
        result = service;
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