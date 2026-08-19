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
import VerifyEmail from "./pages/VerifyEmail";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import About from "./pages/About";
import AIChat from "./pages/AIChat";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";

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
      <ScrollToTop />

      <Routes>
        {/* ================= CUSTOMER ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/compare" element={<Compare />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ✅ VERIFY EMAIL ROUTE */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/account" element={<Account />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/about" element={<About />} />

        <Route path="/ai-chat" element={<AIChat />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route
          path="/payment-cancelled"
          element={<PaymentCancelled />}
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          <Route
            path="/admin/reviews"
            element={<AdminReviews />}
          />

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />
        </Route>

        {/* ================= 404 ================= */}

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;