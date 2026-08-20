import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ setSidebarOpen }) {
  const { user } = useAuth();

  return (
    <header className="bg-brand-navy px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Mobile Hamburger */}

        <button
          onClick={() => setSidebarOpen(true)}
          className="
          text-2xl
          text-white
          md:hidden
          "
        >
          ☰
        </button>

        {/* Logo */}

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
            className="rounded-lg bg-[#00b4d8] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0096c7]"
          >
            Report Disaster
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
