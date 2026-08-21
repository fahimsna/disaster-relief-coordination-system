import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

import { cancelDonation } from "../api/donationApi";

export default function PaymentCancel() {
  const [searchParams] =
    useSearchParams();

  const [message, setMessage] =
    useState(
      "Updating your donation status...",
    );

  const [updating, setUpdating] =
    useState(true);

  useEffect(() => {
    const updateCancelledDonation =
      async () => {
        const sessionId =
          searchParams.get(
            "session_id",
          );

        const token =
          localStorage.getItem(
            "token",
          );

        // ------------------------------------------------
        // No session ID
        // ------------------------------------------------

        if (!sessionId) {
          setMessage(
            "Your payment was cancelled. No donation amount was charged.",
          );

          setUpdating(false);

          return;
        }

        // ------------------------------------------------
        // No authentication token
        // ------------------------------------------------

        if (!token) {
          setMessage(
            "Your payment was cancelled. Please log in to view your donation history.",
          );

          setUpdating(false);

          return;
        }

        // ------------------------------------------------
        // Mark donation as Failed
        // ------------------------------------------------

        try {
          await cancelDonation(
            sessionId,
            token,
          );

          setMessage(
            "Your payment was cancelled. No donation amount was charged.",
          );
        } catch (error) {
          console.error(
            "Failed to update cancelled donation:",
            error,
          );

          setMessage(
            "Your payment was cancelled. You can check your donation history for the latest status.",
          );
        } finally {
          setUpdating(false);
        }
      };

    updateCancelledDonation();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex flex-1 items-center justify-center p-6">
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >
            {/* Icon */}

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-red-100
                text-3xl
                text-red-600
              "
            >
              !
            </div>

            {/* Heading */}

            <h1
              className="
                mt-5
                text-3xl
                font-bold
                text-[#222831]
              "
            >
              Payment Cancelled
            </h1>

            {/* Status */}

            <p
              className="
                mt-3
                text-gray-500
              "
            >
              {message}
            </p>

            {/* Loading */}

            {updating && (
              <div className="mt-5">
                <div
                  className="
                    mx-auto
                    h-6
                    w-6
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-200
                    border-t-[#00ADB5]
                  "
                />
              </div>
            )}

            {/* Donation History */}

            <Link
              to="/donations"
              className="
                mt-6
                block
                rounded-xl
                border
                border-gray-200
                py-3
                font-semibold
                text-[#30475E]
                transition
                hover:bg-gray-50
              "
            >
              View Donation History
            </Link>

            {/* Campaigns */}

            <Link
              to="/campaigns"
              className="
                mt-3
                block
                rounded-xl
                bg-[#00ADB5]
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#0097A0]
              "
            >
              Browse Campaigns
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}