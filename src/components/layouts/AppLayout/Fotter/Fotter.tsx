import React from 'react';
import './Fotter.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="logo">SEONCHA</h2>
          <p className="footer-tagline">Fresh groceries delivered to your door.</p>
          <div className="social-row">
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/facebook.png" alt="FB"/></button>
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/instagram-new.png" alt="IG"/></button>
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/twitter.png" alt="TW"/></button>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/stores">Our Stores</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <a href="/faq">Help Center</a>
          <a href="/shipping">Delivery Info</a>
          <a href="/terms">Terms of Service</a>
        </div>

        {/* Newsletter/App Section */}
        <div className="footer-app">
          <h4>Download our App</h4>
          <div className="app-badge-stack">
            <button className="app-store-btn">App Store</button>
            <button className="app-store-btn">Google Play</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 SEONCHA. All rights reserved.</p>
        <div className="payment-icons">
          <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa"/>
          <img src="https://img.icons8.com/color/32/000000/mastercard.png" alt="MC"/>
          <img src="https://img.icons8.com/color/32/000000/paypal.png" alt="Paypal"/>
        </div>
      </div>
    </footer>
  );
};

export default Footer;