import React from 'react';
import './Fotter.css';
import { UI_STRINGS } from '../../../../constants/uiStrings';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="logo">{UI_STRINGS.NAV.BRAND}</h2>
          <p className="footer-tagline">{UI_STRINGS.NAV.TAGLINE}</p>
          <div className="social-row">
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/facebook.png" alt="FB"/></button>
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/instagram-new.png" alt="IG"/></button>
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/twitter.png" alt="TW"/></button>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h4>{UI_STRINGS.FOOTER.COMPANY_SECTION}</h4>
          <a href="/about">{UI_STRINGS.FOOTER.ABOUT_US}</a>
          <a href="/stores">{UI_STRINGS.FOOTER.STORES}</a>
          <a href="/contact">{UI_STRINGS.FOOTER.CONTACT}</a>
        </div>

        <div className="footer-links">
          <h4>{UI_STRINGS.COMMON.SUPPORT}</h4>
          <a href="/faq">{UI_STRINGS.FOOTER.HELP_CENTER}</a>
          <a href="/shipping">{UI_STRINGS.FOOTER.DELIVERY_INFO}</a>
          <a href="/terms">{UI_STRINGS.FOOTER.TERMS}</a>
        </div>

        {/* Newsletter/App Section */}
        <div className="footer-app">
          <h4>{UI_STRINGS.FOOTER.DOWNLOAD_APP}</h4>
          <div className="app-badge-stack">
            <button className="app-store-btn">{UI_STRINGS.FOOTER.APP_STORE}</button>
            <button className="app-store-btn">{UI_STRINGS.FOOTER.GOOGLE_PLAY}</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{UI_STRINGS.FOOTER.COPYRIGHT(currentYear)}</p>
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