import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return Date.now() < payload.exp * 1000;
}

export default function ProtectedRoute({ children, role }) {
  const { token, user, authReady, logout } = useAuth();

  const location = useLocation();

  /*
   * AuthContext is still restoring the session.
   *
   * NEVER redirect during this phase.
   */
  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />

          <p className="text-sm text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  /*
   * No valid authentication.
   */
  if (!token || !user || !isTokenValid(token)) {
    logout(false);

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
   * Route requires a specific role.
   */
  if (role && user.role !== role) {
    /*
     * Admin user attempting to access a non-admin role route.
     */
    if (user.role === "admin") {
      if (location.pathname === "/admin/dashboard") {
        return children;
      }

      return <Navigate to="/admin/dashboard" replace />;
    }

    /*
     * Non-admin attempting to access an admin route.
     */
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
