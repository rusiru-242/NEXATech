
import {
  User,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Save,
  ArrowLeft,
  ShoppingBag,
  Heart,
  LogOut,
  ArrowRight,
  Package,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000";

function Account() {
  const navigate = useNavigate();

  // ==============================
  // USER
  // ==============================
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ==============================
  // PROFILE FORM
  // ==============================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ==============================
  // PASSWORD FORM
  // ==============================
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==============================
  // GET TOKEN
  // ==============================
  const getToken = () => {
    return localStorage.getItem("nexatech_token");
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("nexatech_token");
    localStorage.removeItem("nexatech_user");

    navigate("/login");
  };

  // ==============================
  // LOAD USER
  // ==============================
  const loadUser = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load account."
        );
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });

      localStorage.setItem(
        "nexatech_user",
        JSON.stringify(data.user)
      );

      return data.user;
    } catch (err) {
      console.error("Account error:", err);

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running on port 5000."
        );
      } else {
        const msg = err.message || "";

        if (
          msg.toLowerCase().includes("token") ||
          msg.toLowerCase().includes("authentication") ||
          msg.toLowerCase().includes("access denied")
        ) {
          localStorage.removeItem("nexatech_token");
          localStorage.removeItem("nexatech_user");

          navigate("/login");
          return null;
        }

        setError(msg);
      }

      return null;
    }
  };

  // ==============================
  // LOAD ORDERS
  // ==============================
  const loadOrders = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setOrdersLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders error:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ==============================
  // LOAD WISHLIST
  // ==============================
  const loadWishlist = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setWishlistLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/wishlist`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load wishlist."
        );
      }

      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error("Wishlist error:", err);
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    const loadAccount = async () => {
      setLoading(true);

      const currentUser = await loadUser();

      if (currentUser) {
        await Promise.all([
          loadOrders(),
          loadWishlist(),
        ]);
      }

      setLoading(false);
    };

    loadAccount();
  }, []);

  // ==============================
  // PROFILE INPUT
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==============================
  // PASSWORD INPUT
  // ==============================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==============================
  // UPDATE PROFILE
  // ==============================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const phoneTrim = formData.phone.trim();

    if (phoneTrim) {
      const phoneRegex = /^(07\d{8}|\+947\d{8})$/;

      if (!phoneRegex.test(phoneTrim)) {
        setError(
          "Phone number is invalid. Use 07XXXXXXXX or +947XXXXXXXX."
        );
        return;
      }
    }

    const addressTrim = formData.address.trim();

    if (addressTrim && addressTrim.length < 5) {
      setError(
        "Address must be at least 5 characters."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: phoneTrim,
            address: addressTrim,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });

      localStorage.setItem(
        "nexatech_user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Account details updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile."
      );
    }
  };

  // ==============================
  // CHANGE PASSWORD
  // ==============================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change password."
        );
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Password change error:",
        err
      );

      setError(
        err.message ||
          "Unable to change password."
      );
    }
  };

  // ==============================
  // FORMAT ORDER DATE
  // ==============================
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // ==============================
  // ORDER STATUS
  // ==============================
  const getOrderStatus = (order) => {
    return (
      order.status ||
      order.orderStatus ||
      "Pending"
    );
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Loading Account...
        </p>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================
  return (
    <div className="min-h-screen bg-[#050505] px-5 pb-12 text-white">

      <Navbar />

      <div className="mx-auto max-w-6xl pt-6 md:pt-20">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="mb-7">

          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#00E5FF]"
          >
            <ArrowLeft size={14} />
            Back to Store
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00E5FF]">
            MY ACCOUNT
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Welcome,
            <span className="text-gray-600">
              {" "}
              {user?.name || "Customer"}.
            </span>
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Manage your account, orders and saved products.
          </p>

        </div>

        {/* ==============================
            MESSAGE
        ============================== */}

        {message && (
          <div className="mb-6 border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-4 py-3 text-sm text-[#00E5FF]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ==============================
            TOP ACCOUNT CARD
        ============================== */}

        <div className="mb-6 border border-white/10 bg-[#090909] p-6 sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF]">
                <User size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {user?.name}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {user?.email}
                </p>

                {user?.role && (
                  <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#00E5FF]">
                    {user.role}
                  </p>
                )}
              </div>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 items-center justify-center gap-2 border border-red-500/20 px-5 text-xs font-semibold uppercase tracking-[0.15em] text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={15} />
              Sign Out
            </button>

          </div>

        </div>

        {/* ==============================
            ORDERS + WISHLIST
        ============================== */}

        <div className="mb-6 grid gap-6 lg:grid-cols-2">

          {/* ==============================
              MY ORDERS
          ============================== */}

          <div className="border border-white/10 bg-[#090909] p-6 sm:p-8">

            <div className="mb-6 flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <ShoppingBag size={15} />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                    SHOPPING
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  My Orders
                </h2>

              </div>

              <div className="flex h-10 min-w-10 items-center justify-center border border-white/10 bg-white/[0.02] px-3 text-sm font-bold text-white">
                {orders.length}
              </div>

            </div>

            {ordersLoading ? (
              <div className="py-10 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-700">
                  Loading Orders...
                </p>
              </div>
            ) : orders.length === 0 ? (

              <div className="border border-white/5 bg-white/[0.02] px-5 py-8 text-center">

                <Package
                  size={28}
                  className="mx-auto text-gray-700"
                />

                <h3 className="mt-4 text-sm font-semibold text-gray-400">
                  No orders yet
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-700">
                  Your orders will appear here
                  after you place an order.
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#00E5FF] transition hover:text-white"
                >
                  Start Shopping
                  <ArrowRight size={13} />
                </Link>

              </div>

            ) : (

              <div className="space-y-3">

                {orders
                  .slice(0, 3)
                  .map((order) => (

                    <Link
                      key={order._id || order.id}
                      to={`/orders/${order._id || order.id}`}
                      className="group flex items-center justify-between border border-white/5 bg-white/[0.02] p-4 transition hover:border-[#00E5FF]/30"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold">
                          Order #
                          {String(
                            order._id ||
                            order.id
                          ).slice(-8)}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-600">
                          {formatDate(
                            order.createdAt ||
                            order.date
                          )}
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-gray-500">
                          {getOrderStatus(order)}
                        </span>

                        <ChevronRight
                          size={15}
                          className="text-gray-700 transition group-hover:translate-x-1 group-hover:text-[#00E5FF]"
                        />

                      </div>

                    </Link>

                  ))}

                {orders.length > 3 && (
                  <Link
                    to="/orders"
                    className="flex items-center justify-center gap-2 pt-3 text-xs font-semibold text-[#00E5FF] transition hover:text-white"
                  >
                    View All Orders
                    <ArrowRight size={13} />
                  </Link>
                )}

              </div>

            )}

          </div>

          {/* ==============================
              WISHLIST
          ============================== */}

          <div className="border border-white/10 bg-[#090909] p-6 sm:p-8">

            <div className="mb-6 flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2 text-[#00E5FF]">
                  <Heart size={15} />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                    SAVED ITEMS
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-bold">
                  Wishlist
                </h2>

              </div>

              <div className="flex h-10 min-w-10 items-center justify-center border border-white/10 bg-white/[0.02] px-3 text-sm font-bold text-white">
                {wishlist.length}
              </div>

            </div>

            {wishlistLoading ? (
              <div className="py-10 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-700">
                  Loading Wishlist...
                </p>
              </div>
            ) : wishlist.length === 0 ? (

              <div className="border border-white/5 bg-white/[0.02] px-5 py-8 text-center">

                <Heart
                  size={28}
                  className="mx-auto text-gray-700"
                />

                <h3 className="mt-4 text-sm font-semibold text-gray-400">
                  Your wishlist is empty
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-700">
                  Save products you love and
                  they will appear here.
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#00E5FF] transition hover:text-white"
                >
                  Browse Products
                  <ArrowRight size={13} />
                </Link>

              </div>

            ) : (

              <div className="space-y-3">

                {wishlist
                  .slice(0, 3)
                  .map((product) => {

                    const productId =
                      product?._id ||
                      product?.id;

                    return (
                      <Link
                        key={productId}
                        to={`/products/${productId}`}
                        className="group flex items-center gap-4 border border-white/5 bg-white/[0.02] p-3 transition hover:border-[#00E5FF]/30"
                      >

                        {/* Product Image */}

                        <div className="h-14 w-14 shrink-0 overflow-hidden border border-white/5 bg-white/[0.03]">

                          {product?.image ||
                          product?.imageUrl ? (
                            <img
                              src={
                                product.image ||
                                product.imageUrl
                              }
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Heart
                                size={18}
                                className="text-gray-700"
                              />
                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate text-sm font-semibold text-gray-300 transition group-hover:text-white">
                            {product?.name ||
                              "Product"}
                          </h3>

                          {product?.price !==
                            undefined && (
                            <p className="mt-1 text-xs text-[#00E5FF]">
                              $
                              {Number(
                                product.price
                              ).toFixed(2)}
                            </p>
                          )}

                        </div>

                        <ChevronRight
                          size={15}
                          className="shrink-0 text-gray-700 transition group-hover:translate-x-1 group-hover:text-[#00E5FF]"
                        />

                      </Link>
                    );
                  })}

                {wishlist.length > 3 && (
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-center gap-2 pt-3 text-xs font-semibold text-[#00E5FF] transition hover:text-white"
                  >
                    View Full Wishlist
                    <ArrowRight size={13} />
                  </Link>
                )}

              </div>

            )}

          </div>

        </div>

        {/* ==============================
            PROFILE + PASSWORD
        ============================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ==============================
              PROFILE
          ============================== */}

          <div className="border border-white/10 bg-[#090909] p-6 sm:p-8">

            <div className="mb-7">

              <p className="text-[10px] uppercase tracking-[0.25em] text-[#00E5FF]">
                PERSONAL INFORMATION
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Account Details
              </h2>

            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-5"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    value={formData.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed border border-white/10 bg-white/[0.01] pl-11 pr-4 text-sm text-gray-600 outline-none"
                  />

                </div>

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Phone
                </label>

                <div className="relative">

                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              {/* Address */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={16}
                    className="absolute left-4 top-4 text-gray-700"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    rows={4}
                    className="w-full resize-none border border-white/10 bg-white/[0.02] pl-11 pr-4 pt-3 text-sm text-white outline-none transition focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#00E5FF] text-sm font-bold text-black transition hover:bg-white"
              >
                <Save size={16} />
                Save Details
              </button>

            </form>

          </div>

          {/* ==============================
              PASSWORD
          ============================== */}

          <div className="border border-white/10 bg-[#090909] p-6 sm:p-8">

            <div className="mb-7">

              <p className="text-[10px] uppercase tracking-[0.25em] text-[#00E5FF]">
                SECURITY
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Change Password
              </h2>

            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5"
            >

              {/* Current */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Current Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              {/* New */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  New Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              {/* Confirm */}

              <div>

                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Confirm New Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              <div className="border border-white/5 bg-white/[0.02] p-4 text-xs leading-5 text-gray-600">
                Your new password must contain
                at least 6 characters.
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 border border-[#00E5FF]/40 text-sm font-semibold text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-black"
              >
                <LockKeyhole size={16} />
                Change Password
              </button>

            </form>

          </div>

        </div>

        {/* ==============================
            BOTTOM SIGN OUT
        ============================== */}

        <div className="mt-8 border-t border-white/10 pt-6">

          <button
            type="button"
            onClick={handleLogout}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-600 transition hover:text-red-400"
          >
            <LogOut
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />

            Sign Out
          </button>

        </div>

      </div>

    </div>
  );
}

export default Account;

