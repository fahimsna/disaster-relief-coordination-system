import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";
import { getMyDonations } from "../api/donationApi";

export default function MyDonations() {
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
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}

          <div>
            <h1 className="text-3xl font-bold text-[#222831]">My Donations</h1>

            <p className="mt-2 text-gray-500">
              Track your contribution history
            </p>
          </div>

          {/* Loading */}

          {loading && (
            <p className="mt-8 text-gray-500">Loading donations...</p>
          )}

          {/* Empty */}

          {!loading && donations.length === 0 && (
            <div
              className="
              mt-8
              rounded-2xl
              bg-white
              p-8
              shadow-sm
            "
            >
              <p className="text-gray-500">No donations found.</p>
            </div>
          )}

          {/* Donation Cards */}

          {!loading && donations.length > 0 && (
            <div
              className="
              mt-8
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              xl:grid-cols-3
              "
            >
              {donations.map((donation) => (
                <div
                  key={donation._id}
                  className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  "
                >
                  {/* Campaign Title */}

                  <h2
                    className="
                    text-xl
                    font-bold
                    text-[#222831]
                  "
                  >
                    {donation.campaign?.title || "Campaign"}
                  </h2>

                  {/* Details */}

                  <div
                    className="
                    mt-6
                    space-y-5
                  "
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>

                      <span
                        className="
                        text-lg
                        font-bold
                        text-[#00ADB5]
                      "
                      >
                        ৳ {donation.amount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Status</span>

                      <span
                        className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-green-700
                        "
                      >
                        {donation.paymentStatus}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>

                      <span className="font-medium text-gray-700">
                        {new Date(donation.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
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
