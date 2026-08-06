import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>

          <p className="mt-2 text-gray-500 capitalize">Role: {user?.role}</p>

          {/* Stats cards and donation history will go here */}
        </main>
      </div>
    </div>
  );
}
