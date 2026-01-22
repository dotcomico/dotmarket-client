import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { UI_STRINGS } from '../../../../constants/uiStrings';
import './CartSummary.css';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export const CartSummary = ({ subtotal, itemCount }: CartSummaryProps) => {
  const navigate = useNavigate();
  
  const SHIPPING_FEE = 5.99;
  const FREE_SHIPPING_THRESHOLD = 50;
  
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingCost;
  const amountUntilFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleCheckout = () => {
    navigate(PATHS.CHECKOUT);
  };

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>
      
      {/* Free Shipping Progress */}
      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <div className="cart-summary__shipping-progress">
          <p className="shipping-message">
            Add <strong>${amountUntilFreeShipping.toFixed(2)}</strong> more for FREE shipping! 🚚
          </p>
          <div className="progress-bar">
            <div 
              className="progress-bar__fill"
              style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
            />
          </div>
        </div>
      )}

      {subtotal >= FREE_SHIPPING_THRESHOLD && (
        <div className="cart-summary__free-shipping">
          ✅ You qualify for FREE shipping!
        </div>
      )}

      {/* Price Breakdown */}
      <div className="cart-summary__breakdown">
        <div className="cart-summary__row">
          <span>{UI_STRINGS.CART.SUBTOTAL} ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="cart-summary__value">${subtotal.toFixed(2)}</span>
        </div>

        <div className="cart-summary__row">
          <span>{UI_STRINGS.CART.SHIPPING}</span>
          <span className="cart-summary__value">
            {shippingCost === 0 ? (
              <span className="free-badge">FREE</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="cart-summary__divider" />

        <div className="cart-summary__row cart-summary__row--total">
          <span>{UI_STRINGS.CART.TOTAL}</span>
          <span className="cart-summary__total-value">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        className="cart-summary__checkout-btn"
        onClick={handleCheckout}
      >
        {UI_STRINGS.CART.CHECKOUT}
      </button>

      {/* Security Badge */}
      <div className="cart-summary__security">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Secure checkout
      </div>
    </div>
  );
};