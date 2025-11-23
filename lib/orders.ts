// Order management system using database
// Replaces the mock implementation with actual database queries

import { createDbConnection } from './db-config';
import { Order as OrderInterface } from './database';

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id?: number;
  user_id?: number;
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

export const orderService = {
  // Generate order number
  generateOrderNumber: (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const counter = (Math.floor(Math.random() * 900) + 100).toString(); // 3 digit random number
    return `ORD-${timestamp}${counter}`;
  },

  // Create new order
  createOrder: async (orderData: Omit<Order, "id" | "order_number" | "created_at">): Promise<Order> => {
    const connection = await createDbConnection();

    try {
      await connection.beginTransaction();

      // Generate order number
      const orderNumber = orderService.generateOrderNumber();

      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + item.total_price, 0);
      const taxAmount = orderService.calculateTax(subtotal);
      const shippingCost = orderService.calculateShipping(orderData.shipping_address);
      const totalAmount = subtotal + taxAmount + shippingCost;

      // Set payment deadline for transfer orders (24 hours)
      let paymentDeadline: string | undefined;
      if (orderData.payment_method === "transfer") {
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 24);
        paymentDeadline = deadline.toISOString();
      }

      // Insert order into database
      const [result] = await connection.execute(`
        INSERT INTO orders
        (order_number, user_id, status, payment_method, payment_status,
         subtotal, tax_amount, shipping_cost, total_amount,
         shipping_address, notes, payment_deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderNumber,
        orderData.user_id || null, // user_id if available
        "pending", // default status
        orderData.payment_method,
        "pending", // default payment status
        subtotal,
        taxAmount,
        shippingCost,
        totalAmount,
        orderData.shipping_address,
        orderData.notes || null,
        paymentDeadline || null
      ]);

      const orderId = (result as any).insertId;

      // Insert order items
      for (const item of orderData.items) {
        await connection.execute(`
          INSERT INTO order_items
          (order_id, product_id, product_name, quantity, unit_price, total_price)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          orderId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.total_price
        ]);
      }

      await connection.commit();

      // Return the complete order
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        order_number: orderNumber,
        subtotal,
        tax_amount: taxAmount,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        payment_status: "pending",
        status: "pending",
        created_at: new Date().toISOString(),
        payment_deadline: paymentDeadline
      };

      console.log("Order created in database:", newOrder);
      return newOrder;
    } catch (error) {
      await connection.rollback();
      console.error("Error creating order:", error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<Order | null> => {
    const connection = await createDbConnection();

    try {
      // Get order details
      const [orderRows] = await connection.execute(`
        SELECT * FROM orders WHERE id = ?
      `, [orderId]);

      const orders = orderRows as OrderInterface[];
      if (orders.length === 0) {
        return null;
      }

      const order = orders[0];

      // Get order items
      const [itemRows] = await connection.execute(`
        SELECT * FROM order_items WHERE order_id = ?
      `, [orderId]);

      const items = itemRows as OrderItem[];

      // Combine order and items
      const fullOrder: Order = {
        id: order.id,
        order_number: order.order_number,
        customer_name: "", // This would need to come from user info or be stored separately
        customer_email: "", // This would need to come from user info or be stored separately
        customer_phone: "", // This would need to come from user info or be stored separately
        shipping_address: order.shipping_address,
        payment_method: order.payment_method as "transfer" | "cod",
        payment_status: order.payment_status as "pending" | "paid" | "failed",
        status: order.status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
        subtotal: order.subtotal,
        tax_amount: order.tax_amount,
        shipping_cost: order.shipping_cost,
        total_amount: order.total_amount,
        items: items,
        notes: order.notes || undefined,
        payment_deadline: order.payment_deadline || undefined,
        created_at: order.created_at
      };

      return fullOrder;
    } finally {
      await connection.end();
    }
  },

  // Generate payment info for transfer orders
  generatePaymentInfo: (order: Order): PaymentInfo => {
    return {
      bank_name: "Bank BCA",
      account_number: "1234567890",
      account_name: "PT BLOWS NETWORK SOLUTIONS",
      amount: order.total_amount,
      payment_code: order.order_number,
      deadline: order.payment_deadline || "",
    };
  },

  // Calculate shipping cost based on area
  calculateShipping: (address: string): number => {
    const lowerAddress = address.toLowerCase();

    // Free shipping for Jakarta area
    if (lowerAddress.includes("jakarta")) {
      return 0;
    }

    // Different rates for different areas
    if (lowerAddress.includes("bogor") || lowerAddress.includes("depok") || lowerAddress.includes("bekasi")) {
      return 25000;
    }

    if (lowerAddress.includes("tangerang")) {
      return 30000;
    }

    // Default shipping cost for other areas
    return 50000;
  },

  // Calculate tax (11% PPN)
  calculateTax: (subtotal: number): number => {
    return Math.round(subtotal * 0.11);
  },

  // Validate COD area
  isCODAvailable: (address: string): boolean => {
    const lowerAddress = address.toLowerCase();
    // COD only available in Jakarta area
    return lowerAddress.includes("jakarta");
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: Order['status']): Promise<void> => {
    const connection = await createDbConnection();

    try {
      await connection.execute(`
        UPDATE orders
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, orderId]);
    } finally {
      await connection.end();
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId: number, paymentStatus: Order['payment_status']): Promise<void> => {
    const connection = await createDbConnection();

    try {
      await connection.execute(`
        UPDATE orders
        SET payment_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [paymentStatus, orderId]);
    } finally {
      await connection.end();
    }
  },
};
