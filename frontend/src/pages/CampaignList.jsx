import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CampaignCard from "../components/CampaignCard";
import { getCampaigns } from "../api/campaignApi";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await getCampaigns();

        setCampaigns(res.data);
        setFilteredCampaigns(res.data);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let filtered = [...campaigns];

    if (selectedType !== "All") {
      filtered = filtered.filter(
        (campaign) => campaign?.disasterType === selectedType,
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((campaign) =>
        `${campaign?.title || ""} ${campaign?.location || ""} ${
          campaign?.disasterType || ""
        }`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, selectedType]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center text-2xl font-semibold">
          Loading campaigns...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <Hero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        {/* Campaign Section */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Active Campaigns
              </h2>

              <p className="mt-2 text-gray-600">
                Browse verified disaster relief campaigns and support people in
                need.
              </p>
            </div>

            <span className="w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {filteredCampaigns.length} Campaign
              {filteredCampaigns.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800">
                No campaigns found
              </h3>

              <p className="mt-3 text-gray-500">
                Try searching with another keyword.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default CampaignList;
