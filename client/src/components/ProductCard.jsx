import {
  ShoppingCart,
  Heart,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCart,
  saveCart,
} from "../utils/cartStorage";

function ProductCard({
  id,
  name = "Premium Device",
  category = "Electronics",
  price = 0,
  oldPrice,
  discount = 0,
  image,
  rating = 0,
  reviews = 0,
  stock = 0,
  brand = "",
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const numericPrice = (() => {
    if (typeof price === "number") return Math.max(price, 0);

    const parsed = Number(
      String(price)
        .replace(/Rs\./gi, "")
        .replace(/[$,]/g, "")
        .trim()
    );

    return Number.isFinite(parsed)
      ? Math.max(parsed, 0)
      : 0;
  })();

  const numericDiscount = Math.min(
    Math.max(Number(discount || 0), 0),
    100
  );

  const originalPrice = numericPrice;

  const currentPrice =
    numericDiscount > 0 && numericDiscount < 100
      ? Number(
          (
            originalPrice *
            (1 - numericDiscount / 100)
          ).toFixed(2)
        )
      : originalPrice;

  const numericRating = Math.min(
    Math.max(Number(rating || 0), 0),
    5
  );

  const numericReviews = Math.max(
    Number(reviews || 0),
    0
  );

  const numericStock = Math.max(
    Number(stock || 0),
    0
  );

  const displayPrice = `Rs. ${currentPrice.toFixed(2)}`;

  const displayOldPrice =
    oldPrice ||
    (numericDiscount > 0
      ? `Rs. ${originalPrice.toFixed(2)}`
      : null);

  useEffect(() => {
    const checkWishlist = async () => {
      const token =
        localStorage.getItem("nexatech_token");

      if (!token || !id) return;

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setIsWishlisted(
          (data.wishlist || []).some(
            (item) =>
              String(item?._id || item) ===
              String(id)
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    checkWishlist();
  }, [id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token =
      localStorage.getItem("nexatech_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/auth/wishlist/${id}`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message);

      setIsWishlisted(!isWishlisted);

      const saved =
        localStorage.getItem("nexatech_user");

      if (saved) {
        const user = JSON.parse(saved);

        user.wishlist = data.wishlist || [];

        localStorage.setItem(
          "nexatech_user",
          JSON.stringify(user)
        );
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token =
      localStorage.getItem("nexatech_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (numericStock <= 0) {
      setCartMessage("Out of stock.");

      setTimeout(
        () => setCartMessage(""),
        2500
      );

      return;
    }

    const cart = getCart();

    const index = cart.findIndex(
      (item) => String(item._id) === String(id)
    );

    if (index !== -1) {
      const qty = Number(
        cart[index].quantity || 1
      );

      if (qty >= numericStock) {
        setCartMessage(
          "Maximum available stock already added."
        );

        setTimeout(
          () => setCartMessage(""),
          2500
        );

        return;
      }

      cart[index] = {
        ...cart[index],
        quantity: qty + 1,
        price: currentPrice,
        originalPrice,
        discount: numericDiscount,
        stock: numericStock,
        name,
        image,
        brand,
        category,
      };
    } else {
      cart.push({
        _id: id,
        name,
        price: currentPrice,
        originalPrice,
        discount: numericDiscount,
        image,
        brand,
        category,
        stock: numericStock,
        quantity: 1,
      });
    }

    saveCart(cart);

    setCartMessage(`${name} added to your cart.`);

    setTimeout(
      () => setCartMessage(""),
      2500
    );
  };

  const renderRatingStars = () =>
    [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={13}
        fill={
          star <= Math.round(numericRating)
            ? "currentColor"
            : "transparent"
        }
        className={
          star <= Math.round(numericRating)
            ? "text-[#00E5FF]"
            : "text-gray-700"
        }
      />
    ));
      return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden border border-white/10 bg-[#090909]"
    >
      {numericDiscount > 0 && (
        <span className="absolute left-3 top-3 z-10 bg-[#00E5FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black">
          -{numericDiscount}%
        </span>
      )}

      <button
        type="button"
        onClick={handleWishlist}
        disabled={wishlistLoading}
        aria-label={
          isWishlisted
            ? `Remove ${name} from wishlist`
            : `Add ${name} to wishlist`
        }
        className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border transition ${
          isWishlisted
            ? "border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF]"
            : "border-white/10 bg-[#050505]/80 text-gray-500 hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
        } ${wishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <Heart
          size={15}
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </button>

      <Link to={`/products/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-white/[0.02]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-700">
                NexaTech
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
            {category}
          </p>

          {brand && (
            <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-600">
              {brand}
            </p>
          )}

          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-white">
            {name}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderRatingStars()}
            </div>

            <span className="text-xs text-gray-400">
              {numericRating > 0
                ? numericRating.toFixed(1)
                : "No rating"}
            </span>

            <span className="text-[10px] text-gray-700">
              ({numericReviews})
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-white">
                {displayPrice}
              </p>

              {displayOldPrice && (
                <p className="mt-1 text-xs text-gray-600 line-through">
                  {displayOldPrice}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={numericStock <= 0}
              aria-label={
                numericStock > 0
                  ? `Add ${name} to cart`
                  : `${name} is out of stock`
              }
              className={`flex h-10 w-10 items-center justify-center border transition ${
                numericStock <= 0
                  ? "cursor-not-allowed border-white/5 text-gray-700"
                  : "border-white/10 text-gray-500 hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
              }`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>

          {numericDiscount > 0 && (
            <p className="mt-2 text-[10px] text-green-400">
              Save Rs.{" "}
              {Math.max(
                originalPrice - currentPrice,
                0
              ).toFixed(2)}
            </p>
          )}

          <div className="mt-3">
            {numericStock > 0 ? (
              <p className="text-[10px] text-green-500">
                {numericStock <= 5
                  ? `Only ${numericStock} left`
                  : "In Stock"}
              </p>
            ) : (
              <p className="text-[10px] text-red-500">
                Out of Stock
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600 transition group-hover:text-[#00E5FF]">
            View Product

            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </Link>

      {cartMessage && (
        <div className="absolute bottom-3 left-3 right-3 z-30 rounded-lg border border-[#00E5FF]/20 bg-[#050505]/95 px-3 py-2 text-center text-[10px] font-medium text-[#00E5FF] shadow-lg">
          {cartMessage}
        </div>
      )}
    </motion.article>
  );
}

export default ProductCard;