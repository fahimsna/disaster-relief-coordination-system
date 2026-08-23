// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    const role = user?.role?.toLowerCase();

    switch (role) {
      case "admin":
        return "/admin/dashboard";

      case "volunteer":
      case "donor":
        return "/dashboard";

      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-1000 w-full border-b border-white/10 bg-brand-navy shadow-md">
      <div className="mx-auto flex min-h-15 w-full max-w-7xl min-w-0 items-center gap-2 px-3 sm:min-h-17 sm:gap-4 sm:px-6">
        {/* =====================================================
            LEFT — MENU + BRAND
        ===================================================== */}

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          {setSidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-white transition hover:bg-white/10 active:bg-white/20 md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
          )}

          <Link to="/" className="flex min-w-0 items-center gap-2 text-white">
            <span className="flex h-8 shrink-0 items-center rounded-md bg-[#00b4d8] px-2 text-[10px] font-black tracking-wide text-white shadow-sm sm:h-9 sm:px-2.5 sm:text-xs">
              DRRCS
            </span>

            <span className="hidden max-w-45 truncate text-sm font-bold sm:block">
              Disaster Response
            </span>
          </Link>
        </div>

        {/* =====================================================
            CENTER — EMERGENCY REPORT
        ===================================================== */}

        <div className="flex min-w-0 flex-1 justify-center px-1 sm:px-3">
          <Link
            to="/report"
            className="group flex min-w-0 max-w-full items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-2 text-[10px] font-extrabold text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] sm:gap-2.5 sm:px-5 sm:text-sm"
          >
            <span className="relative flex h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-full w-full rounded-full bg-white" />
            </span>

            <span className="truncate">
              <span className="sm:hidden">⚠️ Emergency</span>
              <span className="hidden sm:inline">⚠️ Report Emergency</span>
            </span>
          </Link>
        </div>

        {/* =====================================================
            RIGHT — AUTH
        ===================================================== */}

        <div className="flex shrink-0 items-center">
          {token ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Desktop Dashboard */}

              <Link
                to={getDashboardPath()}
                className="hidden rounded-lg bg-[#00b4d8] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0097b3] sm:block sm:text-sm"
              >
                Dashboard
              </Link>

              {/* User menu */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((value) => !value)}
                  className="flex h-9 w-9 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 sm:h-10 sm:w-10"
                  aria-label="Open user menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-xs font-bold uppercase text-white transition hover:bg-white/30 sm:h-9 sm:w-9">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                </button>

                {dropdownOpen && (
                  <>
                    {/* Mobile/desktop click-away layer */}

                    <button
                      type="button"
                      aria-label="Close user menu"
                      className="fixed inset-0 z-999 h-full w-full cursor-default bg-transparent"
                      onClick={() => setDropdownOpen(false)}
                    />

                    <div className="absolute right-0 top-full z-1001 mt-2 w-[calc(100vw-24px)] max-w-65 overflow-hidden rounded-xl border border-gray-100 bg-white text-gray-800 shadow-2xl sm:w-52">
                      {/* User information */}

                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="truncate text-sm font-extrabold text-gray-900">
                          {user?.name || "User"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] capitalize text-gray-400">
                          {user?.role || "User"}
                        </p>
                      </div>

                      {/* Dashboard */}

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm font-semibold transition hover:bg-gray-100 active:bg-gray-200 sm:py-2.5 sm:text-xs"
                      >
                        Dashboard
                      </Link>

                      {/* Volunteer profile */}

                      {user?.role === "volunteer" && (
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-3 text-sm transition hover:bg-gray-100 active:bg-gray-200 sm:py-2.5 sm:text-xs"
                        >
                          Profile
                        </Link>
                      )}

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm font-semibold text-amber-700 transition hover:bg-amber-50 active:bg-amber-100 sm:py-2.5 sm:text-xs"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* =================================================
               GUEST AUTH
            ================================================= */

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/login"
                className="rounded-lg px-2 py-2 text-[11px] font-medium text-white/90 transition hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-white/20 sm:px-3 sm:text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
