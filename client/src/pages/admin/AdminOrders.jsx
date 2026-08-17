import {
  ArrowLeft,
  Search,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

function AdminOrders() {
  const [search, setSearch] = useState("");

  const orders = [
    {
      id: "NX-1001",
      customer: "Kasun Perera",
      email: "kasun@example.com",
      product: "Nexa Pro Laptop",
      amount: "Rs. 289,000",
      status: "Delivered",
      date: "Aug 17, 2026",
    },
    {
      id: "NX-1002",
      customer: "Nimal Silva",
      email: "nimal@example.com",
      product: "Ultra X Smartphone",
      amount: "Rs. 189,000",
      status: "Processing",
      date: "Aug 17, 2026",
    },
    {
      id: "NX-1003",
      customer: "Amal Fernando",
      email: "amal@example.com",
      product: "Pulse Gaming Headset",
      amount: "Rs. 49,000",
      status: "Shipped",
      date: "Aug 16, 2026",
    },
    {
      id: "NX-1004",
      customer: "Dinesh Perera",
      email: "dinesh@example.com",
      product: "Vision 4K Monitor",
      amount: "Rs. 159,000",
      status: "Pending",
      date: "Aug 16, 2026",
    },
    {
      id: "NX-1005",
      customer: "Sahan Wijesinghe",
      email: "sahan@example.com",
      product: "Nexa Pro Laptop",
      amount: "Rs. 289,000",
      status: "Cancelled",
      date: "Aug 15, 2026",
    },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-400";

      case "Processing":
        return "bg-[#00E5FF]/10 text-[#00E5FF]";

      case "Shipped":
        return "bg-blue-500/10 text-blue-400";

      case "Pending":
        return "bg-yellow-500/10 text-yellow-400";

      case "Cancelled":
        return "bg-red-500/10 text-red-400";

      default:
        return "bg-white/5 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10 bg-[#080808]">

        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

          <div className="flex items-center gap-6">

            <Link
              to="/admin"
              className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-white"
            >
              <ArrowLeft size={15} />
              Dashboard
            </Link>

            <div className="h-5 w-px bg-white/10" />

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Orders
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
                Order Management
              </p>
            </div>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-[#00E5FF]">
              Sales
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em]">
              All Orders
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View and manage customer orders.
            </p>

          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">

            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full border border-white/10 bg-[#090909] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]/50"
            />

          </div>

        </div>

        {/* ================= STATS ================= */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="border border-white/10 bg-[#090909] p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Orders
              </p>

              <ShoppingBag
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-4 text-3xl font-bold">
              {orders.length}
            </p>

          </div>

          <div className="border border-white/10 bg-[#090909] p-5">

            <p className="text-xs uppercase tracking-wider text-gray-600">
              Pending
            </p>

            <p className="mt-4 text-3xl font-bold text-yellow-400">
              {
                orders.filter(
                  (order) => order.status === "Pending"
                ).length
              }
            </p>

          </div>

          <div className="border border-white/10 bg-[#090909] p-5">

            <p className="text-xs uppercase tracking-wider text-gray-600">
              Processing
            </p>

            <p className="mt-4 text-3xl font-bold text-[#00E5FF]">
              {
                orders.filter(
                  (order) => order.status === "Processing"
                ).length
              }
            </p>

          </div>

          <div className="border border-white/10 bg-[#090909] p-5">

            <p className="text-xs uppercase tracking-wider text-gray-600">
              Delivered
            </p>

            <p className="mt-4 text-3xl font-bold text-green-400">
              {
                orders.filter(
                  (order) => order.status === "Delivered"
                ).length
              }
            </p>

          </div>

        </div>

        {/* ================= ORDERS TABLE ================= */}
        <div className="overflow-hidden border border-white/10 bg-[#090909]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Order
                  </th>

                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Product
                  </th>

                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >

                    {/* Order ID */}
                    <td className="px-6 py-5">

                      <p className="text-sm font-semibold">
                        {order.id}
                      </p>

                    </td>

                    {/* Customer */}
                    <td className="px-6 py-5">

                      <p className="text-sm font-medium text-white">
                        {order.customer}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-700">
                        {order.email}
                      </p>

                    </td>

                    {/* Product */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-[#111]">

                          <ShoppingBag
                            size={15}
                            className="text-gray-600"
                          />

                        </div>

                        <span className="text-xs text-gray-400">
                          {order.product}
                        </span>

                      </div>

                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-semibold">
                        {order.amount}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">

                      <span className="text-xs text-gray-500">
                        {order.date}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end">

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                        >
                          <Eye size={15} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= EMPTY STATE ================= */}

          {filteredOrders.length === 0 && (

            <div className="py-16 text-center">

              <ShoppingBag
                size={30}
                className="mx-auto text-gray-700"
              />

              <p className="mt-4 text-sm text-gray-500">
                No orders found.
              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminOrders;