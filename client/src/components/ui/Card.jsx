import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className = '', delay = 0, as = 'article', ...rest }) => {
  const Component = motion[as] || motion.article;
  return (
    <Component
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
      className={twMerge(
        'rounded-2xl border border-line bg-surface shadow-soft',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Card;
