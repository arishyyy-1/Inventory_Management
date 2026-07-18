import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import Badge from './ui/Badge.jsx';

const ProductTable = ({ products, onDelete }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="max-h-[68vh] overflow-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">
              Product
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">
              SKU
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">
              Category
            </th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-500">
              Qty
            </th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-500">
              Price
            </th>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">
              Updated
            </th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {products.map((product) => (
            <motion.tr
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="transition hover:bg-slate-50"
            >
              <td className="max-w-xs px-5 py-4">
                <div className="font-semibold text-slate-950">
                  {product.productName}
                </div>
                {product.description && (
                  <div className="mt-1 truncate text-sm text-slate-500">
                    {product.description}
                  </div>
                )}
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{product.sku}</td>
              <td className="px-5 py-4 text-sm text-slate-600">
                {product.category}
              </td>
              <td className="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                <div className="flex justify-end">
                  <Badge
                    variant={Number(product.quantity) <= 5 ? 'warning' : 'success'}
                  >
                    {product.quantity} in stock
                  </Badge>
                </div>
              </td>
              <td className="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                {formatCurrency(product.price)}
              </td>
              <td className="px-5 py-4 text-sm text-slate-500">
                {formatDate(product.updatedAt)}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/products/${product._id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100"
                    aria-label={`Edit ${product.productName}`}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-50"
                    aria-label={`Delete ${product.productName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing <strong className="text-slate-900">{products.length}</strong>{' '}
        products
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-400"
        >
          Previous
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-400"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);

export default ProductTable;
