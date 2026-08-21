import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ setSidebarOpen }) {
  const { user } = useAuth();

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

        <span
          className="
          text-lg
          font-bold
          tracking-wide
          text-white
          "
        >
          DRRCS
        </span>

        {/* Desktop Navigation */}

        <nav
          className="
          hidden
          items-center
          gap-6
          text-sm
          text-white/90
          md:flex
          md:ml-auto
          "
        >
          <Link
            to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className="cursor-pointer hover:text-white"
          >
            Home
          </Link>

          <span className="cursor-pointer hover:text-white">My Missions</span>

          {/* Report Disaster Link Button */}
          <Link
            to="/report"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="tracking-wide uppercase text-white drop-shadow-sm">⚠️ Report Emergency</span>
          </Link>

          {user?.role === "volunteer" && (
            <Link to="/profile" className="cursor-pointer hover:text-white">
              Profile
            </Link>
          )}

          {/* Avatar */}
          <span
            className="
            h-7
            w-7
            rounded-full
            bg-white/80
            "
          />
        </nav>

        {/* Mobile Avatar */}

        {user?.role === "volunteer" ? (
          <Link to="/profile">
            <span className="h-7 w-7 rounded-full bg-white/80 md:hidden" />
          </Link>
        ) : (
          <span className="h-7 w-7 rounded-full bg-white/80 md:hidden" />
        )}
      </div>
    </header>
  );
}