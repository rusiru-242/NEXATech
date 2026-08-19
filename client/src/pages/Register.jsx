import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/auth";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [terms, setTerms] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError("Please fill in all fields.");
    }

    if (formData.name.trim().length < 2) {
      return setError("Name must be at least 2 characters.");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!terms) {
      return setError("Please accept the Terms & Conditions.");
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      navigate("/verify-email", {
        state: {
          email: formData.email.trim().toLowerCase(),
          resendAfter: 60,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ================= NAVBAR ================= */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="text-xl font-black tracking-[-0.06em]"
          >
            <span className="text-white">NEXA</span>
            <span className="text-[#00E5FF]">TECH</span>
          </Link>

          <Link
            to="/products"
            className="group flex items-center gap-2 text-xs text-gray-500 transition hover:text-white"
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
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/[0.05] blur-[140px]" />

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:32px_32px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Header */}

          <div className="mb-8 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00E5FF]">
              NEXATECH ACCOUNT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Create
              <span className="text-gray-600">
                {" "}account.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Create your NexaTech account using a real email address.
            </p>
          </div>

          {/* Card */}

          <div className="border border-white/10 bg-[#090909] p-6 shadow-2xl sm:p-8">
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-5"
            >
              {error && (
                <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Full Name */}

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="name"
                    name="register_name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    readOnly
                    onFocus={(e) =>
                      e.target.removeAttribute("readonly")
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="email"
                    name="register_email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@gmail.com"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    readOnly
                    onFocus={(e) =>
                      e.target.removeAttribute("readonly")
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="password"
                    name="register_password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) =>
                      e.target.removeAttribute("readonly")
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00E5FF]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="confirmPassword"
                    name="register_confirm_password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) =>
                      e.target.removeAttribute("readonly")
                    }
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00E5FF]"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms */}

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) =>
                    setTerms(e.target.checked)
                  }
                  className="mt-1 h-3.5 w-3.5 accent-[#00E5FF]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs text-gray-500"
                >
                  I agree to the Terms & Conditions and
                  Privacy Policy.
                </label>
              </div>

              {/* Continue */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-3 bg-[#00E5FF] text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Continue"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Login */}

            <div className="mt-8 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#00E5FF] hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-gray-800">
            Secure · Email Verification · NEXATECH
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default Register;