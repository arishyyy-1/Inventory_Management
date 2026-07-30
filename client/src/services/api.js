import axios from 'axios';

let unauthorizedHandler = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('inventory_auth');

  if (storedAuth && !config.headers.Authorization) {
    const { token } = JSON.parse(storedAuth);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || '';
    const isAuthAttempt =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (error?.response?.status === 401 && unauthorizedHandler && !isAuthAttempt) {
      unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

/**
 * Builds a query string from a params object.
 * - Omits undefined, null, empty-string, and 'all' values.
 * - Trims string values before appending.
 */
export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null) {
      return;
    }

    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (value === '' || value === 'all') {
      return;
    }

    searchParams.append(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export const productService = {
  /**
   * Fetches products with server-side search, filtering, sorting, and pagination.
   * @param {Object} params - { page, limit, search, category, minPrice, maxPrice,
   *   minQty, maxQty, availability, sort, order }
   */
  getProducts: async (params = {}) => {
    const query = buildQueryString(params);
    const response = await api.get(`/products${query}`);
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};
export default api;