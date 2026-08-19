import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCart, saveCart } from "../utils/cartStorage";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("nexatech_token");

  // ================= LOAD CART =================

  const loadCart = () => {
    try {
      const savedCart = getCart();

      if (!Array.isArray(savedCart)) {
        setCart([]);
        return;
      }

      const normalizedCart = savedCart.map((item) => {
        const price = Number(item?.price || 0);
        const discount = Math.min(
          Math.max(Number(item?.discount || 0), 0),
          100
        );

        let originalPrice = Number(item?.originalPrice || 0);

        if (
          originalPrice <= 0 &&
          discount > 0 &&
          discount < 100 &&
          price > 0
        ) {
          originalPrice = price / (1 - discount / 100);
        }

        if (originalPrice <= 0) originalPrice = price;

        return {
          ...item,
          price,
          originalPrice,
          discount,
          quantity: Math.max(Number(item?.quantity || 1), 1),
        };
      });

      setCart(normalizedCart);
    } catch (err) {
      console.error("Cart load error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadCart();

    const handleCartUpdated = () => loadCart();

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, [token, navigate]);

  // ================= SAVE CART =================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // ================= QUANTITY =================

  const increaseQuantity = (id) => {
    updateCart(
      cart.map((item) => {
        if (String(item._id) !== String(id)) return item;

        const stock = Number(item.stock);
        const qty = Math.max(Number(item.quantity || 1), 1);

        if (Number.isFinite(stock) && stock >= 0) {
          return {
            ...item,
            quantity: Math.min(qty + 1, stock),
          };
        }

        return {
          ...item,
          quantity: qty + 1,
        };
      })
    );
  };

  const decreaseQuantity = (id) => {
    updateCart(
      cart.map((item) =>
        String(item._id) === String(id)
          ? {
              ...item,
              quantity: Math.max(Number(item.quantity || 1) - 1, 1),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    updateCart(cart.filter((item) => String(item._id) !== String(id)));
  };

  const clearCart = () => updateCart([]);

  // ================= HELPERS =================

  const getItemPrice = (item) => Number(item?.price || 0);

  const getItemDiscount = (item) =>
    Math.min(Math.max(Number(item?.discount || 0), 0), 100);

  const getItemOriginalPrice = (item) => {
    if (Number(item?.originalPrice || 0) > 0) {
      return Number(item.originalPrice);
    }

    const price = getItemPrice(item);
    const discount = getItemDiscount(item);

    if (discount > 0 && discount < 100) {
      return price / (1 - discount / 100);
    }

    return price;
  };

  const getItemQuantity = (item) =>
    Math.max(Number(item?.quantity || 1), 1);

  // ================= TOTALS =================

  const subtotal = useMemo(
    () =>
      Number(
        cart
          .reduce((t, i) => t + getItemPrice(i) * getItemQuantity(i), 0)
          .toFixed(2)
      ),
    [cart]
  );

  const shippingFee = subtotal === 0 ? 0 : subtotal >= 100 ? 0 : 10;

  const total = Number((subtotal + shippingFee).toFixed(2));

  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + getItemQuantity(i), 0),
    [cart]
  );

  const totalSavings = useMemo(
    () =>
      Number(
        cart
          .reduce((t, i) => {
            const save =
              Math.max(getItemOriginalPrice(i) - getItemPrice(i), 0) *
              getItemQuantity(i);

            return t + save;
          }, 0)
          .toFixed(2)
      ),
    [cart]
  );

  // ================= EMPTY CART =================

  if (!token) {
    return null;
  }

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
              Looks like you haven't added anything yet.
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

  // ================= UI =================

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/products"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#00E5FF]"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

            <h1 className="text-4xl font-bold">Shopping Cart</h1>

            <p className="mt-2 text-gray-500">
              {totalItems} item(s) in your cart
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

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            {cart.map((item) => {
              const quantity = getItemQuantity(item);
              const currentPrice = getItemPrice(item);
              const originalPrice = getItemOriginalPrice(item);
              const discount = getItemDiscount(item);

              const stock = Number(item.stock);
              const hasStockInfo = Number.isFinite(stock) && stock >= 0;
              const isOutOfStock = hasStockInfo && stock === 0;
              const isMaxQuantity = hasStockInfo && quantity >= stock;

              return (
                <div
                  key={item._id}
                  className={`rounded-2xl border p-5 ${
                    isOutOfStock
                      ? "border-red-500/20 bg-red-500/[0.03]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex gap-5">
                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] p-3">
                      {discount > 0 && (
                        <span className="absolute left-1 top-1 rounded bg-[#00E5FF] px-1.5 py-0.5 text-[8px] font-bold text-black">
                          -{discount}%
                        </span>
                      )}

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <ShoppingBag size={30} className="text-gray-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#00E5FF]">
                            {item.brand || item.category || "NexaTech"}
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
                          onClick={() => removeItem(item._id)}
                          className="text-gray-600 transition hover:text-red-400"
                        >
                          <X size={19} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#00E5FF]">
                          Rs. {currentPrice.toFixed(2)}
                        </span>

                        {discount > 0 && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              Rs. {originalPrice.toFixed(2)}
                            </span>

                            <span className="inline-flex items-center gap-1 rounded bg-[#00E5FF]/10 px-2 py-1 text-[10px] text-[#00E5FF]">
                              <Tag size={10} />
                              Save {discount}%
                            </span>
                          </>
                        )}
                      </div>

                      {discount > 0 && (
                        <p className="mt-2 text-[10px] text-green-400">
                          You save Rs.{" "}
                          {Math.max(originalPrice - currentPrice, 0).toFixed(2)}{" "}
                          per item
                        </p>
                      )}

                      {isOutOfStock && (
                        <p className="mt-2 text-[10px] text-red-400">
                          Out of Stock
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item._id)}
                              disabled={quantity <= 1}
                              className="flex h-9 w-9 items-center justify-center rounded-l-lg border border-white/10 bg-white/[0.04] disabled:opacity-40"
                            >
                              <Minus size={15} />
                            </button>

                            <div className="flex h-9 w-12 items-center justify-center border-y border-white/10 bg-white/[0.02] font-semibold">
                              {quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item._id)}
                              disabled={isOutOfStock || isMaxQuantity}
                              className="flex h-9 w-9 items-center justify-center rounded-r-lg border border-white/10 bg-white/[0.04] disabled:opacity-40"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          {hasStockInfo && (
                            <p className="mt-2 text-[10px] text-gray-600">
                              {stock > 0 ? `${stock} available` : "Out of stock"}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-[#00E5FF]">
                            Rs. {(currentPrice * quantity).toFixed(2)}
                          </p>

                          <p className="text-xs text-gray-500">
                            Rs. {currentPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Savings</span>
                  <span className="text-green-400">
                    -Rs. {totalSavings.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>
                  {shippingFee === 0
                    ? "FREE"
                    : `Rs. ${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {subtotal > 0 && subtotal < 100 && (
                <p className="rounded-lg bg-[#00E5FF]/5 px-3 py-2 text-xs text-[#00E5FF]">
                  Add Rs. {(100 - subtotal).toFixed(2)} more to get free
                  shipping.
                </p>
              )}

              {shippingFee === 0 && subtotal >= 100 && (
                <p className="rounded-lg bg-green-500/5 px-3 py-2 text-xs text-green-400">
                  ✓ You qualify for free shipping.
                </p>
              )}

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>

                  <span className="text-2xl font-bold text-[#00E5FF]">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

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