import { getProductStockStatus, type Product } from '../../products';

const ALMOST_GONE_LIMIT = 10;

export const selectAlmostGone = (products: Product[]): Product[] =>
  products
    .filter((product) => getProductStockStatus(product).class === 'low')
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name))
    .slice(0, ALMOST_GONE_LIMIT);
