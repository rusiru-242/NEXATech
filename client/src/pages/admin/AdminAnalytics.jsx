import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

function AdminAnalytics() {
  const salesData = [
    { month: "Jan", sales: 320000 },
    { month: "Feb", sales: 410000 },
    { month: "Mar", sales: 380000 },
    { month: "Apr", sales: 520000 },
    { month: "May", sales: 610000 },
    { month: "Jun", sales: 570000 },
    { month: "Jul", sales: 740000 },
    { month: "Aug", sales: 820000 },
  ];

  const maxSales = Math.max(...salesData.map((item) => item.sales));

  const topProducts = [
    {
      name: "Nexa Pro Laptop",
      category: "Laptops",
      sales: 128,
      revenue: "Rs. 36.9M",
    },
    {
      name: "Ultra X Smartphone",
      category: "Smartphones",
      sales: 96,
      revenue: "Rs. 18.1M",
    },
    {
      name: "Pulse Gaming Headset",
      category: "Gaming",
      sales: 74,
      revenue: "Rs. 3.6M",
    },
    {
      name: "Vision 4K Monitor",
      category: "Monitors",
      sales: 52,
      revenue: "Rs. 8.2M",
    },
  ];

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
              Analytics
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Monitor sales, customers and store performance.
            </p>
          </div>

          {/* Date */}
          <div className="hidden items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-3 sm:flex">
            <CalendarDays size={15} className="text-gray-500" />

            <span className="text-xs text-gray-500">
              Jan — Aug 2026
            </span>
          </div>

        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">

        {/* ================= OVERVIEW ================= */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Revenue */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Revenue
              </p>

              <DollarSign
                size={18}
                className="text-[#00E5FF]"
              />

            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
              Rs. 42.8M
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs">

              <TrendingUp
                size={13}
                className="text-green-400"
              />

              <span className="text-green-400">
                +18.4%
              </span>

              <span className="text-gray-700">
                vs last period
              </span>

            </div>

          </div>

          {/* Orders */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Orders
              </p>

              <ShoppingBag
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
              1,284
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs">

              <TrendingUp
                size={13}
                className="text-green-400"
              />

              <span className="text-green-400">
                +12.7%
              </span>

              <span className="text-gray-700">
                vs last period
              </span>

            </div>

          </div>

          {/* Customers */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Customers
              </p>

              <Users
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
              8,492
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs">

              <TrendingUp
                size={13}
                className="text-green-400"
              />

              <span className="text-green-400">
                +9.3%
              </span>

              <span className="text-gray-700">
                vs last period
              </span>

            </div>

          </div>

          {/* Products */}
          <div className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <p className="text-xs uppercase tracking-wider text-gray-600">
                Products Sold
              </p>

              <Package
                size={18}
                className="text-gray-600"
              />

            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
              3,847
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs">

              <TrendingDown
                size={13}
                className="text-red-400"
              />

              <span className="text-red-400">
                -2.1%
              </span>

              <span className="text-gray-700">
                vs last period
              </span>

            </div>

          </div>

        </div>

        {/* ================= CHART + TOP PRODUCTS ================= */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Sales Chart */}
          <section className="border border-white/10 bg-[#090909] p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#00E5FF]">
                  Performance
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Sales Overview
                </h2>

              </div>

              <span className="text-xs text-gray-600">
                2026
              </span>

            </div>

            {/* Chart */}
            <div className="mt-10 flex h-[300px] items-end gap-3 border-b border-l border-white/10 px-3 pb-0 sm:gap-5">

              {salesData.map((item) => {

                const height =
                  (item.sales / maxSales) * 100;

                return (
                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >

                    <div className="relative flex flex-1 items-end justify-center">

                      <div
                        className="w-full max-w-[45px] bg-[#00E5FF]/70 transition-all duration-300 group-hover:bg-[#00E5FF]"
                        style={{
                          height: `${height}%`,
                        }}
                      >

                        <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[9px] text-gray-400 group-hover:block">
                          Rs. {(item.sales / 1000).toFixed(0)}K
                        </div>

                      </div>

                    </div>

                    <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-gray-600">
                      {item.month}
                    </p>

                  </div>
                );
              })}

            </div>

            <div className="mt-6 flex items-center justify-between">

              <div>
                <p className="text-xs text-gray-600">
                  Total sales
                </p>

                <p className="mt-1 text-lg font-semibold">
                  Rs. 4.37M
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-green-400">
                <TrendingUp size={13} />
                +18.4%
              </div>

            </div>

          </section>

          {/* Top Products */}
          <section className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#00E5FF]">
                  Best Sellers
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Top Products
                </h2>

              </div>

              <ArrowUpRight
                size={18}
                className="text-gray-600"
              />

            </div>

            <div className="mt-8 space-y-6">

              {topProducts.map((product, index) => (

                <div
                  key={product.name}
                  className="flex items-start gap-4"
                >

                  <span className="text-xs font-bold text-gray-700">
                    0{index + 1}
                  </span>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-gray-300">
                      {product.name}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-700">
                      {product.category}
                    </p>

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-xs text-gray-600">
                        {product.sales} sold
                      </span>

                      <span className="text-xs font-semibold text-gray-400">
                        {product.revenue}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>

        {/* ================= ADDITIONAL METRICS ================= */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* Customer Growth */}
          <section className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#00E5FF]">
                  Customers
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Customer Growth
                </h2>

              </div>

              <Users
                size={18}
                className="text-gray-600"
              />

            </div>

            <div className="mt-8">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-4xl font-bold">
                    8,492
                  </p>

                  <p className="mt-2 text-xs text-gray-600">
                    Total registered customers
                  </p>

                </div>

                <span className="text-sm font-semibold text-green-400">
                  +9.3%
                </span>

              </div>

              {/* Progress */}
              <div className="mt-8 h-2 w-full bg-white/5">

                <div
                  className="h-full bg-[#00E5FF]"
                  style={{ width: "76%" }}
                />

              </div>

              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-gray-700">

                <span>
                  Previous
                </span>

                <span>
                  Current
                </span>

              </div>

            </div>

          </section>

          {/* Conversion */}
          <section className="border border-white/10 bg-[#090909] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-[#00E5FF]">
                  Store Performance
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Conversion Rate
                </h2>

              </div>

              <TrendingUp
                size={18}
                className="text-gray-600"
              />

            </div>

            <div className="mt-8 flex items-end justify-between">

              <div>

                <p className="text-4xl font-bold">
                  6.84%
                </p>

                <p className="mt-2 text-xs text-gray-600">
                  Visitors converted to customers
                </p>

              </div>

              <span className="text-sm font-semibold text-green-400">
                +1.2%
              </span>

            </div>

            {/* Conversion bars */}
            <div className="mt-8 space-y-4">

              <div>

                <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider">

                  <span className="text-gray-600">
                    Product Views
                  </span>

                  <span className="text-gray-500">
                    84%
                  </span>

                </div>

                <div className="h-1.5 bg-white/5">

                  <div
                    className="h-full bg-gray-600"
                    style={{ width: "84%" }}
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider">

                  <span className="text-gray-600">
                    Add to Cart
                  </span>

                  <span className="text-gray-500">
                    42%
                  </span>

                </div>

                <div className="h-1.5 bg-white/5">

                  <div
                    className="h-full bg-gray-500"
                    style={{ width: "42%" }}
                  />

                </div>

              </div>

              <div>

                <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider">

                  <span className="text-gray-600">
                    Completed Orders
                  </span>

                  <span className="text-gray-500">
                    18%
                  </span>

                </div>

                <div className="h-1.5 bg-white/5">

                  <div
                    className="h-full bg-[#00E5FF]"
                    style={{ width: "18%" }}
                  />

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminAnalytics;