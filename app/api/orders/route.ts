// API route for order operations using Next.js App Router

import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/orders';

export async function POST(request: NextRequest) {
  try {
    const { operation, orderData } = await request.json();

    switch (operation) {
      case 'createOrder':
        const order = await orderService.createOrder(orderData);
        return NextResponse.json({ 
          success: true, 
          order 
        });

      case 'calculateShipping':
        const shippingCost = orderService.calculateShipping(orderData.address);
        return NextResponse.json({ 
          success: true, 
          shippingCost 
        });

      case 'calculateTax':
        const taxAmount = orderService.calculateTax(orderData.subtotal);
        return NextResponse.json({ 
          success: true, 
          taxAmount 
        });

      case 'isCODAvailable':
        const isAvailable = orderService.isCODAvailable(orderData.address);
        return NextResponse.json({ 
          success: true, 
          isAvailable 
        });

      default:
        return NextResponse.json(
          { error: 'Invalid operation', success: false },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred',
        success: false 
      },
      { status: 500 }
    );
  }
}