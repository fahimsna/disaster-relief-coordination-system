// A single skill "chip" that acts like a checkbox: click to toggle selected.
// Styled as pill buttons on the "Confirm Your Details" screen
// (filled navy-on-orange when selected, outlined when not).
export default function SkillChip({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition
        ${
          selected
            ? "border-brand-accent bg-brand-accent text-white"
            : "border-gray-300 bg-white text-gray-600 hover:border-brand-accent/60"
        }`}
    >
      {label}
    </button>
  );
}
