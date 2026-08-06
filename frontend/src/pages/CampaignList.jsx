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
      <Navbar />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Hero */}

          <Hero
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* Title */}

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-[#222831]">
              Browse Campaigns
            </h1>

            <p className="mt-2 text-gray-500">
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
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignList;
