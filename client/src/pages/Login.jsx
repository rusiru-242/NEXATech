import {
  ArrowRight,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

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

          {/* ================= REGISTER BUTTON ================= */}
          <Link
            to="/register"
            className="hidden h-10 items-center border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:border-[#00E5FF] hover:bg-[#00E5FF] hover:text-black sm:flex"
          >
            Register
          </Link>




         







        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-28">

        {/* ================= BACKGROUND GLOW ================= */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e5ff]/[0.05] blur-[140px]" />

        {/* ================= BACKGROUND GRID ================= */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* ================= LOGIN CONTAINER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >

          {/* ================= HEADER ================= */}
          <div className="mb-8 text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00e5ff]">
              NEXATECH ACCOUNT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Welcome
              <span className="text-gray-600">
                {" "}back.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Sign in to access your orders, wishlist and
              personalized shopping experience.
            </p>

          </div>

          {/* ================= LOGIN CARD ================= */}
          <div className="border border-white/10 bg-[#090909] p-6 shadow-2xl sm:p-8">

            <form className="space-y-5">

              {/* ================= EMAIL ================= */}
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

              {/* ================= PASSWORD ================= */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[10px] text-gray-600 transition hover:text-[#00e5ff]"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00e5ff]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* ================= REMEMBER ME ================= */}
              <div className="flex items-center gap-3">

                <input
                  id="remember"
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-[#00e5ff]"
                />

                <label
                  htmlFor="remember"
                  className="text-xs text-gray-600"
                >
                  Remember me
                </label>

              </div>

              {/* ================= SIGN IN ================= */}
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-3 bg-[#00e5ff] text-sm font-bold text-black transition hover:bg-white"
              >
                Sign In

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

            </form>

            {/* ================= DIVIDER ================= */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-700">
                Or
              </span>

              <div className="h-px flex-1 bg-white/10" />

            </div>

            {/* ================= GOOGLE LOGIN ================= */}
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

          {/* ================= SECURITY ================= */}
          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-gray-800">
            Secure · Private · NEXATECH
          </p>

        </motion.div>

      </main>

    </div>
  );
}

export default Login;