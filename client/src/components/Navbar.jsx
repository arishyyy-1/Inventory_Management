import { NavLink } from 'react-router-dom';
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './ui/Button.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const navigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, end: true },
  { label: 'Products', href: '/products', icon: ShoppingBag, end: false },
  { label: 'Add Product', href: '/products/new', icon: PackagePlus, end: true }
];

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line glass-nav">
      {/* subtle blue-tint wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            'linear-gradient(90deg, rgb(var(--brand) / 0.05), rgb(var(--brand) / 0.02) 40%, transparent)'
        }}
      />
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -4, scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-fg shadow-lift"
            >
              <Boxes className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="text-base font-bold tracking-tight text-fg">
                InventoryPro
              </p>
              <p className="hidden text-xs font-medium text-muted sm:block">
                {user?.fullName || 'Inventory workspace'}
              </p>
            </div>
          </NavLink>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-1 rounded-2xl border border-line bg-surface/70 p-1 shadow-soft backdrop-blur">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'group relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-brand/10 font-bold text-brand shadow-soft'
                        : 'font-semibold text-muted hover:bg-surface-2 hover:text-fg'
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-brand"
                          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                        />
                      )}
                      <Icon
                        className={`h-4 w-4 ${isActive ? 'text-brand' : 'text-subtle group-hover:text-fg'}`}
                      />
                      <span className={isActive ? 'ml-1' : ''}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <Button variant="secondary" icon={LogOut} onClick={logout} aria-label="Logout">
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
