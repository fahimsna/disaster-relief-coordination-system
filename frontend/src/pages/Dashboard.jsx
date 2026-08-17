import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  const { user } = useAuth();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

<<<<<<< HEAD
  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch transparency dashboard
  // --------------------------------------------------

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getFundAllocationDashboard();

      console.log("Fund allocation dashboard:", response.data);

      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to load transparency dashboard:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load transparency dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="flex min-h-100 items-center justify-center">
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
                  Loading transparency dashboard...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

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
                Unable to load dashboard
              </h2>

              <p className="mt-2 text-sm text-red-600">{error}</p>

              <button
                onClick={fetchDashboard}
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

  // --------------------------------------------------
  // Data
  // --------------------------------------------------

  const summary = dashboardData?.summary || {};

  const campaignBreakdown = dashboardData?.campaignBreakdown || [];

  const categoryBreakdown = dashboardData?.categoryBreakdown || [];

  const recentAllocations = dashboardData?.recentAllocations || [];

=======
>>>>>>> fa2469501dd2f773472c7c663117f8e61a6a31c1
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

<<<<<<< HEAD
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
                ৳{Number(summary.totalRaised || 0).toLocaleString("en-BD")}
              </p>

              <p className="mt-2 text-xs text-gray-400">Across all campaigns</p>
            </div>

            {/* Total Allocated */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">
                Total Allocated
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
                ৳{Number(summary.totalAllocated || 0).toLocaleString("en-BD")}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Funds assigned to relief
              </p>
            </div>

            {/* Remaining */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">
                Remaining Funds
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
                ৳{Number(summary.totalRemaining || 0).toLocaleString("en-BD")}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Available for allocation
              </p>
            </div>

            {/* Allocation Percentage */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-gray-500">
                Allocation Progress
              </p>

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-orange-500
                  sm:text-3xl
                "
              >
                {Number(summary.allocationPercentage || 0).toFixed(2)}%
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Of total raised funds
              </p>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Campaign Breakdown */}
          {/* ------------------------------------------------ */}

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
              <h2
                className="
                  text-xl
                  font-bold
                  text-[#222831]
                "
              >
                Campaign Funding Breakdown
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Raised, allocated, and remaining funds for each campaign.
              </p>
            </div>

            {/* Desktop Table */}

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
                      Allocated
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Remaining
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Progress
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
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
                          {campaign.location || "Location not available"}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-700">
                        ৳
                        {Number(campaign.raisedAmount || 0).toLocaleString(
                          "en-BD",
                        )}
                      </td>

                      <td className="px-6 py-5 font-medium text-blue-600">
                        ৳
                        {Number(campaign.totalAllocated || 0).toLocaleString(
                          "en-BD",
                        )}
                      </td>

                      <td className="px-6 py-5 font-medium text-green-600">
                        ৳
                        {Number(campaign.remainingAmount || 0).toLocaleString(
                          "en-BD",
                        )}
                      </td>

                      <td className="min-w-37.5 px-6 py-5">
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
                                  Number(campaign.allocationPercentage || 0),
                                  100,
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-gray-600">
                            {Number(campaign.allocationPercentage || 0).toFixed(
                              2,
                            )}
                            %
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className="
                            rounded-full
                            bg-green-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-green-700
                          "
                        >
                          {campaign.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Campaign Cards */}

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
                        {campaign.location || "Location not available"}
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full
                        bg-green-50
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-green-700
                      "
                    >
                      {campaign.status || "N/A"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Raised</p>

                      <p className="mt-1 font-semibold text-gray-700">
                        ৳
                        {Number(campaign.raisedAmount || 0).toLocaleString(
                          "en-BD",
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Allocated</p>

                      <p className="mt-1 font-semibold text-blue-600">
                        ৳
                        {Number(campaign.totalAllocated || 0).toLocaleString(
                          "en-BD",
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Remaining</p>

                      <p className="mt-1 font-semibold text-green-600">
                        ৳
                        {Number(campaign.remainingAmount || 0).toLocaleString(
                          "en-BD",
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Allocation</p>

                      <p className="mt-1 font-semibold text-[#00ADB5]">
                        {Number(campaign.allocationPercentage || 0).toFixed(2)}%
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
                            Number(campaign.allocationPercentage || 0),
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
                No campaign data available.
              </div>
            )}
          </section>

          {/* ------------------------------------------------ */}
          {/* Category + Recent Allocations */}
          {/* ------------------------------------------------ */}

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-6
              xl:grid-cols-2
            "
          >
            {/* Category Breakdown */}

            <section
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2
                className="
                  text-xl
                  font-bold
                  text-[#222831]
                "
              >
                Allocation by Category
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                How the allocated funds are distributed.
              </p>

              <div className="mt-6 space-y-5">
                {categoryBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {item.category}
                      </span>

                      <span className="text-sm font-semibold text-gray-500">
                        ৳{Number(item.amount || 0).toLocaleString("en-BD")}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-[#00ADB5]
                        "
                        style={{
                          width: `${Math.min(
                            Number(item.percentage || 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-gray-400">
                      {Number(item.percentage || 0).toFixed(2)}%
                    </p>
                  </div>
                ))}

                {categoryBreakdown.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No allocation data available.
                  </p>
                )}
              </div>
            </section>

            {/* Recent Allocations */}

            <section
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="
                      text-xl
                      font-bold
                      text-[#222831]
                    "
                  >
                    Recent Allocations
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                  >
                    Latest fund allocation records.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {recentAllocations.map((allocation) => (
                  <div
                    key={allocation._id}
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
                          {allocation.category}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {allocation.campaign?.title || "Campaign unavailable"}
                        </p>
                      </div>

                      <p
                        className="
                          whitespace-nowrap
                          font-bold
                          text-[#00ADB5]
                        "
                      >
                        ৳
                        {Number(allocation.amount || 0).toLocaleString("en-BD")}
                      </p>
                    </div>

                    {allocation.description && (
                      <p
                        className="
                          mt-3
                          text-xs
                          leading-5
                          text-gray-400
                        "
                      >
                        {allocation.description}
                      </p>
                    )}

                    {allocation.createdAt && (
                      <p className="mt-2 text-[11px] text-gray-400">
                        {new Date(allocation.createdAt).toLocaleDateString(
                          "en-BD",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    )}
                  </div>
                ))}

                {recentAllocations.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No recent allocations.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ------------------------------------------------ */}
          {/* Dashboard Footer Information */}
          {/* ------------------------------------------------ */}

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
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2 className="text-lg font-bold">Fund Transparency</h2>

                <p className="mt-1 text-sm text-gray-300">
                  All allocation figures are based on recorded campaign funding
                  and allocation transactions.
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs text-gray-300">Total Campaigns</p>

                <p className="mt-1 text-xl font-bold">
                  {summary.totalCampaigns || 0}
                </p>
              </div>
            </div>
          </div>
=======
          {/* Stats cards and donation history will go here */}
>>>>>>> fa2469501dd2f773472c7c663117f8e61a6a31c1
        </main>
      </div>
    </div>
  );
}
