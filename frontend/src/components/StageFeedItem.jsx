// One row in the admin feed -- volunteer, incident, stage badge, note, timestamp.
const stageColors = {
  Dispatched: "bg-blue-50 text-blue-600",
  "In Transit": "bg-yellow-50 text-yellow-600",
  "On Site": "bg-orange-50 text-orange-600",
  Distributed: "bg-green-50 text-green-600",
};

export default function StageFeedItem({ update }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 transition hover:border-[#00ADB5]/20 hover:bg-[#00ADB5]/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${stageColors[update.stage]}`}
            >
              {update.stage}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(update.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 font-semibold text-[#222831]">
            {update.volunteer?.fullName || "Unknown volunteer"}
          </p>
          <p className="text-xs text-gray-400">
            {update.incident?.crisisType} · {update.incident?.district}
          </p>
          {update.note && (
            <p className="mt-1 text-sm leading-5 text-gray-500">
              {update.note}
            </p>
          )}
        </div>
        {update.photoUrl && (
          <img
            src={update.photoUrl}
            alt="update"
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
        )}
      </div>
    </div>
  );
}
