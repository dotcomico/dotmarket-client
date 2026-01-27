import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import Fotter from "./Fotter/Fotter";
import AppRoutes from "../../../routes/AppRoutes";
import Header from "./Header/Header";

/**
 * Inner component that has access to router context
 * Conditionally renders Header/Footer based on current route
 */
const AppContent = () => {
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

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