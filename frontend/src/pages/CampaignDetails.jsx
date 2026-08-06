import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getCampaign } from "../api/campaignApi";
import { createCheckoutSession } from "../api/donationApi";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleDonate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const donationData = {
        campaignId: campaign._id,

        amount: 1000,
      };

      const response = await createCheckoutSession(donationData, token);

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xl font-semibold">Loading campaign...</p>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xl font-semibold">Campaign not found</p>
        </div>
      </>
    );
  }

  const raised = Number(campaign.raisedAmount) || 0;

  const target = Number(campaign.targetAmount) || 0;

  const percentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Banner */}

          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src={
                campaign.image ||
                "https://placehold.co/1200x600/e2e8f0/64748b?text=Disaster+Relief"
              }
              alt={campaign.title}
              className="h-[400px] w-full object-cover"
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Campaign Details */}

            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-white p-8 shadow">
                <div className="flex justify-between">
                  <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    {campaign.disasterType || "Relief"}
                  </span>

                  <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                    {campaign.status || "Active"}
                  </span>
                </div>

                <h1 className="mt-6 text-4xl font-bold text-slate-900">
                  {campaign.title}
                </h1>

                <p className="mt-5 leading-7 text-slate-600">
                  {campaign.description}
                </p>

                <div className="mt-8">
                  <h2 className="text-xl font-bold">Campaign Information</h2>

                  <div className="mt-4 space-y-3 text-slate-600">
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

            {/* Donation Card */}

            <div>
              <div className="sticky top-6 rounded-3xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Donation Progress</h2>

                <div className="mt-6">
                  <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-right font-semibold text-blue-600">
                    {percentage.toFixed(0)}% Funded
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Raised</p>

                    <p className="text-xl font-bold text-green-600">
                      ${raised.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">Goal</p>

                    <p className="text-xl font-bold">
                      {target ? `$${target.toLocaleString()}` : "Not set"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDonate}
                  className="mt-8 w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700"
                >
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetails;
