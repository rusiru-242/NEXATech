import { useEffect, useState } from "react";
import {
  Package,
  User,
  MapPin,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:5000";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
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
        setError("Authentication required.");
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);

      const token = localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update order.");
    } finally {
      setUpdating("");
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      setUpdating(orderId);

      const token = localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/payment-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update payment status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update payment status.");
    } finally {
      setUpdating("");
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusClass = (status) => {
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

  const paymentClass = (status) => {
    switch (status) {
      case "paid":
        return "text-green-400";

      case "failed":
        return "text-red-400";

      default:
        return "text-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <AdminNavbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2
              size={24}
              className="animate-spin text-[#00E5FF]"
            />
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#00E5FF]">
              Management
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 text-gray-400">
              Manage customer orders and payment status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
            <Package
              size={48}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-xl font-semibold">
              No orders found
            </h2>

            <p className="mt-2 text-gray-500">
              Customer orders will appear here.
            </p>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              {/* Top */}
              <div className="border-b border-white/10 p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

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

                  {/* Status */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span
                      className={`flex items-center rounded-full border px-3 py-1.5 text-sm ${statusClass(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>

                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00E5FF]"
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>

                    {updating === order._id && (
                      <Loader2
                        size={18}
                        className="animate-spin text-[#00E5FF]"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Customer + Shipping */}
              <div className="grid gap-4 border-b border-white/10 p-5 md:grid-cols-2">

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="mb-3 flex items-center gap-2 text-[#00E5FF]">
                    <User size={17} />
                    <span className="text-sm font-medium">
                      Customer
                    </span>
                  </div>

                  <p className="font-medium">
                    {order.user?.name || "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.user?.email || "No email"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.user?.phone || "No phone"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="mb-3 flex items-center gap-2 text-[#00E5FF]">
                    <MapPin size={17} />
                    <span className="text-sm font-medium">
                      Delivery
                    </span>
                  </div>

                  <p className="font-medium">
                    {order.shippingAddress?.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.shippingAddress?.phone}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.shippingAddress?.address}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.shippingAddress?.city}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-white/5">
                {order.items?.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex gap-4 p-5"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={20}
                            className="text-gray-600"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      $
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div className="border-t border-white/10 bg-black/20 p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                  {/* Payment */}
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-gray-400">
                      <CreditCard size={17} />
                      <span className="text-sm">
                        Payment
                      </span>
                    </div>

                    <p className="text-sm">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Card"}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        Status:
                      </span>

                      <select
                        value={order.paymentStatus}
                        disabled={updating === order._id}
                        onChange={(e) =>
                          updatePaymentStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className={`bg-transparent text-sm font-medium outline-none ${paymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        <option
                          value="pending"
                          className="bg-black text-white"
                        >
                          Pending
                        </option>

                        <option
                          value="paid"
                          className="bg-black text-white"
                        >
                          Paid
                        </option>

                        <option
                          value="failed"
                          className="bg-black text-white"
                        >
                          Failed
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-left lg:text-right">
                    <p className="text-sm text-gray-500">
                      Order Total
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
      </main>
    </div>
  );
}

export default AdminOrders;