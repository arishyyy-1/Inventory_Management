import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, PackagePlus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductTable from '../components/ProductTable.jsx';
import SuccessMessage from '../components/SuccessMessage.jsx';
import { useProducts } from '../hooks/useProducts';
import PageTransition from '../components/PageTransition.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, error, setError, removeProduct } = useProducts();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (location.state?.successMessage) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, products, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!selectedProduct) {
      return;
    }

    setIsDeleting(true);
    setError('');
    const result = await removeProduct(selectedProduct._id);
    setIsDeleting(false);

    if (result.success) {
      setSuccessMessage('Product deleted successfully');
      toast.success('Product deleted successfully');
      setSelectedProduct(null);
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
        <Badge
  variant="blue"
  className="px-4 py-1.5 text-sm uppercase tracking-wide"
>
  Product Catalog
</Badge>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
            Products
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Search, filter, add, edit, and delete inventory products in a
            protected workspace.
          </p>
        </div>
        <Button icon={PackagePlus} onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </div>

      <SuccessMessage message={successMessage} />
      <ErrorMessage message={error} />

      <Card className="p-4 border border-blue-100 bg-blue-50/30">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <Input
            icon={Search}
            name="search"
            aria-label="Search products"
            placeholder="Search by product name or SKU"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <label className="relative">
            <span className="sr-only">Filter by category</span>
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-full min-h-[42px] w-full rounded-lg border border-blue-200 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {products.length === 0 ? (
        <EmptyState />
      ) : filteredProducts.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-lg font-semibold text-slate-950">No matches found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try a different search term or category filter.
          </p>
        </Card>
      ) : (
        <ProductTable products={filteredProducts} onDelete={setSelectedProduct} />
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
