import {
  BarChart3,
  Box,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  Package,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "Rs. 2.84M",
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "1,284",
      change: "+8.2%",
      icon: ShoppingBag,
    },
    {
      title: "Total Products",
      value: "486",
      change: "+4.6%",
      icon: Box,
    },
    {
      title: "Total Users",
      value: "8,942",
      change: "+15.3%",
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: "#NT-1024",
      customer: "Kasun Perera",
      product: "Nexa Pro Laptop",
      amount: "Rs. 289,000",
      status: "Completed",
    },
    {
      id: "#NT-1023",
      customer: "Amal Fernando",
      product: "Ultra X Smartphone",
      amount: "Rs. 189,000",
      status: "Processing",
    },
    {
      id: "#NT-1022",
      customer: "Nimal Silva",
      product: "Pulse Gaming Headset",
      amount: "Rs. 49,000",
      status: "Pending",
    },
    {
      id: "#NT-1021",
      customer: "Sahan Perera",
      product: "Vision 4K Monitor",
      amount: "Rs. 159,000",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#090909]">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
              NEXATECH
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 border border-white/10 px-4 py-2 text-xs font-semibold text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            View Store
            <ArrowUpRight size={14} />
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* Page Heading */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
            Overview
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
            STORE
            <span className="text-gray-600"> PERFORMANCE.</span>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="border border-white/10 bg-[#090909] p-6 transition hover:border-[#00E5FF]/30"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center border border-white/10 text-[#00E5FF]">
                    <Icon size={18} />
                  </div>

                  <span className="text-xs text-[#00E5FF]">
                    {stat.change}
                  </span>

                </div>

                <p className="mt-6 text-xs uppercase tracking-[0.15em] text-gray-600">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>

              </div>
            );
          })}

        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Recent Orders */}
          <section className="border border-white/10 bg-[#090909] lg:col-span-2">

            <div className="flex items-center justify-between border-b border-white/10 p-6">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                  Orders
                </p>

                <h3 className="mt-2 text-lg font-semibold">
                  Recent Orders
                </h3>
              </div>

              <Link
                to="/admin/orders"
                className="text-xs text-gray-500 transition hover:text-[#00E5FF]"
              >
                View all →
              </Link>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.15em] text-gray-600">
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>

                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >

                      <td className="px-6 py-5 text-xs font-semibold">
                        {order.id}
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-400">
                        {order.customer}
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-400">
                        {order.product}
                      </td>

                      <td className="px-6 py-5 text-xs font-semibold">
                        {order.amount}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            order.status === "Completed"
                              ? "bg-green-400/10 text-green-400"
                              : order.status === "Processing"
                              ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                              : "bg-yellow-400/10 text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </section>

          {/* Quick Actions */}
          <section className="border border-white/10 bg-[#090909]">

            <div className="border-b border-white/10 p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-gray-600">
                Management
              </p>

              <h3 className="mt-2 text-lg font-semibold">
                Quick Actions
              </h3>

            </div>

            <div className="space-y-3 p-6">

              <Link
                to="/admin/products"
                className="flex items-center justify-between border border-white/10 p-4 transition hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/[0.03]"
              >

                <div className="flex items-center gap-3">

                  <Package
                    size={17}
                    className="text-[#00E5FF]"
                  />

                  <span className="text-sm">
                    Manage Products
                  </span>

                </div>

                <ArrowUpRight
                  size={15}
                  className="text-gray-600"
                />

              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center justify-between border border-white/10 p-4 transition hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/[0.03]"
              >

                <div className="flex items-center gap-3">

                  <Clock
                    size={17}
                    className="text-[#00E5FF]"
                  />

                  <span className="text-sm">
                    Manage Orders
                  </span>

                </div>

                <ArrowUpRight
                  size={15}
                  className="text-gray-600"
                />

              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between border border-white/10 p-4 transition hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/[0.03]"
              >

                <div className="flex items-center gap-3">

                  <Users
                    size={17}
                    className="text-[#00E5FF]"
                  />

                  <span className="text-sm">
                    Manage Users
                  </span>

                </div>

                <ArrowUpRight
                  size={15}
                  className="text-gray-600"
                />

              </Link>

              <Link
                to="/admin/analytics"
                className="flex items-center justify-between border border-white/10 p-4 transition hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/[0.03]"
              >

                <div className="flex items-center gap-3">

                  <BarChart3
                    size={17}
                    className="text-[#00E5FF]"
                  />

                  <span className="text-sm">
                    View Analytics
                  </span>

                </div>

                <ArrowUpRight
                  size={15}
                  className="text-gray-600"
                />

              </Link>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;