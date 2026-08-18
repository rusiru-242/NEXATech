import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nexatech_cart")) || [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    );
  }, [cart]);

  const shippingFee = subtotal >= 100 || subtotal === 0 ? 0 : 10;

  const total = subtotal + shippingFee;

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    // --------------------------------------------------------
    // Check cart
    // --------------------------------------------------------

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    // --------------------------------------------------------
    // Check authentication
    // --------------------------------------------------------

    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      alert("Please login before placing your order.");
      navigate("/login");
      return;
    }

    // --------------------------------------------------------
    // Basic validation
    // --------------------------------------------------------

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setError("Please complete all delivery information.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ------------------------------------------------------
      // Send order to backend
      // ------------------------------------------------------

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: cart,

            shippingAddress: {
              name: formData.name.trim(),
              phone: formData.phone.trim(),
              address: formData.address.trim(),
              city: formData.city.trim(),
            },

            paymentMethod,

            subtotal,
            shippingFee,
            total,
          }),
        }
      );

      const data = await response.json();

      // ------------------------------------------------------
      // Handle backend error
      // ------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place your order."
        );
      }

      // ------------------------------------------------------
      // Save last order
      // ------------------------------------------------------

      if (data.order) {
        localStorage.setItem(
          "nexatech_last_order",
          JSON.stringify(data.order)
        );
      }

      // ------------------------------------------------------
      // Clear cart
      // ------------------------------------------------------

      localStorage.removeItem("nexatech_cart");

      // ------------------------------------------------------
      // Update Navbar cart count
      // ------------------------------------------------------

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // ------------------------------------------------------
      // Go to Orders page
      // ------------------------------------------------------

      navigate("/orders");
    } catch (err) {
      console.error("Checkout Error:", err);

      setError(
        err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">

        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-500">
              <ShoppingBag size={30} />
            </div>

            <h1 className="mt-5 text-3xl font-bold">
              Your cart is empty
            </h1>

            <p className="mt-3 text-gray-400">
              Add some products before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-6 py-3 font-semibold text-black transition hover:bg-[#00cce6]"
            >
              <ShoppingBag size={18} />
              Browse Products
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================================
  // CHECKOUT PAGE
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">

        {/* Header */}
        <div className="mb-8">

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#00E5FF]"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <div className="mt-5">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00E5FF]">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              Complete your order.
            </h1>

            <p className="mt-3 text-gray-400">
              Enter your delivery details and select your payment method.
            </p>

          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-6">

            {/* Delivery Details */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3 border-b border-white/10 pb-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Delivery Information
                  </h2>

                  <p className="text-xs text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>

                  <label className="mb-2 block text-sm text-gray-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#00E5FF]/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

                {/* Phone */}
                <div>

                  <label className="mb-2 block text-sm text-gray-300">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#00E5FF]/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

                {/* Address */}
                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm text-gray-300">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    required
                    rows={3}
                    disabled={loading}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#00E5FF]/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

                {/* City */}
                <div>

                  <label className="mb-2 block text-sm text-gray-300">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#00E5FF]/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                </div>

              </div>

            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3 border-b border-white/10 pb-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
                  <CreditCard size={20} />
                </div>

                <div>

                  <h2 className="font-semibold">
                    Payment Method
                  </h2>

                  <p className="text-xs text-gray-500">
                    Select how you want to pay
                  </p>

                </div>

              </div>

              <div className="mt-5 space-y-3">

                {/* COD */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "cod"
                      ? "border-[#00E5FF]/50 bg-[#00E5FF]/5"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  } ${
                    loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    disabled={loading}
                    className="accent-[#00E5FF]"
                  />

                  <Truck
                    size={20}
                    className={
                      paymentMethod === "cod"
                        ? "text-[#00E5FF]"
                        : "text-gray-400"
                    }
                  />

                  <div className="flex-1">

                    <p className="font-medium">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>

                  </div>

                  {paymentMethod === "cod" && (
                    <CheckCircle
                      size={20}
                      className="text-[#00E5FF]"
                    />
                  )}

                </label>

                {/* Card */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "card"
                      ? "border-[#00E5FF]/50 bg-[#00E5FF]/5"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  } ${
                    loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    disabled={loading}
                    className="accent-[#00E5FF]"
                  />

                  <CreditCard
                    size={20}
                    className={
                      paymentMethod === "card"
                        ? "text-[#00E5FF]"
                        : "text-gray-400"
                    }
                  />

                  <div className="flex-1">

                    <p className="font-medium">
                      Credit / Debit Card
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Secure online card payment.
                    </p>

                  </div>

                  {paymentMethod === "card" && (
                    <CheckCircle
                      size={20}
                      className="text-[#00E5FF]"
                    />
                  )}

                </label>

              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-400">
                  Online card payment integration will be
                  connected in the next step.
                </div>
              )}

            </section>

          </div>

          {/* ==================================================
              RIGHT - ORDER SUMMARY
          ================================================== */}

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">

            <div className="flex items-center justify-between border-b border-white/10 pb-5">

              <h2 className="font-semibold">
                Order Summary
              </h2>

              <span className="text-xs text-gray-500">
                {cart.length}{" "}
                {cart.length === 1 ? "item" : "items"}
              </span>

            </div>

            {/* Products */}
            <div className="mt-5 space-y-4">

              {cart.map((item) => (

                <div
                  key={item._id}
                  className="flex gap-3"
                >

                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="line-clamp-2 text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <p className="text-sm font-semibold">

                    $
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}

                  </p>

                </div>

              ))}

            </div>

            {/* Totals */}
            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">

              <div className="flex justify-between text-sm">

                <span className="text-gray-400">
                  Subtotal
                </span>

                <span>
                  ${subtotal.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-400">
                  Shipping
                </span>

                <span>
                  {shippingFee === 0
                    ? "FREE"
                    : `$${shippingFee.toFixed(2)}`}
                </span>

              </div>

              <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">

                <span>
                  Total
                </span>

                <span className="text-[#00E5FF]">
                  ${total.toFixed(2)}
                </span>

              </div>

            </div>

            {/* Place Order */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-3.5 font-semibold text-black transition hover:bg-[#00cce6] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Place Order
                </>
              )}

            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-600">
              By placing your order, you agree to our terms
              and conditions.
            </p>

          </aside>

        </form>

      </main>

    </div>
  );
}

export default Checkout;