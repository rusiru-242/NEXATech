import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Nexa Pro Laptop",
      category: "Laptops",
      price: 289000,
      stock: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Ultra X Smartphone",
      category: "Smartphones",
      price: 189000,
      stock: 18,
      status: "Active",
    },
    {
      id: 3,
      name: "Pulse Gaming Headset",
      category: "Gaming",
      price: 49000,
      stock: 7,
      status: "Active",
    },
    {
      id: 4,
      name: "Vision 4K Monitor",
      category: "Monitors",
      price: 159000,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 5,
      name: "Nexa Wireless Mouse",
      category: "Accessories",
      price: 12000,
      stock: 42,
      status: "Active",
    },
    {
      id: 6,
      name: "Studio Pro Headphones",
      category: "Audio",
      price: 79000,
      stock: 11,
      status: "Active",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    category: "Laptops",
    price: "",
    stock: "",
  });

  const categories = [
    "All",
    "Laptops",
    "Smartphones",
    "Gaming",
    "Audio",
    "Monitors",
    "Cameras",
    "Accessories",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString("en-LK")}`;
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      category: "Laptops",
      price: "",
      stock: "",
    });

    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.price || form.stock === "") {
      alert("Please fill all required fields.");
      return;
    }

    const stock = Number(form.stock);
    const price = Number(form.price);

    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: form.name,
                category: form.category,
                price,
                stock,
                status: stock > 0 ? "Active" : "Out of Stock",
              }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price,
        stock,
        status: stock > 0 ? "Active" : "Out of Stock",
      };

      setProducts((currentProducts) => [
        newProduct,
        ...currentProducts,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}

      <header className="border-b border-white/10 bg-[#090909]">

        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8">

          <div className="flex items-center gap-5">

            <Link
              to="/admin"
              className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
            >
              <ArrowLeft size={16} />
            </Link>

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00E5FF]">
                NEXATECH ADMIN
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight">
                Products
              </h1>
            </div>

          </div>

          <Link
            to="/"
            className="hidden items-center gap-2 border border-white/10 px-4 py-2 text-xs font-semibold text-gray-400 transition hover:border-[#00E5FF] hover:text-[#00E5FF] sm:flex"
          >
            View Store
            <ArrowUpRight size={14} />
          </Link>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* Page Heading */}

        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              Inventory
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
              MANAGE
              <span className="text-gray-600"> PRODUCTS.</span>
            </h2>

            <p className="mt-4 text-sm text-gray-600">
              Manage your store products, pricing and inventory.
            </p>

          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex h-11 items-center justify-center gap-2 bg-[#00E5FF] px-5 text-xs font-bold uppercase tracking-[0.1em] text-black transition hover:bg-white"
          >
            <Plus size={16} />
            Add Product
          </button>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="mb-6 flex flex-col gap-3 border border-white/10 bg-[#090909] p-4 md:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-11 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#00E5FF]/60"
            />

          </div>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="h-11 border border-white/10 bg-[#0b0b0b] px-4 text-xs text-gray-400 outline-none focus:border-[#00E5FF]/60"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-[#090909]"
              >
                {category}
              </option>
            ))}
          </select>

        </div>

        {/* ================= PRODUCT COUNT ================= */}

        <div className="mb-4 flex items-center justify-between">

          <p className="text-xs text-gray-600">
            Showing{" "}
            <span className="text-gray-400">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Box size={14} />
            {products.length} Total
          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden border border-white/10 bg-[#090909]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead>

                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.15em] text-gray-600">

                  <th className="px-6 py-4">
                    Product
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Price
                  </th>

                  <th className="px-6 py-4">
                    Stock
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >

                      <Box
                        size={28}
                        className="mx-auto text-gray-700"
                      />

                      <p className="mt-4 text-sm text-gray-500">
                        No products found.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >

                      {/* Product */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 bg-white/[0.02] text-[#00E5FF]">
                            <Box size={18} />
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-gray-200">
                              {product.name}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-700">
                              ID: #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Category */}

                      <td className="px-6 py-5 text-xs text-gray-400">
                        {product.category}
                      </td>

                      {/* Price */}

                      <td className="px-6 py-5 text-xs font-semibold text-gray-200">
                        {formatPrice(product.price)}
                      </td>

                      {/* Stock */}

                      <td className="px-6 py-5">

                        <span
                          className={
                            product.stock === 0
                              ? "text-xs text-red-400"
                              : product.stock <= 10
                              ? "text-xs text-yellow-400"
                              : "text-xs text-gray-400"
                          }
                        >
                          {product.stock} units
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            product.status === "Active"
                              ? "bg-green-400/10 text-green-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {product.status}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(product)
                            }
                            className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-red-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 size={15} />
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

      {/* ================= ADD / EDIT MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">

          <div className="w-full max-w-lg border border-white/10 bg-[#090909] shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-white/10 p-6">

              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#00E5FF]">
                  Product Management
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-white/30 hover:text-white"
              >
                <X size={16} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Product Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter product name"
                  className="h-12 w-full border border-white/10 bg-white/[0.02] px-4 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#00E5FF]/60"
                />

              </div>

              {/* Category */}

              <div>

                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                  className="h-12 w-full border border-white/10 bg-[#0b0b0b] px-4 text-sm text-gray-300 outline-none focus:border-[#00E5FF]/60"
                >

                  {categories
                    .filter(
                      (category) => category !== "All"
                    )
                    .map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-[#090909]"
                      >
                        {category}
                      </option>
                    ))}

                </select>

              </div>

              {/* Price + Stock */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: event.target.value,
                      })
                    }
                    placeholder="289000"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] px-4 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#00E5FF]/60"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        stock: event.target.value,
                      })
                    }
                    placeholder="20"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] px-4 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#00E5FF]/60"
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-12 flex-1 border border-white/10 text-xs font-semibold text-gray-400 transition hover:border-white/30 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-12 flex-1 bg-[#00E5FF] text-xs font-bold uppercase tracking-[0.1em] text-black transition hover:bg-white"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
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