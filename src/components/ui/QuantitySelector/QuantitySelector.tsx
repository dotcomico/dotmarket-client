import React from 'react';
import './QuantitySelector.css';

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onUpdate: (newQuantity: number) => void;
  variant?: 'default' | 'floating';
  min?: number;
}

export const QuantitySelector = ({ 
  quantity, 
  stock, 
  onUpdate, 
  variant = 'default',
  min = 0 
}: QuantitySelectorProps) => {
  const isMax = quantity >= stock;
  const isFloating = variant === 'floating';
  const isActive = quantity > 0;

  const handleAction = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate(newQuantity);
  };

  return (
    <div className={`
      quantity-selector 
      ${isFloating ? 'quantity-selector--floating' : ''} 
      ${isFloating && isActive ? 'quantity-selector--active' : ''}
    `}>
      {(!isFloating || isActive) && (
        <button 
          className={`quantity-btn ${isFloating ? 'animate-in' : ''}`}
          onClick={(e) => handleAction(e, quantity - 1)}
          disabled={quantity <= min}
        >
          −
        </button>
      )}
      
      {(!isFloating || isActive) && (
        <span key={quantity} className={`quantity-display ${isFloating ? 'pop-in' : ''}`}>
          {quantity}
        </span>
      )}
      
      <button 
        className="quantity-btn" 
        onClick={(e) => handleAction(e, quantity + 1)}
        disabled={isMax}
      >
        +
      </button>
    </div>
  );
};