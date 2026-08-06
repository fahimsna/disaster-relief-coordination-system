import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read from localStorage on first load so a refresh doesn't log people out
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password });
    persistSession(data);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await registerRequest(payload);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Grab this inside any component under <AuthProvider>
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
