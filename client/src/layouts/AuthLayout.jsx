import { Boxes, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle.jsx';

const AuthLayout = ({ children, title, subtitle }) => (
  <main className="relative grid min-h-screen bg-bg text-fg lg:grid-cols-[1.05fr_0.95fr]">
    {/* Ambient gradients */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(circle at 15% 20%, rgb(var(--brand) / 0.14), transparent 40%), radial-gradient(circle at 85% 90%, rgb(var(--brand) / 0.08), transparent 45%)'
      }}
    />

    <div className="absolute right-4 top-4 z-10">
      <ThemeToggle />
    </div>

    <section className="hidden border-r border-line px-12 py-10 lg:flex lg:flex-col lg:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-lift">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-fg">InventoryPro</p>
          <p className="text-sm text-muted">Secure inventory workspace</p>
        </div>
      </motion.div>

      <div className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-sm font-semibold text-muted shadow-soft backdrop-blur"
        >
          <Sparkles className="h-4 w-4 text-brand" />
          Modern inventory, protected by JWT
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-5xl font-bold leading-tight tracking-tight text-fg"
        >
          Manage inventory with polished, protected workflows.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-5 text-lg leading-8 text-muted"
        >
          Register, sign in, and continue your product operations in a secure
          SaaS-grade dashboard.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="flex items-center gap-3 rounded-2xl border border-line bg-surface/70 p-4 shadow-soft backdrop-blur"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-fg">JWT protected APIs</p>
          <p className="text-sm text-muted">Session persistence with localStorage</p>
        </div>
      </motion.div>
    </section>

    <section className="flex items-center justify-center px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-lift">
              <Boxes className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-fg">InventoryPro</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface/90 p-6 shadow-lift backdrop-blur sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-fg">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </section>
  </main>
);

export default AuthLayout;
