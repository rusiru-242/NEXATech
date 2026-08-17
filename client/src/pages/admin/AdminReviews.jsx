import {
  Search,
  Star,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

function AdminReviews() {
  const [search, setSearch] = useState("");

  const [reviews] = useState([
    {
      id: 1,
      customer: "Kasun Perera",
      email: "kasun@gmail.com",
      product: "Nexa Pro Laptop",
      rating: 5,
      review:
        "Excellent laptop. The performance is really good and the build quality is amazing.",
      date: "Aug 15, 2026",
      status: "Published",
    },
    {
      id: 2,
      customer: "Amaya Fernando",
      email: "amaya@gmail.com",
      product: "Ultra X Smartphone",
      rating: 4,
      review:
        "Great phone with a beautiful display. Battery life could be slightly better.",
      date: "Aug 14, 2026",
      status: "Published",
    },
    {
      id: 3,
      customer: "Nimal Silva",
      email: "nimal@gmail.com",
      product: "Pulse Gaming Headset",
      rating: 5,
      review:
        "Very comfortable headset with excellent sound quality. Perfect for gaming.",
      date: "Aug 13, 2026",
      status: "Published",
    },
    {
      id: 4,
      customer: "Sahan Wijesinghe",
      email: "sahan@gmail.com",
      product: "Vision 4K Monitor",
      rating: 3,
      review:
        "The picture quality is good, but I expected better speakers at this price.",
      date: "Aug 12, 2026",
      status: "Pending",
    },
    {
      id: 5,
      customer: "Dilshan Perera",
      email: "dilshan@gmail.com",
      product: "Nexa Mechanical Keyboard",
      rating: 5,
      review:
        "Amazing keyboard. The typing experience is excellent and the design looks premium.",
      date: "Aug 10, 2026",
      status: "Published",
    },
  ]);

  const filteredReviews = reviews.filter(
    (review) =>
      review.customer.toLowerCase().includes(search.toLowerCase()) ||
      review.product.toLowerCase().includes(search.toLowerCase()) ||
      review.review.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={
              star <= rating
                ? "fill-[#00E5FF] text-[#00E5FF]"
                : "text-gray-700"
            }
          />
        ))}
      </div>
    );
  };

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
              Reviews
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage customer reviews and feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-3">
            <MessageSquare
              size={16}
              className="text-[#00E5FF]"
            />

            <span className="text-xs text-gray-400">
              {reviews.length} Reviews
            </span>
          </div>

        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* ================= STATS ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Reviews */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Reviews
              </p>

              <MessageSquare
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              5
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Customer reviews
            </p>

          </div>

          {/* Average Rating */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Average Rating
              </p>

              <Star
                size={18}
                className="fill-[#00E5FF] text-[#00E5FF]"
              />

            </div>

            <div className="mt-5 flex items-center gap-3">

              <p className="text-4xl font-bold tracking-tight">
                4.4
              </p>

              {renderStars(4)}

            </div>

            <p className="mt-2 text-xs text-gray-600">
              Overall customer rating
            </p>

          </div>

          {/* Published */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Published
              </p>

              <CheckCircle
                size={18}
                className="text-green-400"
              />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              4
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Visible to customers
            </p>

          </div>

          {/* Pending */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Pending
              </p>

              <MessageSquare
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight">
              1
            </p>

            <p className="mt-2 text-xs text-gray-600">
              Awaiting moderation
            </p>

          </div>

        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <section className="mt-8 border border-white/10 bg-[#090909]">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-semibold">
                Customer Reviews
              </h2>

              <p className="mt-1 text-xs text-gray-600">
                Review and moderate customer feedback.
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
                placeholder="Search reviews..."
                className="h-10 w-full border border-white/10 bg-white/[0.02] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-gray-700 focus:border-[#00E5FF]/50"
              />

            </div>

          </div>

          {/* ================= REVIEW LIST ================= */}
          <div>

            {filteredReviews.map((review) => (

              <div
                key={review.id}
                className="border-b border-white/5 p-6 transition hover:bg-white/[0.02]"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  {/* Left */}
                  <div className="flex gap-4">

                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold text-gray-400">
                      {review.customer
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    {/* Review Content */}
                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="text-sm font-semibold text-white">
                          {review.customer}
                        </p>

                        <span className="text-[10px] text-gray-700">
                          {review.date}
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-gray-600">
                        {review.email}
                      </p>

                      {/* Product */}
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#00E5FF]">
                        {review.product}
                      </p>

                      {/* Rating */}
                      <div className="mt-3">
                        {renderStars(review.rating)}
                      </div>

                      {/* Review */}
                      <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
                        {review.review}
                      </p>

                    </div>

                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-end">

                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider ${
                        review.status === "Published"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          review.status === "Published"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      />

                      {review.status}

                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-white/25 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-gray-500 transition hover:border-red-500/50 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Empty */}
          {filteredReviews.length === 0 && (
            <div className="px-5 py-16 text-center">

              <MessageSquare
                size={28}
                className="mx-auto text-gray-700"
              />

              <p className="mt-4 text-sm text-gray-500">
                No reviews found.
              </p>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AdminReviews;