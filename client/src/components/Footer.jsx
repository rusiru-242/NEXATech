import { Link } from "react-router-dom";
import { Sparkles, Shield, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050505]/95 px-6 py-14 text-white backdrop-blur-xl sm:px-10 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-[0.2em] text-white">
                NEXA<span className="text-[#00E5FF]">TECH</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-gray-400 sm:text-sm">
              Precision-engineered electronics, high-refresh displays, and
              AI-accelerated shopping designed for the next generation.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-mono tracking-wider text-gray-400">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
              Catalog
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-gray-400">
              <li>
                <Link
                  to="/products?category=Laptops"
                  className="transition hover:text-white"
                >
                  Laptops &amp; Ultrabooks
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Gaming"
                  className="transition hover:text-white"
                >
                  Gaming Rigs &amp; GPUs
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Smartphones"
                  className="transition hover:text-white"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Monitors"
                  className="transition hover:text-white"
                >
                  OLED Displays
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Audio"
                  className="transition hover:text-white"
                >
                  Studio Audio
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/products" className="transition hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-chat"
                  className="flex items-center gap-1.5 transition hover:text-[#00E5FF]"
                >
                  <Sparkles size={12} className="text-[#00E5FF]" />
                  NexaTech AI Advisor
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-white">
                  My Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition hover:text-white">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Col */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
              Account
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/account" className="transition hover:text-white">
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-white">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-white">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-white">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 NEXATECH. All rights reserved. Technology Built Different.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-gray-400">
              <Shield size={13} className="text-[#00E5FF]" />
              Secure 256-Bit SSL Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;