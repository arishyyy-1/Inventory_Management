import { twMerge } from 'tailwind-merge';

const variants = {
  neutral: 'bg-surface-2 text-muted border border-line',
  success: 'bg-success-soft text-success border border-success/20',
  warning: 'bg-warn-soft text-warn border border-warn/20',
  danger: 'bg-danger-soft text-danger border border-danger/20',
  blue: 'bg-brand-soft text-brand border border-brand/20'
};

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={twMerge(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight',
      variants[variant],
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
