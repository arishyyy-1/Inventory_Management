import { useEffect, useState } from 'react';
import { productService } from '../services/api';

const getReadableError = (error, fallbackMessage) => {
  const responseMessage = error?.response?.data?.message;
  const firstValidationError = error?.response?.data?.errors?.[0]?.message;
  return firstValidationError || responseMessage || fallbackMessage;
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        setProducts(response.data || []);
      } catch (fetchError) {
        setError(getReadableError(fetchError, 'Unable to load products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    const previousProducts = products;
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product._id !== id)
    );

    try {
      await productService.deleteProduct(id);
      return { success: true };
    } catch (deleteError) {
      setProducts(previousProducts);
      return {
        success: false,
        message: getReadableError(deleteError, 'Unable to delete product')
      };
    }
  };

  return {
    products,
    loading,
    error,
    setError,
    removeProduct
  };
};
