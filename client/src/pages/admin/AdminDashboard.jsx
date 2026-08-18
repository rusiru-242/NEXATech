import {
  ArrowUpRight,
  Box,
  ChevronRight,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import AdminNavbar from "../../components/AdminNavbar";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ========================================
  LOAD ADMIN DASHBOARD
  ========================================
  */

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem(
        "nexatech_token"
      );

      const userData = localStorage.getItem(
        "nexatech_user"
      );

      if (!token || !userData) {
        navigate("/login");
        return;
      }

      try {
        const user = JSON.parse(userData);

        if (user.role !== "admin") {
          navigate("/");
          return;
        }

        setAdmin(user);

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load dashboard."
          );
        }

        setStats(data.stats);

      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);


  /*
  ========================================
  STAT CARDS
  ========================================
  */

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      link: "/admin/products",
    },

    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      link: "/admin/orders",
    },

    {
      title: "Total Customers",
      value: stats.totalUsers,
      icon: Users,
      link: "/admin/users",
    },

    {
      title: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: ArrowUpRight,
      link: "/admin/analytics",
    },
  ];


  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">

        <AdminNavbar />

        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#00e5ff]" />

            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              Loading Dashboard
            </p>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ========================================
          ADMIN NAVBAR
      ======================================== */}

      <AdminNavbar />


      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <main>

        <div className="mx-auto max-w-[1600px] p-6 sm:p-10">


          {/* ========================================
              PAGE HEADER
          ======================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-8"
          >

            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Dashboard
              <span className="text-gray-700">
                .
              </span>
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Welcome back,{" "}
              <span className="text-gray-400">
                {admin?.name}
              </span>
            </p>

          </motion.div>


          {/* ========================================
              ERROR
          ======================================== */}

          {error && (
            <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* ========================================
              STAT CARDS
          ======================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {statCards.map(
              (card, index) => {

                const Icon = card.icon;

                return (
                  <motion.div
                    key={card.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                    }}
                  >

                    <Link
                      to={card.link}
                      className="group block border border-white/10 bg-[#090909] p-5 transition hover:border-[#00e5ff]/30"
                    >

                      <div className="mb-6 flex items-start justify-between">

                        <div className="flex h-10 w-10 items-center justify-center bg-[#00e5ff]/5 text-[#00e5ff]">
                          <Icon size={18} />
                        </div>

                        <ArrowUpRight
                          size={15}
                          className="text-gray-700 transition group-hover:text-[#00e5ff]"
                        />

                      </div>

                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-600">
                        {card.title}
                      </p>

                      <p className="mt-2 text-2xl font-black">
                        {card.value}
                      </p>

                    </Link>

                  </motion.div>
                );
              }
            )}

          </div>


          {/* ========================================
              QUICK ACTIONS
          ======================================== */}

          <section className="mt-10">

            <div className="mb-5">

              <p className="text-[9px] uppercase tracking-[0.3em] text-gray-700">
                Quick Actions
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Manage Store
              </h2>

            </div>


            <div className="grid gap-4 md:grid-cols-3">


              {/* PRODUCTS */}

              <Link
                to="/admin/products"
                className="group border border-white/10 bg-[#090909] p-6 transition hover:border-[#00e5ff]/30"
              >

                <Box
                  size={22}
                  className="mb-5 text-[#00e5ff]"
                />

                <h3 className="font-bold">
                  Manage Products
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  Add, edit and remove products
                  from your store.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600 transition group-hover:text-[#00e5ff]">

                  Open

                  <ChevronRight size={13} />

                </div>

              </Link>


              {/* ORDERS */}

              <Link
                to="/admin/orders"
                className="group border border-white/10 bg-[#090909] p-6 transition hover:border-[#00e5ff]/30"
              >

                <ShoppingCart
                  size={22}
                  className="mb-5 text-[#00e5ff]"
                />

                <h3 className="font-bold">
                  Manage Orders
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  View customer orders and
                  update order status.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600 transition group-hover:text-[#00e5ff]">

                  Open

                  <ChevronRight size={13} />

                </div>

              </Link>


              {/* CUSTOMERS */}

              <Link
                to="/admin/users"
                className="group border border-white/10 bg-[#090909] p-6 transition hover:border-[#00e5ff]/30"
              >

                <Users
                  size={22}
                  className="mb-5 text-[#00e5ff]"
                />

                <h3 className="font-bold">
                  Manage Customers
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  View and manage registered
                  customer accounts.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600 transition group-hover:text-[#00e5ff]">

                  Open

                  <ChevronRight size={13} />

                </div>

              </Link>

            </div>

          </section>


          {/* ========================================
              SYSTEM STATUS
          ======================================== */}

          <section className="mt-10 border border-white/10 bg-[#090909] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-700">
                  System Status
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  NexaTech backend services
                </p>

              </div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#00e5ff]" />

                <span className="text-[10px] uppercase tracking-wider text-[#00e5ff]">
                  Operational
                </span>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;