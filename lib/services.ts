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

export const serviceTypes: ServiceType[] = [
  {
    id: "network_installation",
    name: "Instalasi Jaringan",
    description: "Instalasi jaringan LAN/WAN untuk kantor atau rumah",
    base_price: 500000,
    duration: "2-4 jam",
  },
  {
    id: "network_maintenance",
    name: "Maintenance Jaringan",
    description: "Pemeliharaan rutin dan troubleshooting jaringan",
    base_price: 300000,
    duration: "1-2 jam",
  },
  {
    id: "wifi_setup",
    name: "Setup WiFi",
    description: "Konfigurasi dan optimasi jaringan WiFi",
    base_price: 200000,
    duration: "1-2 jam",
  },
  {
    id: "security_audit",
    name: "Audit Keamanan Jaringan",
    description: "Evaluasi keamanan infrastruktur jaringan",
    base_price: 800000,
    duration: "4-6 jam",
  },
  {
    id: "consultation",
    name: "Konsultasi IT",
    description: "Konsultasi perencanaan infrastruktur IT",
    base_price: 150000,
    duration: "1 jam",
  },
]

class ServiceBookingManager {
  private bookings: ServiceBooking[] = []
  private nextId = 1

  async createBooking(
    bookingData: Omit<ServiceBooking, "id" | "created_at" | "updated_at" | "status">,
  ): Promise<ServiceBooking> {
    const booking: ServiceBooking = {
      ...bookingData,
      id: this.nextId++,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.bookings.push(booking)
    return booking
  }

  async getBookings(): Promise<ServiceBooking[]> {
    return [...this.bookings]
  }

  async getBookingById(id: number): Promise<ServiceBooking | null> {
    return this.bookings.find((booking) => booking.id === id) || null
  }

  async updateBookingStatus(
    id: number,
    status: ServiceBooking["status"],
    technicianNotes?: string,
  ): Promise<ServiceBooking | null> {
    const booking = this.bookings.find((b) => b.id === id)
    if (booking) {
      booking.status = status
      booking.updated_at = new Date().toISOString()
      if (technicianNotes) {
        booking.technician_notes = technicianNotes
      }
      return booking
    }
    return null
  }

  async updateEstimatedCost(id: number, cost: number): Promise<ServiceBooking | null> {
    const booking = this.bookings.find((b) => b.id === id)
    if (booking) {
      booking.estimated_cost = cost
      booking.updated_at = new Date().toISOString()
      return booking
    }
    return null
  }
}

export const serviceBookingManager = new ServiceBookingManager()
