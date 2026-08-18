import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  ShoppingBag,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  const [cart, setCart] = useState([]);

  // =========================================================
  // LOAD CART
  // =========================================================

  const loadCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("nexatech_cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch (error) {
      console.error("Cart load error:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // =========================================================
  // UPDATE CART STORAGE
  // =========================================================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "nexatech_cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (String(item._id) !== String(id)) {
        return item;
      }

      const stock = Number(item.stock || 999999);

      return {
        ...item,
        quantity: Math.min(
          Number(item.quantity || 1) + 1,
          stock
        ),
      };
    });

    updateCart(updatedCart);
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) => {
        if (String(item._id) !== String(id)) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            Number(item.quantity || 1) - 1,
            1
          ),
        };
      });

    updateCart(updatedCart);
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => String(item._id) !== String(id)
    );

    updateCart(updatedCart);
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    updateCart([]);
  };

  // =========================================================
  // TOTALS
  // =========================================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // Free shipping above $100
  const shippingFee =
    subtotal === 0
      ? 0
      : subtotal >= 100
      ? 0
      : 10;

  const total = subtotal + shippingFee;

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF]">
              <ShoppingCart size={36} />
            </div>

            <h1 className="mt-7 text-3xl font-bold">
              Your Cart is Empty
            </h1>

            <p className="mt-3 max-w-md text-gray-500">
              Looks like you haven't added anything to your
              cart yet.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-6 py-3 font-semibold text-black transition hover:bg-[#00cce6]"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // CART UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <Link
              to="/products"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#00E5FF]"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

            <h1 className="text-4xl font-bold">
              Shopping Cart
            </h1>

            <p className="mt-2 text-gray-500">
              {cart.reduce(
                (sum, item) =>
                  sum + Number(item.quantity || 1),
                0
              )}{" "}
              item(s) in your cart
            </p>

          </div>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={17} />
            Clear Cart
          </button>

        </div>

        {/* CONTENT */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* CART ITEMS */}

          <section className="space-y-4">

            {cart.map((item) => {

              const itemTotal =
                Number(item.price || 0) *
                Number(item.quantity || 1);

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >

                  <div className="flex gap-5">

                    {/* IMAGE */}

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] p-3">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <ShoppingBag
                          size={30}
                          className="text-gray-700"
                        />
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs uppercase tracking-wider text-[#00E5FF]">
                            {item.brand || item.category}
                          </p>

                          <Link
                            to={`/products/${item._id}`}
                            className="mt-1 block text-lg font-semibold transition hover:text-[#00E5FF]"
                          >
                            {item.name}
                          </Link>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item._id)
                          }
                          className="text-gray-600 transition hover:text-red-400"
                          title="Remove item"
                        >
                          <X size={19} />
                        </button>

                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                        {/* QUANTITY */}

                        <div className="flex items-center">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item._id)
                            }
                            disabled={
                              Number(item.quantity) <= 1
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-l-lg border border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/10 disabled:opacity-40"
                          >
                            <Minus size={15} />
                          </button>

                          <div className="flex h-9 w-12 items-center justify-center border-y border-white/10 bg-white/[0.02] text-sm font-semibold">
                            {item.quantity}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item._id)
                            }
                            disabled={
                              Number(item.quantity) >=
                              Number(item.stock || 999999)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-r-lg border border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/10 disabled:opacity-40"
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                        {/* PRICE */}

                        <div className="text-right">

                          <p className="text-lg font-bold text-[#00E5FF]">
                            ${itemTotal.toFixed(2)}
                          </p>

                          <p className="text-xs text-gray-600">
                            ${Number(item.price).toFixed(2)} each
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </section>

          {/* ORDER SUMMARY */}

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  ${subtotal.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="font-medium">
                  {shippingFee === 0
                    ? "FREE"
                    : `$${shippingFee.toFixed(2)}`}
                </span>

              </div>

              {subtotal > 0 && subtotal < 100 && (
                <p className="rounded-lg bg-[#00E5FF]/5 px-3 py-2 text-xs text-[#00E5FF]">
                  Add ${(100 - subtotal).toFixed(2)} more
                  to get free shipping.
                </p>
              )}

              <div className="border-t border-white/10 pt-4">

                <div className="flex items-center justify-between">

                  <span className="text-base font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#00E5FF]">
                    ${total.toFixed(2)}
                  </span>

                </div>

              </div>

            </div>

            {/* CHECKOUT */}

            <Link
              to="/checkout"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-4 font-semibold text-black transition hover:bg-[#00cce6]"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Cart;