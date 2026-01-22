import { Link } from 'react-router-dom';
import './Cart.css';
import { useCartStore } from '../store/cartStore';
import { CartItemCard, CartSummary, EmptyCart } from '../features/cart';
import { PATHS } from '../routes/paths';
import { UI_STRINGS } from '../constants/uiStrings';

const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getTotalPrice,
    getTotalItems 
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // Show empty cart if no items
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <nav className="cart-breadcrumb">
        <Link to={PATHS.HOME}>Home</Link>
        <span> / </span>
        <span className="cart-breadcrumb__current">{UI_STRINGS.CART.TITLE}</span>
      </nav>

      {/* Page Header */}
      <div className="cart-header">
        <h1 className="cart-header__title">
          {UI_STRINGS.CART.TITLE}
          <span className="cart-header__count">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {items.length > 0 && (
          <button 
            className="cart-header__clear"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {items.map((item) => (
            <CartItemCard
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <aside className="cart-sidebar">
          <CartSummary
            subtotal={totalPrice}
            itemCount={totalItems}
          />
        </aside>
      </div>
    </div>
  );
};

export default Cart;