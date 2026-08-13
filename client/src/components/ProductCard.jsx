import { ShoppingCart, Heart, Star, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

function ProductCard({
  name = "Premium Device",
  category = "Electronics",
  price = "Rs. 0",
  oldPrice,
  discount,
  image,
  rating = 5,
  reviews = 0,
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden border border-white/10 bg-[#0a0a0a]"
    >
      {/* Discount */}

      {discount && (
        <span className="absolute left-4 top-4 z-20 border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#00e5ff]">
          {discount}
        </span>
      )}

      {/* Wishlist */}

      <button
        type="button"
        aria-label={`Add ${name} to wishlist`}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border border-white/10 bg-black/40 text-gray-500 backdrop-blur-sm transition duration-300 hover:border-white/30 hover:text-white"
      >
        <Heart size={15} />
      </button>

      {/* Product Image */}

      <div className="relative flex h-64 items-center justify-center overflow-hidden border-b border-white/10 bg-[#0d0d0d]">

        {/* Glow */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e5ff]/[0.04] blur-[70px] transition duration-500 group-hover:bg-[#00e5ff]/[0.09]" />

        {image ? (
          <img
            src={image}
            alt={name}
            className="relative z-10 h-full w-full object-contain p-8 transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="relative z-10 flex h-36 w-36 items-center justify-center border border-white/10 bg-[#111111] transition duration-500 group-hover:scale-105">
            <div className="h-20 w-20 border border-[#00e5ff]/20 bg-gradient-to-br from-white/10 via-white/[0.02] to-[#00e5ff]/10" />
          </div>
        )}

        {/* View Product */}

        <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 border border-white/20 bg-black/80 py-3 text-xs font-semibold text-white backdrop-blur-md transition hover:border-[#00e5ff] hover:text-[#00e5ff]"
          >
            View Product
            <ArrowUpRight size={14} />
          </button>

        </div>
      </div>

      {/* Product Details */}

      <div className="p-5">

        {/* Category */}

        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-600 transition group-hover:text-[#00e5ff]">
          {category}
        </p>

        {/* Name */}

        <h3 className="mt-3 min-h-[48px] line-clamp-2 text-base font-semibold leading-6 tracking-[-0.025em] text-gray-200 transition group-hover:text-white">
          {name}
        </h3>

        {/* Rating */}

        <div className="mt-4 flex items-center gap-2">

          <div className="flex gap-0.5">

            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={12}
                className={
                  index < rating
                    ? "fill-[#00e5ff] text-[#00e5ff]"
                    : "text-gray-700"
                }
              />
            ))}

          </div>

          {reviews > 0 && (
            <span className="text-[10px] text-gray-600">
              ({reviews})
            </span>
          )}

        </div>

        {/* Bottom */}

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">

          <div>

            <span className="block text-lg font-bold tracking-[-0.03em] text-white">
              {price}
            </span>

            {oldPrice && (
              <span className="mt-1 block text-xs text-gray-600 line-through">
                {oldPrice}
              </span>
            )}

          </div>

          {/* Add Cart */}

          <button
            type="button"
            aria-label={`Add ${name} to cart`}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white text-black transition duration-300 hover:border-[#00e5ff] hover:bg-[#00e5ff]"
          >
            <ShoppingCart size={16} />
          </button>

        </div>

      </div>
    </motion.article>
  );
}

export default ProductCard;