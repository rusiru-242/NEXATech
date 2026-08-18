import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("nexatech_token");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/orders/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Orders error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={18} />;

      case "shipped":
        return <Truck size={18} />;

      case "processing":
        return <Package size={18} />;

      case "cancelled":
        return <XCircle size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-400 bg-green-400/10 border-green-400/20";

      case "shipped":
        return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";

      case "processing":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";

      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";

      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="animate-spin text-[#00E5FF]" size={24} />
            Loading your orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-[#00E5FF]">
            Your Orders
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-gray-400">
            Track and manage your NexaTech orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}

            {!localStorage.getItem("nexatech_token") && (
              <Link
                to="/login"
                className="ml-2 font-medium text-[#00E5FF] hover:underline"
              >
                Login
              </Link>
            )}
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <ShoppingBag
              size={52}
              className="mx-auto mb-5 text-gray-600"
            />

            <h2 className="text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-400">
              You haven't placed any orders yet. Start shopping and your
              orders will appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center rounded-lg bg-[#00E5FF] px-6 py-3 font-semibold text-black transition hover:bg-[#00cde6]"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        {!error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm text-gray-300">
                      #{order._id}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div
                    className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {formatStatus(order.status)}
                  </div>
                </div>

                {/* Products */}
                <div className="divide-y divide-white/5">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${order._id}-${item.product || index}`}
                      className="flex gap-4 p-5"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={24}
                              className="text-gray-600"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-white">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          ${Number(item.price || 0).toFixed(2)} each
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-white">
                          $
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 bg-black/20 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1 text-sm">
                      <div className="flex gap-8 text-gray-500">
                        <span>Payment</span>
                        <span className="capitalize text-gray-300">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "Card"}
                        </span>
                      </div>

                      <div className="flex gap-8 text-gray-500">
                        <span>Payment Status</span>
                        <span className="capitalize text-gray-300">
                          {order.paymentStatus}
                        </span>
                      </div>

                      <div className="flex gap-8 text-gray-500">
                        <span>Shipping</span>
                        <span className="text-gray-300">
                          {order.shippingAddress?.city || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="text-2xl font-bold text-[#00E5FF]">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {!error && orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-gray-300 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;