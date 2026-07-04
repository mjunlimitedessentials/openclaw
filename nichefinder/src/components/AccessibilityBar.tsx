import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Toggle } from "@/components/ui/Toggle";
import { isSpeechSupported } from "@/lib/audio";

/**
 * A persistent, always-reachable accessibility control.
 *
 * Collapsed by default to keep the interface calm and uncluttered; opening it
 * reveals the full set of comfort controls. Everything here changes the whole
 * app instantly via SettingsContext.
 */
export function AccessibilityBar() {
  const { settings, update, toggle, reset } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="nf-accessibility-panel"
        className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-surface px-4 py-2 font-semibold text-ink hover:border-brand transition nf-bordered"
      >
        <span aria-hidden="true">⚙️</span>
        Comfort &amp; Access
      </button>

      {open && (
        <div
          id="nf-accessibility-panel"
          className="mt-3 grid gap-3 rounded-xl3 border-2 border-line bg-surface p-4 shadow-lift nf-bordered animate-fade-in sm:grid-cols-2"
        >
          {/* Text size — segmented control */}
          <div className="rounded-xl2 border-2 border-line p-4 nf-bordered">
            <p className="mb-2 font-semibold text-ink">Text size</p>
            <div className="flex gap-2">
              {(["normal", "large", "xlarge"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => update({ textSize: size })}
                  aria-pressed={settings.textSize === size}
                  className={[
                    "flex-1 rounded-xl2 border-2 py-2 font-semibold capitalize transition",
                    settings.textSize === size
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-surface text-ink hover:border-brand",
                  ].join(" ")}
                >
                  {size === "xlarge" ? "X-Large" : size}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            icon="🌗"
            label="High contrast"
            description="Stronger colors and borders."
            checked={settings.contrast === "high"}
            onChange={(next) => update({ contrast: next ? "high" : "normal" })}
          />

          {isSpeechSupported() && (
            <Toggle
              icon="🔊"
              label="Read aloud automatically"
              description="Speak each question when it appears."
              checked={settings.audioAutoRead}
              onChange={() => toggle("audioAutoRead")}
            />
          )}

          <Toggle
            icon="🖼️"
            label="Picture mode"
            description="Bigger pictures, less text."
            checked={settings.pictureMode}
            onChange={() => toggle("pictureMode")}
          />

          <Toggle
            icon="🕊️"
            label="Calm mode"
            description="Turn off motion and animations."
            checked={settings.reducedMotion}
            onChange={() => toggle("reducedMotion")}
          />

          <div className="flex items-center justify-end sm:col-span-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl2 px-4 py-2 font-semibold text-ink-soft hover:text-ink"
            >
              Reset to default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
