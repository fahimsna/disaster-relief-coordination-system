import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function CampaignAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/api/campaign-analytics`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load campaign analytics.");
      }

      setAnalytics(data);
    } catch (error) {
      console.error("Campaign analytics error:", error);

      setError(error.message || "Failed to load campaign analytics.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen">
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="flex min-h-[70vh] items-center justify-center">
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-200
                    border-t-[#00ADB5]
                  "
                />

                <p className="mt-4 text-sm text-gray-500">
                  Loading campaign analytics...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen">
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-6
              "
            >
              <h2 className="text-lg font-bold text-red-700">
                Unable to load campaign analytics
              </h2>

              <p className="mt-2 text-sm text-red-600">{error}</p>

              <button
                onClick={fetchAnalytics}
                className="
                  mt-4
                  rounded-xl
                  bg-[#30475E]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#222831]
                "
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const summary = analytics?.summary || {};

  const campaignBreakdown = analytics?.campaignBreakdown || [];

  const paymentStatusSummary = analytics?.paymentStatusSummary || [];

  const recentDonations = analytics?.recentDonations || [];

  // =====================================================
  // HELPERS
  // =====================================================

  const formatMoney = (value) =>
    `৳${Number(value || 0).toLocaleString("en-BD")}`;

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Failed") {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
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

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-[#222831]
                  sm:text-3xl
                "
              >
                Campaign Analytics
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Donation performance and campaign contribution overview.
              </p>
            </div>

            <button
              onClick={fetchAnalytics}
              className="
                w-fit
                rounded-xl
                bg-[#30475E]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#222831]
              "
            >
              Refresh
            </button>
          </div>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <section
            className="
              mt-8
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {/* Total Raised */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">Total Raised</p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-[#00ADB5]
                  sm:text-3xl
                "
              >
                {formatMoney(summary.totalRaised)}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Successful donations only
              </p>
            </div>

            {/* Successful Donations */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">
                Successful Donations
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-[#30475E]
                  sm:text-3xl
                "
              >
                {Number(summary.totalDonations || 0).toLocaleString("en-BD")}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Completed Stripe payments
              </p>
            </div>

            {/* Average Donation */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">
                Average Donation
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-blue-600
                  sm:text-3xl
                "
              >
                {formatMoney(summary.averageDonation)}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Average successful contribution
              </p>
            </div>

            {/* Campaign Count */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">
                Campaigns Receiving Funds
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-green-600
                  sm:text-3xl
                "
              >
                {Number(summary.campaignCount || 0).toLocaleString("en-BD")}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Campaigns with paid donations
              </p>
            </div>
          </section>

          {/* =================================================
              CAMPAIGN BREAKDOWN
          ================================================= */}

          <section
            className="
              mt-8
              rounded-2xl
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                border-b
                border-gray-100
                p-6
              "
            >
              <h2 className="text-xl font-bold text-[#222831]">
                Campaign Donation Breakdown
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare successful donations across campaigns.
              </p>
            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Campaign
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Raised
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Donations
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Average
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Target Progress
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Share
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {campaignBreakdown.map((campaign) => (
                    <tr
                      key={campaign.campaignId}
                      className="
                          border-b
                          border-gray-50
                          last:border-0
                          hover:bg-gray-50
                        "
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#222831]">
                          {campaign.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {campaign.disasterType || "Disaster type unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {campaign.location || "Location unavailable"}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-semibold text-[#00ADB5]">
                        {formatMoney(campaign.totalRaised)}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {Number(campaign.donationCount || 0).toLocaleString(
                          "en-BD",
                        )}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        {formatMoney(campaign.averageDonation)}
                      </td>

                      <td className="min-w-[180px] px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="
                                  h-full
                                  rounded-full
                                  bg-[#00ADB5]
                                "
                              style={{
                                width: `${Math.min(
                                  Number(campaign.targetProgress || 0),
                                  100,
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-gray-600">
                            {Number(campaign.targetProgress || 0).toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-[#30475E]">
                          {Number(campaign.percentageOfTotal || 0).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="space-y-4 p-4 md:hidden">
              {campaignBreakdown.map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="
                      rounded-xl
                      border
                      border-gray-100
                      p-4
                    "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#222831]">
                        {campaign.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {campaign.location || "Location unavailable"}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {Number(campaign.percentageOfTotal || 0).toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Raised</p>

                      <p className="mt-1 font-semibold text-[#00ADB5]">
                        {formatMoney(campaign.totalRaised)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Donations</p>

                      <p className="mt-1 font-semibold text-gray-700">
                        {campaign.donationCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Average</p>

                      <p className="mt-1 font-semibold text-gray-700">
                        {formatMoney(campaign.averageDonation)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Target Progress</p>

                      <p className="mt-1 font-semibold text-blue-600">
                        {Number(campaign.targetProgress || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="
                            h-full
                            rounded-full
                            bg-[#00ADB5]
                          "
                        style={{
                          width: `${Math.min(
                            Number(campaign.targetProgress || 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {campaignBreakdown.length === 0 && (
              <div className="p-8 text-center text-sm text-gray-500">
                No successful campaign donations available.
              </div>
            )}
          </section>

          {/* =================================================
              PAYMENT STATUS + RECENT DONATIONS
          ================================================= */}

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-2
            "
          >
            {/* Payment Status */}

            <section
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-xl font-bold text-[#222831]">
                Payment Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current donation payment statuses.
              </p>

              <div className="mt-6 space-y-4">
                {paymentStatusSummary.map((item) => (
                  <div
                    key={item.status}
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-gray-100
                        p-4
                      "
                  >
                    <div>
                      <span
                        className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${getStatusStyle(item.status)}
                          `}
                      >
                        {item.status}
                      </span>

                      <p className="mt-2 text-xs text-gray-400">
                        {item.count} donation
                        {item.count === 1 ? "" : "s"}
                      </p>
                    </div>

                    <p className="font-bold text-[#222831]">
                      {formatMoney(item.amount)}
                    </p>
                  </div>
                ))}

                {paymentStatusSummary.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No donation records available.
                  </p>
                )}
              </div>
            </section>

            {/* Recent Donations */}

            <section
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-xl font-bold text-[#222831]">
                Recent Successful Donations
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest completed Stripe payments.
              </p>

              <div className="mt-6 space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation._id}
                    className="
                        rounded-xl
                        border
                        border-gray-100
                        p-4
                      "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#222831]">
                          {donation.campaign?.title || "Campaign unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {donation.donor?.name || "Anonymous donor"}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-bold text-[#00ADB5]">
                        {formatMoney(donation.amount)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span>Stripe</span>

                      <span>•</span>

                      <span>
                        {donation.createdAt
                          ? new Date(donation.createdAt).toLocaleDateString(
                              "en-BD",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Date unavailable"}
                      </span>

                      <span
                        className="
                            ml-auto
                            rounded-full
                            bg-green-50
                            px-2.5
                            py-1
                            font-semibold
                            text-green-700
                          "
                      >
                        Paid
                      </span>
                    </div>
                  </div>
                ))}

                {recentDonations.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No successful donations yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              FOOTER INFO
          ================================================= */}

          <div
            className="
              mt-8
              rounded-2xl
              bg-[#30475E]
              p-6
              text-white
              shadow-sm
            "
          >
            <h2 className="text-lg font-bold">Campaign Analytics</h2>

            <p className="mt-1 text-sm text-gray-300">
              Analytics are calculated from recorded donation transactions. Only
              successful Stripe payments are included in total raised funds.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
