import { useEffect, useState } from 'react';
import { productApi, type Product } from '../../products';
import { getErrorMessage, logError } from '../../../utils/errorHandler';

const NEW_ARRIVALS_PAGE_SIZE = 10;

/**
 * useNewArrivals - fetches the newest products for the home page. The backend
 * already sorts /products by createdAt descending.
 *
 * Local state rather than useProductStore: that store is overwritten with
 * category and search results by the Products page, so it can't answer
 * "what's newest".
 */
export const useNewArrivals = () => {
  const [arrivals, setArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchArrivals = async () => {
      try {
        const response = await productApi.getAll({ page: 1, limit: NEW_ARRIVALS_PAGE_SIZE });
        if (!cancelled) setArrivals(response.data.products);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Failed to load new arrivals'));
          logError(err, 'useNewArrivals.fetchArrivals');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchArrivals();

    return () => {
      cancelled = true;
    };
  }, []);

  return { arrivals, isLoading, error };
};
