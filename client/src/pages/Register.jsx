import {
  ArrowRight,
  ArrowLeft,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // Handle Input Changes
  // ==============================
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==============================
  // Register User
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==============================
    // Validation
    // ==============================

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // API REQUEST
      // ==============================

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      // ==============================
      // Read Response
      // ==============================

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      // ==============================
      // Backend Error
      // ==============================

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Registration failed (${response.status}).`
        );
      }

      // ==============================
      // Save Token
      // ==============================

      if (data.token) {
        localStorage.setItem(
          "nexatech_token",
          data.token
        );
      }

      // ==============================
      // Save User
      // ==============================

      if (data.user) {
        localStorage.setItem(
          "nexatech_user",
          JSON.stringify(data.user)
        );
      }

      // ==============================
      // Success
      // ==============================

      setSuccess(
        data.message ||
          "Account created successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTerms(false);

      // ==============================
      // Redirect To Login
      // ==============================

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      // ==============================
      // Connection Error
      // ==============================

      if (
        err instanceof TypeError &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running on port 5000."
        );
      } else {
        setError(
          err.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= AUTH NAVBAR ================= */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <Link
            to="/"
            className="text-xl font-black tracking-[-0.06em]"
          >
            <span className="text-white">
              NEXA
            </span>

            <span className="text-[#00E5FF]">
              TECH
            </span>
          </Link>

          {/* Back To Store */}

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

        {/* Background Grid */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* ================= REGISTER CONTAINER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative z-10 w-full max-w-md"
        >

          {/* ================= HEADER ================= */}

          <div className="mb-8 text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00e5ff]">
              NEXATECH ACCOUNT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Create
              <span className="text-gray-600">
                {" "}account.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Create your NexaTech account to manage
              orders, wishlist and your personalized
              shopping experience.
            </p>

          </div>

          {/* ================= CARD ================= */}

          <div className="border border-white/10 bg-[#090909] p-6 shadow-2xl sm:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ================= ERROR ================= */}

              {error && (
                <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-5 text-red-400">
                  {error}
                </div>
              )}

              {/* ================= SUCCESS ================= */}

              {success && (
                <div className="border border-[#00e5ff]/20 bg-[#00e5ff]/5 px-4 py-3 text-xs leading-5 text-[#00e5ff]">
                  {success}
                </div>
              )}

              {/* ================= FULL NAME ================= */}

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
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={loading}
                    autoComplete="name"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

              </div>

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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    autoComplete="email"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

              </div>

              {/* ================= PASSWORD ================= */}

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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loading}
                    autoComplete="new-password"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00e5ff]"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* ================= CONFIRM PASSWORD ================= */}

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
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                    autoComplete="new-password"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/60 focus:bg-[#00e5ff]/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-600 transition hover:text-[#00e5ff]"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* ================= TERMS ================= */}

              <div className="flex items-start gap-3">

                <input
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) =>
                    setTerms(e.target.checked)
                  }
                  disabled={loading}
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

              {/* ================= REGISTER BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-3 bg-[#00e5ff] text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}

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

            {/* ================= GOOGLE ================= */}

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

              <ArrowRight
                size={14}
                className="ml-2"
              />
            </Link>

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

export default Register;