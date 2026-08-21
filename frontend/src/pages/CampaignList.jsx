import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import DashboardSidebar from "../components/DashboardSidebar";
import Hero from "../components/Hero";
import CampaignCard from "../components/CampaignCard";

import { getCampaigns } from "../api/campaignApi";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampaigns();

        const data = response.data;

        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let result = campaigns;

    if (selectedType !== "All") {
      result = result.filter(
        (campaign) => campaign.disasterType === selectedType,
      );
    }

    if (searchTerm) {
      result = result.filter((campaign) =>
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCampaigns(result);
  }, [searchTerm, selectedType, campaigns]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main
          className="
          flex-1
          overflow-x-hidden
          p-4

          sm:p-6

          lg:p-8
          "
        >
          {/* Hero */}

          <Hero
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Header */}

          <div className="mt-8">
            <h1
              className="
              text-2xl
              font-bold
              text-[#222831]

              sm:text-3xl
              "
            >
              Browse Campaigns
            </h1>

            <p
              className="
              mt-2
              text-sm
              text-gray-500

              sm:text-base
              "
            >
              Support disaster relief campaigns
            </p>
          </div>

          {/* Campaign Cards */}

          <div
            className="
            mt-8

            grid

            grid-cols-1

            gap-6

            md:grid-cols-2

            xl:grid-cols-3
            "
          >
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))
            ) : (
              <div
                className="
                col-span-full

                rounded-xl

                bg-white

                p-8

                text-center

                text-gray-500

                shadow
                "
              >
                No campaigns found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignList;
