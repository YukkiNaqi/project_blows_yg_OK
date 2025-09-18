export interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id?: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: "transfer" | "cod"
  payment_status: "pending" | "paid" | "failed"
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  tax_amount: number
  shipping_cost: number
  total_amount: number
  items: OrderItem[]
  notes?: string
  payment_deadline?: string
  created_at?: string
}

export interface PaymentInfo {
  bank_name: string
  account_number: string
  account_name: string
  amount: number
  payment_code: string
  deadline: string
}

// Mock order management
let orderCounter = 1000

export const orderService = {
  // Generate order number
  generateOrderNumber: (): string => {
    const timestamp = Date.now().toString().slice(-6)
    const counter = (++orderCounter).toString().padStart(3, "0")
    return `ORD-${timestamp}${counter}`
  },

  // Create new order
  createOrder: async (orderData: Omit<Order, "id" | "order_number" | "created_at">): Promise<Order> => {
    const order: Order = {
      ...orderData,
      id: Date.now(),
      order_number: orderService.generateOrderNumber(),
      created_at: new Date().toISOString(),
    }

    // Set payment deadline for transfer orders (24 hours)
    if (order.payment_method === "transfer") {
      const deadline = new Date()
      deadline.setHours(deadline.getHours() + 24)
      order.payment_deadline = deadline.toISOString()
    }

    // In production, save to database
    console.log("Order created:", order)

    return order
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
    }
  },

  // Calculate shipping cost based on area
  calculateShipping: (address: string): number => {
    const lowerAddress = address.toLowerCase()

    // Free shipping for Jakarta area
    if (lowerAddress.includes("jakarta")) {
      return 0
    }

    // Different rates for different areas
    if (lowerAddress.includes("bogor") || lowerAddress.includes("depok") || lowerAddress.includes("bekasi")) {
      return 25000
    }

    if (lowerAddress.includes("tangerang")) {
      return 30000
    }

    // Default shipping cost for other areas
    return 50000
  },

  // Calculate tax (11% PPN)
  calculateTax: (subtotal: number): number => {
    return Math.round(subtotal * 0.11)
  },

  // Validate COD area
  isCODAvailable: (address: string): boolean => {
    const lowerAddress = address.toLowerCase()
    // COD only available in Jakarta area
    return lowerAddress.includes("jakarta")
  },
}
