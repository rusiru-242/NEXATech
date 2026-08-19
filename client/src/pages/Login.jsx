import {
  ArrowRight,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const API_URL = "http://localhost:5000/api/auth";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Save authentication
      localStorage.setItem("nexatech_token", data.token);
      localStorage.setItem(
        "nexatech_user",
        JSON.stringify(data.user)
      );

      // Switch cart to logged-in user's cart
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("authChanged"));

      // Refresh Navbar & Cart
      window.dispatchEvent(new Event("authChanged"));

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ================= AUTH NAVBAR ================= */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="text-xl font-black tracking-[-0.06em]"
          >
            <span className="text-white">NEXA</span>
            <span className="text-[#00E5FF]">TECH</span>
          </Link>

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
        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e5ff]/[0.05] blur-[140px]" />

        {/* Background Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:32px_32px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Header */}

          <div className="mb-8 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00e5ff]">
              NEXATECH ACCOUNT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Welcome
              <span className="text-gray-600"> back.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Sign in to access your orders, wishlist and personalized shopping experience.
            </p>
          </div>

          {/* Login Card */}

          <div className="border border-white/10 bg-[#090909] p-6 shadow-2xl sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="border border-[#00e5ff]/20 bg-[#00e5ff]/5 px-4 py-3 text-sm text-[#00e5ff]">
                  {success}
                </div>
              )}

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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02]"
                  />
                </div>
              </div>

              {/* Password */}

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
                    onClick={() =>
                      setError("Password reset is not available yet.")
                    }
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
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

              {/* Remember Me */}

              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="h-3.5 w-3.5 accent-[#00e5ff]"
                />

                <label
                  htmlFor="remember"
                  className="text-xs text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {/* Sign In */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-3 bg-[#00e5ff] text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
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

export default Login;