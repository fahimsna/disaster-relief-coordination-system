// Reusable labeled dropdown.
// `groups`: for the district select, an array of { division, districts[] } so
// the dropdown renders <optgroup> sections. `options`: flat list (blood type).
export default function FormSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
  groups,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800
          outline-none transition focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {/* flat list, e.g. blood types */}
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}

        {/* grouped list, e.g. districts by division */}
        {groups?.map((group) => (
          <optgroup key={group.division} label={group.division}>
            {group.districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
