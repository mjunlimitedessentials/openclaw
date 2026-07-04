import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AccessibilityBar } from "@/components/AccessibilityBar";

/**
 * The shared page frame: warm header with the brand, the always-available
 * accessibility controls, the page content, and a gentle footer.
 *
 * Layout is mobile-first and centered with a comfortable max width so lines
 * never get too long to read.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Skip link for keyboard/AT users. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl2 focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="no-print border-b-2 border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-brand"
          >
            <span aria-hidden="true" className="text-2xl">🌱</span>
            <span>
              NicheFinder
              <span className="hidden text-sm font-medium text-ink-soft sm:inline">
                {" "}· Strength Discovery
              </span>
            </span>
          </Link>
          <AccessibilityBar />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-10">
        {children}
      </main>

      <footer className="no-print border-t-2 border-line py-6 text-center text-sm text-ink-soft">
        <p>
          NicheFinder celebrates strengths, not labels. Every person has a place
          to thrive. 💛
        </p>
      </footer>
    </div>
  );
}
