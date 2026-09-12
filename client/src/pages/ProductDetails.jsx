import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Zap,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCart, saveCart } from "../utils/cartStorage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CyanLinesBackground from "../components/ui/CyanLinesBackground";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Verified buyer review eligibility
  const [reviewEligibility, setReviewEligibility] = useState({
    loading: true,
    canReview: false,
    hasPurchased: false,
    hasReviewed: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [cartMessage, setCartMessage] = useState("");

  const activeId = product?._id || id;

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product.");
        }

        const fetchedProduct = data.product || data;
        setProduct(fetchedProduct);

        // If URL id was an alias, update browser URL bar without reloading
        if (fetchedProduct?._id && String(fetchedProduct._id) !== String(id)) {
          window.history.replaceState(null, "", `/products/${fetchedProduct._id}`);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  useEffect(() => {
    if (!activeId) return;

    const fetchReviews = async () => {
      try {
        setReviewLoading(true);

        const response = await fetch(
          `${API_URL}/api/reviews/product/${activeId}`
        );

        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Review fetch error:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [activeId]);

  // =========================================================
  // WISHLIST (CONNECTED TO BACKEND DATABASE)
  // =========================================================

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("nexatech_token");
      if (!token || !activeId) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = await response.json();
        setIsWishlisted(
          (data.wishlist || []).some(
            (item) => String(item?._id || item) === String(activeId)
          )
        );
      } catch (err) {
        console.error("Check wishlist error:", err);
      }
    };

    checkWishlist();

    const onWishlistUpdate = () => checkWishlist();
    window.addEventListener("wishlistUpdated", onWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", onWishlistUpdate);
  }, [activeId]);

  const handleWishlist = async () => {
    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!product || wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const targetId = product._id || id;
      const response = await fetch(
        `${API_URL}/api/auth/wishlist/${targetId}`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update wishlist.");
      }

      setIsWishlisted(!isWishlisted);

      const saved = localStorage.getItem("nexatech_user");
      if (saved) {
        const user = JSON.parse(saved);
        user.wishlist = data.wishlist || [];
        localStorage.setItem("nexatech_user", JSON.stringify(user));
      }

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================================================
  // REVIEW ELIGIBILITY (VERIFIED PURCHASER CHECK)
  // =========================================================

  useEffect(() => {
    const checkReviewEligibility = async () => {
      const token = localStorage.getItem("nexatech_token");
      if (!token || !activeId) {
        setIsLoggedIn(false);
        setReviewEligibility({
          loading: false,
          canReview: false,
          hasPurchased: false,
          hasReviewed: false,
        });
        return;
      }

      setIsLoggedIn(true);

      try {
        const response = await fetch(
          `${API_URL}/api/reviews/can-review/${activeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setReviewEligibility({
            loading: false,
            canReview: Boolean(data.canReview),
            hasPurchased: Boolean(data.hasPurchased),
            hasReviewed: Boolean(data.hasReviewed),
          });
        } else {
          setReviewEligibility((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error("Error checking review eligibility:", err);
        setReviewEligibility((prev) => ({ ...prev, loading: false }));
      }
    };

    checkReviewEligibility();
  }, [activeId]);

  // =========================================================
  // PRICE
  // =========================================================

  const originalPrice = Number(product?.price || 0);

  const discountPercentage = Math.min(
    Math.max(Number(product?.discount || 0), 0),
    100
  );

  const discountedPrice =
    discountPercentage > 0
      ? originalPrice -
        (originalPrice * discountPercentage) / 100
      : originalPrice;

  // =========================================================
  // QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    if (!product) return;

    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // =========================================================
  // CREATE CART ITEM
  // =========================================================

  const createCartItem = () => ({
    _id: product._id,
    name: product.name,
    price: discountedPrice,
    originalPrice,
    discount: discountPercentage,
    image: product.image || "",
    brand: product.brand || "",
    category: product.category || "",
    stock: product.stock || 0,
    quantity,
  });

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = () => {
    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!product) return;

    if (product.stock <= 0) {
      setCartMessage("This product is currently out of stock.");
      return;
    }

    const cart = getCart();

    const existingItemIndex = cart.findIndex(
      (item) => String(item._id) === String(product._id)
    );

    if (existingItemIndex !== -1) {
      const currentQuantity = Number(
        cart[existingItemIndex].quantity || 1
      );

      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity: Math.min(
          currentQuantity + quantity,
          product.stock
        ),
        price: discountedPrice,
        originalPrice,
        discount: discountPercentage,
        stock: product.stock,
        name: product.name,
        image: product.image || "",
        brand: product.brand || "",
        category: product.category || "",
      };
    } else {
      cart.push(createCartItem());
    }

    saveCart(cart);

    setCartMessage(`${product.name} added to your cart.`);

    setTimeout(() => setCartMessage(""), 3000);
  };

  // =========================================================
  // BUY NOW
  // =========================================================

  const handleBuyNow = () => {
    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!product) return;

    if (product.stock <= 0) {
      setCartMessage("This product is currently out of stock.");
      return;
    }

    const cart = getCart();

    const existingItemIndex = cart.findIndex(
      (item) => String(item._id) === String(product._id)
    );

    if (existingItemIndex !== -1) {
      const currentQuantity = Number(
        cart[existingItemIndex].quantity || 1
      );

      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity: Math.min(
          currentQuantity + quantity,
          product.stock
        ),
        price: discountedPrice,
        originalPrice,
        discount: discountPercentage,
        stock: product.stock,
        name: product.name,
        image: product.image || "",
        brand: product.brand || "",
        category: product.category || "",
      };
    } else {
      cart.push(createCartItem());
    }

    saveCart(cart);

    navigate("/checkout");
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewMessage("");
    setReviewError("");

    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      setReviewError("Please login to submit a review.");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please enter your review comment.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product: product._id,
            rating: Number(reviewRating),
            comment: reviewComment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit review."
        );
      }

      setReviewMessage(
        "Review submitted successfully. Waiting for admin approval."
      );

      setReviewEligibility({
        loading: false,
        canReview: false,
        hasPurchased: true,
        hasReviewed: true,
      });

      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error("Review submit error:", error);

      setReviewError(
        error.message || "Failed to submit review."
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#00E5FF] border-t-transparent" />
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            The product you are looking for does not exist.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-3 font-semibold text-black"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // RATING
  // =========================================================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + Number(review.rating),
          0
        ) / reviews.length
      : Number(product.rating || 0);

  const reviewCount =
    reviews.length > 0
      ? reviews.length
      : Number(product.reviews || 0);

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <CyanLinesBackground />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-2 pb-10 lg:pt-3 lg:pb-12">
        {/* BACK */}
        <Link
          to="/products"
          className="mb-3.5 inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 transition hover:text-[#00E5FF]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* PRODUCT FOCUSED GLASS CONTAINER */}
        <section className="grid gap-6 lg:gap-8 lg:grid-cols-2 rounded-3xl border border-white/15 bg-black/45 backdrop-blur-2xl p-4 sm:p-6 lg:p-7 shadow-[0_0_80px_rgba(0,229,255,0.12)]">
          {/* IMAGE */}
          <div className="relative flex min-h-[300px] sm:min-h-[360px] lg:h-full lg:max-h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 sm:p-6">
            {discountPercentage > 0 && (
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                -{discountPercentage}%
              </div>
            )}

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[280px] sm:max-h-[340px] lg:max-h-[420px] max-w-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div className="text-gray-600">No Image Available</div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              {product.category && (
                <span className="rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2.5 py-0.5 text-xs font-medium text-[#00E5FF]">
                  {product.category}
                </span>
              )}

              {product.brand && (
                <span className="text-xs font-medium text-gray-500">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= Math.round(averageRating) ? "currentColor" : "transparent"}
                    className={
                      star <= Math.round(averageRating)
                        ? "text-[#00E5FF]"
                        : "text-gray-600"
                    }
                  />
                ))}
              </div>

              <span className="text-xs font-medium text-gray-300">
                {averageRating > 0 ? averageRating.toFixed(1) : "No rating"}
              </span>

              <span className="text-xs text-gray-600">
                ({reviewCount} reviews)
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-3.5 flex flex-wrap items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-bold text-[#00E5FF]">
                Rs. {discountedPrice.toFixed(2)}
              </span>

              {discountPercentage > 0 && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    Rs. {originalPrice.toFixed(2)}
                  </span>

                  <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-400">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-400 line-clamp-3 lg:line-clamp-4">
              {product.description || "No description available for this product."}
            </p>

            {/* EXTRA INFO */}
            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              {product.brand && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Brand</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-medium text-gray-200 truncate">
                    {product.brand}
                  </p>
                </div>
              )}

              {product.category && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Category</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-medium text-gray-200 truncate">
                    {product.category}
                  </p>
                </div>
              )}
            </div>

            {/* STOCK */}
            <div className="mt-3 flex items-center gap-2">
              {product.stock > 0 ? (
                <p className="text-xs font-medium text-green-400">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-xs font-medium text-red-400">
                  ✕ Out of Stock
                </p>
              )}
            </div>

            {/* QUANTITY */}
            {product.stock > 0 && (
              <div className="mt-3.5">
                <p className="mb-1.5 text-xs font-medium text-gray-300">
                  Quantity
                </p>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-l-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={15} />
                  </button>

                  <div className="flex h-9 w-12 items-center justify-center border-y border-white/10 bg-white/[0.02] text-xs font-semibold">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="flex h-9 w-9 items-center justify-center rounded-r-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 text-xs font-bold text-[#00E5FF] transition hover:bg-[#00E5FF]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-4 text-xs font-bold text-black transition hover:bg-[#00cce6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap size={16} />
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                disabled={wishlistLoading}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                  isWishlisted
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                } ${wishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

          {cartMessage && (
            <div className="mt-4 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-4 py-3 text-sm text-[#00E5FF]">
              {cartMessage}
            </div>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mt-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00E5FF]">
            Customer Reviews
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            What customers say
          </h2>
        </div>

        {/* REVIEW FORM / VERIFIED BUYER GATE */}
        {!isLoggedIn ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-center shadow-xl">
            <Lock className="mx-auto mb-3 text-gray-500" size={32} />
            <h4 className="text-lg font-semibold text-white">Verified Customer Reviews</h4>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
              Only verified buyers who have purchased this product can leave a review. Please sign in to check your purchase eligibility.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#00E5FF] px-6 py-2.5 text-xs font-bold text-black transition hover:bg-[#00cce6]"
            >
              Sign In to Review
            </button>
          </div>
        ) : reviewEligibility.loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-gray-500 shadow-xl">
            <Loader2 className="mr-2 animate-spin text-[#00E5FF]" size={18} />
            <span className="text-sm">Checking purchase verification...</span>
          </div>
        ) : reviewEligibility.hasReviewed ? (
          <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 backdrop-blur-xl p-6 text-center shadow-xl">
            <CheckCircle2 className="mx-auto mb-2 text-[#00E5FF]" size={30} />
            <h4 className="text-base font-semibold text-white">Review Already Submitted</h4>
            <p className="mt-1 text-xs text-gray-400">
              You have already reviewed this product. Thank you for helping the NexaTech community!
            </p>
          </div>
        ) : !reviewEligibility.hasPurchased ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-center shadow-xl">
            <ShieldCheck className="mx-auto mb-3 text-gray-500" size={34} />
            <h4 className="text-lg font-semibold text-white">Verified Purchase Required</h4>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
              To ensure authentic feedback, only customers who have purchased this product can submit a review.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">Write a Review</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3 py-1 text-[11px] font-semibold text-[#00E5FF]">
                <ShieldCheck size={14} />
                Verified Buyer
              </span>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-6">
              <div>
                <p className="mb-3 text-sm text-gray-400">Rating</p>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                    >
                      <Star
                        size={25}
                        fill={
                          star <= reviewRating ? "currentColor" : "transparent"
                        }
                        className={
                          star <= reviewRating
                            ? "text-[#00E5FF]"
                            : "text-gray-600"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review as a verified buyer..."
                rows={4}
                maxLength={1000}
                className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#00E5FF]/40"
              />

              <button
                type="submit"
                className="mt-4 rounded-xl bg-[#00E5FF] px-6 py-3 font-semibold text-black transition hover:bg-[#00cce6]"
              >
                Submit Review
              </button>
            </form>

            {reviewMessage && (
              <p className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
                {reviewMessage}
              </p>
            )}

            {reviewError && (
              <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {reviewError}
              </p>
            )}
          </div>
        )}

        {/* EXISTING REVIEWS */}
        <div className="mt-8 space-y-4">
          {reviewLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-8 text-center">
              <p className="text-gray-500">
                No approved reviews yet.
              </p>
            </div>
          ) : (
            reviews.map((review)=>(
              <div
                key={review._id}
                className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {review.user?.name || "Customer"}
                    </p>

                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4,5].map((star)=>(
                        <Star
                          key={star}
                          size={15}
                          fill={star <= Number(review.rating)
                            ? "currentColor"
                            : "transparent"}
                          className={star <= Number(review.rating)
                            ? "text-[#00E5FF]"
                            : "text-gray-600"}
                        />
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-gray-600">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-gray-400">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);
}

export default ProductDetails;