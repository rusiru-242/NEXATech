import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  RefreshCw,
} from "lucide-react";
import CyanLinesBackground from "../components/ui/CyanLinesBackground";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verified, setVerified] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      return setError("Please enter the 6-digit OTP.");
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("nexatech_token", data.token);
      localStorage.setItem(
        "nexatech_user",
        JSON.stringify(data.user)
      );

      setVerified(true);
      setSuccess("Email verified successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSuccess("A new OTP has been sent.");
      setOtp("");
      setSeconds(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <CyanLinesBackground />

      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="shrink-0">
            <div className="text-xl font-bold tracking-[0.2em] text-white">
              NEXA
              <span className="text-[#00E5FF]">TECH</span>
            </div>
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>
      </header>

      {/* Main */}

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/5 blur-[140px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 my-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            {!verified ? (
              <>
                <div className="mb-6 text-center sm:mb-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00E5FF]/10 sm:h-16 sm:w-16">
                    <Mail size={24} className="text-[#00E5FF] sm:hidden" />
                    <Mail size={28} className="hidden text-[#00E5FF] sm:block" />
                  </div>

                  <h1 className="mt-4 text-2xl font-black sm:mt-5 sm:text-3xl">
                    Verify Email
                  </h1>

                  <p className="mt-2 text-xs text-gray-500 sm:mt-3 sm:text-sm">
                    Enter the 6-digit code sent to
                  </p>

                  <p className="mt-1.5 break-all text-xs font-semibold text-[#00E5FF] sm:mt-2 sm:text-sm">
                    {email}
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4 sm:space-y-5">
                  <div>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      maxLength={6}
                      placeholder="000000"
                      className="h-12 w-full border border-white/10 bg-white/[0.02] text-center text-xl font-bold tracking-[0.4em] outline-none transition focus:border-[#00E5FF] sm:h-14 sm:text-2xl sm:tracking-[0.5em]"
                    />
                  </div>

                  {error && (
                    <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-4 py-3 text-xs text-[#00E5FF]">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 bg-[#00E5FF] text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={resendOtp}
                    disabled={seconds > 0 || resendLoading}
                    className="text-xs text-[#00E5FF] transition disabled:text-gray-600 sm:text-sm"
                  >
                    {resendLoading
                      ? "Sending..."
                      : seconds > 0
                      ? `Resend in ${seconds}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle
                  size={60}
                  className="mx-auto text-[#00E5FF]"
                />

                <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                  Verified!
                </h2>

                <p className="mt-3 text-xs text-gray-500 sm:text-sm">
                  Redirecting to login...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default VerifyEmail;