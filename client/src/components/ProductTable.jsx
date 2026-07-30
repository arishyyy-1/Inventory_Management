import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown, Edit3, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from './ui/Badge.jsx';

const LOW_STOCK_THRESHOLD = 5;
const SERVER_URL = (import.meta.env.VITE_API_URL || '').replace('/api', '');

const SORTABLE_COLUMNS = [
  { field: 'productName', label: 'Product', align: 'left' },
  { field: 'quantity', label: 'Stock', align: 'right' },
  { field: 'price', label: 'Price', align: 'right' }
];

const SortIcon = ({ isActive, order }) => {
  if (!isActive) return <ArrowUpDown className="h-3.5 w-3.5 text-subtle" />;
  return order === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-brand" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-brand" />
  );
};

const stockBadge = (qty) => {
  const q = Number(qty || 0);
  if (q === 0) return { variant: 'danger', label: `${q} in stock` };
  if (q <= LOW_STOCK_THRESHOLD) return { variant: 'warning', label: `${q} in stock` };
  return { variant: 'success', label: `${q} in stock` };
};

const ProductTable = ({ products, onDelete, sort, order, onSortChange }) => {
  const renderSortableHeader = ({ field, label, align }) => {
    const isActive = sort === field;
    return (
      <th
        key={field}
        className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => onSortChange(field)}
          className={`inline-flex items-center gap-1.5 transition-colors hover:text-brand ${
            align === 'right' ? 'flex-row-reverse' : ''
          } ${isActive ? 'text-brand' : ''}`}
        >
          {label}
          <SortIcon isActive={isActive} order={order} />
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      <div className="max-h-[68vh] overflow-auto">
        <table className="min-w-full">
          <thead className="sticky top-0 z-10 border-b border-line bg-surface-2/95 backdrop-blur">
            <tr>
              {renderSortableHeader(SORTABLE_COLUMNS[0])}
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">
                SKU
              </th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">
                Category
              </th>
              {renderSortableHeader(SORTABLE_COLUMNS[1])}
              {renderSortableHeader(SORTABLE_COLUMNS[2])}
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">
                Updated
              </th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product, index) => {
              const badge = stockBadge(product.quantity);
              
              // Extract category name if populated object, or fallback
              const categoryName =
                typeof product.category === 'object' && product.category?.name
                  ? product.category.name.toUpperCase()
                  : product.category || 'N/A';

              return (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                  className={`row-hover ${index % 2 === 1 ? 'bg-surface-2/50' : ''}`}
                >
                  <td className="max-w-xs px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Product Thumbnail */}
                      {product.image?.url ? (
                        <img
                          src={`${SERVER_URL}${product.image.url}`}
                          alt={product.productName}
                          className="h-10 w-10 flex-shrink-0 rounded-lg object-cover border border-line shadow-sm"
                        />
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-[10px] font-semibold text-subtle">
                          No Img
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-fg truncate">{product.productName}</div>
                        {product.description && (
                          <div className="mt-0.5 truncate text-sm text-muted">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted tabular-nums">{product.sku}</td>
                  
                  {/* Category Cell */}
                  <td className="px-5 py-4 text-sm text-muted">
                    <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-1 text-xs font-semibold text-fg border border-line">
                      {categoryName}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-semibold text-fg tabular-nums">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    {formatDate(product.updatedAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-fg transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:text-brand"
                        aria-label={`Edit ${product.productName}`}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-surface px-3 py-1.5 text-sm font-semibold text-danger transition-all duration-200 hover:-translate-y-0.5 hover:bg-danger-soft"
                        aria-label={`Delete ${product.productName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line bg-surface-2 px-5 py-3 text-sm text-muted">
        Showing <strong className="text-fg">{products.length}</strong>{' '}
        product{products.length === 1 ? '' : 's'} on this page
      </div>
    </div>
  );
};

export default ProductTable;