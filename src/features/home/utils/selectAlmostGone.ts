import { getProductStockStatus, type Product } from '../../products';

const ALMOST_GONE_LIMIT = 10;

export const selectAlmostGone = (
  products: Product[],
  excludedIds: ReadonlySet<number>,
): Product[] =>
  products
    .filter(
      (product) =>
        getProductStockStatus(product).class === 'low' && !excludedIds.has(product.id),
    )
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name))
    .slice(0, ALMOST_GONE_LIMIT);
