import {
  CheckCircle,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  ArrowUpRight,
  Cpu,
  Layers,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
              About NexaTech
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl md:text-7xl">
              Technology Made
              <span className="block text-[#00E5FF]"> Simple.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base sm:leading-8">
              NexaTech is a precision-engineered electronics marketplace designed
              to make discovering, comparing, and purchasing technology reliable,
              transparent, and convenient.
            </p>
          </Reveal>
        </section>

        {/* Mission & Vision */}
        <section className="mt-20 grid gap-8 md:grid-cols-2">
          <Reveal delay={0}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl transition duration-300 hover:border-[#00E5FF]/40 hover:bg-white/[0.05]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]">
                <Sparkles size={22} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                Our Mission
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                Our mission is to create an intuitive and frictionless bridge
                between world-class hardware manufacturers and modern shoppers.
                From ultra-portable laptops and OLED displays to studio audio and
                smart accessories, NexaTech curates verified, high-performance
                solutions for everyday work and play.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl transition duration-300 hover:border-[#00E5FF]/40 hover:bg-white/[0.05]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]">
                <ShieldCheck size={22} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                The NexaTech Standard
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                We believe shopping for hardware should never involve guesswork.
                We pair authentic manufacturer warranties with verified customer
                reviews, encrypted Stripe checkouts, and integrated AI assistance
                so you make informed, confident choices.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Core Pillars */}
        <section className="mt-24">
          <Reveal>
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                Capabilities
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Built for Modern Tech Enthusiasts
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            <Reveal delay={0}>
              <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl transition duration-300 hover:border-[#00E5FF]/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#00E5FF]">
                  <ShoppingBag size={20} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Curated Catalog
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-400 sm:text-sm">
                  Hand-picked devices from Apple, Asus, Sony, Nvidia, and Razer,
                  ensuring authentic specifications and zero grey-market products.
                </p>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl transition duration-300 hover:border-[#00E5FF]/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#00E5FF]">
                  <CheckCircle size={20} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  Transparent Security
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-400 sm:text-sm">
                  Complete order tracking, transparent returns, SSL checkout, and
                  customer account management centralized in a responsive dashboard.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl transition duration-300 hover:border-[#00E5FF]/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#00E5FF]">
                  <Sparkles size={20} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  AI Consultation
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-400 sm:text-sm">
                  Integrated real-time AI assistant answering hardware
                  compatibility queries and recommending hardware based on budget.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-white/[0.03] via-white/[0.05] to-white/[0.02] p-10 text-center backdrop-blur-2xl sm:p-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#00E5FF]/15 blur-[60px]"
              />

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Ready to Experience NexaTech?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                Discover our curated hardware collection or consult NexaTech AI to
                match the right configuration for your needs.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-[#00E5FF] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#2bf0ff] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                >
                  <ShoppingBag size={16} />
                  <span>Browse Products</span>
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>

                <Link
                  to="/ai-chat"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                >
                  <Sparkles size={15} className="text-[#00E5FF]" />
                  <span>Ask AI Advisor</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;