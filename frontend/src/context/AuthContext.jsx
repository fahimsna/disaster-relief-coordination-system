import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../api/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

function decodeJwtPayload(token) {
  if (!token) return null;

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

  if (!payload) {
    return false;
  }

  if (!payload.exp) {
    return false;
  }

  return Date.now() < payload.exp * 1000;
}

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getInitialSession() {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUser = readStoredUser();

  if (!storedToken || !storedUser || !isTokenValid(storedToken)) {
    clearStoredSession();

    return {
      token: null,
      user: null,
    };
  }

  return {
    token: storedToken,
    user: storedUser,
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [session, setSession] = useState(getInitialSession);
  const [authReady, setAuthReady] = useState(false);

  const { token, user } = session;

  /*
   * Authentication initialization.
   *
   * We deliberately wait one render cycle before ProtectedRoute
   * starts making redirect decisions.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = readStoredUser();

    if (!storedToken || !storedUser || !isTokenValid(storedToken)) {
      clearStoredSession();

      setSession({
        token: null,
        user: null,
      });
    }

    setAuthReady(true);
  }, []);

  const persistSession = useCallback((data) => {
    if (!data?.token || !data?.user) {
      throw new Error(
        "Authentication succeeded but the server returned an invalid session.",
      );
    }

    const nextToken = data.token;
    const nextUser = data.user;

    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

    setSession({
      token: nextToken,
      user: nextUser,
    });
  }, []);

  const login = useCallback(
    async (email, password) => {
      if (!email?.trim() || !password) {
        throw new Error("Email and password are required.");
      }

      const response = await loginRequest({
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response?.data;

      if (!data?.token || !data?.user) {
        throw new Error(
          "Login succeeded but the server returned an invalid session.",
        );
      }

      persistSession(data);

      return data.user;
    },
    [persistSession],
  );

  const signup = useCallback(
    async (payload) => {
      const response = await registerRequest(payload);
      const data = response?.data;

      if (!data?.token || !data?.user) {
        throw new Error(
          "Registration succeeded but the server returned an invalid session.",
        );
      }

      persistSession(data);

      return data.user;
    },
    [persistSession],
  );

  const logout = useCallback(
    (redirect = true) => {
      clearStoredSession();

      setSession({
        token: null,
        user: null,
      });

      if (redirect) {
        navigate("/login", {
          replace: true,
        });
      }
    },
    [navigate],
  );

  /*
   * Automatically clear an expired JWT.
   */
  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const payload = decodeJwtPayload(token);

    if (!payload?.exp) {
      logout(false);
      return undefined;
    }

    const remaining = payload.exp * 1000 - Date.now();

    if (remaining <= 0) {
      logout(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      logout(false);
    }, remaining);

    return () => {
      window.clearTimeout(timer);
    };
  }, [token, logout]);

  /*
   * Synchronize login/logout between browser tabs.
   */
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== TOKEN_KEY && event.key !== USER_KEY) {
        return;
      }

      const nextToken = localStorage.getItem(TOKEN_KEY);
      const nextUser = readStoredUser();

      if (!nextToken || !nextUser || !isTokenValid(nextToken)) {
        clearStoredSession();

        setSession({
          token: null,
          user: null,
        });

        return;
      }

      setSession({
        token: nextToken,
        user: nextUser,
      });
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      authReady,

      isAuthenticated: Boolean(token && user && isTokenValid(token)),

      login,
      signup,
      logout,
    }),
    [token, user, authReady, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
