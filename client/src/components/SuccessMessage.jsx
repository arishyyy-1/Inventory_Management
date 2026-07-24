import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessMessage = ({ message }) => {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold text-success"
      role="status"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </motion.div>
  );
};

export default SuccessMessage;
