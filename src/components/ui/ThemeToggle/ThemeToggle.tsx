import React from 'react';
import { useUIStore } from '../../../store/uiStore';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useUIStore();

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      <img 
        src={isDark 
          ? "https://img.icons8.com/material-outlined/24/ffffff/sun.png" 
          : "https://img.icons8.com/material-outlined/24/000000/moon-symbol.png"
        } 
        alt="theme icon"
      />
    </button>
  );
};

export default ThemeToggle;