import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/auth";

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

      const response = await fetch(`${API_URL}/verify-otp`, {
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

      const response = await fetch(`${API_URL}/resend-otp`, {
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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="text-xl font-black tracking-[-0.06em]">
            <span>NEXA</span>
            <span className="text-[#00E5FF]">TECH</span>
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

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00E5FF]/5 blur-[140px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="border border-white/10 bg-[#090909] p-8 shadow-2xl">
            {!verified ? (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00E5FF]/10">
                    <Mail size={28} className="text-[#00E5FF]" />
                  </div>

                  <h1 className="mt-5 text-3xl font-black">
                    Verify Email
                  </h1>

                  <p className="mt-3 text-sm text-gray-500">
                    Enter the 6-digit code sent to
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#00E5FF] break-all">
                    {email}
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div>
                    <input
                      type="text"
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
                      className="h-14 w-full border border-white/10 bg-white/[0.02] text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-[#00E5FF]"
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
                    className="flex h-12 w-full items-center justify-center gap-2 bg-[#00E5FF] font-bold text-black"
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
                    className="text-sm text-[#00E5FF] disabled:text-gray-600"
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

                <h2 className="mt-5 text-3xl font-black">
                  Verified!
                </h2>

                <p className="mt-3 text-gray-500">
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