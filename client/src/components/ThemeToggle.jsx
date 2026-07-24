import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'inline-flex h-10 w-10 items-center justify-center rounded-xl',
        'border border-line bg-surface text-fg shadow-soft',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand',
        className
      ].join(' ')}
    >
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        <Sun
          className={`absolute h-5 w-5 transition-all duration-300 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
