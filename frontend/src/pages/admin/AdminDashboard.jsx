import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

import { useAuth } from "../../context/AuthContext";

import { createFundAllocation } from "../../api/fundAllocationApi";
import { getCampaigns } from "../../api/campaignApi";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Campaigns
  const [campaigns, setCampaigns] = useState([]);

  // Allocation form
  const [campaign, setCampaign] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Loading states
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [allocationLoading, setAllocationLoading] = useState(false);

  // Messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --------------------------------------------------
  // Get campaigns
  // --------------------------------------------------

  const fetchCampaigns = async () => {
    try {
      setCampaignLoading(true);
      setErrorMessage("");

      const response = await getCampaigns();

      /*
        Different versions of the campaign API may return:

        response.data
        response.data.campaigns
        response.data.data
      */

      const campaignData =
        response.data?.campaigns || response.data?.data || response.data || [];

      setCampaigns(Array.isArray(campaignData) ? campaignData : []);
    } catch (error) {
      console.error("Failed to load campaigns:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to load campaigns.",
      );
    } finally {
      setCampaignLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // --------------------------------------------------
  // Create allocation
  // --------------------------------------------------

  const handleCreateAllocation = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    // Basic validation
    if (!campaign) {
      setErrorMessage("Please select a campaign.");
      return;
    }

    if (!category) {
      setErrorMessage("Please select an allocation category.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMessage("Please enter a valid allocation amount.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please enter a description.");
      return;
    }

    try {
      setAllocationLoading(true);

      const response = await createFundAllocation({
        campaign,
        category,
        amount: Number(amount),
        description: description.trim(),
      });

      console.log("Fund allocation created:", response.data);

      setSuccessMessage("Fund allocation created successfully.");

      // Clear form
      setCampaign("");
      setCategory("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Create fund allocation error:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to create fund allocation.",
      );
    } finally {
      setAllocationLoading(false);
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

          {/* Header */}

          <h1
            className="
              text-3xl
              font-bold
              text-[#222831]
            "
          >
            Welcome Admin, {user?.name} 👋
          </h1>

          <p
            className="
              mt-2
              text-gray-500
            "
          >
            Manage disaster relief campaigns, donations, and fund allocations.
          </p>

          {/* Stats */}

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {/* Total Campaigns */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-gray-500">Total Campaigns</h2>

              <p
                className="
                  mt-3
                  text-3xl
                  font-bold
                  text-[#00ADB5]
                "
              >
                {campaigns.length}
              </p>
            </div>

            {/* Total Donations */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-gray-500">Total Donations</h2>

              <p
                className="
                  mt-3
                  text-3xl
                  font-bold
                  text-green-600
                "
              >
                ৳ --
              </p>
            </div>

            {/* Active Campaigns */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-gray-500">Active Campaigns</h2>

              <p
                className="
                  mt-3
                  text-3xl
                  font-bold
                  text-blue-600
                "
              >
                {campaigns.filter((item) => item.status === "Active").length}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Fund Allocation Management */}
          {/* ------------------------------------------------ */}

          <section
            className="
              mt-8
              rounded-2xl
              bg-white
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <div className="mb-6">
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#222831]
                "
              >
                Fund Allocation Management
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                "
              >
                Allocate raised campaign funds to specific relief categories.
              </p>
            </div>

            {/* Success Message */}

            {successMessage && (
              <div
                className="
                  mb-6
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-green-700
                "
              >
                {successMessage}
              </div>
            )}

            {/* Error Message */}

            {errorMessage && (
              <div
                className="
                  mb-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateAllocation} className="space-y-6">
              {/* Campaign */}

              <div>
                <label
                  htmlFor="campaign"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#222831]
                  "
                >
                  Campaign
                </label>

                <select
                  id="campaign"
                  value={campaign}
                  onChange={(event) => setCampaign(event.target.value)}
                  disabled={campaignLoading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#00ADB5]
                    focus:ring-2
                    focus:ring-[#00ADB5]/20
                    disabled:bg-gray-100
                  "
                >
                  <option value="">
                    {campaignLoading
                      ? "Loading campaigns..."
                      : "Select a campaign"}
                  </option>

                  {campaigns.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title} — Raised: ৳
                      {Number(item.raisedAmount || 0).toLocaleString("en-BD")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#222831]
                  "
                >
                  Allocation Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#00ADB5]
                    focus:ring-2
                    focus:ring-[#00ADB5]/20
                  "
                >
                  <option value="">Select category</option>

                  <option value="Food">Food</option>

                  <option value="Medical">Medical</option>

                  <option value="Shelter">Shelter</option>

                  <option value="Transportation">Transportation</option>

                  <option value="Clothing">Clothing</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Amount */}

              <div>
                <label
                  htmlFor="amount"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#222831]
                  "
                >
                  Allocation Amount
                </label>

                <div className="relative">
                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      font-semibold
                      text-gray-500
                    "
                  >
                    ৳
                  </span>

                  <input
                    id="amount"
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      py-3
                      pl-9
                      pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-[#00ADB5]
                      focus:ring-2
                      focus:ring-[#00ADB5]/20
                    "
                  />
                </div>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#222831]
                  "
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows="4"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe how the allocated funds will be used..."
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#00ADB5]
                    focus:ring-2
                    focus:ring-[#00ADB5]/20
                  "
                />
              </div>

              {/* Submit */}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={allocationLoading}
                  className="
                    rounded-xl
                    bg-[#00ADB5]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#0099A0]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {allocationLoading
                    ? "Creating Allocation..."
                    : "Create Fund Allocation"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
