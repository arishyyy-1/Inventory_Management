import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductTable from '../components/ProductTable.jsx';
import SuccessMessage from '../components/SuccessMessage.jsx';
import TableToolbar from '../components/products/TableToolbar.jsx';
import Pagination from '../components/products/Pagination.jsx';
import { useProducts } from '../hooks/useProducts';
import { productService } from '../services/api';
import PageTransition from '../components/PageTransition.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { categoryService } from '../services/api';

export const LIMIT_OPTIONS = [10, 25, 50, 100];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'productName', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'quantity', label: 'Quantity' }
];

// Client-side "low-stock" is layered on top of the existing filter API by
// translating it to minQty=1 & maxQty=LOW_STOCK_THRESHOLD. It coexists with
// the backend "availability" enum (all | in-stock | out-of-stock).
export const LOW_STOCK_THRESHOLD = 5;

export const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All availability' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'out-of-stock', label: 'Out of stock' }
];

const DEFAULTS = {
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc',
  category: 'all',
  availability: 'all'
};

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  let isMounted = true;

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();

      if (isMounted) {
        setCategories(response.data || []);
      }
    } catch {
      // non-critical
    }
  };

  loadCategories();

  return () => {
    isMounted = false;
  };
}, []);

  const rawAvailability = searchParams.get('availability') || DEFAULTS.availability;

  const queryParams = useMemo(() => {
    // Map low-stock (frontend-only) to backend params.
    const availabilityForApi =
      rawAvailability === 'low-stock' ? 'in-stock' : rawAvailability;

    const paramMinQty = searchParams.get('minQty') || '';
    const paramMaxQty = searchParams.get('maxQty') || '';
    const minQty = rawAvailability === 'low-stock' ? '1' : paramMinQty;
    const maxQty =
      rawAvailability === 'low-stock' ? String(LOW_STOCK_THRESHOLD) : paramMaxQty;

    return {
      page: toPositiveInt(searchParams.get('page'), DEFAULTS.page),
      limit: LIMIT_OPTIONS.includes(Number(searchParams.get('limit')))
        ? Number(searchParams.get('limit'))
        : DEFAULTS.limit,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || DEFAULTS.category,
      sort: SORT_OPTIONS.some((o) => o.value === searchParams.get('sort'))
        ? searchParams.get('sort')
        : DEFAULTS.sort,
      order: searchParams.get('order') === 'asc' ? 'asc' : DEFAULTS.order,
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minQty,
      maxQty,
      availability: availabilityForApi,
      // shadow field kept on the object so UI still sees "low-stock" as active
      _uiAvailability: rawAvailability
    };
  }, [searchParams, rawAvailability]);

  const {
    products,
    pagination,
    loading,
    isFetching,
    error,
    setError,
    removeProduct,
    refetch
  } = useProducts(useMemo(() => {
    // Strip the UI-only field before sending to the API hook (which JSON-stringifies).
    const { _uiAvailability, ...api } = queryParams;
    return api;
  }, [queryParams]));

  const [rangeDrafts, setRangeDrafts] = useState({
    minPrice: queryParams.minPrice,
    maxPrice: queryParams.maxPrice,
    minQty: rawAvailability === 'low-stock' ? '' : queryParams.minQty,
    maxQty: rawAvailability === 'low-stock' ? '' : queryParams.maxQty
  });

  useEffect(() => {
    setRangeDrafts({
      minPrice: queryParams.minPrice,
      maxPrice: queryParams.maxPrice,
      minQty: rawAvailability === 'low-stock' ? '' : queryParams.minQty,
      maxQty: rawAvailability === 'low-stock' ? '' : queryParams.maxQty
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.minPrice, queryParams.maxPrice, queryParams.minQty, queryParams.maxQty, rawAvailability]);

  const updateParams = (updates) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          const isEmpty = value === undefined || value === null || value === '';
          const isDefault =
            Object.prototype.hasOwnProperty.call(DEFAULTS, key) &&
            String(value) === String(DEFAULTS[key]);
          if (isEmpty || isDefault) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    // Skip debounced range writes while low-stock preset owns qty range.
    if (rawAvailability === 'low-stock') return;
    const handler = setTimeout(() => {
      const updates = {};
      let hasChange = false;
      Object.entries(rangeDrafts).forEach(([key, value]) => {
        if (String(value) !== String(queryParams[key])) {
          updates[key] = value;
          hasChange = true;
        }
      });
      if (hasChange) updateParams({ ...updates, page: 1 });
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDrafts, rawAvailability]);

  const handleRangeDraftChange = (key) => (event) => {
    setRangeDrafts((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSearch = (value) => updateParams({ search: value, page: 1 });
  const handleCategoryChange = (e) => updateParams({ category: e.target.value, page: 1 });
  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    // Reset qty range fields when leaving/entering low-stock preset.
    const extra =
      value === 'low-stock' || rawAvailability === 'low-stock'
        ? { minQty: '', maxQty: '' }
        : {};
    updateParams({ availability: value, page: 1, ...extra });
  };
  const handleSortChange = (value) => updateParams({ sort: value, page: 1 });
  const handleOrderToggle = () =>
    updateParams({ order: queryParams.order === 'asc' ? 'desc' : 'asc', page: 1 });
  const handleLimitChange = (e) => updateParams({ limit: Number(e.target.value), page: 1 });

  const handleClearFilters = () => {
    setRangeDrafts({ minPrice: '', maxPrice: '', minQty: '', maxQty: '' });
    updateParams({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      minQty: '',
      maxQty: '',
      availability: 'all',
      page: 1
    });
  };

  const handlePrevPage = () => updateParams({ page: Math.max(queryParams.page - 1, 1) });
  const handleNextPage = () => updateParams({ page: queryParams.page + 1 });

  const areFiltersActive = Boolean(
    queryParams.search ||
      queryParams.category !== 'all' ||
      queryParams.minPrice ||
      queryParams.maxPrice ||
      (rawAvailability !== 'low-stock' && (queryParams.minQty || queryParams.maxQty)) ||
      rawAvailability !== 'all'
  );

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    setError('');
    const result = await removeProduct(selectedProduct._id);
    setIsDeleting(false);
    if (result.success) {
      setSuccessMessage('Product deleted successfully');
      toast.success('Product deleted successfully');
      setSelectedProduct(null);
      if (products.length === 1 && queryParams.page > 1) {
        updateParams({ page: queryParams.page - 1 });
      } else {
        refetch();
      }
      return;
    }
    setError(result.message);
    toast.error(result.message);
  };

  if (loading) {
    return (
      <PageTransition className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="blue">Product Catalog</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Search, filter, add, edit, and delete inventory products.
          </p>
        </div>
        <Button icon={PackagePlus} onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </div>

      <SuccessMessage message={successMessage} />
      <ErrorMessage message={error} />

      <TableToolbar
        search={queryParams.search}
        onSearch={handleSearch}
        category={queryParams.category}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        availability={rawAvailability}
        onAvailabilityChange={handleAvailabilityChange}
        rangeDrafts={rangeDrafts}
        onRangeDraftChange={handleRangeDraftChange}
        sort={queryParams.sort}
        order={queryParams.order}
        onSortChange={handleSortChange}
        onOrderToggle={handleOrderToggle}
        areFiltersActive={areFiltersActive}
        onClearFilters={handleClearFilters}
        isFilterOpen={isFilterOpen}
        onToggleFilterOpen={() => setIsFilterOpen((open) => !open)}
        qtyRangeDisabled={rawAvailability === 'low-stock'}
      />

      {isFetching && (
        <p className="text-sm font-semibold text-brand">Updating results…</p>
      )}

      {pagination.totalProducts === 0 && !areFiltersActive ? (
        <EmptyState />
      ) : pagination.totalProducts === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-lg font-bold text-fg">No matches found</p>
          <p className="mt-2 text-sm text-muted">
            Try a different search term, or adjust your filters.
          </p>
        </Card>
      ) : (
        <>
          <ProductTable
            products={products}
            onDelete={setSelectedProduct}
            sort={queryParams.sort}
            order={queryParams.order}
            onSortChange={handleSortChange}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalProducts={pagination.totalProducts}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            limit={queryParams.limit}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      <DeleteConfirmationModal
        product={selectedProduct}
        isDeleting={isDeleting}
        onCancel={() => setSelectedProduct(null)}
        onConfirm={handleConfirmDelete}
      />
    </PageTransition>
  );
};

export default Products;
