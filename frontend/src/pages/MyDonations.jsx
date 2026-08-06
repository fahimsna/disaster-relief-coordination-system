import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";
import { getMyDonations } from "../api/donationApi";
import { useAuth } from "../context/AuthContext";

export default function MyDonations() {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await getMyDonations(token);

        setDonations(response.data);
      } catch (error) {
        console.error("Failed to load donations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-slate-800">My Donations</h1>

          <p className="mt-2 text-gray-500">Track your donation history</p>

          {loading ? (
            <p className="mt-8">Loading donations...</p>
          ) : donations.length === 0 ? (
            <div className="mt-8 rounded-xl bg-white p-8 shadow">
              <p className="text-gray-500">
                You haven't made any donations yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5">
              {donations.map((donation) => (
                <div
                  key={donation._id}
                  className="rounded-xl bg-white p-6 shadow"
                >
                  <h2 className="text-xl font-bold">
                    {donation.campaign?.title || "Campaign"}
                  </h2>

                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Amount</p>

                      <p className="font-semibold">৳ {donation.amount}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Status</p>

                      <p className="font-semibold text-green-600">
                        {donation.status}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Date</p>

                      <p className="font-semibold">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
