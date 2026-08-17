import {
  User,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==============================
  // Load Current User
  // ==============================
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("nexatech_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
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
            data.message || "Unable to load account."
          );
        }

        setUser(data.user);

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        });

        // Keep localStorage updated
        localStorage.setItem(
          "nexatech_user",
          JSON.stringify(data.user)
        );
      } catch (err) {
        console.error("Account error:", err);

        if (
          err.message.includes("token") ||
          err.message.includes("authentication")
        ) {
          localStorage.removeItem("nexatech_token");
          localStorage.removeItem("nexatech_user");
          navigate("/login");
          return;
        }

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // ==============================
  // Input Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==============================
  // Password Input Change
  // ==============================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==============================
  // Update Profile
  // ==============================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      setUser(data.user);

      localStorage.setItem(
        "nexatech_user",
        JSON.stringify(data.user)
      );

      setMessage("Account details updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update profile.");
    }
  };

  // ==============================
  // Change Password
  // ==============================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("nexatech_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword:
              passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password."
        );
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage("Password changed successfully.");
    } catch (err) {
      console.error("Password change error:", err);
      setError(
        err.message || "Unable to change password."
      );
    }
  };

  // ==============================
  // Loading
  // ==============================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Loading Account...
        </p>
      </div>
    );
  }

  // ==============================
  // Page
  // ==============================
  return (
    <div className="min-h-screen bg-[#050505] px-5 pb-20 pt-28 text-white">

      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}
        <div className="mb-10">

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#00E5FF]"
          >
            <ArrowLeft size={14} />
            Back to Store
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#00E5FF]">
            MY ACCOUNT
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">
            Account
            <span className="text-gray-600"> details.</span>
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Manage your personal information and password.
          </p>

        </div>

        {/* ================= MESSAGE ================= */}
        {message && (
          <div className="mb-6 border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-4 py-3 text-sm text-[#00E5FF]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ================= PROFILE ================= */}
          <div className="border border-white/10 bg-[#090909] p-6 sm:p-8">

            <div className="mb-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#00E5FF]">
                PERSONAL INFORMATION
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Your Details
              </h2>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none focus:border-[#00E5FF]/60"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    value={formData.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed border border-white/10 bg-white/[0.01] pl-11 pr-4 text-sm text-gray-600 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none focus:border-[#00E5FF]/60"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Address
                </label>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-4 top-4 text-gray-700"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    rows={4}
                    className="w-full resize-none border border-white/10 bg-white/[0.02] pl-11 pr-4 pt-3 text-sm text-white outline-none focus:border-[#00E5FF]/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#00E5FF] text-sm font-bold text-black transition hover:bg-white"
              >
                <Save size={16} />
                Save Details
              </button>

            </form>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="border border-white/10 bg-[#090909] p-6 sm:p-8">

            <div className="mb-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#00E5FF]">
                SECURITY
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Change Password
              </h2>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5"
            >

              {/* Current Password */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Current Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none focus:border-[#00E5FF]/60"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none focus:border-[#00E5FF]/60"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Confirm New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white outline-none focus:border-[#00E5FF]/60"
                  />
                </div>
              </div>

              <div className="mt-4 border border-white/5 bg-white/[0.02] p-4 text-xs leading-5 text-gray-600">
                Your new password must contain at least 6
                characters.
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 border border-[#00E5FF]/40 text-sm font-semibold text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-black"
              >
                <LockKeyhole size={16} />
                Change Password
              </button>

            </form>
          </div>

        </div>

        {/* ================= QUICK LINKS ================= */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <Link
            to="/orders"
            className="border border-white/10 bg-[#090909] p-6 transition hover:border-[#00E5FF]/40"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">
              SHOPPING
            </p>

            <h3 className="mt-2 text-lg font-bold">
              My Orders
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              View your previous and current orders.
            </p>
          </Link>

          <Link
            to="/wishlist"
            className="border border-white/10 bg-[#090909] p-6 transition hover:border-[#00E5FF]/40"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">
              SAVED ITEMS
            </p>

            <h3 className="mt-2 text-lg font-bold">
              Wishlist
            </h3>

            <p className="mt-2 text-xs text-gray-600">
              View products you have saved.
            </p>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Account;