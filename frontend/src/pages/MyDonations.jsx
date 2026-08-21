import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

import { getMyDonations } from "../api/donationApi";

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your donation history.");
          return;
        }

        const response = await getMyDonations(token);

        setDonations(response.data || []);
      } catch (error) {
        console.error("Failed to load donation history:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your donation history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // =====================================================
  // SUMMARY
  // =====================================================

  const paidDonations = useMemo(() => {
    return donations.filter(
      (donation) => String(donation.paymentStatus).toLowerCase() === "paid",
    );
  }, [donations]);

  const pendingDonations = useMemo(() => {
    return donations.filter(
      (donation) => String(donation.paymentStatus).toLowerCase() === "pending",
    );
  }, [donations]);

  const totalDonated = useMemo(() => {
    return paidDonations.reduce(
      (total, donation) => total + Number(donation.amount || 0),
      0,
    );
  }, [paidDonations]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "paid") {
      return "bg-green-100 text-green-700";
    }

    if (normalizedStatus === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (normalizedStatus === "failed" || normalizedStatus === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  // =====================================================
  // RECEIPT LINK
  // =====================================================

  const getReceiptLink = (donation) => {
    if (!donation?.stripeSessionId) {
      return null;
    }

    return `/payment-success?session_id=${encodeURIComponent(
      donation.stripeSessionId,
    )}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 p-6">
            <div className="flex min-h-[400px] items-center justify-center">
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
                  Loading donation history...
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
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 p-6">
            <div className="mx-auto max-w-4xl">
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
                  Unable to load donation history
                </h2>

                <p className="mt-2 text-sm text-red-600">{error}</p>

                <button
                  onClick={() => window.location.reload()}
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
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-[#222831]
                  sm:text-3xl
                "
              >
                My Donations
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                View your complete donation history and payment records.
              </p>
            </div>

            {/* =====================================================
                SUMMARY CARDS
            ===================================================== */}

            <div
              className="
                mt-8
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-3
              "
            >
              {/* Total Donations */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-sm font-medium text-gray-500">
                  Total Donations
                </p>

                <p
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    text-[#30475E]
                  "
                >
                  {donations.length}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  All donation records
                </p>
              </div>

              {/* Total Donated */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-sm font-medium text-gray-500">
                  Total Donated
                </p>

                <p
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    text-[#00ADB5]
                  "
                >
                  ৳{totalDonated.toLocaleString("en-BD")}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Successfully paid donations
                </p>
              </div>

              {/* Pending */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-sm font-medium text-gray-500">
                  Pending Payments
                </p>

                <p
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    text-yellow-500
                  "
                >
                  {pendingDonations.length}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Payments awaiting confirmation
                </p>
              </div>
            </div>

            {/* =====================================================
                DONATION HISTORY
            ===================================================== */}

            <section
              className="
                mt-8
                overflow-hidden
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
                  Donation History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Every donation made from your account.
                </p>
              </div>

              {/* =====================================================
                  EMPTY STATE
              ===================================================== */}

              {donations.length === 0 ? (
                <div className="p-12 text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-cyan-50
                      text-2xl
                    "
                  >
                    💙
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-bold
                      text-[#222831]
                    "
                  >
                    No donations yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    Your donation history will appear here after you make a
                    contribution to a relief campaign.
                  </p>

                  <Link
                    to="/campaigns"
                    className="
                      mt-6
                      inline-block
                      rounded-xl
                      bg-[#00ADB5]
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#0097A0]
                    "
                  >
                    Explore Campaigns
                  </Link>
                </div>
              ) : (
                <>
                  {/* =================================================
                      DESKTOP TABLE
                  ================================================= */}

                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-left">
                      <thead>
                        <tr
                          className="
                            border-b
                            border-gray-100
                            bg-gray-50/70
                          "
                        >
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Campaign
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Amount
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Payment Method
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Date
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Receipt
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {donations.map((donation) => {
                          const receiptLink = getReceiptLink(donation);

                          return (
                            <tr
                              key={donation._id}
                              className="
                                border-b
                                border-gray-50
                                last:border-0
                                hover:bg-gray-50
                              "
                            >
                              {/* Campaign */}

                              <td className="px-6 py-5">
                                <p className="font-semibold text-[#222831]">
                                  {donation.campaign?.title ||
                                    "Campaign unavailable"}
                                </p>

                                {donation.campaign?.disasterType && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    {donation.campaign.disasterType}
                                  </p>
                                )}

                                {donation.campaign?.location && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    {donation.campaign.location}
                                  </p>
                                )}
                              </td>

                              {/* Amount */}

                              <td className="px-6 py-5">
                                <span className="font-bold text-[#00ADB5]">
                                  ৳
                                  {Number(donation.amount || 0).toLocaleString(
                                    "en-BD",
                                  )}
                                </span>
                              </td>

                              {/* Payment Method */}

                              <td className="px-6 py-5">
                                <span className="text-sm font-medium text-gray-700">
                                  {donation.paymentMethod || "Stripe"}
                                </span>
                              </td>

                              {/* Status */}

                              <td className="px-6 py-5">
                                <span
                                  className={`
                                    inline-flex
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${getStatusStyle(donation.paymentStatus)}
                                  `}
                                >
                                  {donation.paymentStatus || "Unknown"}
                                </span>
                              </td>

                              {/* Date */}

                              <td className="px-6 py-5">
                                <p className="text-sm text-gray-600">
                                  {donation.createdAt
                                    ? new Date(
                                        donation.createdAt,
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "N/A"}
                                </p>
                              </td>

                              {/* Receipt */}

                              <td className="px-6 py-5">
                                {String(
                                  donation.paymentStatus,
                                ).toLowerCase() === "paid" && receiptLink ? (
                                  <Link
                                    to={receiptLink}
                                    className="
                                      inline-flex
                                      items-center
                                      rounded-lg
                                      bg-green-50
                                      px-3
                                      py-2
                                      text-sm
                                      font-semibold
                                      text-green-700
                                      transition
                                      hover:bg-green-100
                                    "
                                  >
                                    View Receipt
                                  </Link>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    Not available
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* =================================================
                      MOBILE / TABLET CARDS
                  ================================================= */}

                  <div className="space-y-4 p-4 lg:hidden">
                    {donations.map((donation) => {
                      const receiptLink = getReceiptLink(donation);

                      return (
                        <div
                          key={donation._id}
                          className="
                            rounded-2xl
                            border
                            border-gray-100
                            bg-white
                            p-5
                          "
                        >
                          {/* Header */}

                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-4
                            "
                          >
                            <div className="min-w-0">
                              <h3
                                className="
                                  truncate
                                  font-semibold
                                  text-[#222831]
                                "
                              >
                                {donation.campaign?.title ||
                                  "Campaign unavailable"}
                              </h3>

                              {donation.campaign?.disasterType && (
                                <p className="mt-1 text-xs text-gray-400">
                                  {donation.campaign.disasterType}
                                </p>
                              )}

                              {donation.campaign?.location && (
                                <p className="mt-1 text-xs text-gray-400">
                                  {donation.campaign.location}
                                </p>
                              )}
                            </div>

                            <span
                              className={`
                                shrink-0
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                ${getStatusStyle(donation.paymentStatus)}
                              `}
                            >
                              {donation.paymentStatus || "Unknown"}
                            </span>
                          </div>

                          {/* Information */}

                          <div
                            className="
                              mt-5
                              grid
                              grid-cols-2
                              gap-4
                            "
                          >
                            <div>
                              <p className="text-xs text-gray-400">Amount</p>

                              <p className="mt-1 font-bold text-[#00ADB5]">
                                ৳
                                {Number(donation.amount || 0).toLocaleString(
                                  "en-BD",
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">Payment</p>

                              <p className="mt-1 font-semibold text-gray-700">
                                {donation.paymentMethod || "Stripe"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">Date</p>

                              <p className="mt-1 font-semibold text-gray-700">
                                {donation.createdAt
                                  ? new Date(
                                      donation.createdAt,
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Transaction
                              </p>

                              <p className="mt-1 truncate text-xs font-medium text-gray-600">
                                {donation.transactionId || "Not available"}
                              </p>
                            </div>
                          </div>

                          {/* Receipt */}

                          {String(donation.paymentStatus).toLowerCase() ===
                            "paid" && receiptLink ? (
                            <div className="mt-5 border-t border-gray-100 pt-4">
                              <Link
                                to={receiptLink}
                                className="
                                  inline-flex
                                  w-full
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-[#00ADB5]
                                  px-4
                                  py-3
                                  text-sm
                                  font-semibold
                                  text-white
                                  transition
                                  hover:bg-[#0097A0]
                                "
                              >
                                View Donation Receipt
                              </Link>
                            </div>
                          ) : (
                            <div className="mt-5 border-t border-gray-100 pt-4">
                              <span className="text-xs text-gray-400">
                                Receipt will be available after successful
                                payment confirmation.
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>

            {/* =====================================================
                FOOTER NOTE
            ===================================================== */}

            {donations.length > 0 && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  bg-[#30475E]
                  p-5
                  text-white
                "
              >
                <p className="text-sm font-semibold">
                  Thank you for supporting disaster relief. 💙
                </p>

                <p className="mt-1 text-xs text-gray-300">
                  Your successful donations are recorded in your history for
                  transparency and future reference.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
