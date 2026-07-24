import { useCallback, useEffect, useRef, useState } from 'react';
import { productService } from '../services/api';

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 0,
  totalProducts: 0,
  hasNextPage: false,
  hasPreviousPage: false
};

const getReadableError = (error, fallbackMessage) => {
  const responseMessage = error?.response?.data?.message;
  const firstValidationError = error?.response?.data?.errors?.[0]?.message;
  return firstValidationError || responseMessage || fallbackMessage;
};

/**
 * Fetches products from the server using the supplied query params and
 * re-fetches whenever those params change.
 *
 * `loading` is only ever true for the very first fetch (nothing on screen
 * yet). Every subsequent fetch — triggered by typing a debounced search,
 * changing a filter, sorting, or paginating — sets `isFetching` instead,
 * so the existing table stays visible and doesn't flash back to a full
 * skeleton. A ref (not products.length) tracks "have we loaded once",
 * since a filtered search can legitimately return zero results without
 * that meaning we're back at the initial load.
 *
 * @param {Object} queryParams - { page, limit, search, category, minPrice,
 *   maxPrice, minQty, maxQty, availability, sort, order }
 */
export const useProducts = (queryParams = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  const requestIdRef = useRef(0);
  const hasLoadedOnceRef = useRef(false);

  const serializedParams = JSON.stringify(queryParams);

  const fetchProducts = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;

    if (hasLoadedOnceRef.current) {
      setIsFetching(true);
    } else {
      setLoading(true);
    }

    try {
      setError('');

      const effectiveParams = JSON.parse(serializedParams);
      const response = await productService.getProducts(effectiveParams);

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setProducts(response.data || []);
      setPagination({
        currentPage: response.currentPage ?? DEFAULT_PAGINATION.currentPage,
        totalPages: response.totalPages ?? DEFAULT_PAGINATION.totalPages,
        totalProducts: response.totalProducts ?? DEFAULT_PAGINATION.totalProducts,
        hasNextPage: response.hasNextPage ?? DEFAULT_PAGINATION.hasNextPage,
        hasPreviousPage: response.hasPreviousPage ?? DEFAULT_PAGINATION.hasPreviousPage
      });
    } catch (fetchError) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setError(getReadableError(fetchError, 'Unable to load products'));
    } finally {
      if (currentRequestId === requestIdRef.current) {
        hasLoadedOnceRef.current = true;
        setLoading(false);
        setIsFetching(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProduct = async (id) => {
    const previousProducts = products;
    const previousPagination = pagination;

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== id)
    );
    setPagination((currentPagination) => ({
      ...currentPagination,
      totalProducts: Math.max(currentPagination.totalProducts - 1, 0)
    }));

    try {
      await productService.deleteProduct(id);
      return { success: true };
    } catch (deleteError) {
      setProducts(previousProducts);
      setPagination(previousPagination);
      return {
        success: false,
        message: getReadableError(deleteError, 'Unable to delete product')
      };
    }
  };

  return {
    products,
    pagination,
    loading,
    isFetching,
    error,
    setError,
    removeProduct,
    refetch: fetchProducts
  };
};