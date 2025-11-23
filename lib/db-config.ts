// Database configuration for Laragoon
// This file contains the database connection settings for Laragoon

import { createConnection } from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blows_ecommerce',
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
};

// Create database connection
export const createDbConnection = async () => {
  try {
    const connection = await createConnection(dbConfig);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// Export the configuration
export { dbConfig };

// Test connection function
export const testConnection = async () => {
  try {
    const connection = await createDbConnection();
    await connection.execute('SELECT 1');
    console.log('Database connection test successful');
    await connection.end();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};