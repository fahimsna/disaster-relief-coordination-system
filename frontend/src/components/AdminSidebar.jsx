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
      name: "Weather",
      path: "/admin/weather",
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
      name: "Campaign Analytics",
      path: "/admin/campaign-analytics",
    },
    {
      name: "SMS Broadcast",
      path: "/admin/sms-broadcast",
    },
  ];

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-[1px]
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          w-[260px]
          flex-col

          bg-[#30475E]
          text-white
          shadow-xl

          transition-transform
          duration-300
          ease-in-out

          md:sticky
          md:top-0
          md:flex
          md:translate-x-0

          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div
          className="
            flex
            min-h-[76px]
            items-center
            justify-between
            border-b
            border-white/10
            px-5
          "
        >
          <div>
            <h2 className="text-lg font-bold tracking-wide">DRRCS Admin</h2>

            <p className="mt-0.5 text-xs text-white/60">Administration Panel</p>
          </div>

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              rounded-lg
              p-2
              text-white/70
              transition
              hover:bg-white/10
              hover:text-white
              md:hidden
            "
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-4

            scrollbar-thin
          "
        >
          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-white/40
            "
          >
            Administration
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                    group
                    relative
                    flex
                    min-h-[44px]
                    items-center
                    rounded-xl
                    px-3.5
                    py-2.5

                    text-[13px]
                    font-medium

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-[#00ADB5]
                          text-white
                          shadow-md
                        `
                        : `
                          text-white/75
                          hover:bg-white/[0.08]
                          hover:text-white
                        `
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}

                    <span
                      className={`
                        absolute
                        left-0
                        top-1/2
                        h-6
                        w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-white

                        transition-opacity

                        ${isActive ? "opacity-100" : "opacity-0"}
                      `}
                    />

                    {/* Menu Icon */}

                    <span
                      className={`
                        mr-3
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-xs
                        font-bold

                        ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-white/[0.06] text-white/50 group-hover:text-white"
                        }
                      `}
                    >
                      {item.name.charAt(0)}
                    </span>

                    {/* Menu Name */}

                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* =================================================
            BOTTOM SECTION
        ================================================= */}

        <div
          className="
            border-t
            border-white/10
            bg-[#2b4055]
            p-3
          "
        >
          {/* Admin Status */}

          <div
            className="
              mb-3
              flex
              items-center
              gap-3
              rounded-xl
              bg-white/[0.05]
              px-3
              py-2.5
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#00ADB5]
                text-xs
                font-bold
              "
            >
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                Administrator
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                <span className="text-[10px] text-white/50">Online</span>
              </div>
            </div>
          </div>

          {/* Logout */}

          <button
            type="button"
            onClick={logout}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2

              rounded-xl
              border
              border-white/10
              bg-[#00ADB5]

              px-4
              py-2.5

              text-sm
              font-semibold
              text-white

              transition-all
              duration-200

              hover:bg-[#0097A0]
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            <span>↪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
