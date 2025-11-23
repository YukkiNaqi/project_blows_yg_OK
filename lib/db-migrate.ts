// Migration file to create database tables for BLOWS e-commerce
// This file contains SQL queries to create the necessary tables

import { createDbConnection } from './db-config';

export async function createTables() {
  const connection = await createDbConnection();

  try {
    // Drop all tables in correct order to avoid foreign key constraint issues
    await connection.execute(`DROP TABLE IF EXISTS service_bookings;`);
    await connection.execute(`DROP TABLE IF EXISTS order_items;`);
    await connection.execute(`DROP TABLE IF EXISTS orders;`);
    await connection.execute(`DROP TABLE IF EXISTS products;`);
    await connection.execute(`DROP TABLE IF EXISTS customers;`);
    await connection.execute(`DROP TABLE IF EXISTS users;`);
    await connection.execute(`DROP TABLE IF EXISTS services;`);
    await connection.execute(`DROP TABLE IF EXISTS categories;`);

    // Create all tables without foreign key constraints first
    await connection.execute(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role ENUM('superadmin', 'admin', 'customer') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        image_data LONGBLOB,
        price DECIMAL(10, 2) NOT NULL,
        cost_price DECIMAL(10, 2) NOT NULL,
        stock_quantity INT DEFAULT 0,
        min_stock_level INT DEFAULT 0,
        sku VARCHAR(50) UNIQUE,
        brand VARCHAR(100),
        specifications JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        company VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_method ENUM('transfer', 'cod') NOT NULL,
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        shipping_address TEXT NOT NULL,
        notes TEXT,
        payment_deadline TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration_hours DECIMAL(5, 2),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE service_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        service_type VARCHAR(255),
        preferred_date DATE NOT NULL,
        preferred_time TIME NOT NULL,
        address TEXT,
        description TEXT,
        status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        estimated_cost DECIMAL(10, 2),
        technician_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Now add foreign key constraints
    await connection.execute(`
      ALTER TABLE products ADD CONSTRAINT fk_products_category
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    `);

    await connection.execute(`
      ALTER TABLE orders ADD CONSTRAINT fk_orders_user
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    `);

    await connection.execute(`
      ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    `);

    await connection.execute(`
      ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    `);

    await connection.execute(`
      ALTER TABLE service_bookings ADD CONSTRAINT fk_service_bookings_customer
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
    `);
    
    console.log('All tables created successfully');
    
    // Close connection
    await connection.end();
  } catch (error) {
    console.error('Error creating tables:', error);
    await connection.end();
    throw error;
  }
}

// Function to insert initial data
export async function insertInitialData() {
  const connection = await createDbConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();
    
    // Insert sample categories
    const [categoryResult] = await connection.execute(`
      INSERT IGNORE INTO categories (name, description, image_url) VALUES
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?)
    `, [
      'Router', 'Network routers for home and business use', '/network-router.png',
      'Switch', 'Network switches for expanding connectivity', '/network-switch.png',
      'Kabel LAN', 'Ethernet cables and networking cables', '/ethernet-cable-closeup.png',
      'Access Point', 'Wireless access points for WiFi coverage', '/wifi-access-point.jpg',
      'Modem', 'Internet modems and gateways', '/internet-modem.png'
    ]);
    
    // Insert sample products
    const [productResult] = await connection.execute(`
      INSERT IGNORE INTO products (category_id, name, description, image_url, price, cost_price, stock_quantity, min_stock_level, sku, brand, specifications, is_active) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      // Router category
      1, 'TP-Link Archer C6 AC1200', 'Dual-band wireless router with MU-MIMO technology', '/tp-link-router.jpg', 450000, 350000, 25, 5, 'TPL-AC6-001', 'TP-Link', JSON.stringify({ speed: "AC1200", bands: "Dual-band", antennas: 4 }), true,
      1, 'ASUS RT-AX55 AX1800', 'WiFi 6 router with advanced security features', '/asus-wifi6-router.jpg', 850000, 650000, 15, 5, 'ASU-AX55-001', 'ASUS', JSON.stringify({ speed: "AX1800", wifi: "WiFi 6", security: "WPA3" }), true,
      
      // Switch category
      2, 'Netgear GS108 8-Port Switch', '8-port Gigabit Ethernet unmanaged switch', '/netgear-switch.jpg', 320000, 250000, 30, 5, 'NET-GS108-001', 'Netgear', JSON.stringify({ ports: 8, speed: "Gigabit", type: "Unmanaged" }), true,
      
      // Cable category
      3, 'Kabel LAN Cat6 UTP 305m', 'Cat6 UTP cable roll for network installation', '/cat6-cable-roll.jpg', 1200000, 950000, 10, 2, 'CBL-CAT6-305', 'Generic', JSON.stringify({ category: "Cat6", length: "305m", type: "UTP" }), true,
      
      // Access Point category
      4, 'Ubiquiti UniFi AP AC Lite', 'Enterprise WiFi access point', '/ubiquiti-access-point.jpg', 1250000, 1000000, 12, 3, 'UBI-ACLITE-001', 'Ubiquiti', JSON.stringify({ speed: "AC1200", management: "UniFi Controller", mounting: "Ceiling" }), true
    ]);
    
    // Insert sample services
    await connection.execute(`
      INSERT IGNORE INTO services (name, description, price, duration_hours, is_active) VALUES
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?)
    `, [
      'Instalasi Jaringan Kantor', 'Pemasangan dan konfigurasi jaringan untuk kantor kecil-menengah', 500000, 4, true,
      'Maintenance Jaringan Bulanan', 'Pemeliharaan rutin jaringan dan troubleshooting', 300000, 2, true,
      'Konsultasi IT Infrastructure', 'Konsultasi perencanaan infrastruktur IT', 750000, 3, true
    ]);
    
    // Insert sample admin user (password should be hashed in production)
    await connection.execute(`
      INSERT IGNORE INTO users (username, email, password, full_name, phone, role) VALUES
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
    `, [
      'Agungsaputra', 'agung@blows.com', '12345678910', 'Agung Saputra', '088229157588', 'superadmin',
      'admin', 'admin@blows.com', 'admin123', 'Admin BLOWS', '088229157588', 'admin'
    ]);
    
    // Commit transaction
    await connection.commit();
    console.log('Initial data inserted successfully');
    
    // Close connection
    await connection.end();
  } catch (error) {
    console.error('Error inserting initial data:', error);
    await connection.rollback();
    await connection.end();
    throw error;
  }
}

// Run migration
(async () => {
  try {
    await createTables();
    await insertInitialData();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})();