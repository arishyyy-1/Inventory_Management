import { twMerge } from 'tailwind-merge';

const Input = ({
  error,
  icon: Icon,
  id,
  label,
  rightElement,
  className = '',
  ...props
}) => (
  <div className="space-y-1.5">
    {label && (
      <label
        htmlFor={id || props.name}
        className="text-sm font-semibold text-fg"
      >
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
          aria-hidden="true"
        />
      )}
      <input
        id={id || props.name}
        className={twMerge(
          'w-full rounded-xl border bg-surface px-3 py-2.5 text-sm text-fg shadow-soft transition-all duration-200',
          'placeholder:text-subtle',
          'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15',
          Icon ? 'pl-10' : '',
          rightElement ? 'pr-11' : '',
          error
            ? 'border-danger focus:border-danger focus:ring-danger/15'
            : 'border-line hover:border-brand/40',
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
    {error && <p className="text-xs font-medium text-danger">{error}</p>}
  </div>
);

export default Input;
