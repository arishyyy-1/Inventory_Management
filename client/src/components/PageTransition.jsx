import { motion } from 'framer-motion';

const PageTransition = ({ children, className = '' }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 16 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.section>
);

export default PageTransition;
