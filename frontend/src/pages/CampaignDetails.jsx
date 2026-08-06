import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";

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
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="flex">
        {/* Dashboard Menu */}

        <DashboardSidebar />

        {/* Main Content */}

        <main
          className="
          flex-1
          px-4
          py-6
          sm:px-6
          lg:px-8
          "
        >
          <div
            className="
            mx-auto
            max-w-7xl
            "
          >
            {/* Banner */}

            <div
              className="
              overflow-hidden
              rounded-3xl
              shadow-lg
              "
            >
              <img
                src={
                  campaign.image ||
                  "https://placehold.co/1200x600/e2e8f0/64748b?text=Disaster+Relief"
                }
                alt={campaign.title}
                className="
                h-[280px]
                w-full
                object-cover
                sm:h-[400px]
                "
              />
            </div>

            <div
              className="
              mt-8
              grid
              gap-8
              lg:grid-cols-3
              "
            >
              {/* Campaign Information */}

              <div className="lg:col-span-2">
                <div
                  className="
                  rounded-3xl
                  bg-white
                  p-6
                  shadow-sm
                  sm:p-8
                  "
                >
                  <div
                    className="
                    flex
                    flex-wrap
                    justify-between
                    gap-3
                    "
                  >
                    <span
                      className="
                      rounded-full
                      bg-[#00ADB5]
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      "
                    >
                      {campaign.disasterType || "Relief"}
                    </span>

                    <span
                      className="
                      rounded-full
                      bg-green-600
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      "
                    >
                      {campaign.status || "Active"}
                    </span>
                  </div>

                  <h1
                    className="
                    mt-6
                    text-3xl
                    font-bold
                    text-[#222831]
                    sm:text-4xl
                    "
                  >
                    {campaign.title}
                  </h1>

                  <p
                    className="
                    mt-5
                    leading-7
                    text-gray-600
                    "
                  >
                    {campaign.description}
                  </p>

                  <div className="mt-8">
                    <h2
                      className="
                      text-xl
                      font-bold
                      text-[#222831]
                      "
                    >
                      Campaign Information
                    </h2>

                    <div
                      className="
                      mt-4
                      space-y-3
                      text-gray-600
                      "
                    >
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

              {/* Donation Section */}

              <div>
                <div
                  className="
                  sticky
                  top-6
                  rounded-3xl
                  bg-white
                  p-6
                  shadow-sm
                  "
                >
                  <h2
                    className="
                    text-2xl
                    font-bold
                    text-[#222831]
                    "
                  >
                    Donation Progress
                  </h2>

                  <div className="mt-6">
                    <div
                      className="
                      h-4
                      overflow-hidden
                      rounded-full
                      bg-gray-200
                      "
                    >
                      <div
                        className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-[#00ADB5]
                        to-blue-500
                        "
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p
                      className="
                      mt-3
                      text-right
                      font-semibold
                      text-[#00ADB5]
                      "
                    >
                      {percentage.toFixed(0)}% Funded
                    </p>
                  </div>

                  <div
                    className="
                    mt-6
                    flex
                    justify-between
                    "
                  >
                    <div>
                      <p className="text-sm text-gray-500">Raised</p>

                      <p
                        className="
                        text-xl
                        font-bold
                        text-green-600
                        "
                      >
                        ৳ {raised.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Goal</p>

                      <p
                        className="
                        text-xl
                        font-bold
                        "
                      >
                        {target ? `৳ ${target.toLocaleString()}` : "Not set"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDonate}
                    className="
                    mt-8
                    w-full
                    rounded-xl
                    bg-[#00ADB5]
                    py-4
                    font-bold
                    text-white
                    transition
                    hover:bg-[#0097A0]
                    "
                  >
                    Donate Now
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
