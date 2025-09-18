// Database connection and query utilities for BLOWS e-commerce
// Note: This is a mock implementation for demonstration
// In production, you would use a proper MySQL connection

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
  image_url: string
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
  image_url: string
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

// Mock data for demonstration
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Router",
    description: "Network routers for home and business use",
    image_url: "/network-router.png",
    created_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Switch",
    description: "Network switches for expanding connectivity",
    image_url: "/network-switch.png",
    created_at: "2024-01-01",
  },
  {
    id: 3,
    name: "Kabel LAN",
    description: "Ethernet cables and networking cables",
    image_url: "/ethernet-cable-closeup.png",
    created_at: "2024-01-01",
  },
  {
    id: 4,
    name: "Access Point",
    description: "Wireless access points for WiFi coverage",
    image_url: "/wifi-access-point.jpg",
    created_at: "2024-01-01",
  },
  {
    id: 5,
    name: "Modem",
    description: "Internet modems and gateways",
    image_url: "/internet-modem.png",
    created_at: "2024-01-01",
  },
]

const mockProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "TP-Link Archer C6 AC1200",
    description: "Dual-band wireless router with MU-MIMO technology",
    image_url: "/tp-link-router.jpg",
    price: 450000,
    cost_price: 350000,
    stock_quantity: 25,
    min_stock_level: 5,
    sku: "TPL-AC6-001",
    brand: "TP-Link",
    specifications: { speed: "AC1200", bands: "Dual-band", antennas: 4 },
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: 2,
    category_id: 1,
    name: "ASUS RT-AX55 AX1800",
    description: "WiFi 6 router with advanced security features",
    image_url: "/asus-wifi6-router.jpg",
    price: 850000,
    cost_price: 650000,
    stock_quantity: 15,
    min_stock_level: 5,
    sku: "ASU-AX55-001",
    brand: "ASUS",
    specifications: { speed: "AX1800", wifi: "WiFi 6", security: "WPA3" },
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: 3,
    category_id: 2,
    name: "Netgear GS108 8-Port Switch",
    description: "8-port Gigabit Ethernet unmanaged switch",
    image_url: "/netgear-switch.jpg",
    price: 320000,
    cost_price: 250000,
    stock_quantity: 30,
    min_stock_level: 5,
    sku: "NET-GS108-001",
    brand: "Netgear",
    specifications: { ports: 8, speed: "Gigabit", type: "Unmanaged" },
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: 4,
    category_id: 3,
    name: "Kabel LAN Cat6 UTP 305m",
    description: "Cat6 UTP cable roll for network installation",
    image_url: "/cat6-cable-roll.jpg",
    price: 1200000,
    cost_price: 950000,
    stock_quantity: 10,
    min_stock_level: 2,
    sku: "CBL-CAT6-305",
    brand: "Generic",
    specifications: { category: "Cat6", length: "305m", type: "UTP" },
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: 5,
    category_id: 4,
    name: "Ubiquiti UniFi AP AC Lite",
    description: "Enterprise WiFi access point",
    image_url: "/ubiquiti-access-point.jpg",
    price: 1250000,
    cost_price: 1000000,
    stock_quantity: 12,
    min_stock_level: 3,
    sku: "UBI-ACLITE-001",
    brand: "Ubiquiti",
    specifications: { speed: "AC1200", management: "UniFi Controller", mounting: "Ceiling" },
    is_active: true,
    created_at: "2024-01-01",
  },
]

const mockServices: Service[] = [
  {
    id: 1,
    name: "Instalasi Jaringan Kantor",
    description: "Pemasangan dan konfigurasi jaringan untuk kantor kecil-menengah",
    price: 500000,
    duration_hours: 4,
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Maintenance Jaringan Bulanan",
    description: "Pemeliharaan rutin jaringan dan troubleshooting",
    price: 300000,
    duration_hours: 2,
    is_active: true,
    created_at: "2024-01-01",
  },
  {
    id: 3,
    name: "Konsultasi IT Infrastructure",
    description: "Konsultasi perencanaan infrastruktur IT",
    price: 750000,
    duration_hours: 3,
    is_active: true,
    created_at: "2024-01-01",
  },
]

// Mock database functions
export const db = {
  categories: {
    findAll: async (): Promise<Category[]> => mockCategories,
    findById: async (id: number): Promise<Category | null> => mockCategories.find((c) => c.id === id) || null,
  },

  products: {
    findAll: async (): Promise<Product[]> => mockProducts,
    findById: async (id: number): Promise<Product | null> => mockProducts.find((p) => p.id === id) || null,
    findByCategory: async (categoryId: number): Promise<Product[]> =>
      mockProducts.filter((p) => p.category_id === categoryId),
    findFeatured: async (): Promise<Product[]> => mockProducts.slice(0, 4),
  },

  services: {
    findAll: async (): Promise<Service[]> => mockServices,
    findById: async (id: number): Promise<Service | null> => mockServices.find((s) => s.id === id) || null,
  },
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
