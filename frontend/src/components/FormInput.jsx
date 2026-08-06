// Reusable labeled text input.
// `highlighted` draws the orange OCR-autofill border
// for fields that were just auto-filled and still need the user's review.
export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  highlighted = false,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition
          focus:border-brand-accent focus:ring-1 focus:ring-brand-accent
          ${highlighted ? "border-brand-accent" : "border-gray-300"}`}
      />
    </label>
  );
}
