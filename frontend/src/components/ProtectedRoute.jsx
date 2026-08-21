import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

function isTokenValid(token) {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);

    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuth();

  // Not logged in
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (role && user?.role !== role) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
