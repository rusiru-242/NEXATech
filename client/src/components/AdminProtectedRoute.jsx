import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearAuthSession, verifyAuthSession } from "../utils/auth";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("nexatech_token");
  const userData = localStorage.getItem("nexatech_user");
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAdminAuth = async () => {
      if (!token || !userData) {
        clearAuthSession();
        if (isMounted) {
          setIsAuthorized(false);
          setChecking(false);
        }
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== "admin") {
          if (isMounted) {
            setIsAuthorized(false);
            setChecking(false);
          }
          return;
        }

        // Verify active token against backend
        const validUser = await verifyAuthSession(API_URL);
        if (isMounted) {
          if (validUser && validUser.role === "admin") {
            setIsAuthorized(true);
          } else {
            clearAuthSession();
            setIsAuthorized(false);
          }
          setChecking(false);
        }
      } catch (error) {
        console.error("Admin auth check error:", error);
        clearAuthSession();
        if (isMounted) {
          setIsAuthorized(false);
          setChecking(false);
        }
      }
    };

    checkAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [token, userData]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-cyan-400 font-mono tracking-wider">VERIFYING ACCESS...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;