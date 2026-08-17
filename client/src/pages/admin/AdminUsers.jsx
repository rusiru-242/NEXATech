import {
  Search,
  MoreHorizontal,
  UserPlus,
  ShieldCheck,
  User,
  Mail,
} from "lucide-react";
import { useState } from "react";

function AdminUsers() {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      name: "Kasun Perera",
      email: "kasun@gmail.com",
      role: "Customer",
      orders: 8,
      spent: "Rs. 245,000",
      status: "Active",
    },
    {
      id: 2,
      name: "Nimal Silva",
      email: "nimal@gmail.com",
      role: "Customer",
      orders: 5,
      spent: "Rs. 128,500",
      status: "Active",
    },
    {
      id: 3,
      name: "Amaya Fernando",
      email: "amaya@gmail.com",
      role: "Customer",
      orders: 12,
      spent: "Rs. 389,000",
      status: "Active",
    },
    {
      id: 4,
      name: "Sahan Wijesinghe",
      email: "sahan@gmail.com",
      role: "Customer",
      orders: 2,
      spent: "Rs. 74,000",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@nexatech.com",
      role: "Admin",
      orders: 0,
      spent: "Rs. 0",
      status: "Active",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-white/10 bg-[#090909]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 sm:px-8">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00E5FF]">
              NEXATECH ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
              Users
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage registered customers and administrators.
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 bg-[#00E5FF] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-white"
          >
            <UserPlus size={15} />
            Add User
          </button>

        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* ================= STATS ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="border border-white/10 bg-[#090909] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Users
              </p>

              <User size={18} className="text-gray-600" />
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              5
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Registered accounts
            </p>
          </div>

          <div className="border border-white/10 bg-[#090909] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Active Users
              </p>

              <ShieldCheck size={18} className="text-[#00E5FF]" />
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              4
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Currently active
            </p>
          </div>

          <div className="border border-white/10 bg-[#090909] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Customers
              </p>

              <User size={18} className="text-gray-600" />
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              4
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Customer accounts
            </p>
          </div>

          <div className="border border-white/10 bg-[#090909] p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Admins
              </p>

              <ShieldCheck size={18} className="text-gray-600" />
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              1
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Administrator accounts
            </p>
          </div>

        </div>

        {/* ================= USERS TABLE ================= */}
        <section className="mt-8 border border-white/10 bg-[#090909]">

          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                All Users
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                View and manage user accounts.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="h-10 w-full border border-white/10 bg-white/[0.02] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]/50"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.15em] text-gray-600">

                  <th className="px-5 py-4">
                    User
                  </th>

                  <th className="px-5 py-4">
                    Role
                  </th>

                  <th className="px-5 py-4">
                    Orders
                  </th>

                  <th className="px-5 py-4">
                    Total Spent
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >

                    {/* User */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold text-gray-400">
                          {user.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">

                            <Mail
                              size={11}
                              className="text-gray-700"
                            />

                            <p className="text-xs text-gray-600">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </div>

                    </td>

                    {/* Role */}
                    <td className="px-5 py-5">

                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1.5 border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]">
                          <ShieldCheck size={11} />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                          <User size={11} />
                          Customer
                        </span>
                      )}

                    </td>

                    {/* Orders */}
                    <td className="px-5 py-5 text-sm text-gray-400">
                      {user.orders}
                    </td>

                    {/* Spent */}
                    <td className="px-5 py-5 text-sm font-semibold text-gray-300">
                      {user.spent}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">

                      <span
                        className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider ${
                          user.status === "Active"
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "Active"
                              ? "bg-green-400"
                              : "bg-gray-600"
                          }`}
                        />

                        {user.status}

                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-5 text-right">

                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-white/25 hover:text-white"
                      >
                        <MoreHorizontal size={17} />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Empty Search */}
          {filteredUsers.length === 0 && (
            <div className="px-5 py-16 text-center">

              <User
                size={28}
                className="mx-auto text-gray-700"
              />

              <p className="mt-4 text-sm text-gray-500">
                No users found.
              </p>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AdminUsers;