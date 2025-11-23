import { createDbConnection } from './lib/db-config';

async function checkProductsTable() {
  try {
    console.log('Connecting to database...');
    const connection = await createDbConnection();
    
    // Cek struktur tabel products
    const [columns] = await connection.execute('DESCRIBE products');
    console.log('Products table structure:', JSON.stringify(columns, null, 2));
    
    // Cek apakah kolom image_data ada
    const hasImageData = Array.isArray(columns) && columns.some((col: any) => col.Field === 'image_data');
    console.log('Has image_data column:', hasImageData);
    
    await connection.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error checking products table:', error);
  }
}

checkProductsTable();