import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
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
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60',
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
