import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

import { getCampaigns, deleteCampaign } from "../../api/campaignApi";

export default function AdminCampaigns() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);

  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const response = await getCampaigns();

      setCampaigns(response.data);
    } catch (error) {
      console.error("Failed to load campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this campaign?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await deleteCampaign(id, token);

      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main
          className="
          flex-1
          p-4
          sm:p-6
          lg:p-8
          "
        >
          {/* Mobile Menu Button */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="
            mb-5
            rounded-xl
            bg-[#30475E]
            px-4
            py-2
            text-white
            md:hidden
            "
          >
            ☰ Menu
          </button>

          <div
            className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            "
          >
            <div>
              <h1
                className="
                text-3xl
                font-bold
                text-[#222831]
                "
              >
                Manage Campaigns
              </h1>

              <p className="mt-2 text-gray-500">
                Create and manage relief campaigns
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/campaigns/create")}
              className="
              rounded-xl
              bg-[#00ADB5]
              px-5
              py-3
              font-semibold
              text-white
              hover:bg-[#0097A0]
              "
            >
              + Create Campaign
            </button>
          </div>

          {loading && (
            <p className="mt-8 text-gray-500">Loading campaigns...</p>
          )}

          {!loading && campaigns.length === 0 && (
            <div
              className="
              mt-8
              rounded-2xl
              bg-white
              p-8
              shadow
              "
            >
              No campaigns found.
            </div>
          )}

          {!loading && campaigns.length > 0 && (
            <div
              className="
              mt-8
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-2
              xl:grid-cols-3
              "
            >
              {campaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-sm
                  "
                >
                  <h2
                    className="
                    text-xl
                    font-bold
                    text-[#222831]
                    "
                  >
                    {campaign.title}
                  </h2>

                  <p
                    className="
                    mt-3
                    line-clamp-3
                    text-gray-600
                    "
                  >
                    {campaign.description}
                  </p>

                  <div className="mt-5 space-y-2 text-sm">
                    <p>
                      Location:
                      <span className="font-semibold">
                        {" "}
                        {campaign.location}
                      </span>
                    </p>

                    <p>
                      Goal:
                      <span className="font-semibold">
                        {" "}
                        ৳ {campaign.targetAmount}
                      </span>
                    </p>

                    <p>
                      Status:
                      <span className="font-semibold"> {campaign.status}</span>
                    </p>
                  </div>

                  <div
                    className="
                    mt-6
                    flex
                    gap-3
                    "
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/campaigns/edit/${campaign._id}`)
                      }
                      className="
                      flex-1
                      rounded-xl
                      border
                      border-[#00ADB5]
                      py-2
                      font-semibold
                      text-[#00ADB5]
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="
                      flex-1
                      rounded-xl
                      bg-red-500
                      py-2
                      font-semibold
                      text-white
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
