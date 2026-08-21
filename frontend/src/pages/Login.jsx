import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      // Role based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        
        {/* Back Button */}
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-navy transition"
        >
          <span>←</span> Back to Home
        </Link>

        <h1 className="text-lg font-bold text-brand-navy">Log In</h1>

        {error && (
          <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="
              mt-1
              w-full
              rounded-lg
              border
              border-gray-300
              px-3
              py-2
              text-sm
              focus:border-brand-accent
              focus:outline-none
              "
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="
              mt-1
              w-full
              rounded-lg
              border
              border-gray-300
              px-3
              py-2
              text-sm
              focus:border-brand-accent
              focus:outline-none
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            rounded-lg
            bg-brand-navy
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
            disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          No account?{" "}
          <Link to="/signup" className="font-medium text-brand-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}