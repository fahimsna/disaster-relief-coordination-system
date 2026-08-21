import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

import { createCampaign } from "../../api/campaignApi";

export default function CreateCampaign() {
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

      await createCampaign(formData, token);

      navigate("/admin/campaigns");
    } catch (error) {
      console.error("Campaign creation failed", error);
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
              Create Campaign
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
                placeholder="Campaign title"
                value={formData.title}
                onChange={handleChange}
                className="input-style"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="input-style h-32"
                required
              />

              <input
                name="targetAmount"
                type="number"
                placeholder="Target amount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="input-style"
                required
              />

              <input
                name="disasterType"
                placeholder="Disaster type"
                value={formData.disasterType}
                onChange={handleChange}
                className="input-style"
                required
              />

              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="input-style"
                required
              />

              <input
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                className="input-style"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-style"
                  required
                />

                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input-style"
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
                Create Campaign
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
