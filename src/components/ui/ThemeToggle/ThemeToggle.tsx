import React from "react";
import { useUIStore } from "../../../store/uiStore";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useUIStore();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      <img
        src={
          isDark
            ? "https://img.icons8.com/material-outlined/24/ffffff/sun.png"
            : "https://cdn-icons-png.flaticon.com/512/6714/6714978.png"
        }
        alt="theme icon"
      />
    </button>
  );
};

export default ThemeToggle;
