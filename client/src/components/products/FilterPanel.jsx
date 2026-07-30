import { Filter, X } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All availability' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'out-of-stock', label: 'Out of stock' }
];

const selectClasses =
  'h-full min-h-[42px] w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium text-fg shadow-soft transition-all duration-200 hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15';

const FilterPanel = ({
  category,
  categories,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  rangeDrafts,
  onRangeDraftChange,
  areFiltersActive,
  onClearFilters,
  qtyRangeDisabled = false
}) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <label className="relative block">
      <span className="sr-only">Filter by category</span>
      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <select
        value={category}
        onChange={onCategoryChange}
        className={`${selectClasses} pl-10`}
      >
        <option value="all">All categories</option>
{categories.map((c) => (
  <option key={c._id} value={c._id}>
    {c.name}
  </option>
))}
      </select>
    </label>

    <label className="relative block">
      <span className="sr-only">Filter by availability</span>
      <select
        value={availability}
        onChange={onAvailabilityChange}
        className={selectClasses}
      >
        {AVAILABILITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>

    <div className="grid grid-cols-2 gap-2">
      <Input
        type="number"
        min="0"
        aria-label="Minimum price"
        placeholder="Min price"
        value={rangeDrafts.minPrice}
        onChange={onRangeDraftChange('minPrice')}
      />
      <Input
        type="number"
        min="0"
        aria-label="Maximum price"
        placeholder="Max price"
        value={rangeDrafts.maxPrice}
        onChange={onRangeDraftChange('maxPrice')}
      />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <Input
        type="number"
        min="0"
        aria-label="Minimum quantity"
        placeholder="Min qty"
        value={rangeDrafts.minQty}
        onChange={onRangeDraftChange('minQty')}
        disabled={qtyRangeDisabled}
      />
      <Input
        type="number"
        min="0"
        aria-label="Maximum quantity"
        placeholder="Max qty"
        value={rangeDrafts.maxQty}
        onChange={onRangeDraftChange('maxQty')}
        disabled={qtyRangeDisabled}
      />
    </div>

    {areFiltersActive && (
      <Button
        variant="ghost"
        icon={X}
        onClick={onClearFilters}
        className="justify-self-start sm:col-span-2 lg:col-span-1"
      >
        Clear filters
      </Button>
    )}
  </div>
);

export default FilterPanel;
