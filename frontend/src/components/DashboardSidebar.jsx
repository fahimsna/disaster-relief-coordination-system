import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DashboardSidebar({ open, setOpen }) {
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
  ];

  const handleLogout = () => {
    logout();

    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          z-40
          bg-black/50
          md:hidden
          "
        />
      )}

      <aside
        className={`
        fixed
        left-0
        top-0
        z-50

        flex
        min-h-screen
        w-72
        flex-col

        bg-[#30475E]
        px-6
        py-6

        text-white
        shadow-xl

        transition-transform
        duration-300

        md:static
        md:flex

        ${open ? "translate-x-0" : "-translate-x-full"}

        md:translate-x-0
        `}
      >
        {/* Mobile Header */}
        <div
          className="
          mb-8
          flex
          items-center
          justify-between
          md:hidden
          "
        >
          <h2
            className="
          text-xl
          font-bold
          "
          >
            DRRCS
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="
            rounded-lg
            p-2
            hover:bg-white/10
            "
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}

        <nav
          className="
          flex-1
          space-y-3
        "
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (setOpen) {
                  setOpen(false);
                }
              }}
              className={({ isActive }) =>
                `
                block
                rounded-xl
                px-5
                py-3.5

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
          onClick={handleLogout}
          className="
          mt-8
          w-full

          rounded-xl

          bg-[#00ADB5]

          px-5
          py-3.5

          text-sm
          font-semibold

          text-white

          transition

          hover:bg-[#0097A0]
          "
        >
          Log Out
        </button>
      </aside>
    </>
  );
}
