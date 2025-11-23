// Server action untuk menguji pengambilan kategori
'use server';

import { dbDirect } from './lib/server-db';

export async function testCategoriesFetch() {
  try {
    console.log('Server action: Fetching categories using dbDirect.categories.findAll()...');
    const categories = await dbDirect.categories.findAll();
    console.log('Server action: Categories returned:', categories);
    
    return {
      success: true,
      categories,
      count: categories.length
    };
  } catch (error) {
    console.error('Server action: Error fetching categories:', error);
    return {
      success: false,
      error: error.message,
      categories: [],
      count: 0
    };
  }
}