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

  // Direct dashboard paths for the three supported roles
  const getDashboardPath = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "volunteer":
      case "donor":
        return "/dashboard"; // Both share the same dashboard
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
    <header className="bg-brand-navy px-4 sm:px-6 py-3 sticky top-0 z-50 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl text-white md:hidden hover:opacity-80 transition"
              aria-label="Open sidebar"
            >
              ☰
            </button>
          )}

          <Link
            to="/"
            className="text-xl font-black tracking-wider text-white flex items-center gap-2"
          >
            <span className="bg-[#00b4d8] text-white text-xs px-2.5 py-1 rounded font-extrabold shadow-sm">
              DRRCS
            </span>
          </Link>
        </div>

        {/* Middle: Centered Emergency Report Button */}
        <div className="flex-1 flex justify-center">
          <Link
            to="/report"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="tracking-wide uppercase text-white drop-shadow-sm">
              ⚠️ Report Emergency
            </span>
          </Link>
        </div>

        {/* Right: Dynamic Auth Section */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role-Based Dashboard Button (Admin, Volunteer, Donor) */}
              <Link
                to={getDashboardPath()}
                className="bg-[#00b4d8] hover:bg-[#0097b3] text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <span>Dashboard</span>
              </Link>

              {/* Logged-In User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30 uppercase hover:bg-white/30 transition">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white text-gray-800 shadow-xl py-1 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b text-xs font-bold text-gray-600 truncate">
                      <p className="text-gray-900 font-extrabold">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {user?.role || "User"}
                      </p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold hover:bg-gray-100 transition"
                    >
                      Dashboard
                    </Link>

                    {user?.role === "volunteer" && (
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-xs hover:bg-gray-100 transition"
                      >
                        Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-amber-700 font-semibold hover:bg-amber-50 transition border-t border-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest Auth Buttons */
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <Link
                to="/login"
                className="text-white/90 hover:text-white font-medium px-2 py-1 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 border border-white/20 transition shadow-sm"
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
