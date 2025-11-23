import { createTables, insertInitialData } from './lib/db-migrate';

async function runMigration() {
  try {
    console.log('Starting database migration...');
    await createTables();
    console.log('Tables created successfully');

    console.log('Inserting initial data...');
    await insertInitialData();
    console.log('Initial data inserted successfully');
    console.log('Migration completed successfully!');
  } catch (error) {
    // Jika tabel sudah ada, coba insert data saja
    console.log('Tables might already exist, trying to insert data only...');
    try {
      await insertInitialData();
      console.log('Initial data inserted successfully');
      console.log('Migration completed successfully!');
    } catch (insertError) {
      console.error('Migration failed:', insertError);
    }
  }
}

runMigration();