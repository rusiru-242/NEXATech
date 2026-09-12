/**
 * Centralized Authentication & Session Management for NexaTech Client
 */

export const clearAuthSession = () => {
  localStorage.removeItem("nexatech_token");
  localStorage.removeItem("nexatech_user");
  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("cartUpdated"));
};

/**
 * Verify current session with the backend.
 * If user was deleted by admin or token is invalid (HTTP 401/403/404),
 * clears storage and broadcasts authChanged event.
 */
let inFlightVerification = null;

export const verifyAuthSession = async (apiUrl) => {
  const token = localStorage.getItem("nexatech_token");
  if (!token) {
    clearAuthSession();
    return null;
  }

  if (inFlightVerification) {
    return inFlightVerification;
  }

  inFlightVerification = (async () => {
    try {
      const baseUrl = (apiUrl || import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          console.warn("[auth] Session invalid or user deleted by admin. Logging out.");
          clearAuthSession();
        }
        return null;
      }

      const data = await res.json();
      if (data?.user) {
        localStorage.setItem("nexatech_user", JSON.stringify(data.user));
        return data.user;
      }

      clearAuthSession();
      return null;
    } catch (err) {
      // If backend network request completely fails, keep cached session temporarily
      try {
        const cached = localStorage.getItem("nexatech_user");
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    } finally {
      inFlightVerification = null;
    }
  })();

  return inFlightVerification;
};
