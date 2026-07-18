const Input = ({
  error,
  icon: Icon,
  id,
  label,
  rightElement,
  className = '',
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <label htmlFor={id || props.name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      )}
      <input
        id={id || props.name}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200',
          Icon ? 'pl-10' : '',
          rightElement ? 'pr-11' : '',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200',
          className
        ].join(' ')}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
    {error && <p className="text-xs font-medium text-red-600">{error}</p>}
  </div>
);

export default Input;
