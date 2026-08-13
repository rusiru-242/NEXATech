import {
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">

      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

        {/* ================= LOGO ================= */}

        <a
          href="/"
          className="text-xl font-black tracking-[-0.06em] text-white"
        >
          NEXA<span className="text-[#00E5FF]">TECH</span>
        </a>


        {/* ================= DESKTOP NAV ================= */}

        <div className="hidden items-center gap-8 md:flex">

          <a
            href="/"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            Home
          </a>

          <a
            href="/products"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            Products
          </a>

          <a
            href="/#categories"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            Categories
          </a>

          <a
            href="/#ai"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            AI
          </a>

          <a
            href="/#about"
            className="text-xs font-medium uppercase tracking-[0.15em] text-gray-400 transition hover:text-white"
          >
            About
          </a>

        </div>


        {/* ================= RIGHT ACTIONS ================= */}

        <div className="flex items-center gap-3">

          {/* Cart */}

          <a
            href="/cart"
            aria-label="Shopping cart"
            className="group flex h-10 w-10 items-center justify-center border border-white/10 text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            <ShoppingCart
              size={18}
              className="transition group-hover:scale-110"
            />
          </a>


          {/* Login */}

          <a
            href="/login"
            className="hidden h-10 items-center border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black sm:flex"
          >
            Login
          </a>


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

            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              Home
            </a>

            <a
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              Products
            </a>

            <a
              href="/#categories"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              Categories
            </a>

            <a
              href="/#ai"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              AI
            </a>

            <a
              href="/#about"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-sm text-gray-400 transition hover:text-white"
            >
              About
            </a>


            {/* Mobile Login */}

            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-5 flex items-center justify-center border border-[#00E5FF]/40 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-black"
            >
              Login
            </a>

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;