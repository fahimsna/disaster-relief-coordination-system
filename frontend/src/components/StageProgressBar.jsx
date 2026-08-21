const STAGES = ["Dispatched", "In Transit", "On Site", "Distributed"];

// Four-dot step indicator -- `current` is null (not started) or one of STAGES.
export default function StageProgressBar({ current }) {
  const currentIndex = current ? STAGES.indexOf(current) : -1;

  return (
    <div className="flex items-center">
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= currentIndex
                  ? "bg-[#00ADB5] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`mt-1.5 text-[10px] font-medium ${i <= currentIndex ? "text-[#00ADB5]" : "text-gray-400"}`}
            >
              {stage}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div
              className={`mx-2 h-0.5 flex-1 ${i < currentIndex ? "bg-[#00ADB5]" : "bg-gray-100"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
