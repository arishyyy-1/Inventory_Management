import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from './Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const location = useLocation();
  const { authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return <Loader label="Checking session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
