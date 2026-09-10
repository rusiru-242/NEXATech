import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Cpu,
  Tv,
  Bot,
  ShieldCheck,
  Zap,
  Gauge,
  Flame,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ScrollVideo from "../components/ScrollVideo";
import ScrollProgress from "../components/ScrollProgress";
import Reveal from "../components/Reveal";
import ProductSequence from "../components/home/ProductSequence";
import AISectionWithHandshake from "../components/home/AISectionWithHandshake";
import GamingSectionWithPC from "../components/home/GamingSectionWithPC";
import PowerWithoutCompromise from "../components/home/PowerWithoutCompromise";
import FutureCTASection from "../components/home/FutureCTASection";
import WhyShopWithUs from "../components/home/WhyShopWithUs";
import Footer from "../components/Footer";
import NexaButton from "../components/ui/NexaButton";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function Home() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // =====================================================
  // LOAD PRODUCTS FROM MONGODB
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load products.");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Home products loading error:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // FEATURED PRODUCTS
  // =====================================================

  const featuredProducts = useMemo(() => {
    const availableProducts = products.filter(
      (product) => Number(product.stock || 0) > 0
    );

    const sortedProducts = [...availableProducts].sort((a, b) => {
      const ratingA = Number(a.rating || 0);
      const ratingB = Number(b.rating || 0);
      const reviewsA = Number(a.reviews || 0);
      const reviewsB = Number(b.reviews || 0);
      const discountA = Number(a.discount || 0);
      const discountB = Number(b.discount || 0);

      if (ratingB !== ratingA) return ratingB - ratingA;
      if (reviewsB !== reviewsA) return reviewsB - reviewsA;
      return discountB - discountA;
    });

    return sortedProducts.slice(0, 4);
  }, [products]);

  // Categories data with curated editorial visuals & metadata
  const categoriesList = [
    {
      name: "Laptops",
      subtitle: "Ultra-thin workstation & gaming powerhouses",
      count: "12+ models",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Gaming",
      subtitle: "RTX graphics, mechanical gear & extreme rigs",
      count: "18+ models",
      image:
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Smartphones",
      subtitle: "Flagship processors & cinematic cameras",
      count: "15+ models",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Monitors",
      subtitle: "High-refresh OLED & ultra-wide studio panels",
      count: "10+ models",
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Audio",
      subtitle: "Audiophile DACs, planar magnetic & ANC gear",
      count: "14+ models",
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Accessories",
      subtitle: "Thunderbolt hubs, GaN power & precision inputs",
      count: "25+ models",
      image:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black">
      {/* ================= SCROLL VIDEO BACKGROUND ================= */}
      <ScrollVideo />

      {/* ================= TOP SCROLL PROGRESS ================= */}
      <ScrollProgress />

      {/* ================= 1. NAVBAR ================= */}
      <Navbar />

      {/* Main Content Layer (above background video) */}
      <main className="relative z-10">
        {/* ================= 2. CINEMATIC HERO ================= */}
        <Hero />

        {/* ================= 3. SCROLL-LINKED IMAGE SEQUENCE ================= */}
        <ProductSequence />

        {/* ================= 4. METRICS TRANSITION ================= */}
        <section className="relative border-y border-white/10 bg-[#050505]/85 py-12 backdrop-blur-xl sm:py-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
            <Reveal>
              <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:gap-12 md:gap-16">
                <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500">
                  Global Engineering Standards
                </p>
                {/* Scrolling Brand Marquee */}
                <div
                  className="marquee-group relative w-full flex-1 min-w-0 overflow-hidden sm:w-auto"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                  }}
                >
                  <div className="animate-brand-marquee">
                    {[0, 1, 2, 3].map((groupIdx) => (
                      <div
                        key={groupIdx}
                        className="flex shrink-0 items-center"
                        aria-hidden={groupIdx > 0 ? "true" : undefined}
                      >
                        {["APPLE", "ASUS", "SONY", "NVIDIA", "SAMSUNG", "RAZER"].map(
                          (brand) => (
                            <span
                              key={`${brand}-${groupIdx}`}
                              className="mr-16 text-sm font-extrabold uppercase tracking-wider text-gray-400 transition duration-300 hover:text-[#00E5FF] sm:mr-20 sm:text-base md:text-lg"
                            >
                              {brand}
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
              <Reveal delay={0}>
                <div>
                  <p className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    10K+
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Curated Devices
                  </p>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div>
                  <p className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    50K+
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Verified Users
                  </p>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div>
                  <p className="text-4xl font-black tracking-tight text-[#00E5FF] sm:text-5xl lg:text-6xl">
                    &lt;0.4ms
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Bus Response Time
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div>
                  <p className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    4.9 / 5
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hardware Score
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= 4. FEATURED TECHNOLOGY / PRODUCT SHOWCASE ================= */}
        <PowerWithoutCompromise />

        {/* ================= 5. FEATURED CATEGORIES ================= */}
        <section
          id="categories"
          className="relative border-t border-white/10 bg-[#050505]/90 px-6 pt-24 pb-12 backdrop-blur-2xl sm:px-10 lg:px-16 lg:pt-32 lg:pb-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Reveal>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    Curated Sectors
                  </span>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                    FEATURED CATEGORIES.
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={100}>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:text-[#00E5FF]"
                >
                  <span>Explore All Hardware</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoriesList.map((cat, idx) => (
                <Reveal key={cat.name} delay={idx * 70}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="group relative flex h-72 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-500 hover:border-[#00E5FF]/50 hover:shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.12)]"
                  >
                    {/* Background image with cinematic dark gradient overlay */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover opacity-35 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-45"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
                    </div>

                    {/* Top row */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-gray-500">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-semibold text-gray-300 backdrop-blur-md">
                        {cat.count}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold tracking-tight text-white transition group-hover:text-[#00E5FF]">
                        {cat.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-gray-400">
                        {cat.subtitle}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00E5FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span>Browse Catalog</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 6. FEATURED PRODUCTS (REAL DATA) ================= */}
        <section
          id="products"
          className="relative px-6 pb-24 pt-12 sm:px-10 lg:px-16 lg:pb-32 lg:pt-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Reveal>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    Selected Hardware
                  </span>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                    FEATURED GEAR.
                  </h2>
                  <p className="mt-4 max-w-lg text-xs leading-relaxed text-gray-400 sm:text-sm">
                    Tested and rated by creators and competitive esports players.
                    Synced in real time with our live inventory.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={100}>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:text-[#00E5FF]"
                >
                  <span>View Full Collection</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Reveal>
            </div>

            {/* Product Grid */}
            <div className="mt-14">
              {productsLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-96 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]"
                    />
                  ))}
                </div>
              ) : featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.map((product, idx) => (
                    <Reveal key={product._id} delay={idx * 90}>
                      <ProductCard
                        id={product._id}
                        name={product.name}
                        category={product.category}
                        price={Number(product.price || 0)}
                        discount={Number(product.discount || 0)}
                        image={product.image || ""}
                        rating={Number(product.rating || 0)}
                        reviews={Number(product.reviews || 0)}
                        stock={Number(product.stock || 0)}
                        brand={product.brand || ""}
                      />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center backdrop-blur-md">
                  <p className="text-sm text-gray-400">
                    No active products found in the catalog.
                  </p>
                  <Link to="/products" className="focus:outline-none mt-4 inline-block">
                    <NexaButton
                      variant="primary"
                      size="sm"
                    >
                      Browse Products
                    </NexaButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= 7. GAMING / PERFORMANCE SECTION ================= */}
        <GamingSectionWithPC />

        {/* ================= 8. NEXATECH AI SHOPPING ASSISTANT ================= */}
        <AISectionWithHandshake />

        {/* ================= 9. WHY NEXATECH (CAPABILITY PANEL) ================= */}
        <WhyShopWithUs />

        {/* ================= 10. FINAL CINEMATIC CTA (Scroll Sequence Background) ================= */}
        <FutureCTASection />
      </main>

      {/* ================= 11. FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Home;