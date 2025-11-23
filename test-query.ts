import { createDbConnection } from './lib/db-config';

async function testQuery() {
  try {
    console.log('Connecting to database...');
    const connection = await createDbConnection();
    
    console.log('Running the exact query from dbDirect.categories.findAll()...');
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
    
    console.log('Query results:', rows);
    
    console.log('Running simple query...');
    const [simpleRows] = await connection.execute('SELECT id, name, description, image_url, created_at FROM categories ORDER BY name');
    
    console.log('Simple query results:', simpleRows);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();