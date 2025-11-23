// Database interface definitions and utility functions for BLOWS e-commerce
// This file contains type definitions and utility functions but no database access

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  phone?: string
  address?: string
  role: "superadmin" | "admin" | "customer"
  created_at: string
}

export interface Product {
  id: number
  category_id: number
  name: string
  description: string
  image_url?: string
  price: number
  cost_price: number
  stock_quantity: number
  min_stock_level: number
  sku: string
  brand: string
  specifications: Record<string, any>
  is_active: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  description: string
  image_url?: string
  created_at: string
}

export interface Order {
  id: number
  user_id?: number
  order_number: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_method: "transfer" | "cod"
  payment_status: "pending" | "paid" | "failed"
  subtotal: number
  tax_amount: number
  shipping_cost: number
  total_amount: number
  shipping_address: string
  notes?: string
  payment_deadline?: string
  created_at: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: number
  duration_hours: number
  is_active: boolean
  created_at: string
}

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const calculateMargin = (price: number, cost: number): number => {
  return ((price - cost) / price) * 100
}
