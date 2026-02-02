import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Fotter from "./Fotter/Fotter";
import AppRoutes from "../../../routes/AppRoutes";
import Header from "./Header/Header";
import { useAuthStore } from "../../../store/authStore";
import { authApi } from "../../../features/auth/api/authApi";
import { isAxiosError } from "axios";
import { useScrollToTop } from "../../../hooks/useScrollToTop";


const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, updateUser, logout } = useAuthStore();
  
    useScrollToTop();

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Sync user data from server on app load (handles role changes)
  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated) return;

      try {
        const freshUser = await authApi.getMe();
        updateUser(freshUser);
      } catch (err) {
        // If token is invalid (401), log out
       if (isAxiosError(err) && err.response?.status === 401) {
          logout();
        }
      }
    };

    syncUser();
  }, []); // Run once on mount

  return (
    <>
      {/* Only render client Header/Footer on non-admin routes */}
      {!isAdminRoute && <Header />}
      <AppRoutes />
      {!isAdminRoute && <Fotter />}
    </>
  );
};

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}