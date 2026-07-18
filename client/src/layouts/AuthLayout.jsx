import { Boxes, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => (
  <main className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_34%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] lg:grid-cols-[1.05fr_0.95fr]">
    <section className="hidden border-r border-white/70 px-12 py-10 lg:flex lg:flex-col lg:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-950">InventoryPro</p>
          <p className="text-sm text-slate-500">Secure inventory workspace</p>
        </div>
      </motion.div>

      <div className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
        >
          <Sparkles className="h-4 w-4 text-blue-600" />
          Week 2 Authentication Ready
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-5xl font-bold leading-tight tracking-normal text-slate-950"
        >
          Manage inventory with protected, polished workflows.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-5 text-lg leading-8 text-slate-600"
        >
          Register, sign in, and continue your product operations in a secure
          SaaS-style dashboard.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-soft backdrop-blur"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-950">JWT protected APIs</p>
          <p className="text-sm text-slate-500">Session persistence with localStorage</p>
        </div>
      </motion.div>
    </section>

    <section className="flex items-center justify-center px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
              <Boxes className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-slate-950">InventoryPro</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-normal text-slate-950">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </section>
  </main>
);

export default AuthLayout;
