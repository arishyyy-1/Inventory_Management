import { NavLink } from 'react-router-dom';
import { Boxes, LayoutDashboard, LogOut, PackagePlus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './ui/Button.jsx';

const navigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: ShoppingBag },
  { label: 'Add Product', href: '/products/new', icon: PackagePlus }
];

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -3, scale: 1.03 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg"
            >
              <Boxes className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="text-lg font-bold tracking-normal text-slate-950">
                InventoryPro
              </p>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">
                {user?.fullName || 'Inventory workspace'}
              </p>
            </div>
          </NavLink>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    [
                      'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-950'
                    ].join(' ')
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
          <Button variant="secondary" icon={LogOut} onClick={logout} aria-label="Logout">
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
