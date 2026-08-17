import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

import { getDonationReceipt } from "../api/donationApi";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const [receipt, setReceipt] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!sessionId) {
        setError("Payment session information is missing.");

        setLoading(false);

        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your donation receipt.");

          setLoading(false);

          return;
        }

        let lastError = null;

        // Stripe webhook may need a short time
        // to update MongoDB.
        for (let attempt = 0; attempt < 6; attempt += 1) {
          try {
            const response = await getDonationReceipt(sessionId, token);

            setReceipt(response.data.receipt);

            setError("");

            setLoading(false);

            return;
          } catch (requestError) {
            lastError = requestError;

            if (attempt < 5) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        throw lastError;
      } catch (error) {
        console.error("Failed to load donation receipt:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your donation receipt.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [sessionId]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const paymentStatus = String(receipt?.paymentStatus || "").toLowerCase();

  const isPaid = paymentStatus === "paid";

  const isPending = paymentStatus === "pending";

  const isFailed = paymentStatus === "failed";

  const pageTitle = isPaid
    ? "Donation Successful"
    : isPending
      ? "Payment Processing"
      : isFailed
        ? "Payment Failed"
        : "Donation Payment";

  const pageDescription = isPaid
    ? "Thank you for supporting disaster relief. Your contribution has been received successfully."
    : isPending
      ? "Your payment is still being processed. Please check your donation history for the latest status."
      : isFailed
        ? "Your donation payment was not completed."
        : "Your donation payment information is being prepared.";

  const statusClass = isPaid
    ? "bg-green-100 text-green-700"
    : isPending
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  const iconClass = isPaid
    ? "bg-green-100 text-green-600"
    : isPending
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  const icon = isPaid ? "✓" : isPending ? "..." : "!";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm">
            {/* Status Icon */}

            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold ${iconClass}`}
            >
              {icon}
            </div>

            {/* Heading */}

            <h1 className="mt-5 text-center text-3xl font-bold text-[#222831]">
              {loading ? "Preparing Donation Receipt" : pageTitle}
            </h1>

            <p className="mt-3 text-center text-gray-500">
              {loading
                ? "Please wait while we verify your payment."
                : pageDescription}
            </p>

            {/* Loading */}

            {loading && (
              <div className="mt-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#00ADB5]" />

                <p className="mt-4 text-sm text-gray-500">
                  Preparing your donation receipt...
                </p>
              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-medium text-red-700">{error}</p>

                <p className="mt-2 text-xs text-red-600">
                  Your payment may still be processing. Please check your
                  donation history for the latest payment status.
                </p>
              </div>
            )}

            {/* Receipt */}

            {!loading && receipt && (
              <div
                id="donation-receipt"
                className="mt-8 rounded-2xl bg-[#F5F7FA] p-6"
              >
                <div className="mb-5 border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#222831]">
                        Donation Receipt
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Thank you for your contribution.
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                    >
                      {receipt.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Donor */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Donor</span>

                    <span className="text-right font-semibold text-[#222831]">
                      {receipt.donor?.name || "N/A"}
                    </span>
                  </div>

                  {/* Email */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Email</span>

                    <span className="text-right font-semibold text-[#222831]">
                      {receipt.donor?.email || "N/A"}
                    </span>
                  </div>

                  {/* Campaign */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Campaign</span>

                    <span className="max-w-[60%] text-right font-semibold text-[#222831]">
                      {receipt.campaign?.title || "Campaign"}
                    </span>
                  </div>

                  {/* Amount */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Donation Amount</span>

                    <span className="font-bold text-[#00ADB5]">
                      ৳ {Number(receipt.amount || 0).toLocaleString("en-BD")}
                    </span>
                  </div>

                  {/* Currency */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Currency</span>

                    <span className="font-semibold text-[#222831]">
                      {receipt.currency || "BDT"}
                    </span>
                  </div>

                  {/* Transaction */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Transaction ID</span>

                    <span className="max-w-[60%] break-all text-right text-sm font-semibold text-[#222831]">
                      {receipt.transactionId || "Processing"}
                    </span>
                  </div>

                  {/* Payment Method */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Payment Method</span>

                    <span className="font-semibold text-[#222831]">
                      {receipt.paymentMethod || "Stripe"}
                    </span>
                  </div>

                  {/* Payment Status */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Payment Status</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                    >
                      {receipt.paymentStatus}
                    </span>
                  </div>

                  {/* Date */}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Date</span>

                    <span className="text-right font-semibold text-[#222831]">
                      {receipt.createdAt
                        ? new Date(receipt.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Location */}

                {receipt.campaign?.location && (
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-400">Relief Location</p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {receipt.campaign.location}
                    </p>
                  </div>
                )}

                {/* Pending notice */}

                {isPending && (
                  <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm font-medium text-yellow-800">
                      Your payment is still being processed. The donation will
                      be added to campaign analytics only after Stripe confirms
                      the payment.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}

            <div className="mt-8 space-y-3">
              {receipt && (
                <button
                  onClick={handlePrintReceipt}
                  className="w-full rounded-xl border border-[#00ADB5] py-3 font-semibold text-[#00ADB5] transition hover:bg-cyan-50"
                >
                  Print Receipt
                </button>
              )}

              <Link
                to="/donations"
                className="block w-full rounded-xl border border-gray-200 py-3 text-center font-semibold text-[#30475E] transition hover:bg-gray-50"
              >
                View Donation History
              </Link>

              <Link
                to="/campaigns"
                className="block w-full rounded-xl bg-[#00ADB5] py-3 text-center font-semibold text-white transition hover:bg-[#0097A0]"
              >
                Back to Campaigns
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Print styling */}

      <style>{`
        @media print {
          body {
            background: white !important;
          }

          nav,
          aside,
          button,
          a {
            display: none !important;
          }

          #donation-receipt {
            display: block !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 700px !important;
            background: white !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
