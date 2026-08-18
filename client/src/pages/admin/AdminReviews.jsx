import {
  Check,
  Eye,
  MessageSquare,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";

const API_URL = "http://localhost:5000/api";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================================
  // LOAD REVIEWS
  // ==========================================================

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/reviews`,
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
            "Failed to fetch reviews."
        );
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/reviews/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update review."
        );
      }

      setReviews((prev) =>
        prev.map((review) =>
          review._id === id
            ? data.review
            : review
        )
      );

      if (
        selectedReview &&
        selectedReview._id === id
      ) {
        setSelectedReview(data.review);
      }
    } catch (error) {
      console.error(
        "Update review error:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteReview = async (id) => {
    const confirmed = window.confirm(
      "Delete this review?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("nexatech_token");

      const response = await fetch(
        `${API_URL}/admin/reviews/${id}`,
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
            "Failed to delete review."
        );
      }

      setReviews((prev) =>
        prev.filter(
          (review) => review._id !== id
        )
      );

      setSelectedReview(null);
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredReviews =
    reviews.filter((review) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        review.user?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        review.user?.email
          ?.toLowerCase()
          .includes(searchValue) ||
        review.product?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        review.comment
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        review.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const countStatus = (status) =>
    reviews.filter(
      (review) => review.status === status
    ).length;

  // ==========================================================
  // DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // ==========================================================
  // STARS
  // ==========================================================

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={13}
              className={
                star <= rating
                  ? "fill-[#00e5ff] text-[#00e5ff]"
                  : "text-gray-700"
              }
            />
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <AdminNavbar />

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">

        {/* HEADER */}

        <div className="mb-8">

          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#00e5ff]">
            Customer Feedback
          </p>

          <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Reviews
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Moderate customer product reviews.
          </p>

        </div>


        {/* STATS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
              Total Reviews
            </p>

            <p className="mt-3 text-3xl font-black">
              {reviews.length}
            </p>

          </div>


          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
              Pending
            </p>

            <p className="mt-3 text-3xl font-black text-yellow-400">
              {countStatus("pending")}
            </p>

          </div>


          <div className="border border-white/10 bg-[#0a0a0a] p-5">

            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
              Approved
            </p>

            <p className="mt-3 text-3xl font-black text-[#00e5ff]">
              {countStatus("approved")}
            </p>

          </div>

        </div>


        {/* FILTERS */}

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">

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
              placeholder="Search reviews..."
              className="w-full border border-white/10 bg-[#0a0a0a] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#00e5ff]/40"
            />

          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border border-white/10 bg-[#0a0a0a] px-4 py-3 text-xs text-gray-400 outline-none focus:border-[#00e5ff]/40"
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="hidden">
              Hidden
            </option>
          </select>

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

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Product
                  </th>

                  <th className="px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Rating
                  </th>

                  <th className="px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-[9px] uppercase tracking-[0.15em] text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-gray-600"
                    >
                      Loading reviews...
                    </td>

                  </tr>

                ) : filteredReviews.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-gray-600"
                    >
                      No reviews found.
                    </td>

                  </tr>

                ) : (

                  filteredReviews.map(
                    (review) => (

                      <tr
                        key={review._id}
                        className="border-b border-white/[0.05] hover:bg-white/[0.02]"
                      >

                        <td className="px-5 py-5">

                          <p className="text-sm font-semibold">
                            {review.user?.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-600">
                            {review.user?.email}
                          </p>

                        </td>


                        <td className="px-5 py-5">

                          <p className="text-xs text-gray-400">
                            {review.product?.name ||
                              "Unknown Product"}
                          </p>

                        </td>


                        <td className="px-5 py-5">

                          {renderStars(
                            review.rating
                          )}

                        </td>


                        <td className="px-5 py-5">

                          <select
                            value={
                              review.status
                            }
                            onChange={(e) =>
                              updateStatus(
                                review._id,
                                e.target.value
                              )
                            }
                            className={`border bg-transparent px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] outline-none ${
                              review.status ===
                              "approved"
                                ? "border-[#00e5ff]/20 text-[#00e5ff]"
                                : review.status ===
                                  "pending"
                                ? "border-yellow-500/20 text-yellow-400"
                                : "border-red-500/20 text-red-400"
                            }`}
                          >

                            <option value="pending">
                              Pending
                            </option>

                            <option value="approved">
                              Approved
                            </option>

                            <option value="hidden">
                              Hidden
                            </option>

                          </select>

                        </td>


                        <td className="px-5 py-5 text-xs text-gray-600">
                          {formatDate(
                            review.createdAt
                          )}
                        </td>


                        <td className="px-5 py-5">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                setSelectedReview(
                                  review
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 hover:border-[#00e5ff]/30 hover:text-[#00e5ff]"
                            >
                              <Eye size={14} />
                            </button>


                            {review.status !==
                              "approved" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    review._id,
                                    "approved"
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 hover:border-[#00e5ff]/30 hover:text-[#00e5ff]"
                              >
                                <Check
                                  size={14}
                                />
                              </button>
                            )}


                            <button
                              onClick={() =>
                                deleteReview(
                                  review._id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 hover:border-red-500/30 hover:text-red-400"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>


      {/* REVIEW MODAL */}

      {selectedReview && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">

          <div className="w-full max-w-lg border border-white/10 bg-[#0a0a0a]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#00e5ff]">
                  Review Details
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Customer Review
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedReview(null)
                }
                className="text-gray-500 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>


            <div className="space-y-5 p-6">

              <div>

                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Customer
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {selectedReview.user?.name}
                </p>

              </div>


              <div>

                <p className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Product
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  {selectedReview.product?.name}
                </p>

              </div>


              <div>

                <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Rating
                </p>

                {renderStars(
                  selectedReview.rating
                )}

              </div>


              <div>

                <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Comment
                </p>

                <p className="border border-white/10 bg-white/[0.02] p-4 text-sm leading-6 text-gray-400">
                  {selectedReview.comment}
                </p>

              </div>


              <div className="flex gap-3">

                <button
                  onClick={() =>
                    updateStatus(
                      selectedReview._id,
                      "approved"
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 bg-[#00e5ff] py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-black"
                >
                  <Check size={13} />
                  Approve
                </button>

                <button
                  onClick={() =>
                    deleteReview(
                      selectedReview._id
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 border border-red-500/20 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-red-400"
                >
                  <Trash2 size={13} />
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminReviews;