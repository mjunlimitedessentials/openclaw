import type { AnswerOption } from "@/types";
import { SpeakButton } from "@/components/ui/SpeakButton";

/**
 * A single large touch card for one answer option.
 *
 * - Big tap target with a prominent icon and simple label.
 * - Selected state is shown with color, a ring AND a ✓ (never color alone,
 *   so it works for color-blind users and in high-contrast mode).
 * - Includes its own "read aloud" button when speech is available.
 */
export function AnswerCard({
  option,
  selected,
  onSelect,
  pictureMode,
}: {
  option: AnswerOption;
  selected: boolean;
  onSelect: () => void;
  pictureMode?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "group relative flex w-full flex-col items-center justify-center gap-3 text-center",
        "rounded-xl3 border-[3px] p-5 transition nf-bordered",
        "min-h-[9rem] sm:min-h-[11rem]",
        selected
          ? "border-brand bg-brand-soft shadow-lift"
          : "border-line bg-surface shadow-soft hover:border-brand hover:-translate-y-0.5",
      ].join(" ")}
    >
      {/* Selected checkmark badge (non-color cue). */}
      {selected && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-lg text-white"
        >
          ✓
        </span>
      )}

      <span
        aria-hidden="true"
        className={pictureMode ? "text-7xl sm:text-8xl" : "text-5xl sm:text-6xl"}
      >
        {option.icon}
      </span>

      {/* In full picture mode the label is smaller/secondary. */}
      <span
        className={[
          "font-semibold text-ink",
          pictureMode ? "text-base" : "text-answer",
        ].join(" ")}
      >
        {option.label}
      </span>

      {/* Read-aloud lives in a corner so it doesn't compete with the tap. */}
      <span className="absolute bottom-2 left-2">
        <SpeakButton
          text={option.readAloud ?? option.label}
          label={`Read aloud: ${option.label}`}
        />
      </span>
    </button>
  );
}
