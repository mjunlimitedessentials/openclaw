/**
 * A large, clearly-labelled on/off switch used in the accessibility panel.
 * Implemented as a native button with role="switch" for full AT support.
 */
export function Toggle({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  icon?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 rounded-xl2 border-2 border-line bg-surface p-4 text-left transition hover:border-brand nf-bordered"
    >
      {icon && <span aria-hidden="true" className="text-2xl">{icon}</span>}
      <span className="flex-1">
        <span className="block font-semibold text-ink">{label}</span>
        {description && (
          <span className="block text-sm text-ink-soft">{description}</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={[
          "relative h-8 w-14 shrink-0 rounded-full border-2 transition",
          checked ? "bg-brand border-brand" : "bg-surface-2 border-line",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
            checked ? "left-[26px]" : "left-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
