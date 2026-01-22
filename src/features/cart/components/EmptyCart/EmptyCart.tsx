import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { UI_STRINGS } from '../../../../constants/uiStrings';
import './EmptyCart.css';

export const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-cart">
      <div className="empty-cart__icon">🛒</div>
      
      <h2 className="empty-cart__title">
        {UI_STRINGS.CART.TITLE}
      </h2>
      
      <p className="empty-cart__message">
        {UI_STRINGS.CART.EMPTY_MESSAGE}
      </p>
      
      <button 
        className="empty-cart__btn"
        onClick={() => navigate(PATHS.HOME)}
      >
        Start Shopping
      </button>
    </div>
  );
};