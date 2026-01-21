import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PATHS } from './paths';

/*
  Protected Route Component
  Wraps routes that require authentication.
  If user is not logged in, redirects to login page. 
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the location they tried to visit
    // so we can redirect them back after login
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;