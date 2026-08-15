import {
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
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

          {/* Cart */}

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

          {/* Login */}

          <Link
            to="/login"
            className="hidden h-10 items-center border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black sm:flex"
          >
            Login
          </Link>

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-gray-400 transition hover:border-white/30 hover:text-white md:hidden"
          >
            {menuOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
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

            {/* Mobile Login */}

            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-3 flex items-center justify-center border border-[#00E5FF]/40 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-black"
            >
              Login
            </Link>

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;