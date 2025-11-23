// Order service utilities for client-side usage
// This file provides order-related functions that use API routes instead of direct database access

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id?: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: "transfer" | "cod";
  payment_status: "pending" | "paid" | "failed";
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  items: OrderItem[];
  notes?: string;
  payment_deadline?: string;
  created_at?: string;
}

export interface PaymentInfo {
  bank_name: string;
  account_number: string;
  account_name: string;
  amount: number;
  payment_code: string;
  deadline: string;
}

// Order service functions that call API routes
export const orderServiceClient = {
  // Create new order
  createOrder: async (orderData: Omit<Order, "id" | "order_number" | "created_at">): Promise<Order> => {
    const baseUrl = typeof window === 'undefined' 
      ? `${process.env.BASE_URL || 'http://localhost:3000'}` 
      : '';
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'createOrder',
        orderData
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create order');
    }

    return result.order;
  },

  // Calculate shipping cost based on area
  calculateShipping: async (address: string): Promise<number> => {
    const baseUrl = typeof window === 'undefined' 
      ? `${process.env.BASE_URL || 'http://localhost:3000'}` 
      : '';
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'calculateShipping',
        orderData: { address }
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to calculate shipping');
    }

    return result.shippingCost;
  },

  // Calculate tax (11% PPN)
  calculateTax: async (subtotal: number): Promise<number> => {
    const baseUrl = typeof window === 'undefined' 
      ? `${process.env.BASE_URL || 'http://localhost:3000'}` 
      : '';
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'calculateTax',
        orderData: { subtotal }
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to calculate tax');
    }

    return result.taxAmount;
  },

  // Validate COD area
  isCODAvailable: async (address: string): Promise<boolean> => {
    const baseUrl = typeof window === 'undefined' 
      ? `${process.env.BASE_URL || 'http://localhost:3000'}` 
      : '';
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'isCODAvailable',
        orderData: { address }
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to validate COD area');
    }

    return result.isAvailable;
  },
};