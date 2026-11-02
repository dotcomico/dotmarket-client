import { Link } from 'react-router-dom';
import { buildPath } from '../../../../routes/paths';
import type { Product } from '../../types/product.types';
import { useCart } from '../../../cart/hooks/useCart';
import './ProductCard.css';
import { QuantitySelector } from '../../../../components/ui/QuantitySelector/QuantitySelector';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export const ProductCard = ({ product, variant = 'default' }: ProductCardProps) => {
  const { getProductQuantity, addToCart, changeQuantity } = useCart();
  const quantity = getProductQuantity(product.id);
  const isOutOfStock = product.stock === 0;
  const isCompact = variant === 'compact';

  return (
    <div className={`product-card product-card--${variant}`}>
      <Link to={buildPath.productDetail(product.id)} className="product-card__link">
        <div className="product-card__image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-card__placeholder">📦</div>
          )}

          {!isOutOfStock && (
            <QuantitySelector
              variant="floating"
              quantity={quantity}
              stock={product.stock}
              onUpdate={(newVal) => quantity === 0 ? addToCart(product, 1) : changeQuantity(product.id, newVal)}
            />
          )}

          {isOutOfStock && (
            <div className="product-card__badge product-card__badge--out-of-stock">
              Out of Stock
            </div>
          )}
        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{product.name}</h3>

          {!isCompact && product.description && (
            <p className="product-card__description">{product.description}</p>
          )}

          {!isCompact && product.category && (
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