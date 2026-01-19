import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import { PATHS } from "./paths";
import Products from "../pages/Products";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import ProductDetails from "../pages/ProductDetails";
// import Cart from "../pages/Cart";
// import Checkout from "../pages/Checkout";
// import NotFound from "../pages/NotFound";

// import AdminDashboard from "../pages/Admin/Dashboard";
// import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* נתיבים ציבוריים */}
      <Route path={PATHS.HOME} element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.PRODUCTS} element={< Products/>} />

      {/* <Route path="/login" element={<Login />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} /> */}

      {/* נתיבים מוגנים */}
      {/* <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Route> */}

      {/* <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
      </Route> */}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
