import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "Laptops",
  "Smartphones",
  "Gaming",
  "Audio",
  "Monitors",
  "Cameras",
  "Accessories",
  "Smart Devices",
];

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const [mobileFilter, setMobileFilter] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD PRODUCTS FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

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

        setProducts(
          data.products || []
        );
      } catch (err) {
        console.error(
          "Products loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) => {
        const productName =
          product.name || "";

        const productCategory =
          product.category || "";

        const matchesSearch =
          productName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "All" ||
          productCategory === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

    if (sort === "low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
            Loading Products...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 pt-32">
          <div className="border border-red-500/20 bg-red-500/5 p-8">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <p className="mt-3 text-xs text-gray-600">
              Make sure your backend is running on
              http://localhost:5000
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="pt-24">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20">

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="max-w-3xl"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00e5ff]">
                NexaTech Store
              </p>

              <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Explore
                <span className="block text-gray-600">
                  the future.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                Discover premium electronics,
                gaming hardware, smart devices
                and technology built for what's next.
              </p>
            </motion.div>

          </div>
        </section>

        {/* =================================================
            CONTROLS
        ================================================= */}

        <section className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6">

            <div className="flex min-h-[72px] items-center gap-4">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="h-11 w-full border border-white/10 bg-white/[0.03] pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              {/* Sort */}

              <div className="relative hidden sm:block">

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(
                      e.target.value
                    )
                  }
                  className="h-11 appearance-none border border-white/10 bg-white/[0.03] px-4 pr-10 text-xs text-gray-400 outline-none transition hover:border-white/20 focus:border-[#00e5ff]/40"
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="low">
                    Price: Low to High
                  </option>

                  <option value="high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                />

              </div>

              {/* Mobile Filter */}

              <button
                type="button"
                onClick={() =>
                  setMobileFilter(
                    !mobileFilter
                  )
                }
                className="flex h-11 items-center gap-2 border border-white/10 px-4 text-xs text-gray-400 transition hover:border-[#00e5ff]/40 hover:text-white lg:hidden"
              >
                <SlidersHorizontal
                  size={15}
                />

                Filter
              </button>

            </div>

          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

            {/* Sidebar */}

            <aside
              className={`${
                mobileFilter
                  ? "block"
                  : "hidden"
              } lg:block`}
            >
              <div className="sticky top-28">

                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                  Categories
                </p>

                <div className="mt-5 space-y-1">

                  {categories.map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setCategory(
                            item
                          );

                          setMobileFilter(
                            false
                          );
                        }}
                        className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm transition ${
                          category === item
                            ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                            : "text-gray-500 hover:bg-white/[0.03] hover:text-white"
                        }`}
                      >
                        <span>
                          {item}
                        </span>

                        {category ===
                          item && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />
                        )}
                      </button>
                    )
                  )}

                </div>

              </div>
            </aside>

            {/* Products */}

            <div>

              {/* Result Header */}

              <div className="mb-7 flex items-center justify-between">

                <div>

                  <p className="text-xs text-gray-600">
                    {
                      filteredProducts.length
                    }{" "}
                    products
                  </p>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    {category ===
                    "All"
                      ? "All Products"
                      : category}
                  </h2>

                </div>

                {search && (
                  <p className="hidden text-xs text-gray-600 sm:block">
                    Results for "
                    {search}"
                  </p>
                )}

              </div>

              {/* Grid */}

              {filteredProducts.length >
              0 ? (
                <motion.div
                  layout
                  className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredProducts.map(
                    (product) => (
                      <motion.div
                        key={
                          product._id
                        }
                        layout
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                      >

                        {/* IMPORTANT:
                            MongoDB _id is used here
                        */}

                        <Link
                          to={`/products/${product._id}`}
                          className="block"
                        >
                          <ProductCard
  id={product._id}
  name={product.name}
  category={product.category}
  price={`Rs. ${Number(
    product.price || 0
  ).toLocaleString()}`}
  discount={product.discount}
  rating={product.rating || 0}
  reviews={product.reviews || 0}
/>
                        </Link>

                      </motion.div>
                    )
                  )}
                </motion.div>
              ) : (
                /* Empty State */

                <div className="flex min-h-[400px] flex-col items-center justify-center border border-dashed border-white/10">

                  <div className="mb-5 flex h-14 w-14 items-center justify-center border border-white/10 text-gray-600">
                    <Search size={20} />
                  </div>

                  <h3 className="text-lg font-semibold">
                    No products found
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    Try another search or
                    category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory(
                        "All"
                      );
                    }}
                    className="mt-6 border border-white/10 px-5 py-2.5 text-xs font-semibold text-gray-400 transition hover:border-[#00e5ff]/40 hover:text-[#00e5ff]"
                  >
                    Clear Filters
                  </button>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-24">

            <div className="relative overflow-hidden border border-white/10 bg-[#080808] px-8 py-16 sm:px-12">

              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#00e5ff]/[0.05] blur-[100px]" />

              <p className="relative text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
                Need help choosing?
              </p>

              <h2 className="relative mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Find the technology
                <span className="text-gray-600">
                  {" "}that fits you.
                </span>
              </h2>

              <p className="relative mt-5 max-w-xl text-sm leading-7 text-gray-500">
                Our intelligent shopping
                experience will help you discover
                products based on your needs and
                preferences.
              </p>

              <button
                type="button"
                className="relative mt-8 border border-[#00e5ff]/30 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#00e5ff] transition hover:bg-[#00e5ff] hover:text-black"
              >
                AI Shopping — Coming Soon
              </button>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Products;