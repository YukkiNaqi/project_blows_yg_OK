// API route for customer CRUD operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const connection = await createDbConnection();

    let result;
    if (id) {
      // Get single customer by ID
      const [rows] = await connection.execute(
        'SELECT id, full_name, email, phone, address, company, created_at FROM customers WHERE id = ?',
        [parseInt(id)]
      );
      result = Array.isArray(rows) ? rows[0] : null;
    } else {
      // Get all customers with pagination and filtering
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search');
      
      let query = 'SELECT id, full_name, email, phone, address, company, created_at FROM customers';
      const params: any[] = [];
      
      if (search) {
        query += ` WHERE full_name LIKE ? OR email LIKE ? OR company LIKE ?`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
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
      full_name,
      email,
      phone,
      address,
      company
    } = body;

    // Check if email already exists
    const [existingRows] = await connection.execute(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );
    
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    // Insert customer into database
    const [result] = await connection.execute(`
      INSERT INTO customers
      (full_name, email, phone, address, company)
      VALUES (?, ?, ?, ?, ?)
    `, [
      full_name,
      email,
      phone,
      address,
      company
    ]);

    const customerId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      id: customerId,
      message: 'Customer created successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create customer',
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
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      address,
      company
    } = body;

    // Update customer in database
    await connection.execute(`
      UPDATE customers
      SET full_name=?, email=?, phone=?, address=?, company=?
      WHERE id=?
    `, [
      full_name,
      email,
      phone,
      address,
      company,
      id
    ]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update customer',
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
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    // Delete customer from database
    await connection.execute('DELETE FROM customers WHERE id = ?', [id]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete customer',
        message: error.message
      },
      { status: 500 }
    );
  }
}