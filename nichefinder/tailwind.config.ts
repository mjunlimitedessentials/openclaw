import type { Config } from "tailwindcss";

/**
 * NicheFinder design tokens.
 *
 * The palette is intentionally warm, calm and low-arousal (soft teals, warm
 * sand, gentle coral) rather than clinical or childish. Colours are exposed as
 * CSS variables (see `index.css`) so that High Contrast mode can override them
 * globally without touching component code.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens -> CSS variables (themeable at runtime).
        bg: "rgb(var(--nf-bg) / <alpha-value>)",
        surface: "rgb(var(--nf-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--nf-surface-2) / <alpha-value>)",
        ink: "rgb(var(--nf-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--nf-ink-soft) / <alpha-value>)",
        line: "rgb(var(--nf-line) / <alpha-value>)",
        brand: "rgb(var(--nf-brand) / <alpha-value>)",
        "brand-soft": "rgb(var(--nf-brand-soft) / <alpha-value>)",
        accent: "rgb(var(--nf-accent) / <alpha-value>)",
        focus: "rgb(var(--nf-focus) / <alpha-value>)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      fontSize: {
        // A comfortable, slightly larger base scale for readability.
        "answer": ["1.375rem", { lineHeight: "1.75rem", fontWeight: "600" }],
      },
      boxShadow: {
        soft: "0 4px 20px -6px rgb(0 0 0 / 0.12)",
        lift: "0 10px 34px -10px rgb(0 0 0 / 0.22)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "pop": "pop 0.18s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
