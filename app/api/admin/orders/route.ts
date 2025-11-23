// API route for order CRUD operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const connection = await createDbConnection();

    let result;
    if (id) {
      // Get single order by ID
      const [rows] = await connection.execute(
        `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.status, o.payment_method, 
                o.payment_status, o.total_amount, o.created_at, o.shipping_address, o.billing_address,
                o.notes, c.full_name as customer_full_name
         FROM orders o 
         LEFT JOIN customers c ON o.customer_id = c.id 
         WHERE o.id = ?`,
        [parseInt(id)]
      );
      result = Array.isArray(rows) ? rows[0] : null;
    } else {
      // Get all orders with pagination and filtering
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      
      let query = `SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.status, 
                   o.payment_method, o.payment_status, o.total_amount, o.created_at
                   FROM orders o`;
      const params: any[] = [];
      
      let whereClause = '';
      if (status) {
        whereClause += ` WHERE o.status = ?`;
        params.push(status);
      }
      
      if (search) {
        whereClause += whereClause ? ` AND (o.order_number LIKE ? OR o.customer_name LIKE ?)` : ` WHERE (o.order_number LIKE ? OR o.customer_name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += whereClause + ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
      params.push(limit, (page - 1) * limit);
      
      const [rows] = await connection.execute(query, params);
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

    const body = await request.json();
    const {
      customer_id,
      order_number,
      customer_name,
      customer_email,
      status = 'pending',
      payment_method,
      payment_status = 'pending',
      total_amount,
      shipping_address,
      billing_address,
      notes
    } = body;

    // Insert order into database
    const [result] = await connection.execute(`
      INSERT INTO orders
      (customer_id, order_number, customer_name, customer_email, status, payment_method, 
       payment_status, total_amount, shipping_address, billing_address, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      customer_id,
      order_number,
      customer_name,
      customer_email,
      status,
      payment_method,
      payment_status,
      total_amount,
      shipping_address,
      billing_address,
      notes
    ]);

    const orderId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      id: orderId,
      message: 'Order created successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
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
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    const body = await request.json();
    const {
      customer_name,
      customer_email,
      status,
      payment_method,
      payment_status,
      total_amount,
      shipping_address,
      billing_address,
      notes
    } = body;

    // Update order in database
    await connection.execute(`
      UPDATE orders
      SET customer_name=?, customer_email=?, status=?, payment_method=?,
          payment_status=?, total_amount=?, shipping_address=?, billing_address=?, notes=?
      WHERE id=?
    `, [
      customer_name,
      customer_email,
      status,
      payment_method,
      payment_status,
      total_amount,
      shipping_address,
      billing_address,
      notes,
      id
    ]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order',
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
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    // Delete order from database
    await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id]);
    await connection.execute('DELETE FROM orders WHERE id = ?', [id]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete order',
        message: error.message
      },
      { status: 500 }
    );
  }
}