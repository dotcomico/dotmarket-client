import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ProductGrid, useProductStore } from "../../features/products"; // Using your index.ts exports
import "./Products.css";

const Products = () => {
  const { products, isLoading, fetchProducts, error } = useProductStore();

  // Handle URL Search Params (e.g., ?search=banana&category=1)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || "";
  const categoryId = searchParams.get('categoryId');

  // Fetch products on mount or when filters change
  useEffect(() => {
    fetchProducts({
      search: searchTerm,
      categoryId: categoryId ? parseInt(categoryId) : undefined
    });
  }, [searchTerm, categoryId, fetchProducts]);

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to={PATHS.HOME}>Home</Link>
        <span> / </span>
        <span>Products</span>
        {searchTerm && <span> / Search: {searchTerm}</span>}
      </nav>

      {/* Header Logic */}
      <div className="category-header">
        <h1>{searchTerm ? `Search Results for "${searchTerm}"` : "All Products"}</h1>
      </div>

      {/* Error Handling */}
      {error && <div className="error-message">Error: {error}</div>}

      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyMessage={searchTerm ? `No products found for "${searchTerm}"` : "No products available."}
      />
    </div>
  );
};

export default Products;