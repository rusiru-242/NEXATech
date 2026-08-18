import {
  CheckCircle,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:py-12">

        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#00E5FF]">
            About NexaTech
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Technology made
            <span className="text-[#00E5FF]"> simple.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
            NexaTech is a modern technology marketplace designed to make
            discovering, comparing, and purchasing electronics simple,
            reliable, and convenient.
          </p>

        </section>

        {/* Mission */}
        <section className="mt-14 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <Sparkles size={24} />
            </div>

            <h2 className="text-2xl font-bold">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              Our mission is to create a smarter and easier way for customers
              to find the technology products they need. From laptops and
              smartphones to accessories and smart devices, NexaTech brings
              everything together in one convenient platform.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="text-2xl font-bold">
              Why NexaTech?
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              We focus on providing a clean shopping experience, useful
              product information, secure account features, and intelligent
              assistance so customers can make better purchasing decisions.
            </p>

          </div>

        </section>

        {/* Features */}
        <section className="mt-14">

          <div className="mb-8 text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00E5FF]">
              What We Offer
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Built for modern shoppers
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* Easy Shopping */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <ShoppingBag
                className="text-[#00E5FF]"
                size={26}
              />

              <h3 className="mt-5 text-xl font-semibold">
                Easy Shopping
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                Browse products, explore categories, and find the right
                technology products with ease.
              </p>

            </div>

            {/* Trusted Experience */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <CheckCircle
                className="text-[#00E5FF]"
                size={26}
              />

              <h3 className="mt-5 text-xl font-semibold">
                Trusted Experience
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                Product details, reviews, wishlist features, orders, and
                customer accounts are available in one platform.
              </p>

            </div>

            {/* AI Assistance */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">

              <Sparkles
                className="text-[#00E5FF]"
                size={26}
              />

              <h3 className="mt-5 text-xl font-semibold">
                AI Assistance
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                Get intelligent assistance through the NexaTech AI chatbot
                to help with technology-related product questions.
              </p>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="mt-14 rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-8 text-center sm:p-10">

          <h2 className="text-3xl font-bold">
            Ready to explore NexaTech?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Discover our latest technology products and find the right device
            for your needs.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-6 py-3 font-semibold text-black transition hover:bg-[#00cce6]"
          >
            <ShoppingBag size={18} />
            Explore Products
          </Link>

        </section>

      </main>

    </div>
  );
}

export default About;