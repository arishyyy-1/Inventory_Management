import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button.jsx';

export const LIMIT_OPTIONS = [10, 25, 50, 100];

const Pagination = ({
  currentPage,
  totalPages,
  totalProducts,
  hasNextPage,
  hasPreviousPage,
  limit,
  onPrevPage,
  onNextPage,
  onLimitChange
}) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm text-muted shadow-soft sm:flex-row sm:items-center sm:justify-between">
    <span>
      Page <strong className="text-fg">{currentPage}</strong> of{' '}
      <strong className="text-fg">{totalPages}</strong> —{' '}
      <strong className="text-fg">{totalProducts}</strong> total products
    </span>

    <div className="flex flex-wrap items-center gap-2">
      <label className="relative block">
        <span className="sr-only">Rows per page</span>
        <select
          value={limit}
          onChange={onLimitChange}
          className="min-h-[38px] rounded-xl border border-line bg-surface px-3 py-1.5 text-sm font-medium text-fg shadow-soft transition-all duration-200 hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        >
          {LIMIT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} rows per page
            </option>
          ))}
        </select>
      </label>

      <Button
        variant="secondary"
        icon={ChevronLeft}
        onClick={onPrevPage}
        disabled={!hasPreviousPage}
      >
        Previous
      </Button>
      <Button
        variant="secondary"
        icon={ChevronRight}
        onClick={onNextPage}
        disabled={!hasNextPage}
      >
        Next
      </Button>
    </div>
  </div>
);

export default Pagination;
