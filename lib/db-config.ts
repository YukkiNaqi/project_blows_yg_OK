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
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  // Additional configurations to handle MySQL connection issues
  authPlugin: 'mysql_native_password', // Use native password authentication
  connectTimeout: 60000, // Increase connection timeout
  acquireTimeout: 60000, // Increase acquisition timeout
  timeout: 60000, // Increase timeout
};

// Create database connection
export const createDbConnection = async () => {
  try {
    console.log('Attempting to connect to database with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
    });
    const connection = await createConnection(dbConfig);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    // Log additional error details if available
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
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