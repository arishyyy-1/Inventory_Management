import { ArrowUpDown } from 'lucide-react';
import Button from '../ui/Button.jsx';

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'productName', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'quantity', label: 'Quantity' }
];

const SortDropdown = ({ sort, order, onSortChange, onOrderToggle }) => (
  <div className="flex gap-2">
    <label className="relative block flex-1">
      <span className="sr-only">Sort by</span>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        className="h-full min-h-[42px] w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium text-fg shadow-soft transition-all duration-200 hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>
    </label>

    <Button
      variant="secondary"
      icon={ArrowUpDown}
      onClick={onOrderToggle}
      aria-label={`Order ${order === 'asc' ? 'ascending' : 'descending'}`}
    >
      {order === 'asc' ? 'Ascending' : 'Descending'}
    </Button>
  </div>
);

export default SortDropdown;
