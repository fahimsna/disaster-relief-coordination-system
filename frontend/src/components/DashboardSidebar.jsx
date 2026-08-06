import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardSidebar = () => {
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
    <aside className="min-h-screen w-64 bg-[#393E46] px-5 py-6 text-white">
      <h1 className="mb-10 text-xl font-bold tracking-wide">DRRCS</h1>

      <nav className="space-y-2">
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
              transition

              ${
                isActive
                  ? "bg-[#00ADB5] text-white"
                  : "text-gray-200 hover:bg-[#222831]"
              }

              `
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="
        mt-10
        w-full
        rounded-xl
        bg-[#00ADB5]
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
};

export default DashboardSidebar;
