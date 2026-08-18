import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:5000";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("nexatech_token");

      if (!token) {
        throw new Error("Authentication required.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load analytics."
        );
      }

      setAnalytics(data);
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return `$${Number(value || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
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
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <AdminNavbar />

        <main className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        </main>
      </div>
    );
  }

  const overview = analytics?.overview || {};
  const orderStatus =
    analytics?.orderStatus || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#00E5FF]">
              Business Overview
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 text-gray-400">
              Monitor NexaTech performance and sales.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Revenue"
            value={formatMoney(
              overview.totalRevenue
            )}
            icon={<DollarSign size={22} />}
          />

          <StatCard
            title="Total Orders"
            value={overview.totalOrders || 0}
            icon={<ShoppingCart size={22} />}
          />

          <StatCard
            title="Customers"
            value={overview.totalUsers || 0}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Products"
            value={overview.totalProducts || 0}
            icon={<Package size={22} />}
          />

        </div>

        {/* Order Status */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Order Status
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            <StatusCard
              title="Pending"
              value={orderStatus.pending}
              icon={<Clock size={20} />}
            />

            <StatusCard
              title="Processing"
              value={orderStatus.processing}
              icon={<Package size={20} />}
            />

            <StatusCard
              title="Shipped"
              value={orderStatus.shipped}
              icon={<Truck size={20} />}
            />

            <StatusCard
              title="Delivered"
              value={orderStatus.delivered}
              icon={<CheckCircle size={20} />}
            />

            <StatusCard
              title="Cancelled"
              value={orderStatus.cancelled}
              icon={<XCircle size={20} />}
            />

          </div>
        </section>

        {/* Tables */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Best Selling */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                Best Selling Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Top products by quantity sold.
              </p>
            </div>

            <div className="divide-y divide-white/5">
              {analytics.bestSellingProducts
                ?.length > 0 ? (
                analytics.bestSellingProducts.map(
                  (product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00E5FF]/10 text-sm font-bold text-[#00E5FF]">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {product._id}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {product.totalSold} sold
                          </p>
                        </div>
                      </div>

                      <p className="ml-4 font-semibold text-[#00E5FF]">
                        {formatMoney(
                          product.revenue
                        )}
                      </p>
                    </div>
                  )
                )
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No sales data available.
                </div>
              )}
            </div>
          </section>

          {/* Category Sales */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                Category Sales
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Revenue generated by category.
              </p>
            </div>

            <div className="divide-y divide-white/5">
              {analytics.categorySales
                ?.length > 0 ? (
                analytics.categorySales.map(
                  (category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-5"
                    >
                      <div>
                        <p className="font-medium">
                          {category._id}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {category.sales} items sold
                        </p>
                      </div>

                      <p className="font-semibold text-[#00E5FF]">
                        {formatMoney(
                          category.revenue
                        )}
                      </p>
                    </div>
                  )
                )
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No category data available.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recent Orders */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-5">
            <h2 className="font-semibold">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4">
                    Order
                  </th>

                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {analytics.recentOrders?.map(
                  (order) => (
                    <tr
                      key={order._id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-400">
                          #{order._id.slice(-8)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {order.user?.name ||
                            "Unknown"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {order.user?.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="capitalize text-sm text-gray-300">
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="capitalize text-sm text-gray-400">
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-[#00E5FF]">
                        {formatMoney(order.total)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
        {icon}
      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function StatusCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-sm">
          {title}
        </span>
      </div>

      <p className="text-2xl font-bold">
        {value || 0}
      </p>
    </div>
  );
}

export default AdminAnalytics;