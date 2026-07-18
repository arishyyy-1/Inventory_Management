import { Link } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-soft"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"
    >
      <PackagePlus className="h-8 w-8" />
    </motion.div>
    <h2 className="text-xl font-semibold text-slate-950">No products yet</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
      Add your first inventory item to begin tracking stock levels, pricing, and
      product details.
    </p>
    <Link
      to="/products/new"
      className="mt-6 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
    >
      Add Product
    </Link>
  </motion.div>
);

export default EmptyState;
