import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar({ open, setOpen }) {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Incident Command Map",
      path: "/admin/map",
    },
    {
      name: "Report Verification",
      path: "/admin/report-verification",
    },
    {
      name: "Severity Threshold",
      path: "/admin/severity-threshold",
    },
    {
      name: "Manage Campaigns",
      path: "/admin/campaigns",
    },
    {
      name: "Alert Configuration",
      path: "/admin/alerts",
    },
    {
      name: "Donation Analytics",
      path: "/admin/analytics",
    },
    {
      name: "SMS Broadcast",
      path: "/admin/sms-broadcast",
    },
  ];

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
          bg-black/40
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
        h-screen
        w-72
        flex-col
        bg-[#30475E]
        px-5
        py-6
        text-white
        shadow-lg

        transition-transform
        duration-300

        md:static
        md:flex
        md:translate-x-0

        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <h2
          className="
          mb-8
          text-xl
          font-bold
          "
        >
          DRRCS Admin
        </h2>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
              block
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition

              ${isActive ? "bg-[#00ADB5] shadow-md" : "hover:bg-[#222831]"}
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
          rounded-xl
          bg-[#00ADB5]
          px-4
          py-3
          font-semibold
          hover:bg-[#0097A0]
          "
        >
          Log Out
        </button>
      </aside>
    </>
  );
}