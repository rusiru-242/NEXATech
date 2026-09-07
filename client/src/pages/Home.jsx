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
import Footer from "../components/Footer";
import { LiquidButton, MetalButton } from "../components/ui/LiquidButton";

function Home() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // =====================================================
  // LOAD PRODUCTS FROM MONGODB
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
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
              <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500">
                  Global Engineering Standards
                </p>
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-400 sm:gap-10">
                  {["APPLE", "ASUS", "SONY", "NVIDIA", "SAMSUNG", "RAZER"].map(
                    (brand) => (
                      <span
                        key={brand}
                        className="transition duration-300 hover:text-[#00E5FF]"
                      >
                        {brand}
                      </span>
                    )
                  )}
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
        <section className="relative px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Editorial Showcase Header */}
            <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal>
                  <span className="inline-block rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    Ultimate Performance
                  </span>
                  <h2 className="mt-4 text-4xl font-black leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                    Power Without
                    <span className="block text-gray-500">Compromise.</span>
                  </h2>
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={150}>
                  <p className="text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-7">
                    Engineered from the silicon up for uncompromising speed and
                    endurance. Every platform in our inventory is benchmarked to
                    sustain maximum wattage without throttling.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* 3-Column Specs Panel */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
              <Reveal delay={0}>
                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:border-[#00E5FF]/40 hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>SPEC // 01</span>
                    <Cpu size={16} className="text-[#00E5FF]" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                    High Performance
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    Multi-threaded compute architectures and high-bandwidth memory
                    engineered for extreme gaming, CAD, and real-time AI workloads.
                  </p>
                  <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
                    Direct Boost Enabled
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:border-[#00E5FF]/40 hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>SPEC // 02</span>
                    <Tv size={16} className="text-[#00E5FF]" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                    Premium Displays
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    Ultra-dense OLED and high refresh-rate IPS experiences
                    delivering 99.8% DCI-P3 color precision with true 10-bit color.
                  </p>
                  <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
                    Sub-1ms Response
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition duration-300 hover:border-[#00E5FF]/40 hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>SPEC // 03</span>
                    <Bot size={16} className="text-[#00E5FF]" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white">
                    Smart Selection
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">
                    AI-powered tech assistant comparing specifications, bottleneck
                    tolerances, and value ratios for your individual budget.
                  </p>
                  <div className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
                    Zero Guesswork
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= 5. FEATURED CATEGORIES ================= */}
        <section
          id="categories"
          className="relative border-t border-white/10 bg-[#050505]/90 px-6 py-24 backdrop-blur-2xl sm:px-10 lg:px-16 lg:py-32"
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
          className="relative px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
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
                  <Link
                    to="/products"
                    className="mt-4 inline-block rounded-xl border border-white/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= 7. GAMING / PERFORMANCE SECTION ================= */}
        <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#050505] via-[#090b10] to-[#050505] px-6 py-28 sm:px-10 lg:px-16 lg:py-36">
          {/* Oversized background typography */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none text-[18vw] font-black uppercase leading-none tracking-tighter text-white/[0.02]"
          >
            OVERCLOCK
          </div>

          {/* Ambient cyan glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/[0.06] blur-[140px]"
          />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column */}
              <div className="lg:col-span-7">
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
                    <Flame size={12} />
                    Extreme Gaming &amp; Workstations
                  </span>

                  <h2 className="mt-5 text-4xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                    BUILT FOR
                    <span className="block text-[#00E5FF]">PURE SPEED.</span>
                  </h2>

                  <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-8">
                    Push your boundaries with hardware precision-tuned for zero
                    stutter. Liquid-cooled rigs, ultra-low latency memory, and
                    maximum-TGP graphics cards delivering uncompromised framerates.
                  </p>
                </Reveal>

                {/* Performance telemetry row */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                  <Reveal delay={100}>
                    <div>
                      <span className="text-2xl font-black text-white sm:text-4xl">
                        240Hz+
                      </span>
                      <p className="mt-1 text-[11px] font-mono uppercase text-gray-500">
                        Peak Refresh
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={180}>
                    <div>
                      <span className="text-2xl font-black text-[#00E5FF] sm:text-4xl">
                        0.03ms
                      </span>
                      <p className="mt-1 text-[11px] font-mono uppercase text-gray-500">
                        Pixel Response
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={260}>
                    <div>
                      <span className="text-2xl font-black text-white sm:text-4xl">
                        4K UHD
                      </span>
                      <p className="mt-1 text-[11px] font-mono uppercase text-gray-500">
                        Native Clarity
                      </p>
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={300}>
                  <div className="mt-8">
                    <Link to="/products?category=Gaming" className="focus:outline-none">
                      <LiquidButton
                        variant="cyan"
                        size="lg"
                        className="group gap-3 px-8 text-xs font-bold uppercase tracking-wider text-[#00E5FF]"
                      >
                        <span>Explore Gaming Rigs</span>
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </LiquidButton>
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Visual Card */}
              <div className="lg:col-span-5">
                <Reveal delay={150}>
                  <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.02] p-8 backdrop-blur-2xl shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
                      alt="NexaTech Gaming Performance"
                      className="h-80 w-full rounded-2xl object-cover"
                    />
                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">
                          Apex Titan RTX Matrix
                        </p>
                        <p className="text-xs text-gray-400">
                          Direct Airflow Dual Chamber
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400">
                        Verified Ready
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 8. NEXATECH AI SHOPPING ASSISTANT ================= */}
        <section
          id="ai"
          className="relative border-b border-white/10 bg-[#050505]/95 px-6 py-28 backdrop-blur-2xl sm:px-10 lg:px-16 lg:py-36"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column */}
              <div className="lg:col-span-6">
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    <Sparkles size={12} />
                    NexaTech AI Intelligence
                  </span>

                  <h2 className="mt-5 text-4xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl">
                    Your Personal
                    <span className="block text-gray-500">Tech Advisor.</span>
                  </h2>

                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-8">
                    Ask about hardware compatibility, compare products side by
                    side, or get tailored recommendations calibrated to your
                    budget and exact use case.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link to="/ai-chat" className="focus:outline-none">
                      <LiquidButton
                        variant="cyan"
                        size="lg"
                        className="group gap-2.5 px-7 text-xs font-bold uppercase tracking-wider text-[#00E5FF]"
                      >
                        <Sparkles size={15} />
                        <span>Start Chat with AI</span>
                      </LiquidButton>
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Interactive Prompt Previews */}
              <div className="lg:col-span-6">
                <Reveal delay={150}>
                  <div className="space-y-4 rounded-3xl border border-white/15 bg-white/[0.03] p-7 backdrop-blur-2xl sm:p-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                        <Bot size={16} className="text-[#00E5FF]" />
                        Suggested Inquiries
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">
                        REAL-TIME CHAT
                      </span>
                    </div>

                    {[
                      "Recommend the best laptop under Rs. 250,000 for programming",
                      "Compare RTX 4070 Ti vs RTX 4080 for 4K video editing",
                      "Which noise-canceling headphones offer the longest battery life?",
                    ].map((promptText, idx) => (
                      <Link
                        key={idx}
                        to="/ai-chat"
                        className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-gray-300 transition hover:border-[#00E5FF]/40 hover:bg-white/[0.06] hover:text-white"
                      >
                        <span className="max-w-[85%]">{promptText}</span>
                        <ArrowUpRight
                          size={15}
                          className="text-gray-500 transition group-hover:text-[#00E5FF]"
                        />
                      </Link>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 9. WHY NEXATECH (CAPABILITY PANEL) ================= */}
        <section
          id="about"
          className="relative px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                  The NexaTech Standard
                </span>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                  WHY SHOP WITH US.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-gray-400 sm:text-sm">
                  We bridge state-of-the-art electronics with effortless ordering,
                  authentic warranties, and dedicated guidance.
                </p>
              </div>
            </Reveal>

            {/* Capability Rows */}
            <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
              {[
                {
                  id: "01",
                  title: "AI-Powered Shopping",
                  desc: "Ask natural language questions and get instantaneous hardware recommendations customized to your budget.",
                  icon: Sparkles,
                },
                {
                  id: "02",
                  title: "Curated Technology",
                  desc: "Explore authentic electronics from verified manufacturers, complete with full manufacturer warranty backing.",
                  icon: Award,
                },
                {
                  id: "03",
                  title: "Built for Performance",
                  desc: "Rigorous thermal and benchmark verification ensuring your laptops, GPUs, and peripherals perform at peak.",
                  icon: Gauge,
                },
                {
                  id: "04",
                  title: "Secure Shopping & Delivery",
                  desc: "End-to-end encrypted card processing via Stripe, flexible Cash on Delivery, and live order tracking.",
                  icon: ShieldCheck,
                },
              ].map((cap, idx) => (
                <Reveal key={cap.id} delay={idx * 80}>
                  <div className="group grid grid-cols-1 items-center gap-4 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                    <div className="flex items-center gap-4 sm:col-span-4">
                      <span className="font-mono text-sm font-bold text-gray-600 group-hover:text-[#00E5FF]">
                        //{cap.id}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-white transition group-hover:text-[#00E5FF] sm:text-2xl">
                        {cap.title}
                      </h3>
                    </div>

                    <p className="text-xs leading-relaxed text-gray-400 sm:col-span-7 sm:text-sm sm:leading-7">
                      {cap.desc}
                    </p>

                    <div className="flex justify-end sm:col-span-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-gray-400 transition group-hover:border-[#00E5FF]/40 group-hover:text-[#00E5FF]">
                        <cap.icon size={16} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 10. FINAL CINEMATIC CTA ================= */}
        <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#050505] to-[#070b10] px-6 py-28 text-center sm:px-10 lg:px-16 lg:py-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/[0.07] blur-[150px]"
          />

          <div className="relative z-10 mx-auto max-w-4xl">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
                What's Next
              </span>
              <h2 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
                STEP INTO
                <span className="block text-gray-500">THE FUTURE.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
                Discover the latest premium devices or let NexaTech AI find the
                exact machine built for your workflow.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                {/* Primary glass CTA */}
                <Link to="/products" className="focus:outline-none">
                  <LiquidButton
                    variant="cyan"
                    size="xl"
                    className="group gap-3 px-10 text-xs font-bold uppercase tracking-wider text-[#00E5FF]"
                  >
                    <span>Explore Collection</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </LiquidButton>
                </Link>

                {/* Secondary metal CTA */}
                <Link to="/ai-chat" className="focus:outline-none">
                  <MetalButton variant="dark" className="gap-2 px-7 text-xs uppercase tracking-wider">
                    <Sparkles size={15} className="text-[#00E5FF]" />
                    <span className="text-[#00E5FF]">Consult AI</span>
                  </MetalButton>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ================= 11. FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Home;