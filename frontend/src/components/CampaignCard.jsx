import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createCheckoutSession } from "../api/donationApi";

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(1000);

  const raised = Number(campaign?.raisedAmount) || 0;
  const target = Number(campaign?.targetAmount) || 0;

  const percentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US").format(amount);

  const handleDonate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!amount || amount <= 0) {
        alert("Please enter a valid donation amount");
        return;
      }

      const donationData = {
        campaignId: campaign._id,
        amount: Number(amount),
      };

      const response = await createCheckoutSession(donationData, token);

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  return (
    <>
      <div
        className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
        "
      >
        <div className="relative overflow-hidden">
          <img
            src={
              campaign?.image ||
              "https://placehold.co/800x500/e2e8f0/64748b?text=Disaster+Relief"
            }
            alt={campaign?.title}
            className="
            h-56
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
            "
          />

          <div className="absolute left-4 top-4">
            <span
              className="
              rounded-full
              bg-[#00ADB5]
              px-3
              py-1
              text-xs
              font-semibold
              text-white
              "
            >
              {campaign?.disasterType || "Relief"}
            </span>
          </div>

          <div className="absolute right-4 top-4">
            <span
              className="
              rounded-full
              bg-green-600
              px-3
              py-1
              text-xs
              font-semibold
              text-white
              "
            >
              {campaign?.status || "Active"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#222831]">
            {campaign?.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm text-gray-600">
            {campaign?.description}
          </p>

          <div className="mt-5 flex justify-between text-sm">
            <span>📍 {campaign?.location || "Not specified"}</span>

            <span className="font-semibold text-[#00ADB5]">
              {percentage.toFixed(0)}% Funded
            </span>
          </div>

          <div className="mt-5 h-3 rounded-full bg-gray-200">
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

          <div className="mt-5 grid grid-cols-2 rounded-2xl bg-[#F5F7FA] p-4">
            <div>
              <p className="text-xs text-gray-500">Raised</p>

              <p className="font-bold text-green-600">
                ৳ {formatCurrency(raised)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Goal</p>

              <p className="font-bold">
                {target ? `৳ ${formatCurrency(target)}` : "Not set"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              to={`/campaigns/${campaign?._id}`}
              className="
              flex-1
              rounded-xl
              border
              border-[#00ADB5]
              py-3
              text-center
              font-semibold
              text-[#00ADB5]
              "
            >
              Details
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="
              flex-1
              rounded-xl
              bg-[#00ADB5]
              py-3
              font-semibold
              text-white
              hover:bg-[#0097A0]
              "
            >
              Donate
            </button>
          </div>
        </div>
      </div>

      {/* Donation Modal */}

      {showModal && (
        <div
          className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          "
        >
          <div
            className="
            w-[90%]
            max-w-md
            rounded-3xl
            bg-white
            p-6
            shadow-xl
            "
          >
            <h2 className="text-2xl font-bold text-[#222831]">
              Donate to {campaign.title}
            </h2>

            <label className="mt-5 block text-sm font-semibold">
              Donation Amount (৳)
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="
              mt-2
              w-full
              rounded-xl
              border
              px-4
              py-3
              "
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="
                flex-1
                rounded-xl
                border
                py-3
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDonate}
                className="
                flex-1
                rounded-xl
                bg-[#00ADB5]
                py-3
                font-semibold
                text-white
                "
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignCard;
