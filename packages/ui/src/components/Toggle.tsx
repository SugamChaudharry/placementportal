interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string; }
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={"relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none " + (checked ? "bg-indigo-600" : "bg-gray-300")}>
        <span className={"absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 " + (checked ? "translate-x-4" : "translate-x-0")} />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
