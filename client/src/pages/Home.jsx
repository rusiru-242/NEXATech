import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] =
    useState(true);

  // =====================================================
  // LOAD PRODUCTS FROM MONGODB
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load products."
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error(
          "Home products loading error:",
          error
        );

        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // FEATURED PRODUCTS
  //
  // Priority:
  // 1. Available products
  // 2. Highest rating
  // 3. Highest reviews
  // 4. Discounted products
  // =====================================================

  const featuredProducts = useMemo(() => {
    const availableProducts = products.filter(
      (product) =>
        Number(product.stock || 0) > 0
    );

    const sortedProducts = [
      ...availableProducts,
    ].sort((a, b) => {
      const ratingA =
        Number(a.rating || 0);

      const ratingB =
        Number(b.rating || 0);

      const reviewsA =
        Number(a.reviews || 0);

      const reviewsB =
        Number(b.reviews || 0);

      const discountA =
        Number(a.discount || 0);

      const discountB =
        Number(b.discount || 0);

      // Rating has highest priority
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }

      // Then number of reviews
      if (reviewsB !== reviewsA) {
        return reviewsB - reviewsA;
      }

      // Then discount
      return discountB - discountA;
    });

    return sortedProducts.slice(0, 4);
  }, [products]);

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

              {[
                "APPLE",
                "ASUS",
                "SONY",
                "NVIDIA",
                "SAMSUNG",
                "RAZER",
                "LOGITECH",
              ].map((brand) => (
                <span
                  key={brand}
                  className="transition hover:text-white"
                >
                  {brand}
                </span>
              ))}

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

              <motion.div
                key={category}
                whileHover={{
                  x: 8,
                }}
              >

                <Link
                  to={`/products?category=${encodeURIComponent(
                    category
                  )}`}
                  className="group flex items-center justify-between py-6 transition sm:py-8"
                >

                  <div className="flex items-center gap-5 sm:gap-6">

                    <span className="text-xs text-gray-700">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <h3 className="text-xl font-semibold tracking-[-0.04em] text-gray-300 transition group-hover:text-white sm:text-3xl lg:text-4xl">
                      {category}
                    </h3>

                  </div>

                  <ArrowUpRight
                    size={22}
                    className="text-gray-700 transition group-hover:text-[#00E5FF]"
                  />

                </Link>

              </motion.div>

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

        {/* =====================================================
            FEATURED PRODUCTS
        ===================================================== */}

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

              <p className="mt-5 max-w-lg text-sm leading-6 text-gray-500">
                Discover some of our highest-rated
                technology, selected from the
                NexaTech collection.
              </p>

            </div>

            <Link
              to="/products"
              className="text-sm text-gray-500 transition hover:text-white"
            >
              View all products →
            </Link>

          </div>

          {/* =================================================
              FEATURED PRODUCT GRID
          ================================================= */}

          {productsLoading ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[420px] animate-pulse border border-white/10 bg-white/[0.02]"
                  />
                )
              )}

            </div>

          ) : featuredProducts.length > 0 ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {featuredProducts.map(
                (product) => (

                  <motion.div
                    key={product._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  >

                    <Link
                      to={`/products/${product._id}`}
                      className="block"
                    >

                      <ProductCard
                        id={product._id}
                        name={
                          product.name
                        }
                        category={
                          product.category
                        }
                        price={Number(
                          product.price || 0
                        )}
                        discount={Number(
                          product.discount || 0
                        )}
                        image={
                          product.image || ""
                        }
                        rating={Number(
                          product.rating || 0
                        )}
                        reviews={Number(
                          product.reviews || 0
                        )}
                        stock={Number(
                          product.stock || 0
                        )}
                        brand={
                          product.brand || ""
                        }
                      />

                    </Link>

                  </motion.div>

                )
              )}

            </div>

          ) : (

            <div className="border border-dashed border-white/10 py-20 text-center">

              <p className="text-sm text-gray-600">
                Featured products will appear here.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-block border border-white/10 px-5 py-2.5 text-xs text-gray-400 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
              >
                Browse Products
              </Link>

            </div>

          )}

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
                  Our upcoming AI experience will help
                  you discover technology that actually
                  fits your needs.
                </p>

                <Link
                  to="/ai-chat"
                  className="mt-7 inline-block border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                >
                  AI SHOPPING →
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* ================= WHY NEXATECH ================= */}

        <section
          id="about"
          className="mx-auto max-w-[1400px] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24 lg:py-28"
        >

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
                Why NexaTech
              </p>

              <h2 className="mt-3 text-5xl font-bold leading-[0.9] tracking-[-0.07em] sm:mt-4 sm:text-6xl lg:text-7xl">
                TECHNOLOGY

                <span className="block text-gray-600">
                  MADE SIMPLE.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-base leading-7 text-gray-500">
                Discover trusted technology, secure payments,
                fast delivery and intelligent AI-powered
                shopping — all in one place.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-3 border border-white/20 px-6 py-3.5 text-sm font-semibold transition hover:border-white hover:bg-white hover:text-black"
              >
                Explore Products
                <ArrowUpRight size={17} />
              </Link>

            </div>

            <div className="relative min-h-[380px] overflow-hidden border border-white/10 bg-[#0a0a0a] sm:min-h-[450px]">

              <div className="absolute inset-0">

                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/10 blur-[100px]" />

                <div className="absolute inset-10 border border-white/5" />

                <div className="absolute inset-20 border border-white/5" />

              </div>

              <div className="relative flex min-h-[380px] items-center justify-center sm:min-h-[450px]">

                <div className="grid grid-cols-2 gap-8 text-center">

                  <div>
                    <div className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                      50+
                    </div>

                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-600">
                      Products
                    </p>
                  </div>

                  <div>
                    <div className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                      8+
                    </div>

                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-600">
                      Categories
                    </p>
                  </div>

                  <div>
                    <div className="text-4xl font-black tracking-[-0.06em] text-[#00E5FF] sm:text-5xl">
                      24/7
                    </div>

                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-600">
                      AI Support
                    </p>
                  </div>

                  <div>
                    <div className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">
                      4.9
                    </div>

                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-600">
                      Rating
                    </p>
                  </div>

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