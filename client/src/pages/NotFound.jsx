import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';

const NotFound = () => (
  <PageTransition className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
      <p className="text-sm font-semibold uppercase text-blue-700">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 text-slate-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        <Home className="h-4 w-4" />
        Go to dashboard
      </Link>
    </div>
  </PageTransition>
);

export default NotFound;
