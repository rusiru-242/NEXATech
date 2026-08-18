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

      if (!Array.isArray(savedCart)) {
        setCart([]);
        return;
      }

      // Normalize old cart items so the current cart
      // structure remains compatible with older data.
      const normalizedCart = savedCart.map((item) => {
        const price = Number(item?.price || 0);
        const discount = Math.min(
          Math.max(Number(item?.discount || 0), 0),
          100
        );

        let originalPrice = Number(
          item?.originalPrice || 0
        );

        if (
          originalPrice <= 0 &&
          discount > 0 &&
          discount < 100 &&
          price > 0
        ) {
          originalPrice =
            price / (1 - discount / 100);
        }

        if (originalPrice <= 0) {
          originalPrice = price;
        }

        return {
          ...item,
          price,
          originalPrice,
          discount,
          quantity: Math.max(
            Number(item?.quantity || 1),
            1
          ),
        };
      });

      setCart(normalizedCart);
    } catch (error) {
      console.error("Cart load error:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdated = () => {
      loadCart();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    window.addEventListener(
      "storage",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

      window.removeEventListener(
        "storage",
        handleCartUpdated
      );
    };
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

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (
        String(item._id) !== String(id)
      ) {
        return item;
      }

      const stock = Number(item.stock);

      const currentQuantity = Math.max(
        Number(item.quantity || 1),
        1
      );

      // If stock is known, never exceed it.
      if (
        Number.isFinite(stock) &&
        stock >= 0
      ) {
        return {
          ...item,
          quantity: Math.min(
            currentQuantity + 1,
            stock
          ),
        };
      }

      return {
        ...item,
        quantity: currentQuantity + 1,
      };
    });

    updateCart(updatedCart);
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (
        String(item._id) !== String(id)
      ) {
        return item;
      }

      const currentQuantity = Math.max(
        Number(item.quantity || 1),
        1
      );

      return {
        ...item,
        quantity: Math.max(
          currentQuantity - 1,
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
      (item) =>
        String(item._id) !== String(id)
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
  // PRICE HELPERS
  // =========================================================

  const getItemPrice = (item) => {
    const price = Number(
      item?.price || 0
    );

    return Number.isFinite(price) &&
      price >= 0
      ? price
      : 0;
  };

  const getItemDiscount = (item) => {
    const discount = Number(
      item?.discount || 0
    );

    if (!Number.isFinite(discount)) {
      return 0;
    }

    return Math.min(
      Math.max(discount, 0),
      100
    );
  };

  const getItemOriginalPrice = (item) => {
    const storedOriginalPrice =
      Number(item?.originalPrice || 0);

    if (
      Number.isFinite(
        storedOriginalPrice
      ) &&
      storedOriginalPrice > 0
    ) {
      return storedOriginalPrice;
    }

    const currentPrice =
      getItemPrice(item);

    const discount =
      getItemDiscount(item);

    if (
      discount > 0 &&
      discount < 100 &&
      currentPrice > 0
    ) {
      return (
        currentPrice /
        (1 - discount / 100)
      );
    }

    return currentPrice;
  };

  const getItemQuantity = (item) => {
    const quantity = Number(
      item?.quantity || 1
    );

    return Number.isInteger(quantity) &&
      quantity > 0
      ? quantity
      : 1;
  };

  // =========================================================
  // TOTALS
  // =========================================================

  const subtotal = useMemo(() => {
    const value = cart.reduce(
      (total, item) => {
        return (
          total +
          getItemPrice(item) *
            getItemQuantity(item)
        );
      },
      0
    );

    return Number(value.toFixed(2));
  }, [cart]);

  // Free shipping above $100
  const shippingFee =
    subtotal === 0
      ? 0
      : subtotal >= 100
      ? 0
      : 10;

  const total = Number(
    (
      subtotal + shippingFee
    ).toFixed(2)
  );

  // =========================================================
  // TOTAL ITEMS
  // =========================================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + getItemQuantity(item),
      0
    );
  }, [cart]);

  // =========================================================
  // TOTAL SAVINGS
  // =========================================================

  const totalSavings = useMemo(() => {
    const value = cart.reduce(
      (total, item) => {
        const originalPrice =
          getItemOriginalPrice(item);

        const currentPrice =
          getItemPrice(item);

        const quantity =
          getItemQuantity(item);

        const savingPerItem = Math.max(
          originalPrice -
            currentPrice,
          0
        );

        return (
          total +
          savingPerItem * quantity
        );
      },
      0
    );

    return Number(value.toFixed(2));
  }, [cart]);

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

        {/* ===================================================
            HEADER
        =================================================== */}

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

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <section className="space-y-4">

            {cart.map((item) => {

              const quantity =
                getItemQuantity(item);

              const currentPrice =
                getItemPrice(item);

              const originalPrice =
                getItemOriginalPrice(item);

              const discount =
                getItemDiscount(item);

              const itemTotal =
                currentPrice * quantity;

              const stock = Number(
                item.stock
              );

              const hasStockInfo =
                Number.isFinite(stock) &&
                stock >= 0;

              const isOutOfStock =
                hasStockInfo &&
                stock === 0;

              const isMaxQuantity =
                hasStockInfo &&
                quantity >= stock;

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

                    {/* =====================================
                        IMAGE
                    ===================================== */}

                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] p-3">

                      {discount > 0 && (
                        <span className="absolute left-1 top-1 z-10 rounded-md bg-[#00E5FF] px-1.5 py-0.5 text-[8px] font-bold text-black">
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
                        <ShoppingBag
                          size={30}
                          className="text-gray-700"
                        />
                      )}

                    </div>

                    {/* =====================================
                        DETAILS
                    ===================================== */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="text-xs uppercase tracking-wider text-[#00E5FF]">
                            {item.brand ||
                              item.category ||
                              "NexaTech"}
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
                            removeItem(
                              item._id
                            )
                          }
                          className="text-gray-600 transition hover:text-red-400"
                          title="Remove item"
                        >
                          <X size={19} />
                        </button>

                      </div>

                      {/* ===================================
                          PRICE INFORMATION
                      =================================== */}

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span className="text-sm font-semibold text-[#00E5FF]">
                          ${currentPrice.toFixed(2)}
                        </span>

                        {discount > 0 && (
                          <span className="text-xs text-gray-600 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}

                        {discount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#00E5FF]/10 px-2 py-1 text-[10px] font-medium text-[#00E5FF]">
                            <Tag size={10} />
                            Save {discount}%
                          </span>
                        )}

                      </div>

                      {/* SAVING PER ITEM */}

                      {discount > 0 && (
                        <p className="mt-2 text-[10px] text-green-400">
                          You save $
                          {Math.max(
                            originalPrice -
                              currentPrice,
                            0
                          ).toFixed(2)}{" "}
                          per item
                        </p>
                      )}

                      {/* STOCK WARNING */}

                      {isOutOfStock && (
                        <p className="mt-2 text-[10px] font-medium text-red-400">
                          Out of stock
                        </p>
                      )}

                      {hasStockInfo &&
                        stock > 0 &&
                        quantity > stock && (
                          <p className="mt-2 text-[10px] font-medium text-red-400">
                            Requested quantity exceeds
                            available stock.
                          </p>
                        )}

                      {/* ===================================
                          QUANTITY + TOTAL
                      =================================== */}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                        {/* QUANTITY */}

                        <div>

                          <div className="flex items-center">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item._id
                                )
                              }
                              disabled={
                                quantity <= 1
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-l-lg border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus size={15} />
                            </button>

                            <div className="flex h-9 w-12 items-center justify-center border-y border-white/10 bg-white/[0.02] text-sm font-semibold">
                              {quantity}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item._id
                                )
                              }
                              disabled={
                                isOutOfStock ||
                                isMaxQuantity
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-r-lg border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={15} />
                            </button>

                          </div>

                          {hasStockInfo && (
                            <p className="mt-2 text-[10px] text-gray-600">
                              {stock > 0
                                ? `${stock} available`
                                : "Out of stock"}
                            </p>
                          )}

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="text-right">

                          <p className="text-lg font-bold text-[#00E5FF]">
                            ${itemTotal.toFixed(2)}
                          </p>

                          <p className="text-xs text-gray-600">
                            ${currentPrice.toFixed(2)} each
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {/* SUBTOTAL */}

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  ${subtotal.toFixed(2)}
                </span>

              </div>

              {/* SAVINGS */}

              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Discount Savings
                  </span>

                  <span className="font-medium text-green-400">
                    -${totalSavings.toFixed(2)}
                  </span>

                </div>
              )}

              {/* SHIPPING */}

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

              {/* FREE SHIPPING MESSAGE */}

              {subtotal > 0 &&
                subtotal < 100 && (
                  <p className="rounded-lg bg-[#00E5FF]/5 px-3 py-2 text-xs text-[#00E5FF]">
                    Add $
                    {(100 - subtotal).toFixed(
                      2
                    )}{" "}
                    more to get free shipping.
                  </p>
                )}

              {shippingFee === 0 &&
                subtotal >= 100 && (
                  <p className="rounded-lg bg-green-500/5 px-3 py-2 text-xs text-green-400">
                    ✓ You qualify for free shipping.
                  </p>
                )}

              {/* TOTAL */}

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

            {/* CONTINUE SHOPPING */}

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