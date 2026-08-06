import { useAuth } from "../context/AuthContext";

// Placeholder landing page post-login --(for now, just shows the user's name and role, with a logout button.)
export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 text-center">
      <h1 className="text-xl font-bold text-brand-navy">
        Welcome, {user?.name}
      </h1>
      <p className="mt-1 text-sm text-gray-500 capitalize">
        Role: {user?.role}
      </p>
      <button
        onClick={logout}
        className="mt-4 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Log Out
      </button>
    </div>
  );
}
