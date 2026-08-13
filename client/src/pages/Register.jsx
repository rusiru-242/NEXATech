import {
  ArrowRight,
  ArrowLeft,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= AUTH NAVBAR ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

           {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="text-xl font-black tracking-[-0.06em]"
          >
            <span className="text-white">NEXA</span>
            <span className="text-[#00E5FF]">TECH</span>
          </Link>

          {/* Back to Store */}
          <Link
            to="/products"
            className="group flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Store
          </Link>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-28">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e5ff]/[0.05] blur-[140px]" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* ================= REGISTER CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >

          {/* Top Label */}
          <div className="mb-8 text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00e5ff]">
              NEXATECH ACCOUNT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Create
              <span className="text-gray-600"> account.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Create your NexaTech account to manage orders,
              wishlist and your personalized shopping experience.
            </p>

          </div>

          {/* Card */}
          <div className="border border-white/10 bg-[#090909] p-6 shadow-2xl sm:p-8">

            <form className="space-y-5">

              {/* Full Name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02]"
                  />

                </div>

              </div>

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02]"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00e5ff]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00e5ff]"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">

                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 accent-[#00e5ff]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-gray-600"
                >
                  I agree to the{" "}
                  <span className="text-gray-400">
                    Terms & Conditions
                  </span>{" "}
                  and Privacy Policy.
                </label>

              </div>

              {/* Create Account */}
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-3 bg-[#00e5ff] text-sm font-bold text-black transition hover:bg-white"
              >
                Create Account

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-700">
                Or
              </span>

              <div className="h-px flex-1 bg-white/10" />

            </div>

            {/* Google */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 border border-white/10 bg-white/[0.02] text-xs font-semibold text-gray-400 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">
                G
              </span>

              Continue with Google
            </button>

          </div>

          {/* ================= LOGIN ================= */}
          <div className="mt-7 text-center">

            <p className="text-xs text-gray-600">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-3 inline-flex h-10 items-center justify-center border border-white/10 px-6 text-xs font-semibold text-gray-400 transition hover:border-[#00e5ff] hover:bg-[#00e5ff] hover:text-black"
            >
              Sign In
              <ArrowRight size={14} className="ml-2" />
            </Link>

          </div>

          {/* Security */}
          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-gray-800">
            Secure · Private · NEXATECH
          </p>

        </motion.div>

      </main>

    </div>
  );
}

export default Register;