import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-brand-bg">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* =========================================================
            LEFT BRAND PANEL
        ========================================================= */}
        <div className="relative hidden overflow-hidden bg-brand-navy lg:flex lg:flex-col lg:justify-between">
          {/* Decorative shapes */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-accent/10" />
          <div className="absolute -bottom-40 -left-40 h-112 w-md rounded-full bg-white/5" />
          <div className="absolute right-20 top-1/3 h-24 w-24 rounded-full border border-white/10" />

          <div className="relative z-10 p-10 xl:p-14">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>

            <div className="mt-20 max-w-lg">
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
                <HeartHandshake
                  size={34}
                  className="text-brand-accent"
                  strokeWidth={2.2}
                />
              </div>

              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-accent">
                Disaster Relief Coordination
              </p>

              <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Welcome back to
                <span className="block text-brand-accent">DRRCS</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Coordinate relief efforts, support communities, and help make
                disaster response faster and more effective.
              </p>
            </div>
          </div>

          <div className="relative z-10 p-10 xl:p-14">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <ShieldCheck size={22} className="mb-3 text-brand-accent" />
                <p className="text-sm font-bold text-white">Secure Access</p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Protected account authentication
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <Users size={22} className="mb-3 text-brand-accent" />
                <p className="text-sm font-bold text-white">Community Driven</p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Connecting people with relief
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT LOGIN PANEL
        ========================================================= */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile back button */}
            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-brand-navy"
              >
                <ArrowLeft size={17} />
                Back to Home
              </Link>
            </div>

            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy shadow-sm">
                <HeartHandshake size={24} className="text-brand-accent" />
              </div>

              <div>
                <p className="text-lg font-extrabold text-brand-navy">DRRCS</p>
                <p className="text-[11px] font-medium text-gray-400">
                  Relief Coordination
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5">
                <LockKeyhole size={23} className="text-brand-navy" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Sign in to continue managing your relief activities.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
              {/* Error */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                    !
                  </div>

                  <p className="text-sm leading-5 text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={6}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white shadow-lg shadow-brand-navy/15 transition duration-200 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log In
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Signup */}
              <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-brand-accent transition hover:opacity-75"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              Secure access to your relief coordination account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
