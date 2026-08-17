import { useState } from "react";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main
          className="
          flex-1
          p-4
          sm:p-6
          lg:p-8
          "
        >
          {/* Mobile Menu Button */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="
            mb-5
            rounded-xl
            bg-[#30475E]
            px-4
            py-2
            text-white
            md:hidden
            "
          >
            ☰ Menu
          </button>

          <h1
            className="
            text-3xl
            font-bold
            text-[#222831]
            "
          >
            Welcome Admin, {user?.name} 👋
          </h1>

          <p
            className="
            mt-2
            text-gray-500
            "
          >
            Manage disaster relief campaigns and donations.
          </p>

          {/* Stats */}

          <div
            className="
            mt-8
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            "
          >
            <div
              className="
              rounded-2xl
              bg-white
              p-6
              shadow-sm
              "
            >
              <h2 className="text-gray-500">Total Campaigns</h2>

              <p
                className="
                mt-3
                text-3xl
                font-bold
                text-[#00ADB5]
                "
              >
                --
              </p>
            </div>

            <div
              className="
              rounded-2xl
              bg-white
              p-6
              shadow-sm
              "
            >
              <h2 className="text-gray-500">Total Donations</h2>

              <p
                className="
                mt-3
                text-3xl
                font-bold
                text-green-600
                "
              >
                ৳ --
              </p>
            </div>

            <div
              className="
              rounded-2xl
              bg-white
              p-6
              shadow-sm
              "
            >
              <h2 className="text-gray-500">Active Campaigns</h2>

              <p
                className="
                mt-3
                text-3xl
                font-bold
                text-blue-600
                "
              >
                --
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
