import { dbConfig } from './lib/db-config';
import { createDbConnection } from './lib/db-config';

async function testConnectionDetails() {
  console.log('Database configuration:', dbConfig);
  
  try {
    console.log('Attempting to connect to database...');
    const connection = await createDbConnection();
    
    // Cek info database
    const [info] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('Current database:', info);
    
    // Cek apakah tabel categories ada
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', tables);
    
    // Cek isi tabel categories
    try {
      const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
      console.log('Number of categories in table:', categories);
      
      if (categories[0].count > 0) {
        const [allCategories] = await connection.execute('SELECT * FROM categories');
        console.log('Categories data:', allCategories);
      } else {
        console.log('Categories table is empty');
      }
    } catch (error) {
      console.log('Categories table might not exist:', error.message);
    }
    
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnectionDetails();