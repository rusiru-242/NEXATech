
import {
  Edit3,
  Image as ImageIcon,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/products/categories";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  brand: "",
  stock: "",
  rating: "",
  reviews: "",
  discount: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load products."
        );
      }

      setProducts(
        Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Load products error:", err);

      setError(
        err.message || "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await fetch(CATEGORY_API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load categories."
        );
      }

      const categoryData = Array.isArray(data.categories)
        ? data.categories
        : [];

      const categoryNames = categoryData
        .map((category) =>
          typeof category === "string"
            ? category
            : category?.name
        )
        .filter(Boolean)
        .map((name) => name.trim());

      const uniqueCategories = categoryNames.filter(
        (name, index, array) =>
          array.findIndex(
            (item) =>
              item.toLowerCase() === name.toLowerCase()
          ) === index
      );

      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Load categories error:", err);

      // Categories API fail unoth existing products walin
      // fallback categories generate karanawa.
      setCategories((currentCategories) => {
        if (currentCategories.length > 0) {
          return currentCategories;
        }

        return [];
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      category: categories.length > 0 ? categories[0] : "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);

    // latest categories load karanna
    loadCategories();
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      image: product.image || "",
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
      discount: product.discount ?? "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);

    // latest categories load karanna
    loadCategories();
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!form.brand.trim()) {
      setError("Brand is required.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem(
        "nexatech_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        category: form.category.trim(),
        brand: form.brand.trim(),
        stock: Number(form.stock) || 0,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        discount: Number(form.discount) || 0,
      };

      const url = editingProduct
        ? `${API_URL}/${editingProduct._id}`
        : API_URL;

      const method = editingProduct
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingProduct ? "update" : "create"
            } product.`
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setShowModal(false);
      setEditingProduct(null);
      setForm(emptyForm);

      await loadProducts();
      await loadCategories();
    } catch (err) {
      console.error("Save product error:", err);

      setError(
        err.message || "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem(
        "nexatech_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/${product._id}`,
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
          data.message || "Failed to delete product."
        );
      }

      setSuccess("Product deleted successfully.");

      await loadProducts();
      await loadCategories();
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.message || "Failed to delete product."
      );
    }
  };

  // ==========================================
  // CATEGORY FILTER
  // ==========================================

  const filterCategories = [
    "All",
    ...products
      .map((product) => product.category)
      .filter(Boolean)
      .filter(
        (category, index, array) =>
          array.findIndex(
            (item) =>
              item.toLowerCase() ===
              category.toLowerCase()
          ) === index
      ),
  ];

  // ==========================================
  // MERGE CATEGORY OPTIONS
  // ==========================================

  const categoryOptions = [
    ...categories,
    ...products
      .map((product) => product.category)
      .filter(Boolean),
  ]
    .map((category) => category.trim())
    .filter(Boolean)
    .filter(
      (category, index, array) =>
        array.findIndex(
          (item) =>
            item.toLowerCase() ===
            category.toLowerCase()
        ) === index
    )
    .sort((a, b) => a.localeCompare(b));

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.brand
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <AdminNavbar />

      <main>
        <div className="mx-auto max-w-[1600px] p-6 sm:p-10">

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
                Administration
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Products
                <span className="text-gray-700">.</span>
              </h1>

              <p className="mt-3 text-sm text-gray-600">
                Manage your NexaTech product catalog.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-[#00e5ff] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white"
            >
              <Plus size={15} />
              Add Product
            </button>

          </div>

          {/* ========================================
              ALERTS
          ======================================== */}

          {error && !showModal && (
            <div className="mb-5 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && !showModal && (
            <div className="mb-5 border border-[#00e5ff]/20 bg-[#00e5ff]/5 px-4 py-3 text-sm text-[#00e5ff]">
              {success}
            </div>
          )}

          {/* ========================================
              FILTER BAR
          ======================================== */}

          <div className="mb-6 flex flex-col gap-3 border border-white/10 bg-[#090909] p-4 md:flex-row">

            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products or brands..."
                className="w-full border border-white/10 bg-[#050505] py-3 pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00e5ff]/30"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="border border-white/10 bg-[#050505] px-4 py-3 text-xs text-gray-400 outline-none focus:border-[#00e5ff]/30"
            >
              {filterCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-[#050505]"
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

          {/* ========================================
              PRODUCT COUNT
          ======================================== */}

          <div className="mb-4 flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-700">
              {filteredProducts.length} Products
            </p>

            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-700">
              MongoDB Catalog
            </p>
          </div>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center border border-white/10 bg-[#090909]">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#00e5ff]" />

                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">
                  Loading Products
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center border border-white/10 bg-[#090909] text-center">

              <Package
                size={35}
                className="mb-4 text-gray-800"
              />

              <h3 className="text-sm font-bold">
                No Products Found
              </h3>

              <p className="mt-2 text-xs text-gray-700">
                Try another search or add a new product.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto border border-white/10 bg-[#090909]">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-white/10 text-left">

                    <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Product
                    </th>

                    <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Category
                    </th>

                    <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Price
                    </th>

                    <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Rating
                    </th>

                    <th className="px-5 py-4 text-right text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredProducts.map((product) => (

                    <tr
                      key={product._id}
                      className="border-b border-white/[0.05] transition hover:bg-white/[0.02]"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-[#050505]">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <ImageIcon
                                size={17}
                                className="text-gray-800"
                              />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-xs font-semibold text-white">
                              {product.name}
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-700">
                              {product.brand}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="border border-white/10 px-2 py-1 text-[8px] uppercase tracking-wider text-gray-500">
                          {product.category}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold">
                          Rs.{" "}
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`text-xs font-semibold ${
                            Number(product.stock) > 0
                              ? "text-gray-400"
                              : "text-red-400"
                          }`}
                        >
                          {product.stock ?? 0}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span className="text-xs text-gray-400">
                          ★ {product.rating ?? 0}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditModal(product)
                            }
                            className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00e5ff]/30 hover:text-[#00e5ff]"
                            title="Edit Product"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product)
                            }
                            className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-red-500/30 hover:text-red-400"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </main>

      {/* ==========================================
          ADD / EDIT MODAL
      ========================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/10 bg-[#090909]">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090909] px-6 py-5">

              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#00e5ff]">
                  Product Management
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                  <span className="text-gray-700">
                    .
                  </span>
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-red-500/30 hover:text-red-400"
              >
                <X size={17} />
              </button>

            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="mx-6 mt-5 border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Product Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: ASUS ROG Strix G16"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* BRAND */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Brand *
                  </label>

                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="ASUS"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none focus:border-[#00e5ff]/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <option
                      value=""
                      className="bg-[#050505]"
                    >
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categoryOptions.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#050505]"
                        >
                          {category}
                        </option>
                      )
                    )}

                    {/* Existing product category
                        eka admin category list eke nathnam
                        edit mode eke preserve karanawa */}
                    {form.category &&
                      !categoryOptions.some(
                        (category) =>
                          category.toLowerCase() ===
                          form.category.toLowerCase()
                      ) && (
                        <option
                          value={form.category}
                          className="bg-[#050505]"
                        >
                          {form.category}
                        </option>
                      )}

                  </select>

                  <p className="mt-2 text-[8px] uppercase tracking-wider text-gray-700">
                    Categories are managed from Admin → Categories
                  </p>

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Price *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="250000"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* STOCK */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* DISCOUNT */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Discount (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* RATING */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Rating
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="4.5"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* REVIEWS */}

                <div>

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Reviews
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* IMAGE */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Product Image URL
                  </label>

                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                    className="w-full border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter product description..."
                    className="w-full resize-none border border-white/10 bg-[#050505] px-4 py-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/30"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-7 flex justify-end gap-3 border-t border-white/10 pt-6">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="border border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 transition hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#00e5ff] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      {editingProduct
                        ? "Update Product"
                        : "Save Product"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminProducts;

