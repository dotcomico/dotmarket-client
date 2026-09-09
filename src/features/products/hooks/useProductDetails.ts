import { useEffect, useState } from 'react';
import { productApi } from '../api/productApi';
import { getErrorMessage, logError } from '../../../utils/errorHandler';
import type { Product } from '../types/product.types';

/**
 * useProductDetails - fetches a single product by id for the customer-facing
 * detail page. Local (not store-backed): unlike useProducts (admin list,
 * shared across the admin pages), this state belongs to exactly one route
 * and isn't reused elsewhere, so a plain fetch+loading+error hook is enough —
 * mirrors the shape used by every other async page (see useCart).
 */
export const useProductDetails = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productApi.getById(parseInt(id));
        if (!cancelled) setProduct(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Failed to load product'));
          logError(err, 'useProductDetails.fetchProduct');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, isLoading, error };
};
