import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "quiet";
type Size = "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Optional leading icon (emoji or node). */
  icon?: ReactNode;
  block?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:brightness-105 border-2 border-transparent",
  secondary:
    "bg-surface text-ink border-2 border-line hover:border-brand nf-bordered",
  ghost: "bg-transparent text-brand hover:bg-brand-soft/60 border-2 border-transparent",
  quiet: "bg-surface-2 text-ink-soft hover:text-ink border-2 border-transparent",
};

const SIZES: Record<Size, string> = {
  // All sizes keep a large, finger-friendly minimum touch target (>=48px).
  md: "min-h-[48px] px-5 py-3 text-base rounded-xl2",
  lg: "min-h-[56px] px-6 py-4 text-lg rounded-xl2",
  xl: "min-h-[64px] px-8 py-5 text-xl rounded-xl3",
};

/**
 * The single button primitive used across the app. Big, calm, high-contrast
 * ready, and always keyboard/switch accessible via the global focus ring.
 */
export function Button({
  variant = "primary",
  size = "lg",
  icon,
  block,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-3 font-semibold",
        "transition disabled:opacity-40 disabled:cursor-not-allowed active:animate-pop select-none",
        VARIANTS[variant],
        SIZES[size],
        block ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {icon && <span aria-hidden="true" className="text-[1.4em] leading-none">{icon}</span>}
      {children}
    </button>
  );
}
