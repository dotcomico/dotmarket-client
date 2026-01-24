import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import { PATHS } from "./paths";
import Products from "../pages/Products/Products";
import Categorys from "../pages/Categorys/Categorys";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile/Profile";
import AdminRoute from "./AdminRoute";
import { AdminLayout } from "../components/layouts/AdminLayout/AdminLayout";
import OrderManagement from "../pages/admin/OrderManagement/OrderManagement";
import UserManagement from "../pages/admin/UserManagements/UserManagement";
import ProductManagement from "../pages/admin/ProductManagement/ProductManagement";
import Dashboard from "../pages/admin/Dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={PATHS.HOME} element={<Home />} />
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.REGISTER} element={<Register />} />
      <Route path={PATHS.PRODUCTS} element={<Products />} />
      <Route path="/categories/:slug/products" element={<Products />} />
      <Route path={PATHS.CATEGORY_DETAILS} element={<Categorys />} />

      {/* Protected routes (authenticated users) */}
      <Route element={<ProtectedRoute />}>
        <Route path={PATHS.PROFILE} element={<Profile />} />
        <Route path={PATHS.ORDERS} element={<div>Orders Page</div>} />
        <Route path={PATHS.CART} element={<Cart />} />
        <Route path={PATHS.CHECKOUT} element={<div>Checkout</div>} />
      </Route>

      {/* Admin routes (admin & manager only) with AdminLayout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path={PATHS.ADMIN.DASHBOARD} element={<Dashboard />} />
          <Route path={PATHS.ADMIN.PRODUCTS} element={<ProductManagement />} />
          <Route path={PATHS.ADMIN.ORDERS} element={<OrderManagement />} />
          <Route path={PATHS.ADMIN.USERS} element={<UserManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>

  );
};

export default AppRoutes;