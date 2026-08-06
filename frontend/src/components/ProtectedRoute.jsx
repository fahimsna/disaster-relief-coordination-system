import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

// Pure check, no side effects -- don't call logout() in here, that's a
// setState-during-render and React will complain
function isTokenValid(token) {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false; // malformed token, treat as logged out
  }
}

// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!isTokenValid(token)) return <Navigate to="/login" replace />;
  return children;
}
