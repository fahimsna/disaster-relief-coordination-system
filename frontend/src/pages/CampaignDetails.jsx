import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

import { getCampaign } from "../api/campaignApi";
import { createCheckoutSession } from "../api/donationApi";

const MIN_DONATION_AMOUNT = 100;
const MAX_DONATION_AMOUNT = 100000;

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);

  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [amount, setAmount] = useState("1000");

  const [donating, setDonating] = useState(false);

  const [donationError, setDonationError] = useState("");

  // ===================================================
  // FETCH CAMPAIGN
  // ===================================================

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaign(id);

        setCampaign(response.data);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // ===================================================
  // DONATE
  // ===================================================

  const handleDonate = async () => {
    setDonationError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const donationAmount = Number(amount);

    // -------------------------------------------------
    // Minimum
    // -------------------------------------------------

    if (
      !Number.isFinite(donationAmount) ||
      donationAmount < MIN_DONATION_AMOUNT
    ) {
      setDonationError(
        `Minimum donation amount is ৳${MIN_DONATION_AMOUNT.toLocaleString(
          "en-BD",
        )}.`,
      );

      return;
    }

    // -------------------------------------------------
    // Maximum
    // -------------------------------------------------

    if (donationAmount > MAX_DONATION_AMOUNT) {
      setDonationError(
        `Maximum donation amount is ৳${MAX_DONATION_AMOUNT.toLocaleString(
          "en-BD",
        )}.`,
      );

      return;
    }

    // -------------------------------------------------
    // Whole number
    // -------------------------------------------------

    if (!Number.isInteger(donationAmount)) {
      setDonationError("Donation amount must be a whole number of BDT.");

      return;
    }

    // -------------------------------------------------
    // Campaign status
    // -------------------------------------------------

    if (campaign?.status !== "Active") {
      setDonationError("This campaign is not currently accepting donations.");

      return;
    }

    try {
      setDonating(true);

      const donationData = {
        campaignId: campaign._id,

        amount: donationAmount,
      };

      const response = await createCheckoutSession(donationData, token);

      if (!response.data?.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Donation failed:", error);

      setDonationError(
        error.response?.data?.message ||
          "Unable to start the donation payment. Please try again.",
      );

      setDonating(false);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <>
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xl font-semibold text-[#222831]">
            Loading campaign...
          </p>
        </div>
      </>
    );
  }

  // ===================================================
  // NOT FOUND
  // ===================================================

  if (!campaign) {
    return (
      <>
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <p className="text-xl font-semibold text-[#222831]">
              Campaign not found
            </p>

            <button
              type="button"
              onClick={() => navigate("/campaigns")}
              className="mt-4 rounded-xl bg-[#00ADB5] px-5 py-3 font-semibold text-white transition hover:bg-[#0097A0]"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </>
    );
  }

  // ===================================================
  // PROGRESS
  // ===================================================

  const raised = Number(campaign.raisedAmount) || 0;

  const target = Number(campaign.targetAmount) || 0;

  const percentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* =================================================
                CAMPAIGN IMAGE
            ================================================= */}

            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src={
                  campaign.image ||
                  "https://placehold.co/1200x600/e2e8f0/64748b?text=Disaster+Relief"
                }
                alt={campaign.title}
                className="h-70 w-full object-cover sm:h-100"
              />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              {/* =================================================
                  CAMPAIGN INFORMATION
              ================================================= */}

              <div className="lg:col-span-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap justify-between gap-3">
                    <span className="rounded-full bg-[#00ADB5] px-4 py-2 text-sm font-semibold text-white">
                      {campaign.disasterType || "Relief"}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
                        campaign.status === "Active"
                          ? "bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {campaign.status || "Unknown"}
                    </span>
                  </div>

                  <h1 className="mt-6 text-3xl font-bold text-[#222831] sm:text-4xl">
                    {campaign.title}
                  </h1>

                  <p className="mt-5 leading-7 text-gray-600">
                    {campaign.description}
                  </p>

                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-[#222831]">
                      Campaign Information
                    </h2>

                    <div className="mt-4 space-y-3 text-gray-600">
                      <p>
                        📍 Location:
                        <span className="font-semibold">
                          {" "}
                          {campaign.location || "Not specified"}
                        </span>
                      </p>

                      <p>
                        📅 Created:{" "}
                        {campaign.createdAt
                          ? new Date(campaign.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  DONATION CARD
              ================================================= */}

              <div>
                <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-[#222831]">
                    Donation Progress
                  </h2>

                  {/* Progress */}

                  <div className="mt-6">
                    <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#00ADB5] to-blue-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-right font-semibold text-[#00ADB5]">
                      {percentage.toFixed(0)}% Funded
                    </p>
                  </div>

                  {/* Raised / Goal */}

                  <div className="mt-6 flex justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Raised</p>

                      <p className="text-xl font-bold text-green-600">
                        ৳ {raised.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Goal</p>

                      <p className="text-xl font-bold text-[#222831]">
                        {target
                          ? `৳ ${target.toLocaleString("en-BD")}`
                          : "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Donation Amount */}

                  <div className="mt-7">
                    <label
                      htmlFor="donationAmount"
                      className="mb-2 block text-sm font-semibold text-[#222831]"
                    >
                      Donation Amount
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#30475E]">
                        ৳
                      </span>

                      <input
                        id="donationAmount"
                        type="number"
                        min={MIN_DONATION_AMOUNT}
                        max={MAX_DONATION_AMOUNT}
                        step="1"
                        value={amount}
                        onChange={(event) => {
                          setAmount(event.target.value);

                          setDonationError("");
                        }}
                        disabled={donating}
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-[#222831] outline-none transition focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/20 disabled:bg-gray-100"
                        placeholder="Enter amount"
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Minimum ৳100 · Maximum ৳100,000
                    </p>

                    {donationError && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-medium text-red-700">
                          {donationError}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Donate Button */}

                  <button
                    type="button"
                    onClick={handleDonate}
                    disabled={donating || campaign.status !== "Active"}
                    className="mt-5 w-full rounded-xl bg-[#00ADB5] py-4 font-bold text-white transition hover:bg-[#0097A0] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {donating
                      ? "Redirecting to Stripe..."
                      : campaign.status === "Active"
                        ? "Donate Now"
                        : "Campaign Closed"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignDetails;
