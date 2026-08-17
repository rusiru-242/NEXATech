import {
  Search,
  Plus,
  MoreHorizontal,
  Folder,
  Package,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";

function AdminCategories() {
  const [search, setSearch] = useState("");

  const [categories] = useState([
    {
      id: 1,
      name: "Laptops",
      description: "Business, gaming and premium laptops",
      products: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Smartphones",
      description: "Latest smartphones and mobile devices",
      products: 32,
      status: "Active",
    },
    {
      id: 3,
      name: "Gaming",
      description: "Gaming PCs, consoles and gaming gear",
      products: 41,
      status: "Active",
    },
    {
      id: 4,
      name: "Audio",
      description: "Headphones, speakers and audio equipment",
      products: 18,
      status: "Active",
    },
    {
      id: 5,
      name: "Monitors",
      description: "Professional, gaming and 4K monitors",
      products: 15,
      status: "Active",
    },
    {
      id: 6,
      name: "Cameras",
      description: "Digital cameras and photography equipment",
      products: 12,
      status: "Active",
    },
    {
      id: 7,
      name: "Accessories",
      description: "Keyboards, mice, cables and accessories",
      products: 56,
      status: "Active",
    },
    {
      id: 8,
      name: "Networking",
      description: "Routers, switches and networking equipment",
      products: 9,
      status: "Inactive",
    },
  ]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
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
              Categories
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Organize and manage your product categories.
            </p>
          </div>

          {/* Add Category */}
          <button
            type="button"
            className="flex items-center gap-2 bg-[#00E5FF] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-white"
          >
            <Plus size={15} />
            Add Category
          </button>

        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* ================= STATS ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Categories */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Categories
              </p>

              <Folder
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              {categories.length}
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Product categories
            </p>

          </div>

          {/* Active */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Active
              </p>

              <span className="h-2 w-2 rounded-full bg-green-400" />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              7
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Active categories
            </p>

          </div>

          {/* Products */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Products
              </p>

              <Package
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              207
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Across all categories
            </p>

          </div>

          {/* Inactive */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Inactive
              </p>

              <span className="h-2 w-2 rounded-full bg-gray-600" />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              1
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Hidden categories
            </p>

          </div>

        </div>

        {/* ================= CATEGORY TABLE ================= */}
        <section className="mt-8 border border-white/10 bg-[#090909]">

          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                All Categories
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Manage product categories and their visibility.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="h-10 w-full border border-white/10 bg-white/[0.02] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]/50"
              />

            </div>

          </div>

          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-left">

              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.15em] text-gray-600">

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Description
                  </th>

                  <th className="px-5 py-4">
                    Products
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCategories.map((category) => (

                  <tr
                    key={category.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >

                    {/* Category */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03]">
                          <Folder
                            size={17}
                            className="text-[#00E5FF]"
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white">
                            {category.name}
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-700">
                            Category #{String(category.id).padStart(2, "0")}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Description */}
                    <td className="max-w-sm px-5 py-5">

                      <p className="truncate text-sm text-gray-500">
                        {category.description}
                      </p>

                    </td>

                    {/* Products */}
                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2">

                        <Package
                          size={14}
                          className="text-gray-700"
                        />

                        <span className="text-sm text-gray-400">
                          {category.products}
                        </span>

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">

                      <span
                        className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider ${
                          category.status === "Active"
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            category.status === "Active"
                              ? "bg-green-400"
                              : "bg-gray-600"
                          }`}
                        />

                        {category.status}

                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          type="button"
                          title="Edit category"
                          className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                        >
                          <Edit size={14} />
                        </button>

                        <button
                          type="button"
                          title="Delete category"
                          className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-red-500/40 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          type="button"
                          title="More"
                          className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-white/25 hover:text-white"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="px-5 py-16 text-center">

              <Folder
                size={28}
                className="mx-auto text-gray-700"
              />

              <p className="mt-4 text-sm text-gray-500">
                No categories found.
              </p>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AdminCategories;