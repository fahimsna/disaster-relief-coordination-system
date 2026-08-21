import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import StageFeedItem from "../../components/StageFeedItem";
import { getStageFeed } from "../../api/stageApi";

export default function StageFeed() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeed = useCallback(async () => {
    try {
      const { data } = await getStageFeed();
      setUpdates(data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  // poll like the other coordinator dashboards -- near-real-time without a socket
  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 15000);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
              Coordination
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#222831]">
              Relief Distribution Feed
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Live, reverse-chronological updates from all deployed volunteers.
            </p>
          </div>
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            {loading ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Loading feed…
              </p>
            ) : error ? (
              <p className="py-10 text-center text-sm text-red-500">{error}</p>
            ) : updates.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                No progress updates yet.
              </p>
            ) : (
              <div className="space-y-3">
                {updates.map((u) => (
                  <StageFeedItem key={u._id} update={u} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
