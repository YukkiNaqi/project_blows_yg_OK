// API route for service CRUD operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const connection = await createDbConnection();

    let result;
    if (id) {
      // Get single service booking by ID
      const [rows] = await connection.execute(
        `SELECT sb.id, sb.customer_id, sb.customer_name, sb.customer_email, sb.customer_phone,
                sb.service_type, sb.preferred_date, sb.preferred_time, sb.address, sb.description,
                sb.status, sb.estimated_cost, sb.technician_notes, sb.created_at, sb.updated_at,
                st.name as service_name
         FROM service_bookings sb
         LEFT JOIN service_types st ON sb.service_type = st.id
         WHERE sb.id = ?`,
        [parseInt(id)]
      );
      result = Array.isArray(rows) ? rows[0] : null;
    } else {
      // Get all service bookings with pagination and filtering
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      
      let query = `SELECT sb.id, sb.customer_name, sb.customer_email, sb.customer_phone,
                   sb.service_type, sb.preferred_date, sb.preferred_time, sb.address,
                   sb.status, sb.estimated_cost, sb.created_at, st.name as service_name
                   FROM service_bookings sb
                   LEFT JOIN service_types st ON sb.service_type = st.id`;
      const params: any[] = [];
      
      let whereClause = '';
      if (status) {
        whereClause += ` WHERE sb.status = ?`;
        params.push(status);
      }
      
      if (search) {
        whereClause += whereClause ? ` AND (sb.customer_name LIKE ? OR sb.service_type LIKE ?)` : ` WHERE (sb.customer_name LIKE ? OR sb.service_type LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += whereClause + ` ORDER BY sb.created_at DESC LIMIT ? OFFSET ?`;
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
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      preferred_date,
      preferred_time,
      address,
      description,
      status = 'pending'
    } = body;

    // Insert service booking into database
    const [result] = await connection.execute(`
      INSERT INTO service_bookings
      (customer_id, customer_name, customer_email, customer_phone, service_type, 
       preferred_date, preferred_time, address, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      preferred_date,
      preferred_time,
      address,
      description,
      status
    ]);

    const bookingId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      id: bookingId,
      message: 'Service booking created successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create service booking',
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
      return NextResponse.json({ error: 'Service booking ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      preferred_date,
      preferred_time,
      address,
      description,
      status,
      estimated_cost,
      technician_notes
    } = body;

    // Update service booking in database
    await connection.execute(`
      UPDATE service_bookings
      SET customer_name=?, customer_email=?, customer_phone=?, service_type=?,
          preferred_date=?, preferred_time=?, address=?, description=?, 
          status=?, estimated_cost=?, technician_notes=?
      WHERE id=?
    `, [
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      preferred_date,
      preferred_time,
      address,
      description,
      status,
      estimated_cost,
      technician_notes,
      id
    ]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Service booking updated successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update service booking',
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
      return NextResponse.json({ error: 'Service booking ID is required' }, { status: 400 });
    }

    const connection = await createDbConnection();

    // Delete service booking from database
    await connection.execute('DELETE FROM service_bookings WHERE id = ?', [id]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Service booking deleted successfully'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete service booking',
        message: error.message
      },
      { status: 500 }
    );
  }
}