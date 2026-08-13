import { ShoppingCart, Heart, Star } from "lucide-react";
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-200/60"
    >
      {/* Discount */}
      {discount && (
        <span className="absolute left-3 top-3 z-10 rounded bg-cyan-500 px-2.5 py-1 text-[10px] font-bold text-white">
          {discount}
        </span>
      )}

      {/* Wishlist */}
      <button
        type="button"
        aria-label={`Add ${name} to wishlist`}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-red-200 hover:text-red-500"
      >
        <Heart size={16} />
      </button>

      {/* Product Image */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition duration-500 group-hover:scale-105">
            <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-200 via-gray-100 to-cyan-100" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          {category}
        </p>

        <h3 className="mt-2 min-h-[40px] line-clamp-2 text-sm font-bold leading-5 text-gray-900 transition group-hover:text-cyan-600">
          {name}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={13}
                className={
                  index < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          {reviews > 0 && (
            <span className="ml-1 text-[10px] text-gray-400">
              ({reviews})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <span className="block text-lg font-black text-gray-900">
              {price}
            </span>

            {oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {oldPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={`Add ${name} to cart`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-cyan-500"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;