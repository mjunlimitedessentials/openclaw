import type { ReactNode } from "react";

/** A calm, rounded surface panel. The base container for most content. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Tag
      className={[
        "bg-surface border-2 border-line rounded-xl3 shadow-soft nf-bordered",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
