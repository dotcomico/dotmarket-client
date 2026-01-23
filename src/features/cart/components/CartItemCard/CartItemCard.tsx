import { Link } from 'react-router-dom';
import type { CartItem } from '../../types/cart.types';
import { buildPath } from '../../../../routes/paths';
import './CartItemCard.css';
import { QuantitySelector } from '../../../../components/ui/QuantitySelector/QuantitySelector';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItemCard = ({
  item,
  onUpdateQuantity,
  onRemove
}: CartItemCardProps) => {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="cart-item-card">
      <Link
        to={buildPath.productDetail(product.id)}
        className="cart-item-card__image-link"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="cart-item-card__image"
          />
        ) : (
          <div className="cart-item-card__placeholder">📦</div>
        )}
      </Link>

      <div className="cart-item-card__details">
        <Link
          to={buildPath.productDetail(product.id)}
          className="cart-item-card__name"
        >
          {product.name}
        </Link>

        {product.category && (
          <span className="cart-item-card__category">
            {product.category.name}
          </span>
        )}

        <div className="cart-item-card__price">
          ${product.price.toFixed(2)}
          {quantity > 1 && (
            <span className="cart-item-card__unit-price"> each</span>
          )}
        </div>
      </div>

      <div className="cart-item-card__actions">
        <QuantitySelector
          quantity={quantity}
          stock={product.stock}
          min={1}
          onUpdate={(newVal) => onUpdateQuantity(product.id, newVal)}
        />
        {quantity >= product.stock && (
          <span className="cart-item-card__stock-warning">Max available</span>
        )}
      </div>

      <div className="cart-item-card__total">
        <div className="cart-item-card__subtotal">
          ${itemTotal.toFixed(2)}
        </div>

        <button
          onClick={() => onRemove(product.id)}
          className="cart-item-card__remove"
          aria-label={`Remove ${product.name} from cart`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
};