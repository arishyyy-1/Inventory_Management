import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-brand text-brand-fg shadow-soft hover:brightness-110 hover:shadow-lift',
  secondary:
    'border border-line bg-surface text-fg shadow-soft hover:border-brand/50 hover:text-brand',
  danger:
    'bg-danger text-white shadow-soft hover:brightness-110 hover:shadow-lift',
  ghost: 'text-muted hover:bg-surface-2 hover:text-fg'
};

const Button = ({
  children,
  className = '',
  icon: Icon,
  isLoading = false,
  variant = 'primary',
  type = 'button',
  ...props
}) => (
  <motion.button
    type={type}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
    disabled={isLoading || props.disabled}
    className={[
      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
      'transition-all duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      'disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      className
    ].join(' ')}
    {...props}
  >
    {isLoading ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : (
      Icon && <Icon className="h-4 w-4" aria-hidden="true" />
    )}
    {children}
  </motion.button>
);

export default Button;
