import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PATHS } from "./paths";

/**
 * Protected Route for Admin & Manager only
 * Customers and unauthenticated users are redirected
 */
const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Not authenticated -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // Customer role -> redirect to home (no access)
  if (user?.role === 'customer') {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Admin or Manager -> allow access
  return <Outlet />;
};

export default AdminRoute;