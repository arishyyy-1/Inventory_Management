import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';

const MainLayout = () => (
  <div className="min-h-screen bg-bg text-fg">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </main>
  </div>
);

export default MainLayout;
