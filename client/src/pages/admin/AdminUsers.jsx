import {
  Eye,
  Mail,
  Phone,
  Search,
  ShoppingBag,
  Trash2,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:5000/api";

function AdminUsers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD CUSTOMERS
  // ==========================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch customers."
        );
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Fetch customers error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================================
  // DELETE CUSTOMER
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/users/${id}`,
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
          data.message || "Failed to delete customer."
        );
      }

      setCustomers((prev) =>
        prev.filter((customer) => customer._id !== id)
      );

      if (selectedCustomer?._id === id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Delete customer error:", error);
      alert(error.message);
    }
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(value) ||
      customer.email?.toLowerCase().includes(value) ||
      customer.phone?.toLowerCase().includes(value)
    );
  });

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ADMIN NAVBAR */}
      <AdminNavbar />

      {/* CONTENT */}

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">

        {/* HEADER */}

        <div className="mb-8">

          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#00e5ff]">
            Customer Management
          </p>

          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage NexaTech customer accounts and activity.
          </p>

        </div>


        {/* STATS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Total Customers
              </p>

              <User
                size={17}
                className="text-[#00e5ff]"
              />

            </div>

            <p className="text-3xl font-black">
              {customers.length}
            </p>

          </div>


          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Customers With Orders
              </p>

              <ShoppingBag
                size={17}
                className="text-[#00e5ff]"
              />

            </div>

            <p className="text-3xl font-black">
              {
                customers.filter(
                  (customer) => customer.orderCount > 0
                ).length
              }
            </p>

          </div>


          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                New Customers
              </p>

              <User
                size={17}
                className="text-[#00e5ff]"
              />

            </div>

            <p className="text-3xl font-black">
              {
                customers.filter((customer) => {
                  const created = new Date(customer.createdAt);
                  const now = new Date();

                  return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <div className="mb-6">

          <div className="relative max-w-xl">

            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full border border-white/10 bg-[#0a0a0a] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/40"
            />

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* TABLE */}

        <div className="overflow-hidden border border-white/10 bg-[#080808]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                    Orders
                  </th>

                  <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center text-sm text-gray-600"
                    >
                      Loading customers...
                    </td>

                  </tr>

                ) : filteredCustomers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center text-sm text-gray-600"
                    >
                      No customers found.
                    </td>

                  </tr>

                ) : (

                  filteredCustomers.map((customer) => (

                    <tr
                      key={customer._id}
                      className="border-b border-white/[0.05] transition hover:bg-white/[0.02]"
                    >

                      {/* CUSTOMER */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center border border-[#00e5ff]/20 bg-[#00e5ff]/5 text-[#00e5ff]">

                            <User size={16} />

                          </div>

                          <div>

                            <p className="text-sm font-semibold text-white">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-600">
                              ID: {customer._id.slice(-8)}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td className="px-5 py-5">

                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-xs text-gray-400">

                            <Mail size={12} />

                            {customer.email}

                          </div>

                          {customer.phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">

                              <Phone size={12} />

                              {customer.phone}

                            </div>
                          )}

                        </div>

                      </td>


                      {/* ORDERS */}

                      <td className="px-5 py-5">

                        <span className="inline-flex items-center gap-2 border border-white/10 px-3 py-1.5 text-xs text-gray-400">

                          <ShoppingBag size={12} />

                          {customer.orderCount || 0}

                        </span>

                      </td>


                      {/* DATE */}

                      <td className="px-5 py-5 text-xs text-gray-500">

                        {formatDate(customer.createdAt)}

                      </td>


                      {/* ACTIONS */}

                      <td className="px-5 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              setSelectedCustomer(customer)
                            }
                            className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00e5ff]/30 hover:text-[#00e5ff]"
                            title="View customer"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(customer._id)
                            }
                            className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-red-500/30 hover:text-red-400"
                            title="Delete customer"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>


      {/* CUSTOMER MODAL */}

      {selectedCustomer && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">

          <div className="w-full max-w-lg border border-white/10 bg-[#0a0a0a] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#00e5ff]">
                  Customer Details
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {selectedCustomer.name}
                </h2>

              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 transition hover:text-white"
              >
                <X size={18} />
              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="space-y-5 p-6">

              <div>

                <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Email
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-300">

                  <Mail size={14} />

                  {selectedCustomer.email}

                </p>

              </div>


              <div>

                <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Phone
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-300">

                  <Phone size={14} />

                  {selectedCustomer.phone || "Not provided"}

                </p>

              </div>


              <div>

                <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Address
                </p>

                <p className="text-sm text-gray-300">
                  {selectedCustomer.address || "Not provided"}
                </p>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div className="border border-white/10 bg-white/[0.02] p-4">

                  <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Orders
                  </p>

                  <p className="mt-2 text-xl font-black">
                    {selectedCustomer.orderCount || 0}
                  </p>

                </div>


                <div className="border border-white/10 bg-white/[0.02] p-4">

                  <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Joined
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-300">
                    {formatDate(selectedCustomer.createdAt)}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;