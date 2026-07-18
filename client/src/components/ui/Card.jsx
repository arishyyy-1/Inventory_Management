import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut', delay }}
    className={[
      'rounded-xl border border-slate-200/80 bg-white/90 shadow-soft backdrop-blur',
      className
    ].join(' ')}
  >
    {children}
  </motion.article>
);

export default Card;
