import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // Load Wishlist
  // ==============================
  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem("nexatech_token");

      if (!token) {
        navigate("/login");
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load wishlist."
          );
        }

        setWishlist(data.wishlist || []);
      } catch (err) {
        console.error("Wishlist error:", err);

        if (err instanceof TypeError) {
          setError(
            "Unable to connect to the server. Please make sure the backend is running on port 5000."
          );
        } else {
          setError(
            err.message || "Unable to load wishlist."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [navigate]);

  // ==============================
  // Remove Wishlist Item
  // ==============================
  const handleRemove = async (productId) => {
    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to remove item."
        );
      }

      setWishlist(data.wishlist || []);

      // Update cached user
      const savedUser = localStorage.getItem("nexatech_user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        user.wishlist = data.wishlist || [];

        localStorage.setItem(
          "nexatech_user",
          JSON.stringify(user)
        );
      }
    } catch (err) {
      console.error("Remove wishlist error:", err);

      setError(
        err.message || "Unable to remove wishlist item."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Loading Wishlist...
        </p>
      </div>
    );
  }

  // ==============================
  // Page
  // ==============================
  return (
    <div className="min-h-screen bg-[#050505] px-5 pb-20 pt-28 text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/account"
            className="mb-6 inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#00E5FF]"
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00E5FF]">
            SAVED ITEMS
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">
            My
            <span className="text-gray-600"> Wishlist.</span>
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Products you have saved for later.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ==============================
            EMPTY WISHLIST
        ============================== */}
        {wishlist.length === 0 ? (
          <div className="border border-white/10 bg-[#090909] px-6 py-16 text-center sm:px-10">

            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-white/10 bg-white/[0.02]">
              <Heart
                size={26}
                className="text-gray-600"
              />
            </div>

            <h2 className="mt-6 text-xl font-bold">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
              You haven't saved any products yet.
              Browse our products and add your favourites
              to your wishlist.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex h-11 items-center gap-2 bg-[#00E5FF] px-6 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white"
            >
              <ShoppingBag size={15} />
              Browse Products
            </Link>

          </div>
        ) : (

          /* ==============================
             WISHLIST PRODUCTS
          ============================== */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {wishlist.map((product) => (
              <div
                key={product._id}
                className="group overflow-hidden border border-white/10 bg-[#090909] transition hover:border-[#00E5FF]/40"
              >

                {/* Product Image */}
                <Link
                  to={`/products/${product._id}`}
                  className="block aspect-square overflow-hidden bg-white/[0.02]"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag
                        size={32}
                        className="text-gray-700"
                      />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#00E5FF]">
                        SAVED
                      </p>

                      <Link
                        to={`/products/${product._id}`}
                        className="mt-2 block text-base font-bold transition hover:text-[#00E5FF]"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(product._id)
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-gray-600 transition hover:border-red-500/40 hover:text-red-400"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                  {/* Price */}
                  {product.price !== undefined && (
                    <p className="mt-4 text-lg font-bold text-white">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;