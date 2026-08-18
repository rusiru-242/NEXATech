import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

import Navbar from "../components/Navbar";

function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">

        <div className="w-full border border-yellow-500/20 bg-white/[0.02] p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
            <CreditCard size={28} />
          </div>

          <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.35em] text-yellow-400">
            Payment Cancelled
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Payment was not completed.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-gray-500">
            Your Stripe payment was cancelled or
            interrupted. You can return to checkout
            and try again.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 border border-[#00e5ff]/40 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#00e5ff] transition hover:bg-[#00e5ff] hover:text-black"
            >
              <ArrowLeft size={15} />
              Return to Checkout
            </Link>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:border-white/30 hover:text-white"
            >
              View Orders
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
}

export default PaymentCancelled;