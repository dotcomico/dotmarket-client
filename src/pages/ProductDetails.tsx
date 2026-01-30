import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../features/products/api/productApi';
import type { Product } from '../features/products/types/product.types';
import { useCart } from '../features/cart/hooks/useCart';
import { QuantitySelector } from '../components/ui/QuantitySelector/QuantitySelector';
import { PATHS } from '../routes/paths';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'photo' | '360'>('photo');

  const { getProductQuantity, addToCart, changeQuantity } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await productApi.getById(parseInt(id));
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-details-page">
        <div className="product-details__loading">
          <div className="spinner" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="product-details__error">
          <div className="error-icon">📦</div>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button className="btn-back" onClick={() => navigate(PATHS.PRODUCTS)}>
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  const quantity = getProductQuantity(product.id);
  const isOutOfStock = product.stock === 0;
  const hasImage360 = !!product.image360;
  const currentImage = activeView === '360' && hasImage360 ? product.image360 : product.image;

  // Stock status helper
  const getStockStatus = () => {
    if (isOutOfStock) return { label: 'Out of Stock', class: 'out', icon: '✕' };
    if (product.stock <= 5) return { label: `Only ${product.stock} left!`, class: 'low', icon: '⚠' };
    if (product.stock <= 20) return { label: 'Limited Stock', class: 'limited', icon: '📦' };
    return { label: 'In Stock', class: 'available', icon: '✓' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={PATHS.HOME}>Home</Link>
        <span className="breadcrumb__separator">/</span>
        <Link to={PATHS.PRODUCTS}>Products</Link>
        {product.category && (
          <>
            <span className="breadcrumb__separator">/</span>
            <Link to={`/categories/${product.category.slug}/products`}>
              {product.category.name}
            </Link>
          </>
        )}
        <span className="breadcrumb__separator">/</span>
        <span className="breadcrumb__current">{product.name}</span>
      </nav>

      <div className="product-details">
        {/* Left: Image Gallery */}
        <div className="product-details__gallery">
          <div className="product-details__image-container">
            {currentImage ? (
              <img
                src={currentImage}
                alt={activeView === '360' ? `${product.name} 360° view` : product.name}
                className={`product-details__image ${activeView === '360' ? 'image--360' : ''}`}
              />
            ) : (
              <div className="product-details__placeholder">
                <span>📦</span>
                <p>No image available</p>
              </div>
            )}

            {/* 360 Badge when active */}
            {activeView === '360' && hasImage360 && (
              <div className="product-details__360-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                360° View
              </div>
            )}
          </div>

          {/* Image View Toggle */}
          {hasImage360 && (
            <div className="product-details__view-toggle">
              <button
                className={`view-toggle-btn ${activeView === 'photo' ? 'active' : ''}`}
                onClick={() => setActiveView('photo')}
                aria-label="View photo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Photo</span>
              </button>

              <button
                className={`view-toggle-btn ${activeView === '360' ? 'active' : ''}`}
                onClick={() => setActiveView('360')}
                aria-label="View 360°"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>360°</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="product-details__info">
          {/* Category Tag */}
          {product.category && (
            <Link
              to={`/categories/${product.category.slug}/products`}
              className="product-details__category-tag"
            >
              {product.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="product-details__title">{product.name}</h1>

          {/* Price */}
          <div className="product-details__price-section">
            <span className="product-details__price">${product.price.toFixed(2)}</span>
            {!isOutOfStock && (
              <span className="product-details__price-note">Tax included</span>
            )}
          </div>

          {/* Stock Status */}
          <div className={`product-details__stock stock--${stockStatus.class}`}>
            <span className="stock__icon">{stockStatus.icon}</span>
            <span className="stock__label">{stockStatus.label}</span>
            {!isOutOfStock && product.stock > 5 && (
              <span className="stock__count">({product.stock} available)</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="product-details__description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Product Meta */}
          <div className="product-details__meta">
            <div className="meta-item">
              <span className="meta-label">SKU</span>
              <span className="meta-value">PRD-{String(product.id).padStart(5, '0')}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category?.name || 'Uncategorized'}</span>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="product-details__actions">
            {isOutOfStock ? (
              <div className="out-of-stock-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>Currently unavailable</span>
              </div>
            ) : quantity === 0 ? (
              <button
                className="btn-add-to-cart"
                onClick={() => addToCart(product, 1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
            ) : (
              <div className="product-details__quantity-wrapper">
                <span className="quantity-label">In cart:</span>
                <QuantitySelector
                  quantity={quantity}
                  stock={product.stock}
                  onUpdate={(newVal) => changeQuantity(product.id, newVal)}
                />
              </div>
            )}
          </div>

          {/* Features/Benefits */}
          <div className="product-details__features">
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Free delivery on orders over $50</span>
            </div>
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>30-day return policy</span>
            </div>
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;