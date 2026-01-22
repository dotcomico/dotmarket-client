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
      {/* Public routes */}
      <Route path={PATHS.HOME} element={<Home />} />
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route path={PATHS.REGISTER} element={<Register />} />
      <Route path={PATHS.PRODUCTS} element={<Products />} />
      <Route path="/categories/:slug/products" element={<Products />} />
      <Route path={PATHS.CATEGORY_DETAILS} element={<Categorys />} />

      {/* <Route path="/login" element={<Login />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} /> */}

      <Route element={<ProtectedRoute />}>
        <Route
          path={PATHS.PROFILE}
          element={<Profile/>}
        />

        <Route
          path={PATHS.ORDERS}
          element={<div>Orders Page (Protected)</div>}
        />

        <Route
          path={PATHS.CART}
          element={<Cart/>}
        />

        <Route
          path={PATHS.CHECKOUT}
          element={<div>Checkout Page (Protected)</div>}
        />
      </Route>

      {/* <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
      </Route> */}


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
