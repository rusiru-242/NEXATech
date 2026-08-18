import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Star,
  Tags,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tags,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: Star,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("nexatech_token");
    localStorage.removeItem("nexatech_user");

    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/95 text-white backdrop-blur-xl">

      {/* ================= DESKTOP NAVBAR ================= */}

      <div className="mx-auto flex h-20 max-w-[1600px] items-center px-5 sm:px-8">

        {/* LOGO */}

        <Link
          to="/admin"
          className="mr-8 shrink-0 text-xl font-black tracking-[-0.06em]"
        >
          <span className="text-white">NEXA</span>
          <span className="text-[#00E5FF]">TECH</span>

          <span className="ml-2 border border-[#00E5FF]/30 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
            Admin
          </span>
        </Link>


        {/* DESKTOP MENU */}

        <nav className="hidden flex-1 items-center gap-1 lg:flex">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-2 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                  active
                    ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                    : "text-gray-500 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={14} />

                {item.name}
              </Link>
            );
          })}

        </nav>


        {/* RIGHT SIDE */}

        <div className="ml-auto flex items-center gap-4">

          {/* ADMIN */}

          <div className="hidden text-right sm:block">

            <p className="text-[10px] font-semibold text-white">
              Admin
            </p>

            <p className="text-[8px] uppercase tracking-[0.15em] text-gray-600">
              Administrator
            </p>

          </div>


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="hidden items-center gap-2 border border-white/10 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-500 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 sm:flex"
          >
            <LogOut size={13} />

            Logout
          </button>


          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-gray-400 transition hover:border-[#00e5ff]/30 hover:text-[#00e5ff] lg:hidden"
          >
            {mobileMenu ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>

        </div>

      </div>


      {/* ================= MOBILE MENU ================= */}

      {mobileMenu && (
        <div className="border-t border-white/10 bg-[#080808] lg:hidden">

          <nav className="mx-auto max-w-[1600px] px-5 py-4 sm:px-8">

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setMobileMenu(false)
                  }
                  className={`flex items-center gap-3 border-b border-white/[0.05] px-3 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition ${
                    active
                      ? "text-[#00e5ff]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Icon size={15} />

                  {item.name}

                </Link>
              );
            })}


            {/* MOBILE LOGOUT */}

            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-3 px-3 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-red-400"
            >
              <LogOut size={15} />

              Logout
            </button>

          </nav>

        </div>
      )}

    </header>
  );
}

export default AdminNavbar;