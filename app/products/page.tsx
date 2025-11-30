import { dbDirect, type Product, type Category } from "@/lib/server-db";
import ClientProductsPage from "@/components/product/client-products-page";

export default async function ProductsPage() {
  let productsData: Product[] = [];
  let categoriesData: Category[] = [];

  try {
    const [productsResult, categoriesResult] = await Promise.all([
      dbDirect.products.findAll(),
      dbDirect.categories.findAll()
    ]);

    productsData = productsResult;
    categoriesData = categoriesResult;
  } catch (error) {
    console.error("Error fetching products or categories:", error);
    // Use empty arrays as fallback
    productsData = [];
    categoriesData = [];
  }

  const fixedProductsData = productsData;

  const fixedCategoriesData = categoriesData.map(category => ({
    ...category,
    image_url: category.image_url ?? "",
  }));

  return <ClientProductsPage initialProducts={fixedProductsData} initialCategories={fixedCategoriesData} />;
}
