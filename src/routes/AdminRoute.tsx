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