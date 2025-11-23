import { createDbConnection } from './lib/db-config';

async function checkCategories() {
  try {
    console.log('Connecting to database...');
    const connection = await createDbConnection();
    
    console.log('Checking categories table...');
    const [rows] = await connection.execute('SELECT * FROM categories');
    
    console.log('Categories found:', rows);
    
    await connection.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error checking categories:', error);
  }
}

checkCategories();