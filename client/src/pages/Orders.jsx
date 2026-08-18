import {
  ArrowLeft,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Orders() {
  return (
    <div className="min-h-screen bg-[#050505] px-5 pb-20 pt-28 text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/account"
            className="mb-6 inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#00E5FF]"
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00E5FF]">
            SHOPPING
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">
            My
            <span className="text-gray-600"> Orders.</span>
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            View your previous and current orders.
          </p>
        </div>

        {/* Empty Orders */}
        <div className="border border-white/10 bg-[#090909] px-6 py-16 text-center sm:px-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-white/10 bg-white/[0.02]">
            <Package
              size={26}
              className="text-gray-600"
            />
          </div>

          <h2 className="mt-6 text-xl font-bold">
            No orders yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
            You haven't placed any orders yet.
            Start shopping and your orders will appear here.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex h-11 items-center gap-2 bg-[#00E5FF] px-6 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white"
          >
            <ShoppingBag size={15} />
            Start Shopping
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Orders;