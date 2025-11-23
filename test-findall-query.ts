// Script untuk menguji fungsi findAll dalam lingkungan Node.js yang meniru Next.js
import { createDbConnection } from './lib/db-config';

async function testFindAllOriginal() {
  try {
    console.log('Testing original findAll function logic...');
    const connection = await createDbConnection();
    try {
      // Use the exact same query as in server-db.ts
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
      
      console.log('Original query results:', rows);
      console.log('Count:', rows.length);
      
      // Sekarang coba tanpa subquery
      const [simpleRows] = await connection.execute('SELECT id, name, description, image_url, created_at FROM categories ORDER BY name');
      console.log('Simple query results:', simpleRows);
      console.log('Simple count:', simpleRows.length);
      
      // Coba query yang lebih sederhana
      const [basicRows] = await connection.execute('SELECT * FROM categories');
      console.log('Basic query results:', basicRows);
      console.log('Basic count:', basicRows.length);
      
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error in testFindAllOriginal:', error);
  }
}

testFindAllOriginal();