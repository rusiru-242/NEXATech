import {
  Menu,
  ShoppingCart,
  X,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);

  // ==============================
  // Load Logged In User
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("nexatech_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid stored user:", error);
        localStorage.removeItem("nexatech_user");
      }
    }
  }, []);

  // ==============================
  // Close Mobile Menu
  // ==============================
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ==============================
  // Sign Out
  // ==============================
  const handleSignOut = () => {
    localStorage.removeItem("nexatech_token");
    localStorage.removeItem("nexatech_user");

    setUser(null);
    setAccountOpen(false);
    setMenuOpen(false);

    navigate("/");
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-black tracking-[-0.06em] text-white"
        >
          NEXA<span className="text-[#00E5FF]">TECH</span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            Products
          </Link>

          <a
            href="#categories"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            Categories
          </a>

          <a
            href="#ai"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            AI
          </a>

          <a
            href="#about"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            About
          </a>
        </div>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-3">

          {/* ================= CART ================= */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="group flex h-10 w-10 items-center justify-center border border-white/10 text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            <ShoppingCart
              size={18}
              className="transition-transform group-hover:scale-110"
            />
          </Link>

          {/* ================= DESKTOP ACCOUNT ================= */}
          {user ? (
            <div className="relative hidden sm:block">

              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex h-10 items-center gap-3 border border-white/10 px-4 text-left transition hover:border-[#00E5FF]/60"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00E5FF] text-black">
                  <User size={14} />
                </div>

                <div className="max-w-[110px]">
                  <p className="truncate text-xs font-semibold text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-[9px] uppercase tracking-wider text-gray-600">
                    My Account
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ================= ACCOUNT DROPDOWN ================= */}
              {accountOpen && (
                <div className="absolute right-0 top-12 w-64 border border-white/10 bg-[#090909] p-2 shadow-2xl">

                  {/* User Info */}
                  <div className="border-b border-white/10 px-4 py-4">
                    <p className="text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-600">
                      {user.email}
                    </p>
                  </div>

                  {/* My Account */}
                  <Link
                    to="/account"
                    onClick={() => setAccountOpen(false)}
                    className="mt-2 block px-4 py-3 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-[#00E5FF]"
                  >
                    My Account
                  </Link>

                  {/* My Orders */}
                  <Link
                    to="/orders"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-3 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-[#00E5FF]"
                  >
                    My Orders
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-3 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-[#00E5FF]"
                  >
                    Wishlist
                  </Link>

                  {/* Divider */}
                  <div className="my-2 border-t border-white/10" />

                  {/* Sign Out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-3 text-xs text-gray-500 transition hover:bg-red-500/5 hover:text-red-400"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>

                </div>
              )}
            </div>
          ) : (
            /* ================= LOGIN ================= */
            <Link
              to="/login"
              className="hidden h-10 items-center border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black sm:flex"
            >
              Login
            </Link>
          )}

          {/* ================= MOBILE MENU ================= */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-gray-400 transition hover:border-white/30 hover:text-white md:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#050505] md:hidden">

          <div className="mx-auto flex max-w-[1400px] flex-col px-5 py-6">

            <Link
              to="/"
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              Products
            </Link>

            <a
              href="#categories"
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              Categories
            </a>

            <a
              href="#ai"
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              AI
            </a>

            <a
              href="#about"
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              About
            </a>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="mt-5 flex items-center justify-center gap-2 border border-white/10 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
            >
              <ShoppingCart size={15} />
              Cart
            </Link>

            {user ? (
              <>
                {/* Mobile User */}
                <div className="mt-5 border border-white/10 p-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00E5FF] text-black">
                      <User size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>

                      <p className="text-[10px] text-gray-600">
                        {user.email}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Mobile Account */}
                <Link
                  to="/account"
                  onClick={closeMenu}
                  className="mt-3 border border-white/10 py-3 text-center text-xs text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                >
                  My Account
                </Link>

                {/* Mobile Orders */}
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="mt-2 border border-white/10 py-3 text-center text-xs text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                >
                  My Orders
                </Link>

                {/* Mobile Wishlist */}
                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="mt-2 border border-white/10 py-3 text-center text-xs text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                >
                  Wishlist
                </Link>

                {/* Mobile Sign Out */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-2 flex items-center justify-center gap-2 border border-red-500/20 py-3 text-xs text-red-400 transition hover:bg-red-500/5"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              /* Mobile Login */
              <Link
                to="/login"
                onClick={closeMenu}
                className="mt-3 flex items-center justify-center border border-[#00E5FF]/40 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-black"
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