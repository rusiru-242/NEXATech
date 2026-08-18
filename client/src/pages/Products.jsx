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

  const [mobileFilter, setMobileFilter] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
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
            data.message || "Failed to load products."
          );
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Products loading error:", err);

        setError(
          err.message || "Unable to load products."
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
    let result = products.filter((product) => {
      const productName = product.name || "";
      const productCategory = product.category || "";

      const matchesSearch = productName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        productCategory === category;

      return matchesSearch && matchesCategory;
    });

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
  }, [products, search, category, sort]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
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

        <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
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

      <main>

        {/* =================================================
            COMPACT PAGE HEADER
        ================================================= */}

        <section className="border-b border-white/10">

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              {/* TITLE */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
              >

                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#00e5ff]">
                  NexaTech Store
                </p>

                <h1 className="mt-2 text-4xl font-black leading-none tracking-[-0.05em] sm:text-5xl">
                  Explore

                  <span className="ml-2 text-gray-600">
                    the future.
                  </span>
                </h1>

                <p className="mt-3 max-w-lg text-xs leading-6 text-gray-500 sm:text-sm">
                  Premium electronics, gaming hardware,
                  smart devices and technology built for
                  what's next.
                </p>

              </motion.div>

              {/* SEARCH + SORT */}

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:min-w-[440px]">

                {/* Search */}

                <div className="relative flex-1">

                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search products..."
                    className="h-10 w-full border border-white/10 bg-white/[0.03] pl-10 pr-9 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}

                </div>

                {/* Sort */}

                <div className="relative sm:w-[170px]">

                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
                    className="h-10 w-full appearance-none border border-white/10 bg-white/[0.03] px-3 pr-9 text-xs text-gray-400 outline-none transition hover:border-white/20 focus:border-[#00e5ff]/40"
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
                    size={13}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CATEGORY + PRODUCT AREA
        ================================================= */}

        <section className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9">

          <div className="grid gap-7 lg:grid-cols-[240px_1fr] lg:gap-10">

            {/* =================================================
                CATEGORY SIDEBAR
            ================================================= */}

            <aside
              className={`${
                mobileFilter
                  ? "block"
                  : "hidden"
              } lg:block`}
            >

              <div className="lg:sticky lg:top-24">

                <div className="flex items-center justify-between">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                    Categories
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileFilter(false)
                    }
                    className="text-gray-600 hover:text-white lg:hidden"
                  >
                    <X size={15} />
                  </button>

                </div>

                {/* CATEGORY LIST */}

                <div className="mt-3 space-y-1">

                  {categories.map((item) => (

                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setMobileFilter(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                        category === item
                          ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                          : "text-gray-500 hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >

                      <span>
                        {item}
                      </span>

                      {category === item && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />
                      )}

                    </button>

                  ))}

                </div>

              </div>

            </aside>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div>

              {/* MOBILE FILTER */}

              <div className="mb-5 flex items-center justify-between lg:hidden">

                <p className="text-xs text-gray-600">
                  {filteredProducts.length} products
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilter(!mobileFilter)
                  }
                  className="flex h-9 items-center gap-2 border border-white/10 px-3 text-[10px] uppercase tracking-wider text-gray-400 transition hover:border-[#00e5ff]/40 hover:text-white"
                >

                  <SlidersHorizontal size={14} />

                  Filter

                </button>

              </div>

              {/* RESULT HEADER */}

              <div className="mb-5 flex items-end justify-between">

                <div>

                  <p className="text-[10px] text-gray-600">
                    {filteredProducts.length} products
                  </p>

                  <h2 className="mt-0.5 text-lg font-semibold tracking-tight">
                    {category === "All"
                      ? "All Products"
                      : category}
                  </h2>

                </div>

                {search && (
                  <p className="hidden text-[10px] text-gray-600 sm:block">
                    Results for "{search}"
                  </p>
                )}

              </div>

              {/* PRODUCT GRID */}

              {filteredProducts.length > 0 ? (

                <motion.div
                  layout
                  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >

                  {filteredProducts.map((product) => (

                    <motion.div
                      key={product._id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                    >

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

                  ))}

                </motion.div>

              ) : (

                <div className="flex min-h-[350px] flex-col items-center justify-center border border-dashed border-white/10">

                  <div className="mb-4 flex h-12 w-12 items-center justify-center border border-white/10 text-gray-600">
                    <Search size={18} />
                  </div>

                  <h3 className="text-base font-semibold">
                    No products found
                  </h3>

                  <p className="mt-2 text-xs text-gray-600">
                    Try another search or category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                    className="mt-5 border border-white/10 px-4 py-2 text-[10px] font-semibold text-gray-400 transition hover:border-[#00e5ff]/40 hover:text-[#00e5ff]"
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

          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:py-20">

            <div className="relative overflow-hidden border border-white/10 bg-[#080808] px-6 py-10 sm:px-10 sm:py-12">

              <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[#00e5ff]/[0.05] blur-[100px]" />

              <p className="relative text-[9px] font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
                Need help choosing?
              </p>

              <h2 className="relative mt-3 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                Find the technology

                <span className="text-gray-600">
                  {" "}that fits you.
                </span>
              </h2>

              <p className="relative mt-3 max-w-xl text-xs leading-6 text-gray-500 sm:text-sm">
                Our intelligent shopping experience
                will help you discover products based
                on your needs and preferences.
              </p>

              <button
                type="button"
                className="relative mt-6 border border-[#00e5ff]/30 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#00e5ff] transition hover:bg-[#00e5ff] hover:text-black"
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