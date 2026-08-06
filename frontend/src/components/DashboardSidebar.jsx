import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Browse Campaigns",
      path: "/campaigns",
    },
    {
      name: "My Donations",
      path: "/donations",
    },
    {
      name: "Donation History",
      path: "/donation-history",
    },
    {
      name: "Profile",
      path: "/profile",
    },
  ];

  return (
    <aside
      className="
      hidden
      md:flex
      md:min-h-screen
      md:w-64
      flex-col
      bg-[#30475E]
      px-5
      py-6
      text-white
      shadow-lg
      "
    >
      {/* Navigation */}

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              block
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition-all

              ${
                isActive
                  ? "bg-[#00ADB5] text-white shadow-md"
                  : "text-white/90 hover:bg-[#222831]"
              }
              `
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}

      <button
        onClick={logout}
        className="
        mt-8
        w-full
        rounded-xl
        bg-[#00ADB5]
        px-4
        py-3
        text-sm
        font-semibold
        text-white
        hover:bg-[#0097A0]
        "
      >
        Log Out
      </button>
    </aside>
  );
}
