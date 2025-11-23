export interface ServiceBooking {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  service_type: string
  description: string
  preferred_date: string
  preferred_time: string
  address: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  estimated_cost?: number
  technician_notes?: string
}

export interface ServiceType {
  id: string
  name: string
  description: string
  base_price: number
  duration: string
}
