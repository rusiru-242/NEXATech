import {
  Menu,
  ShoppingCart,
  X,
  User,
  ChevronDown,
  LogOut,
  Sparkles,
  Info,
  Home as HomeIcon,
  ShoppingBag,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // =========================================================
  // LOAD USER
  // =========================================================

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("nexatech_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("User load error:", error);
      setUser(null);
    }
  };

  // =========================================================
  // LOAD CART COUNT
  // =========================================================

  const loadCartCount = () => {
    try {
      const savedCart = localStorage.getItem("nexatech_cart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const cart = JSON.parse(savedCart);

      if (!Array.isArray(cart)) {
        setCartCount(0);
        return;
      }

      const count = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 1),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error("Cart count error:", error);
      setCartCount(0);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadUser();
    loadCartCount();

    const handleStorageChange = () => {
      loadUser();
      loadCartCount();
    };

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // =========================================================
  // ROUTE CHANGE
  // =========================================================

  useEffect(() => {
    loadUser();
    loadCartCount();
  }, [location.pathname]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("nexatech_token");
    localStorage.removeItem("nexatech_user");

    setUser(null);
    setAccountOpen(false);
    setMobileOpen(false);

    navigate("/");
  };

  // =========================================================
  // ACTIVE LINK
  // =========================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =========================================================
  // DESKTOP LINK STYLE
  // =========================================================

  const desktopLinkClass = (path) => {
    return `flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] transition ${
      isActive(path)
        ? "text-[#00E5FF]"
        : "text-gray-400 hover:text-white"
    }`;
  };

  // =========================================================
  // MOBILE LINK STYLE
  // =========================================================

  const mobileLinkClass = (path) => {
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive(path)
        ? "bg-[#00E5FF]/10 text-[#00E5FF]"
        : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
    }`;
  };

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-white/10
        bg-[#050505]/80
        backdrop-blur-xl
      "
    >
      {/* =====================================================
          NAVBAR CONTAINER
      ===================================================== */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="shrink-0"
        >
          <div className="text-xl font-bold tracking-[0.2em] text-white">
            NEXA
            <span className="text-[#00E5FF]">
              TECH
            </span>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="hidden items-center gap-7 lg:flex">

          <Link
            to="/"
            className={desktopLinkClass("/")}
          >
            <HomeIcon size={13} />
            Home
          </Link>

          <Link
            to="/products"
            className={desktopLinkClass("/products")}
          >
            <ShoppingBag size={13} />
            Products
          </Link>

          <Link
            to="/ai-chat"
            className={desktopLinkClass("/ai-chat")}
          >
            <Sparkles size={13} />
            Ask AI
          </Link>

          <Link
            to="/about"
            className={desktopLinkClass("/about")}
          >
            <Info size={13} />
            About
          </Link>

        </nav>

        {/* =====================================================
            DESKTOP RIGHT SIDE
        ===================================================== */}

        <div className="hidden items-center gap-4 lg:flex">

          {/* CART */}

          <Link
            to="/cart"
            className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-white/10
              bg-white/[0.03]
              text-gray-400
              transition
              hover:border-[#00E5FF]/30
              hover:text-[#00E5FF]
            "
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={19} />

            {cartCount > 0 && (
              <span
                className="
                  absolute -right-1 -top-1
                  flex min-h-[19px] min-w-[19px]
                  items-center justify-center
                  rounded-full
                  bg-[#00E5FF]
                  px-1
                  text-[10px]
                  font-bold
                  text-black
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* ACCOUNT */}

          {user ? (
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setAccountOpen((prev) => !prev)
                }
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  px-3 py-2
                  text-sm text-gray-300
                  transition
                  hover:border-white/20
                  hover:text-white
                "
              >
                <User size={16} />

                <span className="max-w-[110px] truncate">
                  {user.name || "Account"}
                </span>

                <ChevronDown
                  size={14}
                  className={`transition ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div
                  className="
                    absolute right-0 top-14
                    w-56 overflow-hidden
                    rounded-xl
                    border border-white/10
                    bg-[#0b0b0b]/95
                    backdrop-blur-xl
                    shadow-2xl
                  "
                >
                  <div className="border-b border-white/10 px-4 py-4">

                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>

                  </div>

                  <div className="p-2">

                    <Link
                      to="/account"
                      onClick={() => setAccountOpen(false)}
                      className="
                        block rounded-lg
                        px-3 py-2.5
                        text-sm text-gray-400
                        transition
                        hover:bg-white/[0.05]
                        hover:text-white
                      "
                    >
                      My Account
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="
                        block rounded-lg
                        px-3 py-2.5
                        text-sm text-gray-400
                        transition
                        hover:bg-white/[0.05]
                        hover:text-white
                      "
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setAccountOpen(false)}
                      className="
                        block rounded-lg
                        px-3 py-2.5
                        text-sm text-gray-400
                        transition
                        hover:bg-white/[0.05]
                        hover:text-white
                      "
                    >
                      Wishlist
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="
                          block rounded-lg
                          px-3 py-2.5
                          text-sm font-medium
                          text-[#00E5FF]
                          transition
                          hover:bg-[#00E5FF]/10
                        "
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        mt-1 flex w-full
                        items-center gap-2
                        rounded-lg
                        px-3 py-2.5
                        text-left
                        text-sm text-red-400
                        transition
                        hover:bg-red-500/10
                      "
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>

                  </div>
                </div>
              )}

            </div>
          ) : (
            <Link
              to="/login"
              className="
                rounded-xl
                bg-[#00E5FF]
                px-5 py-2.5
                text-xs font-bold
                uppercase tracking-wider
                text-black
                transition
                hover:bg-[#00cce6]
              "
            >
              Login
            </Link>
          )}

        </div>

        {/* =====================================================
            MOBILE ACTIONS
        ===================================================== */}

        <div className="flex items-center gap-2 lg:hidden">

          {/* MOBILE CART */}

          <Link
            to="/cart"
            className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-white/10
              bg-white/[0.03]
              text-gray-400
            "
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={19} />

            {cartCount > 0 && (
              <span
                className="
                  absolute -right-1 -top-1
                  flex min-h-[18px] min-w-[18px]
                  items-center justify-center
                  rounded-full
                  bg-[#00E5FF]
                  px-1
                  text-[9px] font-bold
                  text-black
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              border border-white/10
              bg-white/[0.03]
              text-gray-400
            "
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <div
          className="
            border-t border-white/10
            bg-[#050505]/90
            backdrop-blur-xl
            lg:hidden
          "
        >
          <div className="mx-auto max-w-7xl space-y-2 px-6 py-5">

            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/")}
            >
              <HomeIcon size={17} />
              Home
            </Link>

            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/products")}
            >
              <ShoppingBag size={17} />
              Products
            </Link>

            <Link
              to="/ai-chat"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/ai-chat")}
            >
              <Sparkles size={17} />
              Ask AI
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/about")}
            >
              <Info size={17} />
              About
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass("/cart")}
            >
              <ShoppingCart size={17} />

              <span>Cart</span>

              {cartCount > 0 && (
                <span className="ml-auto rounded-full bg-[#00E5FF] px-2 py-0.5 text-[10px] font-bold text-black">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* USER */}

            {user ? (
              <div className="mt-4 border-t border-white/10 pt-4">

                <div className="mb-3 flex items-center gap-3 px-4">

                  <div className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    bg-[#00E5FF]/10
                    text-[#00E5FF]
                  ">
                    <User size={17} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-600">
                      {user.email}
                    </p>

                  </div>

                </div>

                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className={mobileLinkClass("/account")}
                >
                  <User size={17} />
                  My Account
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className={mobileLinkClass("/orders")}
                >
                  <ShoppingBag size={17} />
                  My Orders
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className={mobileLinkClass("/wishlist")}
                >
                  <Sparkles size={17} />
                  Wishlist
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="
                      flex items-center gap-3
                      rounded-xl px-4 py-3
                      text-sm font-medium
                      text-[#00E5FF]
                      transition
                      hover:bg-[#00E5FF]/10
                    "
                  >
                    <User size={17} />
                    Admin Panel
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    mt-2 flex w-full
                    items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm font-medium
                    text-red-400
                    transition
                    hover:bg-red-500/10
                  "
                >
                  <LogOut size={17} />
                  Sign Out
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="
                  mt-4 flex
                  items-center justify-center
                  rounded-xl
                  bg-[#00E5FF]
                  px-4 py-3
                  text-sm font-bold
                  text-black
                "
              >
                Login
              </Link>
            )}

          </div>
        </div>
      )}

    </header>
  );
}

export default Navbar;