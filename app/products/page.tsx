import { dbDirect, type Product, type Category } from "@/lib/server-db";
import ClientProductsPage from "@/components/product/client-products-page";

export default async function ProductsPage() {
  const [productsData, categoriesData] = await Promise.all([dbDirect.products.findAll(), dbDirect.categories.findAll()]);

  const fixedProductsData = productsData.map(product => ({
    ...product,
    image_url: product.image_url ?? "",
  }));

  const fixedCategoriesData = categoriesData.map(category => ({
    ...category,
    image_url: category.image_url ?? "",
  }));

  return <ClientProductsPage initialProducts={fixedProductsData} initialCategories={fixedCategoriesData} />;
}
