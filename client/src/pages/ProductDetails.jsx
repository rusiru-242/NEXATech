import {
  ArrowLeft,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==============================
  // Load Product
  // ==============================
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load product."
          );
        }

        setProduct(data.product);

        // Check wishlist
        const token = localStorage.getItem(
          "nexatech_token"
        );

        if (token) {
          const wishlistResponse = await fetch(
            "http://localhost:5000/api/auth/wishlist",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const wishlistData =
            await wishlistResponse.json();

          if (wishlistResponse.ok) {
            const exists = (
              wishlistData.wishlist || []
            ).some(
              (item) =>
                item._id === id ||
                item === id
            );

            setIsWishlisted(exists);
          }
        }
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          err.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  // ==============================
  // Wishlist
  // ==============================
  const handleWishlist = async () => {
    const token = localStorage.getItem(
      "nexatech_token"
    );

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setWishlistLoading(true);
      setMessage("");
      setError("");

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

      setMessage(
        isWishlisted
          ? "Removed from wishlist."
          : "Added to wishlist."
      );

      // Update local user cache
      const savedUser =
        localStorage.getItem(
          "nexatech_user"
        );

      if (savedUser) {
        const user = JSON.parse(savedUser);

        user.wishlist =
          data.wishlist || [];

        localStorage.setItem(
          "nexatech_user",
          JSON.stringify(user)
        );
      }
    } catch (err) {
      console.error(
        "Wishlist error:",
        err
      );

      setError(
        err.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Loading Product...
        </p>
      </div>
    );
  }

  // ==============================
  // Error
  // ==============================
  if (error && !product) {
    return (
      <div className="min-h-screen bg-[#050505] px-5 pt-28 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#00E5FF]"
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>

          <div className="mt-10 border border-red-500/20 bg-red-500/5 p-8">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // Page
  // ==============================
  return (
    <div className="min-h-screen bg-[#050505] px-5 pb-20 pt-28 text-white">

      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#00E5FF]"
        >
          <ArrowLeft size={14} />
          Back to Products
        </Link>

        {/* Messages */}
        {message && (
          <div className="mb-6 border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-4 py-3 text-sm text-[#00E5FF]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ==============================
              IMAGE
          ============================== */}
          <div className="aspect-square overflow-hidden border border-white/10 bg-[#090909]">

            {product?.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingCart
                  size={40}
                  className="text-gray-700"
                />
              </div>
            )}

          </div>

          {/* ==============================
              DETAILS
          ============================== */}
          <div className="flex flex-col justify-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00E5FF]">
              NEXATECH PRODUCT
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              {product?.name}
            </h1>

            {/* Price */}
            {product?.price !== undefined && (
              <p className="mt-6 text-2xl font-bold">
                ${Number(product.price).toFixed(2)}
              </p>
            )}

            {/* Description */}
            {product?.description && (
              <p className="mt-6 text-sm leading-7 text-gray-500">
                {product.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">

              <button
                type="button"
                disabled={wishlistLoading}
                onClick={handleWishlist}
                className={`flex h-12 flex-1 items-center justify-center gap-2 border text-sm font-semibold transition ${
                  isWishlisted
                    ? "border-[#00E5FF] bg-[#00E5FF] text-black"
                    : "border-white/10 text-gray-300 hover:border-[#00E5FF] hover:text-[#00E5FF]"
                }`}
              >
                <Heart
                  size={17}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />

                {wishlistLoading
                  ? "Updating..."
                  : isWishlisted
                  ? "Wishlisted"
                  : "Add to Wishlist"}
              </button>

              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center gap-2 bg-[#00E5FF] text-sm font-bold text-black transition hover:bg-white"
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;