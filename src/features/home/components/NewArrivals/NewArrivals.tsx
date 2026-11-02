import type { FocusEvent } from 'react';
import { UI_STRINGS } from '../../../../constants/uiStrings';
import { ProductCard, type Product } from '../../../products';
import './NewArrivals.css';

const HEADING_ID = 'new-arrivals-heading';

interface NewArrivalsProps {
  products: Product[];
  isLoading: boolean;
}

// Scroll snap pulls the small scroll that focus triggers back to the previous stop,
// leaving a tabbed-to card clipped, so jump to the card's own snap position instead.
// Keyboard only: moving a card under a mouse press could lose the click.
const revealFocusedCard = ({ target }: FocusEvent<HTMLUListElement>) => {
  if (!target.matches(':focus-visible')) return;
  target.closest('li')?.scrollIntoView({ block: 'nearest', inline: 'start' });
};

export const NewArrivals = ({ products, isLoading }: NewArrivalsProps) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="new-arrivals" aria-labelledby={HEADING_ID} aria-busy={isLoading}>
      <h2 id={HEADING_ID} className="new-arrivals__title">
        {UI_STRINGS.HOME.NEW_ARRIVALS.TITLE}
      </h2>
      <p className="new-arrivals__subtext">{UI_STRINGS.HOME.NEW_ARRIVALS.SUBTEXT}</p>

      {isLoading ? (
        <div className="new-arrivals__loading" role="status" aria-label={UI_STRINGS.COMMON.LOADING}>
          <div className="spinner" />
        </div>
      ) : (
        <ul className="new-arrivals__list" onFocus={revealFocusedCard}>
          {products.map((product) => (
            <li key={product.id} className="new-arrivals__item">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
