import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCart, saveCart } from "../utils/cartStorage";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [cartMessage, setCartMessage] = useState("");

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product.");
        }

        setProduct(data.product || data);
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
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/reviews/product/${id}`
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
  }, [id]);

  // =========================================================
  // WISHLIST
  // =========================================================

  useEffect(() => {
    const wishlist = JSON.parse(
      localStorage.getItem("nexatech_wishlist") || "[]"
    );

    const exists = wishlist.some(
      (item) => String(item._id) === String(id)
    );

    setIsWishlisted(exists);
  }, [id]);

  const handleWishlist = () => {
    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!product) return;

    const wishlist = JSON.parse(
      localStorage.getItem("nexatech_wishlist") || "[]"
    );

    if (isWishlisted) {
      const updatedWishlist = wishlist.filter(
        (item) => String(item._id) !== String(product._id)
      );

      localStorage.setItem(
        "nexatech_wishlist",
        JSON.stringify(updatedWishlist)
      );

      setIsWishlisted(false);
    } else {
      wishlist.push(product);

      localStorage.setItem(
        "nexatech_wishlist",
        JSON.stringify(wishlist)
      );

      setIsWishlisted(true);
    }
  };

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
        "http://localhost:5000/api/reviews",
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
  <div className="min-h-screen bg-[#050505] text-white">
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* BACK */}
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#00E5FF]"
      >
        <ArrowLeft size={17} />
        Back to Products
      </Link>

      {/* PRODUCT */}
      <section className="grid gap-10 lg:grid-cols-2">
        {/* IMAGE */}
        <div className="relative flex min-h-[450px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          {discountPercentage > 0 && (
            <div className="absolute left-5 top-5 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
              -{discountPercentage}%
            </div>
          )}

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[420px] max-w-full object-contain"
            />
          ) : (
            <div className="text-gray-600">No Image Available</div>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {product.category && (
              <span className="rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3 py-1 text-xs font-medium text-[#00E5FF]">
                {product.category}
              </span>
            )}

            {product.brand && (
              <span className="text-sm text-gray-500">
                {product.brand}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star)=>(
                <Star
                  key={star}
                  size={18}
                  fill={star <= Math.round(averageRating) ? "currentColor" : "transparent"}
                  className={star <= Math.round(averageRating)
                    ? "text-[#00E5FF]"
                    : "text-gray-600"}
                />
              ))}
            </div>

            <span className="text-sm font-medium text-gray-300">
              {averageRating > 0 ? averageRating.toFixed(1) : "No rating"}
            </span>

            <span className="text-sm text-gray-600">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-7 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-[#00E5FF]">
              Rs. {discountedPrice.toFixed(2)}
            </span>

            {discountPercentage > 0 && (
              <>
                <span className="mb-1 text-lg text-gray-500 line-through">
                  Rs. {originalPrice.toFixed(2)}
                </span>

                <span className="mb-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400">
                  Save {discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="mt-6 leading-7 text-gray-400">
            {product.description || "No description available for this product."}
          </p>

          {/* EXTRA INFO */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {product.brand && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-gray-600">Brand</p>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  {product.brand}
                </p>
              </div>
            )}

            {product.category && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-gray-600">Category</p>
                <p className="mt-1 text-sm font-medium text-gray-300">
                  {product.category}
                </p>
              </div>
            )}
          </div>

          {/* STOCK */}
          <div className="mt-6">
            {product.stock > 0 ? (
              <p className="text-sm text-green-400">
                ✓ In Stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-sm text-red-400">
                ✕ Out of Stock
              </p>
            )}
          </div>

          {/* QUANTITY */}
          {product.stock > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-medium text-gray-300">
                Quantity
              </p>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center rounded-l-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={17}/>
                </button>

                <div className="flex h-11 w-14 items-center justify-center border-y border-white/10 bg-white/[0.02] font-semibold">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="flex h-11 w-11 items-center justify-center rounded-r-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={17}/>
                </button>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-5 py-4 font-semibold text-[#00E5FF] transition hover:bg-[#00E5FF]/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart size={19}/>
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-4 font-semibold text-black transition hover:bg-[#00cce6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Zap size={19}/>
              Buy Now
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              className={`flex h-[56px] items-center justify-center rounded-xl border px-5 transition ${
                isWishlisted
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <Heart
                size={21}
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

        {/* REVIEW FORM */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-xl font-semibold">
            Write a Review
          </h3>

          <form onSubmit={handleSubmitReview} className="mt-6">
            <div>
              <p className="mb-3 text-sm text-gray-400">Rating</p>

              <div className="flex gap-1">
                {[1,2,3,4,5].map((star)=>(
                  <button
                    key={star}
                    type="button"
                    onClick={()=>setReviewRating(star)}
                  >
                    <Star
                      size={25}
                      fill={star <= reviewRating ? "currentColor" : "transparent"}
                      className={star <= reviewRating
                        ? "text-[#00E5FF]"
                        : "text-gray-600"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={reviewComment}
              onChange={(e)=>setReviewComment(e.target.value)}
              placeholder="Write your review..."
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

        {/* EXISTING REVIEWS */}
        <div className="mt-8 space-y-4">
          {reviewLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-gray-500">
                No approved reviews yet.
              </p>
            </div>
          ) : (
            reviews.map((review)=>(
              <div
                key={review._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
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
  </div>
);
}

export default ProductDetails;