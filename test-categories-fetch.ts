import { dbDirect } from './lib/server-db';

async function testCategoriesFetch() {
  try {
    console.log('Fetching categories using dbDirect.categories.findAll()...');
    const categories = await dbDirect.categories.findAll();
    console.log('Categories returned:', categories);
    
    if (categories && categories.length > 0) {
      console.log('Success: Categories are available');
    } else {
      console.log('Error: No categories returned');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

testCategoriesFetch();