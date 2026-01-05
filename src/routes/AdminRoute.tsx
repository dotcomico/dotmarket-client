// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore';

// export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, isAuthenticated } = useAuthStore();
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
  
//   if (user?.role !== 'admin' && user?.role !== 'manager') {
//     return <Navigate to="/" />;
//   }
  
//   return <>{children}</>;
// };

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";

// const AdminRoute = () => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user?.role !== "ADMIN") {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default AdminRoute;