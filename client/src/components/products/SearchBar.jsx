import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input.jsx';

const DEBOUNCE_MS = 400;

const SearchBar = ({ value, onSearch, placeholder, className = '' }) => {
  const [draft, setDraft] = useState(value);

  // Keep local draft aligned when the URL/value changes from elsewhere
  // (e.g. "Clear filters", browser back/forward navigation).
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (draft !== value) {
        onSearch(draft);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <Input
      icon={Search}
      name="search"
      aria-label="Search products"
      placeholder={placeholder || 'Search by product name, SKU, or description'}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      className={className}
    />
  );
};

export default SearchBar;