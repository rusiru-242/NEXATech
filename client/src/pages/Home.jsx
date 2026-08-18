import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      <main>

        {/* ================= HERO ================= */}

        <Hero />

        {/* ================= TRUST ================= */}

        <section className="border-y border-white/10">

          <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12 lg:py-14">

            <p className="mb-7 text-xs uppercase tracking-[0.25em] text-gray-600 sm:mb-9">
              Trusted Technology
            </p>

            <div className="grid grid-cols-2 gap-y-7 text-lg font-bold tracking-[-0.04em] text-gray-500 sm:grid-cols-4 sm:text-xl lg:grid-cols-7">

              <span className="transition hover:text-white">
                APPLE
              </span>

              <span className="transition hover:text-white">
                ASUS
              </span>

              <span className="transition hover:text-white">
                SONY
              </span>

              <span className="transition hover:text-white">
                NVIDIA
              </span>

              <span className="transition hover:text-white">
                SAMSUNG
              </span>

              <span className="transition hover:text-white">
                RAZER
              </span>

              <span className="transition hover:text-white">
                LOGITECH
              </span>

            </div>

          </div>

        </section>

        {/* ================= CATEGORIES ================= */}

        <section
          id="categories"
          className="mx-auto max-w-[1400px] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
        >

          <div className="mb-10 max-w-3xl sm:mb-12">

            <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
              Explore
            </p>

            <h2 className="mt-3 text-5xl font-bold leading-[0.92] tracking-[-0.06em] sm:mt-4 sm:text-6xl lg:text-7xl">
              SHOP THE

              <span className="block text-gray-600">
                FUTURE.
              </span>

            </h2>

          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">

            {[
              "Laptops",
              "Smartphones",
              "Gaming",
              "Audio",
              "Monitors",
              "Cameras",
              "Accessories",
            ].map((category, index) => (

              <motion.a
                href="/products"
                key={category}
                whileHover={{
                  x: 8,
                }}
                className="group flex items-center justify-between py-6 transition sm:py-8"
              >

                <div className="flex items-center gap-5 sm:gap-6">

                  <span className="text-xs text-gray-700">
                    0{index + 1}
                  </span>

                  <h3 className="text-xl font-semibold tracking-[-0.04em] text-gray-300 transition group-hover:text-white sm:text-3xl lg:text-4xl">
                    {category}
                  </h3>

                </div>

                <ArrowUpRight
                  size={22}
                  className="text-gray-700 transition group-hover:text-[#00E5FF]"
                />

              </motion.a>

            ))}

          </div>

        </section>

        {/* ================= METRICS ================= */}

        <section className="border-y border-white/10">

          <div className="mx-auto max-w-[1400px] px-5 py-18 sm:px-8 sm:py-20 lg:py-24">

            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              The NexaTech Standard
            </p>

            <div className="mt-12 grid gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-12">

              <div>

                <p className="text-5xl font-bold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  10K+
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Premium Products
                </p>

              </div>

              <div>

                <p className="text-5xl font-bold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  50K+
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Happy Customers
                </p>

              </div>

              <div>

                <p className="text-5xl font-bold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  4.9
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Average Rating
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= PRODUCTS ================= */}

        <section
          id="products"
          className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
        >

          <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
                Selected
              </p>

              <h2 className="mt-3 text-5xl font-bold leading-[0.92] tracking-[-0.06em] sm:mt-4 sm:text-6xl lg:text-7xl">
                FEATURED

                <span className="block text-gray-600">
                  PRODUCTS.
                </span>

              </h2>

            </div>

            <a
              href="/products"
              className="text-sm text-gray-500 transition hover:text-white"
            >
              View all products →
            </a>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <ProductCard
              name="Nexa Pro Laptop"
              category="Laptops"
              price="Rs. 289,000"
            />

            <ProductCard
              name="Ultra X Smartphone"
              category="Smartphones"
              price="Rs. 189,000"
            />

            <ProductCard
              name="Pulse Gaming Headset"
              category="Gaming"
              price="Rs. 49,000"
            />

            <ProductCard
              name="Vision 4K Monitor"
              category="Monitors"
              price="Rs. 159,000"
            />

          </div>

        </section>

        {/* ================= AI ================= */}

        <section
          id="ai"
          className="border-y border-white/10 scroll-mt-20"
        >

          <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">

            <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-16">

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
                  Intelligence
                </p>

                <h2 className="mt-3 text-5xl font-bold leading-[0.9] tracking-[-0.07em] sm:mt-4 sm:text-6xl lg:text-7xl">
                  SHOPPING,

                  <span className="block text-gray-600">
                    REIMAGINED.
                  </span>

                </h2>

              </div>

              <div>

                <p className="max-w-md text-base leading-7 text-gray-500">
                  Our upcoming AI experience will help you
                  discover technology that actually fits your
                  needs.
                </p>

                <button
                  type="button"
                  className="mt-7 border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                >
                  AI FEATURES — COMING SOON
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ================= SETUP ================= */}

        <section
          id="about"
          className="mx-auto max-w-[1400px] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
        >

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
                Your Space
              </p>

              <h2 className="mt-3 text-5xl font-bold leading-[0.9] tracking-[-0.07em] sm:mt-4 sm:text-6xl lg:text-7xl">
                BUILD YOUR

                <span className="block text-gray-600">
                  PERFECT SETUP.
                </span>

              </h2>

              <p className="mt-7 max-w-md text-base leading-7 text-gray-500">
                Combine powerful devices, gaming gear and
                accessories to create a setup built around
                the way you work and play.
              </p>

              <a
                href="/products"
                className="mt-7 inline-flex items-center gap-3 border border-white/20 px-6 py-3.5 text-sm font-semibold transition hover:border-white hover:bg-white hover:text-black"
              >
                Start Building
                <ArrowUpRight size={17} />
              </a>

            </div>

            <div className="relative min-h-[380px] overflow-hidden border border-white/10 bg-[#0a0a0a] sm:min-h-[450px]">

              <div className="absolute inset-0">

                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/10 blur-[100px]" />

                <div className="absolute inset-10 border border-white/5" />

                <div className="absolute inset-20 border border-white/5" />

              </div>

              <div className="relative flex min-h-[380px] items-center justify-center sm:min-h-[450px]">

                <div className="text-center">

                  <div className="text-6xl font-black tracking-[-0.08em] text-white sm:text-7xl">
                    NEXA
                  </div>

                  <p className="mt-3 text-xs uppercase tracking-[0.35em] text-gray-600">
                    Interactive 3D Setup
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10">

        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-lg font-bold tracking-tight">
                NEXATECH
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Technology for what's next.
              </p>

            </div>

            <p className="text-xs text-gray-700">
              © 2026 NEXATECH. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;