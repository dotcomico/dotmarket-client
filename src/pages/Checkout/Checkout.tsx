import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/hooks/useCart';
import { PATHS } from '../../routes/paths';
import { UI_STRINGS } from '../../constants/uiStrings';
import './Checkout.css';
import { useCheckout } from '../../features/orders/hooks/useCheckout';

const SHIPPING_FEE = 5.99;
const FREE_SHIPPING_THRESHOLD = 50;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, itemCount } = useCart();
  const { placeOrder, isLoading, error, clearError } = useCheckout();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  // Calculate totals
  const { shippingCost, total } = useMemo(() => {
    const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return {
      shippingCost: shipping,
      total: cartTotal + shipping,
    };
  }, [cartTotal]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{7,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear API error
    if (error) {
      clearError();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    const fullAddress = `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.postalCode}, Phone: ${formData.phone}`;
    const result = await placeOrder(fullAddress);

    if (result.success && result.order) {
      setOrderSuccess(true);
      setPlacedOrderId(result.order.id);
    }
  };

  // Redirect to cart if empty
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <div className="checkout-empty__icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <Link to={PATHS.PRODUCTS} className="checkout-empty__btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Order Success View
  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-success">
            <div className="checkout-success__icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p className="checkout-success__order-id">
              Order #{placedOrderId}
            </p>
            <p className="checkout-success__message">
              Thank you for your purchase! You'll receive a confirmation email shortly.
            </p>
            <div className="checkout-success__actions">
              <button
                className="checkout-success__btn checkout-success__btn--primary"
                onClick={() => navigate(PATHS.ORDERS)}
              >
                View My Orders
              </button>
              <button
                className="checkout-success__btn checkout-success__btn--secondary"
                onClick={() => navigate(PATHS.PRODUCTS)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <nav className="checkout-breadcrumb">
        <Link to={PATHS.HOME}>Home</Link>
        <span> / </span>
        <Link to={PATHS.CART}>{UI_STRINGS.CART.TITLE}</Link>
        <span> / </span>
        <span className="checkout-breadcrumb__current">Checkout</span>
      </nav>

      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-content">
          {/* Shipping Form */}
          <div className="checkout-form-section">
            <h2 className="checkout-section-title">Shipping Information</h2>

            {error && (
              <div className="checkout-error">
                <span className="checkout-error__icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={formErrors.fullName ? 'input--error' : ''}
                  disabled={isLoading}
                />
                {formErrors.fullName && (
                  <span className="form-error">{formErrors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Apt 4B"
                  rows={2}
                  className={formErrors.address ? 'input--error' : ''}
                  disabled={isLoading}
                />
                {formErrors.address && (
                  <span className="form-error">{formErrors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className={formErrors.city ? 'input--error' : ''}
                    disabled={isLoading}
                  />
                  {formErrors.city && (
                    <span className="form-error">{formErrors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className={formErrors.postalCode ? 'input--error' : ''}
                    disabled={isLoading}
                  />
                  {formErrors.postalCode && (
                    <span className="form-error">{formErrors.postalCode}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={formErrors.phone ? 'input--error' : ''}
                  disabled={isLoading}
                />
                {formErrors.phone && (
                  <span className="form-error">{formErrors.phone}</span>
                )}
              </div>

              <button
                type="submit"
                className="checkout-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="checkout-submit-btn__spinner" />
                    Processing...
                  </>
                ) : (
                  `Place Order • $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="checkout-summary">
            <h2 className="checkout-section-title">Order Summary</h2>

            {/* Items List */}
            <div className="checkout-items">
              {items.map(item => (
                <div key={item.product.id} className="checkout-item">
                  <div className="checkout-item__image">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} />
                    ) : (
                      <span className="checkout-item__placeholder">📦</span>
                    )}
                    <span className="checkout-item__quantity">{item.quantity}</span>
                  </div>
                  <div className="checkout-item__info">
                    <span className="checkout-item__name">{item.product.name}</span>
                    <span className="checkout-item__price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="checkout-totals">
              <div className="checkout-totals__row">
                <span>Subtotal ({itemCount} items)</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="checkout-totals__row">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="checkout-free-badge">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="checkout-totals__divider" />
              <div className="checkout-totals__row checkout-totals__row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Edit Cart Link */}
            <Link to={PATHS.CART} className="checkout-edit-cart">
              ← Edit Cart
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;