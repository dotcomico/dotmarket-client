import { ClipboardCheck, Lock, PackageCheck, ShoppingBag, type LucideIcon } from 'lucide-react';
import { UI_STRINGS } from '../../../../constants/uiStrings';
import './TrustStrip.css';

const { ARIA_LABEL, ITEMS } = UI_STRINGS.HOME.TRUST_STRIP;

interface TrustItem {
  copy: { readonly LABEL: string; readonly SUBTEXT: string };
  Icon: LucideIcon;
}

const TRUST_ITEMS: TrustItem[] = [
  { copy: ITEMS.RANGE, Icon: ShoppingBag },
  { copy: ITEMS.STOCK, Icon: PackageCheck },
  { copy: ITEMS.ORDERS, Icon: ClipboardCheck },
  { copy: ITEMS.ACCOUNT, Icon: Lock },
];

export const TrustStrip = () => (
  <section className="trust-strip" aria-label={ARIA_LABEL}>
    <ul className="trust-strip__list">
      {TRUST_ITEMS.map(({ copy, Icon }) => (
        <li key={copy.LABEL} className="trust-strip__item">
          <Icon className="trust-strip__icon" aria-hidden="true" />
          <div className="trust-strip__text">
            <p className="trust-strip__label">{copy.LABEL}</p>
            <p className="trust-strip__subtext">{copy.SUBTEXT}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
