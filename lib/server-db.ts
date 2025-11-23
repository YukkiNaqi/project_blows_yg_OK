// Direct database access functions for server components
// This bypasses the API route and accesses the database directly
import { createDbConnection } from './db-config';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: "superadmin" | "admin" | "customer";
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image_url?: string; // Optional, for backward compatibility
  image_data: Buffer | null; // Added for image stored in database (can be null)
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  sku: string;
  brand: string;
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url?: string; // Optional, for backward compatibility
  image_data?: Buffer | null; // Added for image stored in database
  created_at: string;
}

export interface Order {
  id: number;
  user_id?: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: "transfer" | "cod";
  payment_status: "pending" | "paid" | "failed";
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  shipping_address: string;
  notes?: string;
  payment_deadline?: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  created_at: string;
}

export interface ServiceBooking {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimated_cost?: number;
  technician_notes?: string;
  created_at: string;
  updated_at: string;
}

// Direct database access functions for server components
export const dbDirect = {
  categories: {
    findAll: async (): Promise<Category[]> => {
      const connection = await createDbConnection();
      try {
        // Use a subquery to get only the first occurrence of each category name
        const [rows] = await connection.execute(`
          SELECT id, name, description, image_url, created_at
          FROM categories
          WHERE id IN (
            SELECT MIN(id)
            FROM categories
            GROUP BY name, description, image_url
          )
          ORDER BY name
        `);
        return rows as Category[];
      } finally {
        await connection.end();
      }
    },

    findById: async (id: number): Promise<Category | null> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute('SELECT id, name, description, image_url, created_at FROM categories WHERE id = ?', [id]);
        const results = rows as Category[];
        return results.length > 0 ? results[0] : null;
      } finally {
        await connection.end();
      }
    },
  },

  products: {
    findAll: async (): Promise<Product[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT DISTINCT id, category_id, name, description, image_url, image_data, price, cost_price,
                 stock_quantity, min_stock_level, sku, brand, specifications,
                 is_active, created_at FROM products
          WHERE is_active = TRUE
          ORDER BY created_at DESC
        `);
        return rows as Product[];
      } finally {
        await connection.end();
      }
    },

    findById: async (id: number): Promise<Product | null> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, category_id, name, description, image_url, image_data, price, cost_price,
                 stock_quantity, min_stock_level, sku, brand, specifications,
                 is_active, created_at FROM products WHERE id = ?
        `, [id]);
        const results = rows as Product[];
        return results.length > 0 ? results[0] : null;
      } finally {
        await connection.end();
      }
    },

    findByCategory: async (categoryId: number): Promise<Product[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, category_id, name, description, image_url, image_data, price, cost_price,
                 stock_quantity, min_stock_level, sku, brand, specifications,
                 is_active, created_at FROM products
          WHERE category_id = ? AND is_active = TRUE
          ORDER BY created_at DESC
        `, [categoryId]);
        return rows as Product[];
      } finally {
        await connection.end();
      }
    },

    findFeatured: async (): Promise<Product[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT DISTINCT id, category_id, name, description, image_url, image_data, price, cost_price,
                 stock_quantity, min_stock_level, sku, brand, specifications,
                 is_active, created_at FROM products
          WHERE is_active = TRUE
          ORDER BY created_at DESC
          LIMIT 4
        `);
        return rows as Product[];
      } finally {
        await connection.end();
      }
    },
  },

  services: {
    findAll: async (): Promise<Service[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute('SELECT * FROM services WHERE is_active = TRUE ORDER BY name');
        return rows as Service[];
      } finally {
        await connection.end();
      }
    },

    findById: async (id: number): Promise<Service | null> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute('SELECT * FROM services WHERE id = ? AND is_active = TRUE', [id]);
        const results = rows as Service[];
        return results.length > 0 ? results[0] : null;
      } finally {
        await connection.end();
      }
    },
  },

  orders: {
    findAll: async (): Promise<Order[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT o.id, o.user_id, o.order_number, o.status, o.payment_method, o.payment_status,
                 o.subtotal, o.tax_amount, o.shipping_cost, o.total_amount, o.shipping_address,
                 o.notes, o.payment_deadline, o.created_at,
                 c.full_name AS customer_name, c.email AS customer_email
          FROM orders o
          LEFT JOIN customers c ON o.user_id = c.id
          ORDER BY o.created_at DESC
        `);
        return rows as Order[];
      } finally {
        await connection.end();
      }
    },

    findById: async (id: number): Promise<Order | null> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, user_id, order_number, status, payment_method, payment_status,
                 subtotal, tax_amount, shipping_cost, total_amount, shipping_address,
                 notes, payment_deadline, created_at
          FROM orders
          WHERE id = ?
        `, [id]);
        const results = rows as Order[];
        return results.length > 0 ? results[0] : null;
      } finally {
        await connection.end();
      }
    },
  },

  customers: {
    findAll: async (): Promise<Customer[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, full_name, email, phone, address, company, created_at
          FROM customers
          ORDER BY created_at DESC
        `);
        return rows as Customer[];
      } finally {
        await connection.end();
      }
    },

    findById: async (id: number): Promise<Customer | null> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, full_name, email, phone, address, company, created_at
          FROM customers
          WHERE id = ?
        `, [id]);
        const results = rows as Customer[];
        return results.length > 0 ? results[0] : null;
      } finally {
        await connection.end();
      }
    },
  },

  serviceBookings: {
    findAll: async (): Promise<ServiceBooking[]> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, customer_id, customer_name, customer_email, customer_phone,
                 service_type, preferred_date, preferred_time, address, description,
                 status, estimated_cost, technician_notes, created_at, updated_at
          FROM service_bookings
          ORDER BY created_at DESC
        `);
        return rows as ServiceBooking[];
      } finally {
        await connection.end();
      }
    },

    findById: async (id: number): Promise<ServiceBooking | null> => {
      const connection = await createDbConnection();
      try {
        const [rows] = await connection.execute(`
          SELECT id, customer_id, customer_name, customer_email, customer_phone,
                 service_type, preferred_date, preferred_time, address, description,
                 status, estimated_cost, technician_notes, created_at, updated_at
          FROM service_bookings
          WHERE id = ?
        `, [id]);
        const results = rows as ServiceBooking[];
        return results.length > 0 ? results[0] : null;
      } finally {
        await connection.end();
      }
    },
  },
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateMargin = (price: number, cost: number): number => {
  return ((price - cost) / price) * 100;
};