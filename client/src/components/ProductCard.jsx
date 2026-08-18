import {
  ShoppingCart,
  Heart,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function ProductCard({
  id,
  name = "Premium Device",
  category = "Electronics",
  price = "Rs. 0",
  oldPrice,
  discount,
  image,
  rating = 5,
  reviews = 0,
}) {
  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  // =====================================================
  // CHECK WISHLIST STATUS
  // =====================================================

  useEffect(() => {
    const checkWishlist = async () => {
      const token =
        localStorage.getItem("nexatech_token");

      if (!token || !id) {
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/wishlist",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const wishlist =
          data.wishlist || [];

        const exists = wishlist.some(
          (item) =>
            String(item?._id || item) ===
            String(id)
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error(
          "Wishlist status error:",
          error
        );
      }
    };

    checkWishlist();
  }, [id]);

  // =====================================================
  // WISHLIST TOGGLE
  // =====================================================

  const handleWishlist = async (event) => {
    // Prevent parent Link navigation
    event.preventDefault();
    event.stopPropagation();

    const token =
      localStorage.getItem("nexatech_token");

    // User not logged in
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!id || wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);

      const method = isWishlisted
        ? "DELETE"
        : "POST";

      const response = await fetch(
        `http://localhost:5000/api/auth/wishlist/${id}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update wishlist."
        );
      }

      setIsWishlisted(!isWishlisted);

      // =================================================
      // UPDATE SAVED USER
      // =================================================

      const savedUser =
        localStorage.getItem("nexatech_user");

      if (savedUser) {
        try {
          const user =
            JSON.parse(savedUser);

          user.wishlist =
            data.wishlist || [];

          localStorage.setItem(
            "nexatech_user",
            JSON.stringify(user)
          );
        } catch (error) {
          console.error(
            "User cache update error:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "Wishlist update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.article
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group relative overflow-hidden border border-white/10 bg-[#090909]"
    >
      {/* =================================================
          DISCOUNT
      ================================================= */}

      {discount && (
        <span className="absolute left-3 top-3 z-10 bg-[#00E5FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black">
          -{discount}%
        </span>
      )}

      {/* =================================================
          WISHLIST
      ================================================= */}

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
        } ${
          wishlistLoading
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <Heart
          size={15}
          fill={
            isWishlisted
              ? "currentColor"
              : "none"
          }
        />
      </button>

      {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

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

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <div className="p-5">

        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF]">
          {category}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-white">
          {name}
        </h3>

        {/* Rating */}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star
              size={13}
              className="fill-[#00E5FF] text-[#00E5FF]"
            />

            <span className="text-xs text-gray-400">
              {Number(rating).toFixed(1)}
            </span>
          </div>

          <span className="text-[10px] text-gray-700">
            ({reviews})
          </span>
        </div>

        {/* Price */}

        <div className="mt-4 flex items-end justify-between gap-3">

          <div>
            <p className="text-lg font-bold text-white">
              {price}
            </p>

            {oldPrice && (
              <p className="mt-1 text-xs text-gray-600 line-through">
                {oldPrice}
              </p>
            )}
          </div>

          {/* Cart */}

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            aria-label={`Add ${name} to cart`}
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
          >
            <ShoppingCart size={16} />
          </button>

        </div>

        {/* View Product */}

        <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600 transition group-hover:text-[#00E5FF]">
          View Product
          <ArrowUpRight
            size={13}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>

      </div>
    </motion.article>
  );
}

export default ProductCard;