import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

import { getMyDonations } from "../api/donationApi";

export default function PaymentSuccess() {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDonation = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await getMyDonations(token);

        const paidDonation = response.data.find(
          (item) => item.paymentStatus === "Paid",
        );

        setDonation(paidDonation);
      } catch (error) {
        console.error("Failed to fetch donation", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDonation();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main
          className="
          flex-1
          flex
          items-center
          justify-center
          p-6
          "
        >
          <div
            className="
            w-full
            max-w-xl
            rounded-3xl
            bg-white
            p-8
            shadow-sm
            "
          >
            <div
              className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-green-100
              text-3xl
              text-green-600
              "
            >
              ✓
            </div>

            <h1
              className="
              mt-5
              text-center
              text-3xl
              font-bold
              text-[#222831]
              "
            >
              Donation Successful
            </h1>

            <p
              className="
              mt-3
              text-center
              text-gray-500
              "
            >
              Thank you for supporting disaster relief. Your contribution has
              been received successfully.
            </p>

            {loading && (
              <p className="mt-8 text-center text-gray-500">
                Loading receipt...
              </p>
            )}

            {!loading && donation && (
              <div
                className="
                mt-8
                space-y-5
                rounded-2xl
                bg-[#F5F7FA]
                p-6
                "
              >
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>

                  <span className="font-semibold text-right">
                    {donation.transactionId || "Processing"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Campaign</span>

                  <span className="font-semibold text-right">
                    {donation.campaign?.title || "Campaign"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Donation Amount</span>

                  <span
                    className="
                    font-bold
                    text-[#00ADB5]
                    "
                  >
                    ৳ {donation.amount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>

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
                    Successful
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>

                  <span className="font-semibold">
                    {new Date(donation.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button
                className="
                w-full
                rounded-xl
                border
                border-[#00ADB5]
                py-3
                font-semibold
                text-[#00ADB5]
                hover:bg-cyan-50
                "
              >
                Download Receipt
              </button>

              <Link
                to="/campaigns"
                className="
                block
                w-full
                rounded-xl
                bg-[#00ADB5]
                py-3
                text-center
                font-semibold
                text-white
                hover:bg-[#0097A0]
                "
              >
                Back to Campaigns
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
