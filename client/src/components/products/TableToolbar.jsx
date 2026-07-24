import { SlidersHorizontal } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import FilterPanel from './FilterPanel.jsx';
import SortDropdown from './SortDropdown.jsx';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';

const TableToolbar = ({
  search,
  onSearch,
  category,
  categories,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  rangeDrafts,
  onRangeDraftChange,
  sort,
  order,
  onSortChange,
  onOrderToggle,
  areFiltersActive,
  onClearFilters,
  isFilterOpen,
  onToggleFilterOpen,
  qtyRangeDisabled = false
}) => (
  <Card className="p-4">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <SearchBar value={search} onSearch={onSearch} className="md:max-w-sm" />
      <Button
        variant="secondary"
        icon={SlidersHorizontal}
        onClick={onToggleFilterOpen}
        className="md:hidden"
      >
        Filters
      </Button>
    </div>

    <div className={`${isFilterOpen ? 'block' : 'hidden'} mt-4 space-y-4 md:block`}>
      <FilterPanel
        category={category}
        categories={categories}
        onCategoryChange={onCategoryChange}
        availability={availability}
        onAvailabilityChange={onAvailabilityChange}
        rangeDrafts={rangeDrafts}
        onRangeDraftChange={onRangeDraftChange}
        areFiltersActive={areFiltersActive}
        onClearFilters={onClearFilters}
        qtyRangeDisabled={qtyRangeDisabled}
      />

      <SortDropdown
        sort={sort}
        order={order}
        onSortChange={onSortChange}
        onOrderToggle={onOrderToggle}
      />
    </div>
  </Card>
);

export default TableToolbar;
