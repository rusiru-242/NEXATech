import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  Heart,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Check,
} from "lucide-react";
import { getCart, saveCart } from "../../utils/cartStorage";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export default function ProductFocusModal({ product, onClose }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!product) return;

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Check wishlist status from API / storage
    const token = localStorage.getItem("nexatech_token");
    if (token) {
      fetch(`${API_URL}/api/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.wishlist) {
            setIsWishlisted(
              data.wishlist.some(
                (item) => String(item?._id || item) === String(product._id)
              )
            );
          }
        })
        .catch((err) => console.error("Modal check wishlist error:", err));
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const numericPrice = (() => {
    if (typeof product.price === "number") return Math.max(product.price, 0);
    const parsed = Number(
      String(product.price || 0)
        .replace(/Rs\./gi, "")
        .replace(/[$,]/g, "")
        .trim()
    );
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
  })();

  const numericDiscount = Math.min(
    Math.max(Number(product.discount || 0), 0),
    100
  );
  const originalPrice = numericPrice;
  const currentPrice =
    numericDiscount > 0 && numericDiscount < 100
      ? Number((originalPrice * (1 - numericDiscount / 100)).toFixed(2))
      : originalPrice;

  const stock = Number(product.stock ?? 10);
  const isOutOfStock = stock <= 0;
  const maxQty = Math.max(stock, 1);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const cart = getCart();
    const index = cart.findIndex((item) => String(item._id) === String(product._id));

    if (index !== -1) {
      const currentQty = Number(cart[index].quantity || 1);
      cart[index] = {
        ...cart[index],
        quantity: Math.min(currentQty + quantity, stock > 0 ? stock : 99),
        price: currentPrice,
        originalPrice,
        discount: numericDiscount,
        stock,
        name: product.name,
        image: product.image,
        brand: product.brand,
        category: product.category,
      };
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: currentPrice,
        originalPrice,
        discount: numericDiscount,
        image: product.image,
        brand: product.brand,
        category: product.category,
        stock,
        quantity,
      });
    }

    saveCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    navigate("/checkout");
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("nexatech_token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!product || wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const res = await fetch(`${API_URL}/api/auth/wishlist/${product._id}`, {
        method: isWishlisted ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(!isWishlisted);

        const saved = localStorage.getItem("nexatech_user");
        if (saved) {
          const user = JSON.parse(saved);
          user.wishlist = data.wishlist || [];
          localStorage.setItem("nexatech_user", JSON.stringify(user));
        }

        window.dispatchEvent(new Event("wishlistUpdated"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Deep Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl transition-all"
        />

        {/* Ambient Cyan Background Spot Glow */}
        <div className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#00E5FF]/10 blur-[130px] z-0" />

        {/* Focused Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#090909]/85 backdrop-blur-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,229,255,0.18),0_25px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Glass Inner Top Highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product view"
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-gray-400 backdrop-blur-md transition-all duration-200 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
          >
            <X size={18} />
          </button>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10 items-center">
            {/* Left: Product Image on Frosted Glass Pedestal */}
            <div className="relative flex min-h-[300px] sm:min-h-[380px] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-xl overflow-hidden group">
              {numericDiscount > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#00E5FF]/20">
                  -{numericDiscount}%
                </span>
              )}

              <button
                type="button"
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
                  isWishlisted
                    ? "border-[#00E5FF]/60 bg-[#00E5FF]/15 text-[#00E5FF]"
                    : "border-white/10 bg-black/40 text-gray-400 hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                }`}
              >
                <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
              </button>

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[320px] max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-xs uppercase tracking-[0.2em] text-gray-600">
                  NexaTech Specimen
                </div>
              )}
            </div>

            {/* Right: Focused Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
                    {product.category || "Electronics"}
                  </span>
                  {product.brand && (
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {product.brand}
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {product.name}
                </h2>

                {/* Star rating */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#00E5FF]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= Math.round(product.rating || 5) ? "currentColor" : "none"}
                        className={s <= Math.round(product.rating || 5) ? "text-[#00E5FF]" : "text-gray-700"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    {product.rating || "5.0"} ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#00E5FF] tracking-tight">
                    Rs. {currentPrice.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {numericDiscount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      Rs. {originalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOutOfStock ? "bg-red-500" : "bg-emerald-400 animate-pulse"
                    }`}
                  />
                  <span className={isOutOfStock ? "text-red-400" : "text-emerald-400 font-medium"}>
                    {isOutOfStock ? "Out of Stock" : `In Stock (${stock} units available)`}
                  </span>
                </div>

                {/* Description Snippet */}
                {product.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Action Controls */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Quantity:
                  </span>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                      disabled={quantity >= maxQty || isOutOfStock}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Buttons Row */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-xs font-bold uppercase tracking-wider text-[#00E5FF] backdrop-blur-md transition-all duration-200 hover:border-[#00E5FF] hover:bg-[#00E5FF]/20 active:scale-[0.98] disabled:opacity-40"
                  >
                    {added ? (
                      <>
                        <Check size={16} className="text-emerald-400" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00E5FF] text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-200 hover:bg-[#33ebff] active:scale-[0.98] disabled:opacity-40"
                  >
                    <Zap size={16} className="fill-black" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* View Full Product Page Link */}
                <div className="pt-2 text-center">
                  <Link
                    to={`/products/${product._id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-[#00E5FF]"
                  >
                    <span>View Full Product Details & Customer Reviews</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
