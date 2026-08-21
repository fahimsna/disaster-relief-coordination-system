// One card shape reused across Available/Assigned/Deployed so the board
// doesn't triplicate markup -- pass whichever `actions` fit the column.
export default function VolunteerBoardCard({
  volunteer,
  incidentLabel,
  actions = [],
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-[#00ADB5]/30">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#222831]">
            {volunteer.fullName}
          </p>
          <p className="mt-0.5 truncate text-xs text-gray-400">
            {volunteer.district} • {volunteer.phone}
          </p>
        </div>

        {volunteer.bloodType && (
          <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500">
            {volunteer.bloodType}
          </span>
        )}
      </div>

      {volunteer.skills?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {volunteer.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#00ADB5]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00ADB5]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {incidentLabel && (
        <p className="mt-2 truncate text-xs font-medium text-[#30475E]">
          → {incidentLabel}
        </p>
      )}

      {actions.length > 0 && (
        <div className="mt-3 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={
                action.variant === "secondary"
                  ? "flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  : "flex-1 rounded-lg bg-[#00ADB5] py-1.5 text-xs font-semibold text-white transition hover:bg-[#0097A0] disabled:cursor-not-allowed disabled:opacity-40"
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
