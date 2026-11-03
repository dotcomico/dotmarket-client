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
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/facebook.png" alt="Facebook"/></button>
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/instagram-new.png" alt="Instagram"/></button>
             <button className="icon-btn-small"><img src="https://img.icons8.com/material-outlined/20/000000/twitter.png" alt="Twitter"/></button>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h3>{UI_STRINGS.FOOTER.COMPANY_SECTION}</h3>
          <a href="/about">{UI_STRINGS.FOOTER.ABOUT_US}</a>
          <a href="/stores">{UI_STRINGS.FOOTER.STORES}</a>
          <a href="/contact">{UI_STRINGS.FOOTER.CONTACT}</a>
        </div>

        <div className="footer-links">
          <h3>{UI_STRINGS.COMMON.SUPPORT}</h3>
          <a href="/faq">{UI_STRINGS.FOOTER.HELP_CENTER}</a>
          <a href="/shipping">{UI_STRINGS.FOOTER.DELIVERY_INFO}</a>
          <a href="/terms">{UI_STRINGS.FOOTER.TERMS}</a>
        </div>

        {/* Newsletter/App Section */}
        <div className="footer-app">
          <h3>{UI_STRINGS.FOOTER.DOWNLOAD_APP}</h3>
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
          <img src="https://img.icons8.com/color/32/000000/mastercard.png" alt="Mastercard"/>
          <img src="https://img.icons8.com/color/32/000000/paypal.png" alt="PayPal"/>
        </div>
      </div>
    </footer>
  );
};

export default Footer;