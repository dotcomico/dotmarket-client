import { Link } from 'react-router-dom';
import { buildPath } from '../../../../routes/paths';
import type { Product } from '../../types/product.types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <Link to={buildPath.productDetail(product.id)} className="product-card__link">
        <div className="product-card__image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-card__placeholder">📦</div>
          )}
          {isOutOfStock && (
            <div className="product-card__badge product-card__badge--out-of-stock">
              Out of Stock
            </div>
          )}
        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{product.name}</h3>
          
          {product.description && (
            <p className="product-card__description">{product.description}</p>
          )}

          {product.category && (
            <span className="product-card__category">{product.category.name}</span>
          )}

          <div className="product-card__footer">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            
            <button 
              className="product-card__add-btn"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to cart logic
                console.log('Add to cart:', product.id);
              }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};