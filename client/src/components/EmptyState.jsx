import { Link } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center shadow-soft"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand"
    >
      <PackagePlus className="h-8 w-8" />
    </motion.div>
    <h2 className="text-xl font-bold text-fg">No products yet</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-muted">
      Add your first inventory item to begin tracking stock levels, pricing, and
      product details.
    </p>
    <Link
      to="/products/new"
      className="mt-6 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      Add Product
    </Link>
  </motion.div>
);

export default EmptyState;
