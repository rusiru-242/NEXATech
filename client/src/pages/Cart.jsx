import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";

const initialCart = [
  {
    id: 1,
    name: "Nexa Pro Laptop",
    category: "Laptops",
    price: 289000,
    quantity: 1,
  },
  {
    id: 2,
    name: "Pulse Gaming Headset",
    category: "Gaming",
    price: 49000,
    quantity: 1,
  },
  {
    id: 3,
    name: "Nexa Mechanical Keyboard",
    category: "Accessories",
    price: 32000,
    quantity: 2,
  },
];

function Cart() {
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + change),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 2500;

  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="pt-24">

        {/* Header */}

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-16">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#00e5ff]">
                Your Selection
              </p>

              <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">
                Your
                <span className="text-gray-600">
                  {" "}cart.
                </span>
              </h1>

              <p className="mt-5 text-sm text-gray-500">
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"} ready for checkout.
              </p>
            </motion.div>

          </div>
        </section>

        {/* Cart Content */}

        <section className="mx-auto max-w-7xl px-6 py-12">

          {cartItems.length > 0 ? (
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

              {/* Items */}

              <div>

                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-600">
                    Cart Items
                  </p>

                  <p className="text-xs text-gray-600">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    units
                  </p>

                </div>

                <div className="space-y-3">

                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border border-white/10 bg-[#090909] p-4 sm:p-5"
                    >

                      <div className="flex gap-5">

                        {/* Product Image */}

                        <div className="flex h-28 w-28 shrink-0 items-center justify-center border border-white/10 bg-[#0d0d0d] sm:h-36 sm:w-36">

                          <div className="h-16 w-24 border border-white/10 bg-gradient-to-br from-white/[0.08] to-[#00e5ff]/[0.03] transition duration-500 group-hover:scale-105" />

                        </div>

                        {/* Details */}

                        <div className="flex min-w-0 flex-1 flex-col justify-between">

                          <div>

                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                              {item.category}
                            </p>

                            <h2 className="mt-2 truncate text-sm font-semibold text-white sm:text-base">
                              {item.name}
                            </h2>

                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            {/* Quantity */}

                            <div className="flex h-9 items-center border border-white/10">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.id, -1)
                                }
                                className="flex h-full w-9 items-center justify-center text-gray-600 transition hover:text-white"
                              >
                                <Minus size={13} />
                              </button>

                              <span className="w-8 text-center text-xs">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.id, 1)
                                }
                                className="flex h-full w-9 items-center justify-center text-gray-600 transition hover:text-white"
                              >
                                <Plus size={13} />
                              </button>

                            </div>

                            {/* Price */}

                            <p className="text-sm font-bold text-white">
                              Rs.{" "}
                              {(
                                item.price * item.quantity
                              ).toLocaleString()}
                            </p>

                          </div>

                        </div>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-700 transition hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </motion.div>
                  ))}

                </div>

                {/* Continue Shopping */}

                <button
                  type="button"
                  className="mt-7 flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#00e5ff]"
                >
                  <ArrowLeft size={14} />
                  Continue Shopping
                </button>

              </div>

              {/* Summary */}

              <aside>

                <div className="sticky top-28 border border-white/10 bg-[#090909]">

                  <div className="border-b border-white/10 p-6">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
                      Order Summary
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">
                      Checkout
                    </h2>

                  </div>

                  <div className="space-y-5 p-6">

                    {/* Subtotal */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal
                      </span>

                      <span className="text-gray-300">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Shipping */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Shipping
                      </span>

                      <span className="text-gray-300">
                        {shipping === 0
                          ? "FREE"
                          : `Rs. ${shipping.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-5">

                      <div className="flex items-end justify-between">

                        <span className="text-xs uppercase tracking-wider text-gray-600">
                          Total
                        </span>

                        <span className="text-2xl font-black">
                          Rs. {total.toLocaleString()}
                        </span>

                      </div>

                    </div>

                    {/* Checkout */}

                    <button
                      type="button"
                      className="flex h-13 w-full items-center justify-center gap-3 bg-[#00e5ff] px-6 py-4 text-sm font-bold text-black transition hover:bg-white"
                    >
                      Proceed to Checkout
                      <ArrowLeft
                        size={16}
                        className="rotate-180"
                      />
                    </button>

                    {/* Security */}

                    <div className="flex items-center gap-3 border-t border-white/10 pt-5">

                      <ShieldCheck
                        size={17}
                        className="shrink-0 text-[#00e5ff]"
                      />

                      <p className="text-[10px] leading-5 text-gray-600">
                        Secure checkout with protected payment
                        processing.
                      </p>

                    </div>

                  </div>

                </div>

              </aside>

            </div>
          ) : (

            /* Empty Cart */

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[500px] flex-col items-center justify-center border border-dashed border-white/10 text-center"
            >

              <div className="flex h-16 w-16 items-center justify-center border border-white/10 text-gray-600">
                <ShoppingBag size={23} />
              </div>

              <h2 className="mt-7 text-2xl font-bold">
                Your cart is empty.
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
                Looks like you haven't added anything yet.
                Explore our collection and find something
                built for what's next.
              </p>

              <button
                type="button"
                className="mt-7 bg-[#00e5ff] px-7 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-white"
              >
                Explore Products
              </button>

            </motion.div>
          )}

        </section>

        {/* Trust Section */}

        <section className="border-t border-white/10">

          <div className="mx-auto grid max-w-7xl sm:grid-cols-3">

            <div className="flex items-center gap-4 border-b border-white/10 p-7 sm:border-b-0 sm:border-r">

              <Truck
                size={20}
                className="text-[#00e5ff]"
              />

              <div>
                <p className="text-xs font-semibold">
                  Fast Delivery
                </p>

                <p className="mt-1 text-[10px] text-gray-600">
                  Islandwide delivery
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 border-b border-white/10 p-7 sm:border-b-0 sm:border-r">

              <ShieldCheck
                size={20}
                className="text-[#00e5ff]"
              />

              <div>
                <p className="text-xs font-semibold">
                  Secure Payment
                </p>

                <p className="mt-1 text-[10px] text-gray-600">
                  Protected checkout
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 p-7">

              <ShoppingBag
                size={20}
                className="text-[#00e5ff]"
              />

              <div>
                <p className="text-xs font-semibold">
                  Genuine Products
                </p>

                <p className="mt-1 text-[10px] text-gray-600">
                  100% authentic
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Cart;