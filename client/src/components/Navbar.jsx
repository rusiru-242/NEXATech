import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full">

        <div className="mx-auto max-w-[1400px] px-5 py-5 sm:px-8">

          <nav className="flex items-center justify-between">

            {/* Logo */}

            <a
              href="/"
              className="group flex items-center gap-3"
            >

              <span className="flex h-8 w-8 items-center justify-center bg-white text-black transition group-hover:bg-[#00E5FF]">
                <span className="text-sm font-black">
                  N
                </span>
              </span>

              <span className="text-lg font-bold tracking-[-0.04em] text-white">
                nexatech
              </span>

            </a>

            {/* Desktop Navigation */}

            <div className="hidden items-center gap-8 md:flex">

              <a
                href="/products"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Products
              </a>

              <a
                href="#categories"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Categories
              </a>

              <a
                href="#ai"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                AI
              </a>

              <a
                href="#about"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                About
              </a>

            </div>

            {/* Right */}

            <div className="flex items-center gap-3">

              <a
                href="/cart"
                className="group flex items-center gap-2 border border-white/10 px-4 py-2.5 text-sm text-white transition hover:border-white/30"
              >

                <ShoppingBag
                  size={16}
                  className="transition group-hover:scale-110"
                />

                <span className="hidden sm:block">
                  Cart
                </span>

              </a>

              <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-10 items-center justify-center border border-white/10 md:hidden"
              >
                {open ? (
                  <X size={18} />
                ) : (
                  <Menu size={18} />
                )}
              </button>

            </div>

          </nav>

        </div>

      </header>

      {/* Mobile Menu */}

      <AnimatePresence>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[80px] z-40 border-y border-white/10 bg-[#050505] p-6 md:hidden"
          >

            <div className="flex flex-col gap-6">

              <a
                href="/products"
                onClick={() => setOpen(false)}
                className="text-lg text-white"
              >
                Products
              </a>

              <a
                href="#categories"
                onClick={() => setOpen(false)}
                className="text-lg text-white"
              >
                Categories
              </a>

              <a
                href="#ai"
                onClick={() => setOpen(false)}
                className="text-lg text-white"
              >
                AI
              </a>

              <a
                href="#about"
                onClick={() => setOpen(false)}
                className="text-lg text-white"
              >
                About
              </a>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}

export default Navbar;