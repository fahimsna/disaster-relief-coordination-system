import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";

import { useAuth } from "../../context/AuthContext";

import {
  getFundAllocationDashboard,
  createFundAllocation,
} from "../../api/fundAllocationApi";

import { getCampaigns } from "../../api/campaignApi";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    campaign: "",
    category: "",
    amount: "",
    description: "",
  });

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {
    try {
      const response = await getFundAllocationDashboard();

      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to load fund allocation dashboard:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load fund allocation dashboard.",
      );
    }
  };

  // =====================================================
  // FETCH CAMPAIGNS
  // =====================================================

  const fetchCampaigns = async () => {
    try {
      const response = await getCampaigns();

      setCampaigns(response.data || []);
    } catch (error) {
      console.error("Failed to load campaigns:", error);

      setError("Failed to load campaigns.");
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchDashboard(), fetchCampaigns()]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const summary = dashboardData?.summary || {};

  const campaignBreakdown = dashboardData?.campaignBreakdown || [];

  const categoryBreakdown = dashboardData?.categoryBreakdown || [];

  const recentAllocations = dashboardData?.recentAllocations || [];

  // =====================================================
  // SELECTED CAMPAIGN
  // =====================================================

  const selectedCampaign = campaigns.find(
    (campaign) => String(campaign._id) === String(formData.campaign),
  );

  const selectedCampaignBreakdown = campaignBreakdown.find(
    (campaign) => String(campaign.campaignId) === String(formData.campaign),
  );

  const campaignRaised =
    selectedCampaignBreakdown?.raisedAmount ??
    selectedCampaign?.raisedAmount ??
    0;

  const campaignAllocated = selectedCampaignBreakdown?.totalAllocated ?? 0;

  const campaignRemaining =
    selectedCampaignBreakdown?.remainingAmount ??
    Math.max(Number(campaignRaised) - Number(campaignAllocated), 0);

  // =====================================================
  // ALLOCATE FUNDS
  // =====================================================

  const handleAllocateFunds = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const amount = Number(formData.amount);

    if (!formData.campaign) {
      setError("Please select a campaign.");
      return;
    }

    if (!formData.category) {
      setError("Please select an allocation category.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Allocation amount must be greater than 0.");
      return;
    }

    if (amount > campaignRemaining) {
      setError(
        `You cannot allocate more than the available ${formatMoney(
          campaignRemaining,
        )}.`,
      );
      return;
    }

    try {
      setSubmitting(true);

      await createFundAllocation({
        campaign: formData.campaign,
        category: formData.category,
        amount,
        description: formData.description.trim(),
      });

      setSuccess("Funds allocated successfully.");

      setFormData({
        campaign: "",
        category: "",
        amount: "",
        description: "",
      });

      await Promise.all([fetchDashboard(), fetchCampaigns()]);
    } catch (error) {
      console.error("Fund allocation failed:", error);

      setError(error.response?.data?.message || "Failed to allocate funds.");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await Promise.all([fetchDashboard(), fetchCampaigns()]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FA]">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex min-h-screen">
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 p-6 lg:p-8">
            <div className="flex min-h-[70vh] items-center justify-center">
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    h-11
                    w-11
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-200
                    border-t-[#00ADB5]
                  "
                />

                <p className="mt-4 text-sm text-gray-500">
                  Loading dashboard...
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="
              mb-5
              rounded-xl
              bg-[#30475E]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              md:hidden
            "
          >
            ☰ Menu
          </button>

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#30475E]
                    text-xl
                    text-white
                    shadow-sm
                  "
                >
                  A
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#00ADB5]">
                    Administration
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-[#222831] sm:text-3xl">
                    Admin Dashboard
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Welcome back,{" "}
                <span className="font-semibold text-gray-700">
                  {user?.name || "Admin"}
                </span>
                . Manage campaigns, allocate relief funds, and monitor financial
                transparency from one place.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-[#30475E]
                shadow-sm
                transition
                hover:border-[#00ADB5]
                hover:text-[#00ADB5]
              "
            >
              <span>↻</span>
              Refresh Data
            </button>
          </div>

          {/* =================================================
              ALERTS
          ================================================= */}

          {error && (
            <div
              className="
                mt-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                text-red-700
              "
            >
              <span className="font-bold">!</span>

              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              className="
                mt-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-green-200
                bg-green-50
                px-5
                py-4
                text-sm
                font-medium
                text-green-700
              "
            >
              <span className="font-bold">✓</span>

              <span>{success}</span>
            </div>
          )}

          {/* =================================================
              KPI CARDS
          ================================================= */}

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {/* Raised */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Raised
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-[#222831]">
                    {formatMoney(summary.totalRaised)}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#00ADB5]/10
                    text-lg
                    text-[#00ADB5]
                  "
                >
                  ৳
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Total contributions received
              </p>
            </div>

            {/* Allocated */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Allocated
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-[#222831]">
                    {formatMoney(summary.totalAllocated)}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-lg
                    text-blue-600
                  "
                >
                  ↗
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Funds assigned to relief
              </p>
            </div>

            {/* Remaining */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Remaining Funds
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-[#222831]">
                    {formatMoney(summary.totalRemaining)}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-lg
                    text-green-600
                  "
                >
                  ✓
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Available for allocation
              </p>
            </div>

            {/* Percentage */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Allocation Rate
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-[#222831]">
                    {Number(summary.allocationPercentage || 0).toFixed(1)}%
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-50
                    text-lg
                    text-orange-500
                  "
                >
                  %
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{
                    width: `${Math.min(
                      Number(summary.allocationPercentage || 0),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              ALLOCATION SECTION
          ================================================= */}

          <section
            className="
              mt-8
              overflow-hidden
              rounded-3xl
              border
              border-gray-100
              bg-white
              shadow-sm
            "
          >
            {/* Section header */}

            <div
              className="
                border-b
                border-gray-100
                bg-gradient-to-r
                from-[#30475E]
                to-[#3D5871]
                px-6
                py-6
                text-white
                sm:px-8
              "
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
                    Fund Management
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Allocate Relief Funds
                  </h2>

                  <p className="mt-1 text-sm text-gray-300">
                    Assign collected campaign funds to specific relief
                    activities.
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs text-gray-300">Total available</p>

                  <p className="mt-1 text-lg font-bold">
                    {formatMoney(summary.totalRemaining)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleAllocateFunds} className="p-6 sm:p-8">
              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  lg:grid-cols-2
                "
              >
                {/* Campaign */}

                <div>
                  <label
                    htmlFor="campaign"
                    className="mb-2 block text-sm font-semibold text-[#222831]"
                  >
                    Campaign
                  </label>

                  <select
                    id="campaign"
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-[#00ADB5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#00ADB5]/10
                    "
                  >
                    <option value="">Select a campaign</option>

                    {campaigns.map((campaign) => (
                      <option key={campaign._id} value={campaign._id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-[#222831]"
                  >
                    Relief Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-[#00ADB5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#00ADB5]/10
                    "
                  >
                    <option value="">Select a category</option>

                    <option value="Food">Food</option>

                    <option value="Medical">Medical</option>

                    <option value="Shelter">Shelter</option>

                    <option value="Clothing">Clothing</option>

                    <option value="Transportation">Transportation</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Amount */}

                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-semibold text-[#222831]"
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
                        font-bold
                        text-gray-400
                      "
                    >
                      ৳
                    </span>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0"
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3.5
                        pl-9
                        pr-4
                        text-sm
                        text-gray-700
                        outline-none
                        transition
                        focus:border-[#00ADB5]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#00ADB5]/10
                      "
                    />
                  </div>

                  {formData.campaign && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Raised:{" "}
                        <strong className="text-gray-600">
                          {formatMoney(campaignRaised)}
                        </strong>
                      </span>

                      <span className="font-semibold text-green-600">
                        Available: {formatMoney(campaignRemaining)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-[#222831]"
                  >
                    Purpose / Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe how the allocated funds will be used..."
                    rows="4"
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-[#00ADB5]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#00ADB5]/10
                    "
                  />
                </div>
              </div>

              {/* Campaign preview */}

              {formData.campaign && (
                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-[#00ADB5]/20
                    bg-[#00ADB5]/5
                    p-5
                  "
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#00ADB5]">
                        Selected Campaign
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-[#222831]">
                        {selectedCampaign?.title || "Campaign"}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-gray-400">Raised</p>

                        <p className="mt-1 font-bold text-gray-700">
                          {formatMoney(campaignRaised)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Allocated</p>

                        <p className="mt-1 font-bold text-blue-600">
                          {formatMoney(campaignAllocated)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Remaining</p>

                        <p className="mt-1 font-bold text-green-600">
                          {formatMoney(campaignRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-gray-500">Allocation progress</span>

                      <span className="font-semibold text-[#00ADB5]">
                        {Number(
                          selectedCampaignBreakdown?.allocationPercentage || 0,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#00ADB5]"
                        style={{
                          width: `${Math.min(
                            Number(
                              selectedCampaignBreakdown?.allocationPercentage ||
                                0,
                            ),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}

              <div className="mt-7 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    w-full
                    rounded-xl
                    bg-[#00ADB5]
                    px-8
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-[#0097A0]
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:w-auto
                  "
                >
                  {submitting ? "Allocating Funds..." : "Allocate Funds"}
                </button>
              </div>
            </form>
          </section>

          {/* =================================================
              CAMPAIGN BREAKDOWN
          ================================================= */}

          <section className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
                    Transparency
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#222831]">
                    Campaign Funding
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Track how much each campaign has raised and how much has
                    been allocated.
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-400">Campaigns</p>

                  <p className="mt-1 text-lg font-bold text-[#30475E]">
                    {campaignBreakdown.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-400">
                      Campaign
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-400">
                      Raised
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-400">
                      Allocated
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-400">
                      Remaining
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-400">
                      Progress
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {campaignBreakdown.map((campaign) => (
                    <tr
                      key={campaign.campaignId}
                      className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-[#222831]">
                          {campaign.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {campaign.location || "Location unavailable"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-right font-medium text-gray-700">
                        {formatMoney(campaign.raisedAmount)}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-blue-600">
                        {formatMoney(campaign.totalAllocated)}
                      </td>

                      <td className="px-6 py-5 text-right font-bold text-green-600">
                        {formatMoney(campaign.remainingAmount)}
                      </td>

                      <td className="min-w-[230px] px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-[#00ADB5]"
                              style={{
                                width: `${Math.min(
                                  Number(campaign.allocationPercentage || 0),
                                  100,
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="w-12 text-right text-xs font-bold text-gray-500">
                            {Number(campaign.allocationPercentage || 0).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="space-y-4 p-4 md:hidden">
              {campaignBreakdown.map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#222831]">
                        {campaign.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {campaign.location || "Location unavailable"}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#00ADB5]/10 px-3 py-1 text-xs font-bold text-[#00ADB5]">
                      {Number(campaign.allocationPercentage || 0).toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Raised</p>

                      <p className="mt-1 text-sm font-bold text-gray-700">
                        {formatMoney(campaign.raisedAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Allocated</p>

                      <p className="mt-1 text-sm font-bold text-blue-600">
                        {formatMoney(campaign.totalAllocated)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Remaining</p>

                      <p className="mt-1 text-sm font-bold text-green-600">
                        {formatMoney(campaign.remainingAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#00ADB5]"
                      style={{
                        width: `${Math.min(
                          Number(campaign.allocationPercentage || 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {campaignBreakdown.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-400">
                  No campaign data available.
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              LOWER GRID
          ================================================= */}

          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
            {/* =================================================
                CATEGORY BREAKDOWN
            ================================================= */}

            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
                Distribution
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#222831]">
                Allocation by Category
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Where allocated relief funds are being directed.
              </p>

              <div className="mt-7 space-y-6">
                {categoryBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {item.category}
                      </span>

                      <span className="text-sm font-bold text-gray-600">
                        {formatMoney(item.amount)}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#00ADB5]"
                        style={{
                          width: `${Math.min(
                            Number(item.percentage || 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-gray-400">
                      {Number(item.percentage || 0).toFixed(1)}%
                    </p>
                  </div>
                ))}

                {categoryBreakdown.length === 0 && (
                  <div className="rounded-2xl bg-gray-50 py-10 text-center text-sm text-gray-400">
                    No allocation data available.
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                RECENT ALLOCATIONS
            ================================================= */}

            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
                    Activity
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#222831]">
                    Recent Allocations
                  </h2>
                </div>

                <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500">
                  Latest
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {recentAllocations.map((allocation) => (
                  <div
                    key={allocation._id}
                    className="
                      rounded-2xl
                      border
                      border-gray-100
                      p-4
                      transition
                      hover:border-[#00ADB5]/20
                      hover:bg-[#00ADB5]/5
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#00ADB5]/10 px-2.5 py-1 text-[11px] font-bold text-[#00ADB5]">
                            {allocation.category}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatDate(allocation.createdAt)}
                          </span>
                        </div>

                        <p className="mt-2 truncate font-semibold text-[#222831]">
                          {allocation.campaign?.title || "Campaign unavailable"}
                        </p>

                        {allocation.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                            {allocation.description}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-bold text-[#00ADB5]">
                        {formatMoney(allocation.amount)}
                      </p>
                    </div>
                  </div>
                ))}

                {recentAllocations.length === 0 && (
                  <div className="rounded-2xl bg-gray-50 py-10 text-center text-sm text-gray-400">
                    No allocations yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-8">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00ADB5]">
                Shortcuts
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#222831]">
                Administration
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/campaigns"
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#00ADB5]/30
                  hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ADB5]/10 text-[#00ADB5]">
                    C
                  </div>

                  <span className="text-gray-300 transition group-hover:text-[#00ADB5]">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-[#222831]">
                  Manage Campaigns
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Create, edit, and manage relief campaigns.
                </p>
              </a>

              <a
                href="/admin/campaign-analytics"
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#00ADB5]/30
                  hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    A
                  </div>

                  <span className="text-gray-300 transition group-hover:text-[#00ADB5]">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-[#222831]">
                  Campaign Analytics
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Monitor campaign donation performance.
                </p>
              </a>

              <a
                href="/admin/report-verification"
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#00ADB5]/30
                  hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    R
                  </div>

                  <span className="text-gray-300 transition group-hover:text-[#00ADB5]">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-[#222831]">
                  Report Verification
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Review submitted disaster reports.
                </p>
              </a>

              <a
                href="/admin/sms-broadcast"
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#00ADB5]/30
                  hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    S
                  </div>

                  <span className="text-gray-300 transition group-hover:text-[#00ADB5]">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-bold text-[#222831]">SMS Broadcast</h3>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Send emergency notifications.
                </p>
              </a>
            </div>
          </section>

          {/* =================================================
              FOOTER SPACE
          ================================================= */}

          <div className="h-8" />
        </main>
      </div>
    </div>
  );
}
