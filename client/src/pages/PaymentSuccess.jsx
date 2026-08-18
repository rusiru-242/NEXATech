import { Link } from "react-router-dom";
import { CheckCircle2, Package } from "lucide-react";

import Navbar from "../components/Navbar";

function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">
        <div className="w-full border border-[#00e5ff]/20 bg-white/[0.02] p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff]">
            <CheckCircle2 size={30} />
          </div>

          <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#00e5ff]">
            Payment Successful
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-gray-500">
            Your payment was successfully submitted.
            You can view your order details from your
            orders page.
          </p>

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