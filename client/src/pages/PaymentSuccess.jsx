
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  Loader2,
  XCircle,
  CreditCard,
} from "lucide-react";

import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const sessionId =
        searchParams.get("session_id");

      const token =
        localStorage.getItem("nexatech_token");

      // ==========================================
      // CHECK LOGIN
      // ==========================================

      if (!token) {
        setError(
          "Please login to verify your payment."
        );
        setLoading(false);
        return;
      }

      // ==========================================
      // CHECK STRIPE SESSION ID
      // ==========================================

      if (!sessionId) {
        setError(
          "Stripe payment session was not found."
        );
        setLoading(false);
        return;
      }

      console.log(
        "Verifying Stripe Session:",
        sessionId
      );

      // ==========================================
      // VERIFY PAYMENT WITH BACKEND
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/payments/verify-session/${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Payment Verification Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to verify payment."
        );
      }

      // ==========================================
      // PAYMENT VERIFIED
      // ==========================================

      if (data.verified) {
        setVerified(true);
        setOrder(data.order);

        // Save latest order locally
        localStorage.setItem(
          "nexatech_last_order",
          JSON.stringify(data.order)
        );
      } else {
        setVerified(false);
        setOrder(data.order);

        setError(
          "Payment has not been confirmed yet."
        );
      }
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setError(
        error.message ||
          "Unable to verify payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">
          <div className="w-full border border-white/10 bg-white/[0.02] p-10 text-center sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff]">
              <Loader2
                size={30}
                className="animate-spin"
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#00e5ff]">
              Verifying Payment
            </p>

            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Confirming your payment...
            </h1>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-gray-500">
              Please wait while we verify your
              Stripe payment and update your order.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // PAYMENT VERIFIED
  // ==========================================

  if (verified) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">
          <div className="w-full border border-[#00e5ff]/20 bg-white/[0.02] p-8 text-center sm:p-12">

            {/* SUCCESS ICON */}

            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-green-400/30 bg-green-400/10 text-green-400">
              <CheckCircle2 size={30} />
            </div>

            {/* LABEL */}

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#00e5ff]">
              Payment Verified
            </p>

            {/* TITLE */}

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Thank you for your order.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-gray-500">
              Your Stripe payment has been
              successfully verified and your order
              is now being processed.
            </p>

            {/* ORDER DETAILS */}

            {order && (
              <div className="mx-auto mt-8 max-w-md border border-white/10 bg-black/30 p-5 text-left">

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Order ID
                  </span>

                  <span className="max-w-[220px] break-all text-right font-mono text-xs text-gray-300">
                    #{order._id}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-4">
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Payment
                  </span>

                  <span className="flex items-center gap-2 text-xs font-medium text-green-400">
                    <CheckCircle2 size={14} />
                    Paid
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-4">
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Order Status
                  </span>

                  <span className="text-xs font-medium capitalize text-yellow-400">
                    {order.status || "Processing"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    Total
                  </span>

                  <span className="text-lg font-bold text-[#00e5ff]">
                    $
                    {Number(
                      order.total || 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 border border-[#00e5ff] bg-[#00e5ff] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-transparent hover:text-[#00e5ff]"
              >
                <Package size={15} />
                View Orders
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:border-white/30 hover:text-white"
              >
                <CreditCard size={15} />
                Continue Shopping
              </Link>

            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // PAYMENT VERIFICATION FAILED
  // ==========================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">
        <div className="w-full border border-red-500/20 bg-white/[0.02] p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-red-400/30 bg-red-400/10 text-red-400">
            <XCircle size={30} />
          </div>

          <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.35em] text-red-400">
            Payment Verification
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Payment could not be verified.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-gray-500">
            {error ||
              "We could not confirm your Stripe payment. Please check your orders before trying again."}
          </p>

          {/* ORDER INFORMATION */}

          {order && (
            <div className="mx-auto mt-7 max-w-md border border-white/10 bg-black/30 p-4 text-left">

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Order ID
                </span>

                <span className="max-w-[220px] break-all text-right font-mono text-xs text-gray-300">
                  #{order._id}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Payment Status
                </span>

                <span className="text-xs capitalize text-yellow-400">
                  {order.paymentStatus ||
                    "Pending"}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 border border-[#00e5ff] bg-[#00e5ff] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-transparent hover:text-[#00e5ff]"
            >
              <Package size={15} />
              Check Orders
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:border-white/30 hover:text-white"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentSuccess;

