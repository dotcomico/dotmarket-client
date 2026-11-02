import type { FocusEvent } from 'react';
import { UI_STRINGS } from '../../../../constants/uiStrings';
import { ProductCard, type Product } from '../../../products';
import './ProductRow.css';

interface ProductRowProps {
  title: string;
  subtext: string;
  products: Product[];
  isLoading: boolean;
  headingId: string;
  getItemNote?: (product: Product) => string;
}

// Scroll snap pulls the small scroll that focus triggers back to the previous stop,
// leaving a tabbed-to card clipped, so jump to the card's own snap position instead.
// Keyboard only: moving a card under a mouse press could lose the click.
const revealFocusedCard = ({ target }: FocusEvent<HTMLUListElement>) => {
  if (!target.matches(':focus-visible')) return;
  target.closest('li')?.scrollIntoView({ block: 'nearest', inline: 'start' });
};

export const ProductRow = ({
  title,
  subtext,
  products,
  isLoading,
  headingId,
  getItemNote,
}: ProductRowProps) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="product-row" aria-labelledby={headingId} aria-busy={isLoading}>
      <h2 id={headingId} className="product-row__title">
        {title}
      </h2>
      <p className="product-row__subtext">{subtext}</p>

      {isLoading ? (
        <div className="product-row__loading" role="status" aria-label={UI_STRINGS.COMMON.LOADING}>
          <div className="spinner" />
        </div>
      ) : (
        <ul className="product-row__list" onFocus={revealFocusedCard}>
          {products.map((product) => (
            <li key={product.id} className="product-row__item">
              <ProductCard product={product} variant="compact" />
              {getItemNote && <p className="product-row__note">{getItemNote(product)}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
