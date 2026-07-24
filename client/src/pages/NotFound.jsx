import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';

const NotFound = () => (
  <PageTransition className="flex min-h-screen items-center justify-center bg-bg px-4">
    <div className="max-w-xl rounded-2xl border border-line bg-surface p-8 text-center shadow-lift">
      <p className="text-sm font-bold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-fg">
        Page not found
      </h1>
      <p className="mt-4 text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-fg shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
      >
        <Home className="h-4 w-4" />
        Go to dashboard
      </Link>
    </div>
  </PageTransition>
);

export default NotFound;
