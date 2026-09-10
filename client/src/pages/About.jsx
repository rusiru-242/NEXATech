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
import NexaButton from "../components/ui/NexaButton";

function About() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00E5FF] selection:text-black">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-60"
          src="/videos/cyan_lines.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-[#050505]" />
      </div>

      {/* Navbar Layering */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Page Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 sm:px-10 sm:pt-8 sm:pb-24">
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
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/5 bg-transparent p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition duration-300 hover:border-[#00E5FF]/30 hover:bg-white/[0.02]">
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
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/5 bg-transparent p-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition duration-300 hover:border-[#00E5FF]/30 hover:bg-white/[0.02]">
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
              <div className="group relative h-full rounded-2xl border border-white/5 bg-transparent p-8 backdrop-blur-md transition duration-300 hover:border-[#00E5FF]/30 hover:bg-white/[0.02]">
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
              <div className="group relative h-full rounded-2xl border border-white/5 bg-transparent p-8 backdrop-blur-md transition duration-300 hover:border-[#00E5FF]/30 hover:bg-white/[0.02]">
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
              <div className="group relative h-full rounded-2xl border border-white/5 bg-transparent p-8 backdrop-blur-md transition duration-300 hover:border-[#00E5FF]/30 hover:bg-white/[0.02]">
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

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                {/* Primary CTA — NexaButton */}
                <Link to="/products" className="focus:outline-none">
                  <NexaButton
                    variant="primary"
                    size="lg"
                    icon={<ShoppingBag size={18} />}
                  >
                    Shop Products
                  </NexaButton>
                </Link>

                {/* Secondary CTA — NexaButton AI */}
                <Link to="/ai-chat" className="focus:outline-none">
                  <NexaButton
                    variant="ai"
                    size="lg"
                    icon={<Sparkles size={17} />}
                  >
                    <span>Ask <span className="text-[#00E5FF]">NexaTech</span> AI</span>
                  </NexaButton>
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