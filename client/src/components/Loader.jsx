import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Loader = ({ label = 'Loading' }) => (
  <div className="flex min-h-48 items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-soft"
    >
      <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
      <span className="text-sm font-semibold text-slate-600">{label}</span>
    </motion.div>
  </div>
);

export default Loader;
