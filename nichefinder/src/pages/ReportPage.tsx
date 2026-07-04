import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { localStore } from "@/lib/storage";
import { scoreSession } from "@/lib/scoring";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AGE_GROUPS, SUPPORT_LEVELS } from "@/data/categories";

/**
 * Strength Profile Report — printable / PDF layout.
 *
 * "Export as PDF" uses the browser's native print-to-PDF (window.print()),
 * which needs no dependency and always produces an accessible, selectable PDF.
 * The print stylesheet in index.css hides the app chrome and the on-screen
 * buttons (.no-print) so only the report prints.
 */
export function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const session = sessionId ? localStore.getSession(sessionId) : undefined;
  const person = session ? localStore.getPerson(session.personId) : undefined;
  const result = useMemo(() => (session ? scoreSession(session) : null), [session]);

  if (!session || !result || !person) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg text-ink">We couldn't find that report.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-brand">← Back home</Link>
      </Card>
    );
  }

  const ageLabel = AGE_GROUPS.find((a) => a.id === person.ageGroup)?.label ?? person.ageGroup;
  const supportLabel = SUPPORT_LEVELS.find((s) => s.id === person.supportLevel)?.label ?? "";
  const primary = result.matchedProfiles[0];

  return (
    <div className="space-y-6">
      {/* Screen-only action bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link to={`/results/${session.id}`} className="font-semibold text-brand">
          ← Back to dashboard
        </Link>
        <div className="flex gap-3">
          <Button icon="🖨️" onClick={() => window.print()}>Export as PDF</Button>
        </div>
      </div>

      {/* The printable page */}
      <article className="print-page rounded-xl3 border-2 border-line bg-white p-8 text-[15px] leading-relaxed text-slate-800 shadow-soft nf-bordered">
        {/* Letterhead */}
        <header className="mb-6 flex items-start justify-between border-b-2 border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-extrabold text-teal-700">
              <span aria-hidden="true">🌱</span> NicheFinder
            </div>
            <p className="text-sm text-slate-500">Ability &amp; Strength Discovery Report</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p className="font-semibold text-slate-700">{person.displayName}</p>
            <p>{ageLabel}</p>
            <p>{supportLabel}</p>
          </div>
        </header>

        {/* Intro line — growth framing */}
        <p className="mb-6 rounded-xl2 bg-teal-50 p-4 text-slate-700">
          This report highlights where <strong>{person.displayName}</strong>{" "}
          naturally thrives. It is a strengths-discovery tool, not a test — there
          are no scores of good or bad, only strengths to build on and gentle
          ways to support growth.
        </p>

        {/* Profile */}
        {primary && (
          <section className="mb-6">
            <h2 className="mb-1 text-lg font-bold text-slate-900">
              {primary.icon} Strengths Profile: {primary.title}
            </h2>
            <p>{primary.description}</p>
          </section>
        )}

        {/* Top strengths */}
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Top strengths</h2>
          <ul className="space-y-2">
            {result.topStrengths.map((s, i) => (
              <li key={s.category.id} className="flex items-center gap-3">
                <span className="w-5 font-bold text-teal-700">{i + 1}.</span>
                <span aria-hidden="true">{s.category.icon}</span>
                <span className="flex-1">
                  <strong>{s.category.label}</strong> — {s.category.blurb}
                </span>
                <span className="text-sm text-slate-500">{s.percent}%</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Two columns of detail */}
        <section className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-slate-900">Learning style</h3>
            <p>{result.learningStyle}</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Sensory preferences</h3>
            <p>
              {result.sensoryNotes.length > 0
                ? result.sensoryNotes.map((n) => n.label).join(", ")
                : "No strong signal yet — observe over time."}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Best environment</h3>
            <p>{result.bestEnvironment}</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Responds well to</h3>
            <p>{primary?.respondsWellTo ?? "A mix of hands-on, visual and social learning."}</p>
          </div>
        </section>

        {/* Support recommendations */}
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Support recommendations</h2>
          <ul className="list-inside list-disc space-y-1">
            {result.supportRecommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        {/* Activities + pathways */}
        <section className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">Suggested activities</h2>
            <ul className="list-inside list-disc space-y-1">
              {result.suggestedActivities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">Possible pathways</h2>
            <p>{result.pathways.join(" · ")}</p>
          </div>
        </section>

        {/* Notes */}
        {person.notes && (
          <section className="mb-6">
            <h2 className="mb-2 text-lg font-bold text-slate-900">Caregiver / teacher notes</h2>
            <p className="whitespace-pre-wrap rounded-xl2 bg-slate-50 p-3">{person.notes}</p>
          </section>
        )}

        <footer className="mt-8 border-t-2 border-slate-200 pt-3 text-xs text-slate-400">
          <p>
            Generated by NicheFinder · Based on {result.answeredCount} of{" "}
            {result.totalQuestions} questions answered. This report is a
            strengths-discovery guide, not a clinical or diagnostic assessment.
          </p>
        </footer>
      </article>
    </div>
  );
}
