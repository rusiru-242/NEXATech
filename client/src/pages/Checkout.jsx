import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    try {
      const savedCart =
        JSON.parse(
          localStorage.getItem("nexatech_cart")
        ) || [];

      console.log("CART:", savedCart);

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch (err) {
      console.error("Cart loading error:", err);
      setCart([]);
    }
  }, []);

  // =====================================================
  // TOTALS
  // =====================================================

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cart]);

  const shippingFee = subtotal >= 100 ? 0 : 10;

  const total = subtotal + shippingFee;

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT ORDER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    console.log("================================");
    console.log("CHECKOUT STARTED");
    console.log("================================");

    // -----------------------------------------------------
    // TOKEN
    // -----------------------------------------------------

    const token =
      localStorage.getItem("nexatech_token");

    console.log(
      "Token exists:",
      !!token
    );

    if (!token) {
      setError(
        "You are not logged in. Please login first."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

      return;
    }

    // -----------------------------------------------------
    // CART
    // -----------------------------------------------------

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    // -----------------------------------------------------
    // VALIDATE CART PRODUCTS
    // -----------------------------------------------------

    const invalidItem = cart.find(
      (item) =>
        !item._id ||
        !item.quantity ||
        Number(item.quantity) <= 0
    );

    if (invalidItem) {
      console.error(
        "Invalid cart item:",
        invalidItem
      );

      setError(
        "One or more cart items are invalid. Please remove them and add again."
      );

      return;
    }

    // -----------------------------------------------------
    // FORM VALIDATION
    // -----------------------------------------------------

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim()
    ) {
      setError(
        "Please complete all delivery details."
      );

      return;
    }

    try {
      setLoading(true);

      // ===================================================
      // ORDER PAYLOAD
      // ===================================================

      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity),
        })),

        shippingAddress: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },

        paymentMethod,

        subtotal: Number(subtotal),
        shippingFee: Number(shippingFee),
        total: Number(total),
      };

      console.log(
        "ORDER PAYLOAD:",
        orderPayload
      );

      // ===================================================
      // CREATE ORDER
      // ===================================================

      const orderResponse = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(orderPayload),
        }
      );

      console.log(
        "Order HTTP Status:",
        orderResponse.status
      );

      // ---------------------------------------------------
      // READ RESPONSE SAFELY
      // ---------------------------------------------------

      const responseText =
        await orderResponse.text();

      console.log(
        "Raw Order Response:",
        responseText
      );

      let orderData = {};

      try {
        orderData =
          responseText
            ? JSON.parse(responseText)
            : {};
      } catch (jsonError) {
        console.error(
          "JSON parse error:",
          jsonError
        );

        throw new Error(
          `Backend returned an invalid response. HTTP ${orderResponse.status}`
        );
      }

      console.log(
        "ORDER RESPONSE:",
        orderData
      );

      // ---------------------------------------------------
      // ORDER ERROR
      // ---------------------------------------------------

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
            `Unable to create order. HTTP ${orderResponse.status}`
        );
      }

      // ---------------------------------------------------
      // CHECK ORDER
      // ---------------------------------------------------

      const order = orderData.order;

      if (!order || !order._id) {
        console.error(
          "Invalid order response:",
          orderData
        );

        throw new Error(
          "Order was not returned by the server."
        );
      }

      console.log(
        "ORDER CREATED:",
        order
      );

      // ===================================================
      // CASH ON DELIVERY
      // ===================================================

      if (paymentMethod === "cod") {
        console.log(
          "COD order created successfully."
        );

        localStorage.setItem(
          "nexatech_last_order",
          JSON.stringify(order)
        );

        localStorage.removeItem(
          "nexatech_cart"
        );

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        navigate("/orders");

        return;
      }

      // ===================================================
      // STRIPE CARD PAYMENT
      // ===================================================

      console.log(
        "Creating Stripe checkout session..."
      );

      const paymentResponse =
        await fetch(
          "http://localhost:5000/api/payments/create-checkout-session",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              orderId: order._id,
            }),
          }
        );

      console.log(
        "Payment HTTP Status:",
        paymentResponse.status
      );

      const paymentText =
        await paymentResponse.text();

      console.log(
        "Raw Payment Response:",
        paymentText
      );

      let paymentData = {};

      try {
        paymentData =
          paymentText
            ? JSON.parse(paymentText)
            : {};
      } catch (jsonError) {
        console.error(
          "Payment JSON parse error:",
          jsonError
        );

        throw new Error(
          "Payment server returned an invalid response."
        );
      }

      console.log(
        "PAYMENT RESPONSE:",
        paymentData
      );

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
            "Unable to start card payment."
        );
      }

      localStorage.setItem(
        "nexatech_last_order",
        JSON.stringify(order)
      );

      // ---------------------------------------------------
      // STRIPE REDIRECT
      // ---------------------------------------------------

      if (paymentData.url) {
        console.log(
          "Redirecting to Stripe..."
        );

        window.location.href =
          paymentData.url;

        return;
      }

      throw new Error(
        "Stripe checkout URL was not returned."
      );

    } catch (err) {
      console.error(
        "================================"
      );

      console.error(
        "CHECKOUT ERROR:",
        err
      );

      console.error(
        "================================"
      );

      setError(
        err.message ||
          "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-5">
          <div className="text-center">

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600">
              Checkout
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Your cart is empty.
            </h1>

            <Link
              to="/products"
              className="mt-7 inline-flex border border-[#00e5ff]/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#00e5ff] transition hover:bg-[#00e5ff] hover:text-black"
            >
              Continue Shopping
            </Link>

          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">

        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Cart
        </Link>

        <div className="mb-8">

          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#00e5ff]">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Complete your order.
          </h1>

        </div>

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* DELIVERY */}

            <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center border border-[#00e5ff]/20 text-[#00e5ff]">
                  <MapPin size={16} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-[10px] text-gray-600">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-600">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-11 w-full border border-white/10 bg-black/30 px-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-600">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="07X XXX XXXX"
                    className="h-11 w-full border border-white/10 bg-black/30 px-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-600">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="h-11 w-full border border-white/10 bg-black/30 px-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                  />

                </div>

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-600">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="House number, street, area..."
                    className="w-full resize-none border border-white/10 bg-black/30 px-4 py-3 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                  />

                </div>

              </div>

            </section>

            {/* PAYMENT */}

            <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center border border-[#00e5ff]/20 text-[#00e5ff]">
                  <CreditCard size={16} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-[10px] text-gray-600">
                    Select how you want to pay.
                  </p>
                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`border p-4 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-[#00e5ff]/50 bg-[#00e5ff]/5"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <Truck
                      size={18}
                      className={
                        paymentMethod === "cod"
                          ? "text-[#00e5ff]"
                          : "text-gray-600"
                      }
                    />

                    <span
                      className={`h-3 w-3 rounded-full border ${
                        paymentMethod === "cod"
                          ? "border-[#00e5ff] bg-[#00e5ff]"
                          : "border-gray-700"
                      }`}
                    />

                  </div>

                  <p className="mt-4 text-xs font-semibold">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-[10px] text-gray-600">
                    Pay when your order arrives.
                  </p>

                </button>

                {/* CARD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`border p-4 text-left transition ${
                    paymentMethod === "card"
                      ? "border-[#00e5ff]/50 bg-[#00e5ff]/5"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <CreditCard
                      size={18}
                      className={
                        paymentMethod === "card"
                          ? "text-[#00e5ff]"
                          : "text-gray-600"
                      }
                    />

                    <span
                      className={`h-3 w-3 rounded-full border ${
                        paymentMethod === "card"
                          ? "border-[#00e5ff] bg-[#00e5ff]"
                          : "border-gray-700"
                      }`}
                    />

                  </div>

                  <p className="mt-4 text-xs font-semibold">
                    Card Payment
                  </p>

                  <p className="mt-1 text-[10px] text-gray-600">
                    Secure payment using Stripe.
                  </p>

                </button>

              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 flex gap-3 border border-[#00e5ff]/10 bg-[#00e5ff]/[0.03] p-4">

                  <ShieldCheck
                    size={17}
                    className="shrink-0 text-[#00e5ff]"
                  />

                  <p className="text-[10px] leading-5 text-gray-500">
                    You will be redirected to Stripe's
                    secure checkout page to complete
                    your card payment.
                  </p>

                </div>
              )}

            </section>

          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside>

            <div className="sticky top-24 border border-white/10 bg-white/[0.02] p-5 sm:p-6">

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                Order Summary
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Your Order
              </h2>

              <div className="mt-6 space-y-4">

                {cart.map((item) => (

                  <div
                    key={item._id}
                    className="flex gap-3"
                  >

                    <div className="h-14 w-14 shrink-0 overflow-hidden border border-white/10 bg-black">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[8px] text-gray-700">
                          NEXA
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-xs font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-600">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="text-xs font-semibold">
                      Rs.{" "}
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">

                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xs">

                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span>
                    {shippingFee === 0
                      ? "FREE"
                      : `Rs. ${shippingFee.toLocaleString()}`}
                  </span>

                </div>

                <div className="flex justify-between border-t border-white/10 pt-4">

                  <span className="text-sm font-semibold">
                    Total
                  </span>

                  <span className="text-lg font-bold text-[#00e5ff]">
                    Rs.{" "}
                    {total.toLocaleString()}
                  </span>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-12 w-full items-center justify-center border border-[#00e5ff]/40 bg-[#00e5ff] text-xs font-bold uppercase tracking-wider text-black transition hover:bg-transparent hover:text-[#00e5ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "card"
                  ? "Pay with Stripe"
                  : "Place Order"}
              </button>

              <p className="mt-4 text-center text-[9px] leading-4 text-gray-700">
                By placing your order, you agree
                to NexaTech's terms and conditions.
              </p>

            </div>

          </aside>

        </form>

      </main>
    </div>
  );
}

export default Checkout;