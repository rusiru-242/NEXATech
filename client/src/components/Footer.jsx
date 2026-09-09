import { Link } from "react-router-dom";
import { Sparkles, Shield } from "lucide-react";

export function Footer() {
  const linkClass =
    "group flex items-center transition-all duration-300 ease-out hover:translate-x-[3px] hover:text-white focus:outline-none focus-visible:text-[#00E5FF]";

  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#050505] px-6 pb-10 pt-16 text-white sm:px-10 lg:px-16 lg:pt-24 overflow-hidden">
      {/* Top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(ellipse_at_top_center,rgba(0,229,255,0.02)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-[1536px]">
        {/* Main Grid: 10 columns for balanced 40/20/20/20 layout on desktop */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-10 lg:gap-8">
          
          {/* ── Brand Col (4 columns) ── */}
          <div className="lg:col-span-4 lg:pr-12">
            <Link
              to="/"
              className="inline-block rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF]"
            >
              <span className="text-2xl font-black tracking-[0.2em] text-white">
                NEXA<span className="text-[#00E5FF]">TECH</span>
              </span>
            </Link>
            <p className="mt-5 max-w-[460px] text-[13px] leading-[1.6] text-gray-400">
              Precision-engineered electronics, high-refresh displays, and
              AI-accelerated shopping designed for the next generation.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]" />
              </span>
              <span className="text-[11.5px] font-medium tracking-wide text-gray-500">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* ── Catalog Col (2 columns) ── */}
          <div className="lg:col-span-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
              Catalog
            </p>
            <ul className="mt-6 space-y-3.5 text-[13px] text-gray-400">
              <li>
                <Link to="/products?category=Laptops" className={linkClass}>
                  Laptops &amp; Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Gaming" className={linkClass}>
                  Gaming Rigs &amp; GPUs
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smartphones" className={linkClass}>
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Monitors" className={linkClass}>
                  OLED Displays
                </Link>
              </li>
              <li>
                <Link to="/products?category=Audio" className={linkClass}>
                  Studio Audio
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Platform Col (2 columns) ── */}
          <div className="lg:col-span-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
              Platform
            </p>
            <ul className="mt-6 space-y-3.5 text-[13px] text-gray-400">
              <li>
                <Link to="/products" className={linkClass}>
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-chat"
                  className="group flex items-center gap-2 transition-all duration-300 ease-out hover:translate-x-[3px] hover:text-[#00E5FF] focus:outline-none focus-visible:text-[#00E5FF]"
                >
                  <Sparkles size={12} className="text-[#00E5FF]" />
                  NexaTech AI Advisor
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className={linkClass}>
                  My Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className={linkClass}>
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Account Col (2 columns) ── */}
          <div className="lg:col-span-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
              Account
            </p>
            <ul className="mt-6 space-y-3.5 text-[13px] text-gray-400">
              <li>
                <Link to="/account" className={linkClass}>
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link to="/orders" className={linkClass}>
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/login" className={linkClass}>
                  Customer Login
                </Link>
              </li>
              <li>
                <Link to="/register" className={linkClass}>
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-white/[0.08] pt-8 text-[12px] text-gray-500 sm:flex-row">
          <p>© 2026 NEXATECH. All rights reserved. Technology Built Different.</p>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[#00E5FF]" />
            <span className="font-medium text-[#b4b9be]">
              Secure 256-Bit SSL Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;