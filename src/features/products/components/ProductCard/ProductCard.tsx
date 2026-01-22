import { Link } from 'react-router-dom';
import { buildPath } from '../../../../routes/paths';
import type { Product } from '../../types/product.types';
import { useCart } from '../../../cart/hooks/useCart';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { getProductQuantity, addToCart, changeQuantity } = useCart();
  const quantity = getProductQuantity(product.id); 
  const isOutOfStock = product.stock === 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity === 0) {
      addToCart(product, 1);
    } else {
      // increment
      changeQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity > 0) {
      changeQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className="product-card">
      <Link to={buildPath.productDetail(product.id)} className="product-card__link">
        <div className="product-card__image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-card__placeholder">📦</div>
          )}

          {!isOutOfStock && (
            <div className={`quantity-selector ${quantity > 0 ? 'quantity-selector--active' : ''}`}>
              {quantity > 0 && (
                <>
                  <button className="quantity-btn animate-in" onClick={handleDecrement}>−</button>
                  <span key={quantity} className="quantity-count pop-in">{quantity}</span>
                </>
              )}

              <button className="quantity-btn plus-icon" onClick={handleIncrement}>
                +
              </button>
            </div>
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
          </div>
        </div>
      </Link>
    </div>
  );
};