import React from 'react';
import './Header.css';
import ThemeToggle from '../../../ui/ThemeToggle/ThemeToggle';




const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">SEONCHA</div>

        <div className="header-actions">
          <ThemeToggle /> {/* Theme switch goes here */}
          {/* Profile Button */}
          <button className="icon-btn">
            <img src="https://img.icons8.com/material-outlined/24/000000/user--v1.png" alt="Profile" />
          </button>

          {/* List Button */}
          <button className="icon-btn">
            <img src="https://img.icons8.com/material-outlined/24/000000/list.png" alt="Lists" />
          </button>

          {/* Grocery/Cart Button with Badge */}
          <button className="cart-wrapper">
            <img src="https://img.icons8.com/material-outlined/24/000000/shopping-cart--v1.png" alt="Grocery" />
            <span className="badge">3</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;