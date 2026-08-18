import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// ================= CUSTOMER PAGES =================

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import About from "./pages/About";
import AIChat from "./pages/AIChat";
import Checkout from "./pages/Checkout";

// ================= ADMIN PAGES =================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";


function App() {
  return (
    <BrowserRouter>

      {/* Scroll to top whenever route changes */}
      <ScrollToTop />

      <Routes>

        {/* =====================================================
            CUSTOMER ROUTES
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/compare"
          element={<Compare />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* About Page */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* AI Chat Page */}
        <Route
          path="/ai-chat"
          element={<AIChat />}
        />

        {/* Checkout Page */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* =====================================================
            ADMIN ROUTES
            All admin pages are protected
        ===================================================== */}

        <Route element={<AdminProtectedRoute />}>

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* Product Management */}
          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          {/* Order Management */}
          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          {/* User Management */}
          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          {/* Category Management */}
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          {/* Review Management */}
          <Route
            path="/admin/reviews"
            element={<AdminReviews />}
          />

          {/* Analytics */}
          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}


export default App;