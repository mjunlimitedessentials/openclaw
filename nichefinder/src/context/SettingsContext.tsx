import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Accessibility settings context
 * ==============================
 *
 * Holds the user-facing accessibility toggles that must be available on every
 * screen: contrast, text size, read-aloud, reduced motion and picture mode.
 *
 * Settings are persisted so a returning user keeps their calm, comfortable
 * setup. The values are applied to <html> as data-attributes / classes; the
 * CSS in `index.css` does the rest, so components never branch on these flags.
 */

export type TextSize = "normal" | "large" | "xlarge";
export type Contrast = "normal" | "high";

export interface Settings {
  contrast: Contrast;
  textSize: TextSize;
  /** Read questions & answers aloud automatically as they appear. */
  audioAutoRead: boolean;
  /** Remove animations/transitions for a calmer, distraction-free experience. */
  reducedMotion: boolean;
  /** Prefer picture-forward questions with minimal text. */
  pictureMode: boolean;
}

const DEFAULTS: Settings = {
  contrast: "normal",
  textSize: "normal",
  audioAutoRead: false,
  reducedMotion: false,
  pictureMode: false,
};

const STORAGE_KEY = "nf.settings";

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  toggle: (key: keyof Settings) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  // Persist + apply to the document root whenever settings change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota/private-mode errors */
    }
    const root = document.documentElement;
    root.dataset.contrast = settings.contrast;
    root.dataset.textsize = settings.textSize;
    root.classList.toggle("nf-reduce-motion", settings.reducedMotion);
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
      toggle: (key) =>
        setSettings((s) => {
          const current = s[key];
          if (typeof current === "boolean") return { ...s, [key]: !current };
          return s;
        }),
      reset: () => setSettings(DEFAULTS),
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
