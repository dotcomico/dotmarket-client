import { Link } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { UI_STRINGS } from '../../../../constants/uiStrings';
import './HeroBanner.css';

const HEADING_ID = 'hero-banner-heading';

export const HeroBanner = () => (
  <section className="hero-banner" aria-labelledby={HEADING_ID}>
    <h1 id={HEADING_ID} className="hero-banner__title">
      {UI_STRINGS.HOME.HERO.HEADLINE}
    </h1>
    <p className="hero-banner__tagline">{UI_STRINGS.NAV.TAGLINE}</p>
    <Link to={PATHS.PRODUCTS} className="hero-banner__cta">
      {UI_STRINGS.HOME.HERO.CTA}
    </Link>
  </section>
);
