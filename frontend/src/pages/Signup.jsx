import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";

const ROLES = ["volunteer", "donor"];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "volunteer",
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
      // NOTE: backend User schema missed `phone`, ping M3
      await signup(form);

      if (form.role === "volunteer") {
        navigate("/register");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
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
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-brand-accent/10" />
          <div className="absolute -bottom-48 -right-40 h-120 w-120 rounded-full bg-white/5" />
          <div className="absolute left-1/2 top-1/3 h-32 w-32 rounded-full border border-white/10" />

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
                Join the Community
              </p>

              <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Be part of
                <span className="block text-brand-accent">
                  meaningful action
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Join our relief coordination platform and help communities
                respond, recover, and rebuild together.
              </p>
            </div>
          </div>

          <div className="relative z-10 p-10 xl:p-14">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <CheckCircle2 size={18} className="text-brand-accent" />
                Connect with relief initiatives
              </div>

              <div className="flex items-center gap-3 text-sm text-white/70">
                <CheckCircle2 size={18} className="text-brand-accent" />
                Support communities in need
              </div>

              <div className="flex items-center gap-3 text-sm text-white/70">
                <CheckCircle2 size={18} className="text-brand-accent" />
                Coordinate meaningful contributions
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT SIGNUP PANEL
        ========================================================= */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile back */}
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
            <div className="mb-7">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5">
                <Users size={23} className="text-brand-navy" />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-brand-navy">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Get started by creating your DRRCS account.
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/10"
                    />
                  </div>
                </div>

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

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

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
                      autoComplete="new-password"
                      placeholder="Create a password"
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

                  <p className="mt-1.5 text-xs text-gray-400">
                    Password must be at least 6 characters.
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((role) => {
                      const selected = form.role === role;

                      return (
                        <label
                          key={role}
                          className={`relative cursor-pointer rounded-xl border p-4 transition ${
                            selected
                              ? "border-brand-accent bg-brand-accent/5 ring-2 ring-brand-accent/10"
                              : "border-gray-200 bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role}
                            checked={selected}
                            onChange={handleChange}
                            className="sr-only"
                          />

                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-bold capitalize text-brand-navy">
                                {role}
                              </p>

                              <p className="mt-1 text-[11px] leading-4 text-gray-400">
                                {role === "volunteer"
                                  ? "Help coordinate relief"
                                  : "Support relief campaigns"}
                              </p>
                            </div>

                            {selected && (
                              <CheckCircle2
                                size={18}
                                className="shrink-0 text-brand-accent"
                              />
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white shadow-lg shadow-brand-navy/15 transition duration-200 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-brand-accent transition hover:opacity-75"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              Together, we can make disaster response stronger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
