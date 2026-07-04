import { isSpeechSupported, speak } from "@/lib/audio";

/**
 * A small round "read aloud" button. Renders nothing if the device has no
 * speech synthesis, so screens never show a button that can't work.
 */
export function SpeakButton({
  text,
  label = "Read aloud",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  if (!isSpeechSupported()) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={label}
      title={label}
      className={[
        "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
        "border-2 border-line bg-surface text-xl hover:border-brand hover:bg-brand-soft/50 transition nf-bordered",
        className,
      ].join(" ")}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}
