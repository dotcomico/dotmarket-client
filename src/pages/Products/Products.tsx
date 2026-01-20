import { useEffect, useState } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ProductGrid, useProductStore } from "../../features/products";
import { categoryApi } from "../../features/categories/api/categoryApi";
import { CategoryCard } from "../../features/categories";
import type { CategoryProductsResponse, CategoryDetail } from "../../features/categories/api/categoryApi";
import "./Products.css";

const Products = () => {
  const { products, isLoading, fetchProducts, error } = useProductStore();
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  
  const [categoryInfo, setCategoryInfo] = useState<CategoryProductsResponse['category'] | null>(null);
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetail | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  
  const searchTerm = searchParams.get('search') || "";
  const categoryId = searchParams.get('categoryId');

  // Fetch category details (including children)
  useEffect(() => {
    const loadCategoryDetails = async () => {
      if (slug) {
        try {
          const response = await categoryApi.getBySlug(slug);
          setCategoryDetail(response.data);
        } catch (err) {
          console.error('Failed to load category details:', err);
        }
      }
    };
    
    loadCategoryDetails();
  }, [slug]);

  // Fetch products based on whether we're in a category view or general products view
  useEffect(() => {
    const loadProducts = async () => {
      if (slug) {
        // We're viewing a specific category
        try {
          setCategoryError(null);
          const response = await categoryApi.getProducts(slug, {
            search: searchTerm || undefined,
            page: 1,
            limit: 100
          });
          
          // Update the product store with category products
          useProductStore.setState({
            products: response.data.products,
            pagination: response.data.pagination,
            isLoading: false,
            error: null
          });
          
          setCategoryInfo(response.data.category);
        } catch (err) {
          setCategoryError(err instanceof Error ? err.message : 'Failed to load category');
          useProductStore.setState({ 
            products: [], 
            isLoading: false, 
            error: 'Category not found' 
          });
        }
      } else {
        // General products view
        setCategoryInfo(null);
        setCategoryDetail(null);
        fetchProducts({
          search: searchTerm,
          categoryId: categoryId ? parseInt(categoryId) : undefined
        });
      }
    };

    loadProducts();
  }, [slug, searchTerm, categoryId, fetchProducts]);

  // Build page title
  const getPageTitle = () => {
    if (searchTerm && categoryInfo) {
      return `"${searchTerm}" in ${categoryInfo.name}`;
    }
    if (searchTerm) {
      return `Search Results for "${searchTerm}"`;
    }
    if (categoryInfo) {
      return categoryInfo.name;
    }
    return "All Products";
  };

  // Build empty message
  const getEmptyMessage = () => {
    if (searchTerm && categoryInfo) {
      return `No products found for "${searchTerm}" in ${categoryInfo.name}`;
    }
    if (searchTerm) {
      return `No products found for "${searchTerm}"`;
    }
    if (categoryInfo) {
      return `No products available in ${categoryInfo.name}`;
    }
    return "No products available";
  };

  // Check if category has children
  const hasChildren = categoryDetail?.children && categoryDetail.children.length > 0;

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to={PATHS.HOME}>Home</Link>
        <span> / </span>
        {categoryInfo ? (
          <>
            <Link to={PATHS.CATEGORY_DETAILS.replace(':slug', slug!)}>
              {categoryInfo.name}
            </Link>
            {searchTerm && (
              <>
                <span> / </span>
                <span>Search: {searchTerm}</span>
              </>
            )}
          </>
        ) : (
          <>
            <span>Products</span>
            {searchTerm && (
              <>
                <span> / </span>
                <span>Search: {searchTerm}</span>
              </>
            )}
          </>
        )}
      </nav>

      {/* Header with Category Icon */}
      <div className="category-header">
        {categoryInfo?.icon && (
          <span className="category-icon">{categoryInfo.icon}</span>
        )}
        <h1>{getPageTitle()}</h1>
      </div>

      {/* Error Handling */}
      {(error || categoryError) && (
        <div className="error-message">
          Error: {error || categoryError}
        </div>
      )}

      {/* Subcategories Section */}
      {hasChildren && !searchTerm && (
        <section className="subcategories-section">
          <h2>Shop by Category</h2>
          <div className="subcategories-grid">
            {categoryDetail.children!.map(subcategory => (
              <CategoryCard 
                key={subcategory.id}
                category={subcategory}
                variant="grid"
              />
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyMessage={getEmptyMessage()}
      />
    </div>
  );
};

export default Products;