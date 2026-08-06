import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

import { getCampaign, updateCampaign } from "../../api/campaignApi";

export default function EditCampaign() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    disasterType: "",
    location: "",
    image: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaign(id);

        const campaign = response.data;

        setFormData({
          title: campaign.title,
          description: campaign.description,
          targetAmount: campaign.targetAmount,
          disasterType: campaign.disasterType,
          location: campaign.location,
          image: campaign.image,
          startDate: campaign.startDate?.slice(0, 10),
          endDate: campaign.endDate?.slice(0, 10),
        });
      } catch (error) {
        console.error("Failed to load campaign", error);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await updateCampaign(id, formData, token);

      navigate("/admin/campaigns");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Mobile Menu */}

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
            mx-auto
            max-w-3xl
            rounded-3xl
            bg-white
            p-6
            shadow
            sm:p-8
            "
          >
            <h1
              className="
              text-3xl
              font-bold
              text-[#222831]
              "
            >
              Edit Campaign
            </h1>

            <form
              onSubmit={handleSubmit}
              className="
              mt-8
              space-y-5
              "
            >
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="h-32 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <input
                name="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <input
                name="disasterType"
                value={formData.disasterType}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />

                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
              </div>

              <button
                className="
                w-full
                rounded-xl
                bg-[#00ADB5]
                py-3
                font-semibold
                text-white
                hover:bg-[#0097A0]
                "
              >
                Update Campaign
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
