import {
  Edit3,
  Folder,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:5000/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/categories`,
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
            "Failed to fetch categories."
        );
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================================
  // OPEN ADD MODAL
  // ==========================================================

  const openAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setError("");
    setShowModal(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const openEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setError("");
    setShowModal(true);
  };

  // ==========================================================
  // SAVE CATEGORY
  // ==========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    // Currently categories are derived from products.
    // Editing is handled by changing product categories.
    if (editingCategory) {
      setError(
        "Category editing is available when the category model is enabled. For now, edit the category directly from the product."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/categories`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: categoryName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create category."
        );
      }

      setShowModal(false);

      setCategoryName("");

      await fetchCategories();
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE CATEGORY
  // ==========================================================

  const handleDelete = async (category) => {
    if (category.productCount > 0) {
      alert(
        "This category contains products. Remove or move those products first."
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete category "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/categories/${encodeURIComponent(
          category.name
        )}`,
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
          data.message ||
            "Failed to delete category."
        );
      }

      await fetchCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredCategories =
    categories.filter((category) =>
      category.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <AdminNavbar />

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#00e5ff]">
              Product Organization
            </p>

            <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage product categories.
            </p>

          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-[#00e5ff] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white"
          >
            <Plus size={15} />
            Add Category
          </button>

        </div>


        {/* STATS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">

          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Total Categories
              </p>

              <Folder
                size={17}
                className="text-[#00e5ff]"
              />

            </div>

            <p className="text-3xl font-black">
              {categories.length}
            </p>

          </div>


          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Products
              </p>

              <Package
                size={17}
                className="text-[#00e5ff]"
              />

            </div>

            <p className="text-3xl font-black">

              {categories.reduce(
                (total, category) =>
                  total +
                  (category.productCount || 0),
                0
              )}

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
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search categories..."
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


        {/* CATEGORY GRID */}

        {loading ? (

          <div className="border border-white/10 bg-[#080808] py-16 text-center text-sm text-gray-600">
            Loading categories...
          </div>

        ) : filteredCategories.length === 0 ? (

          <div className="border border-white/10 bg-[#080808] py-16 text-center">

            <Folder
              size={28}
              className="mx-auto mb-4 text-gray-700"
            />

            <p className="text-sm text-gray-500">
              No categories found.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredCategories.map(
              (category) => (

                <div
                  key={category.name}
                  className="group border border-white/10 bg-[#080808] p-5 transition hover:border-[#00e5ff]/30"
                >

                  <div className="mb-6 flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center border border-[#00e5ff]/20 bg-[#00e5ff]/5 text-[#00e5ff]">

                      <Folder size={18} />

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          openEditModal(category)
                        }
                        className="flex h-8 w-8 items-center justify-center border border-white/10 text-gray-600 transition hover:border-[#00e5ff]/30 hover:text-[#00e5ff]"
                      >
                        <Edit3 size={13} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(category)
                        }
                        className="flex h-8 w-8 items-center justify-center border border-white/10 text-gray-600 transition hover:border-red-500/30 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>

                    </div>

                  </div>


                  <h2 className="text-lg font-bold">
                    {category.name}
                  </h2>


                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">

                    <Package size={13} />

                    {category.productCount || 0}

                    {category.productCount === 1
                      ? " product"
                      : " products"}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>


      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">

          <div className="w-full max-w-md border border-white/10 bg-[#0a0a0a]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#00e5ff]">
                  Category
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-500 transition hover:text-white"
              >
                <X size={18} />
              </button>

            </div>


            <form
              onSubmit={handleSave}
              className="space-y-5 p-6"
            >

              <div>

                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Category Name
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Tablets"
                  className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/40"
                  autoFocus
                />

              </div>


              {error && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}


              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 bg-[#00e5ff] py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingCategory
                  ? "Update Category"
                  : "Create Category"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminCategories;