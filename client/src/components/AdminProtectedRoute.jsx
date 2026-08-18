import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("nexatech_token");
  const userData = localStorage.getItem("nexatech_user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);

    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("nexatech_token");
    localStorage.removeItem("nexatech_user");

    return <Navigate to="/login" replace />;
  }
};

export default AdminProtectedRoute;