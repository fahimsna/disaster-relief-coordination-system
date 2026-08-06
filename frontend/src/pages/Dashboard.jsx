import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  const { user } = useAuth();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main
          className="
          flex-1

          p-4

          sm:p-6

          lg:p-8
          "
        >
          <h1
            className="
            text-2xl
            font-bold

            sm:text-3xl
            "
          >
            Welcome, {user?.name} 👋
          </h1>

          <p
            className="
            mt-2
            text-gray-500
            capitalize
            "
          >
            Role: {user?.role}
          </p>

          {/* Stats cards and donation history will go here */}
        </main>
      </div>
    </div>
  );
}
