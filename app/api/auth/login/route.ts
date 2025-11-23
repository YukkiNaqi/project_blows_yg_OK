// API route for authentication using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { serverAuth } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isAdminLogin } = await request.json();

    // Attempt login using serverAuth
    const user = await serverAuth.login(username, password);

    // Check if admin access is required
    if (isAdminLogin && !['admin', 'superadmin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Create session token
    const token = serverAuth.createSession(user);

    return NextResponse.json({ 
      user, 
      token,
      success: true 
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred',
        code: error.code || 'UNKNOWN_ERROR',
        success: false 
      },
      { status: error.status || 500 }
    );
  }
}