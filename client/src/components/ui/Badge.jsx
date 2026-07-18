import { twMerge } from "tailwind-merge";

const variants = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700'
};

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={twMerge(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
      variants[variant],
      className
    )}
  >
    {children}
  </span>
);

export default Badge;