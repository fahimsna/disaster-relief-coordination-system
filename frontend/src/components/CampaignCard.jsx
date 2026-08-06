import { Link } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  const raised = Number(campaign?.raisedAmount) || 0;
  const target = Number(campaign?.targetAmount) || 0;

  const percentage =
    target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US").format(amount);

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={
            campaign?.image ||
            "https://placehold.co/800x500/e2e8f0/64748b?text=Disaster+Relief"
          }
          alt={campaign?.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {campaign?.disasterType || "Relief"}
          </span>
        </div>

        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
              campaign?.status === "Active"
                ? "bg-green-600"
                : "bg-gray-600"
            }`}
          >
            {campaign?.status || "Unknown"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="line-clamp-2 text-2xl font-bold text-slate-900">
          {campaign?.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {campaign?.description}
        </p>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <span>📍 {campaign?.location || "Location not specified"}</span>

          <span className="font-medium text-blue-600">
            {percentage.toFixed(0)}% Funded
          </span>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Amounts */}
        <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Raised
            </p>

            <p className="mt-1 text-lg font-bold text-green-600">
              ${formatCurrency(raised)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Goal
            </p>

            <p className="mt-1 text-lg font-bold text-slate-700">
              {target > 0 ? `$${formatCurrency(target)}` : "Not set"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <Link
            to={`/campaigns/${campaign?._id}`}
            className="flex-1 rounded-xl border border-blue-600 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View Details
          </Link>

          <button className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;