import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { localStore } from "@/lib/storage";
import { scoreSession } from "@/lib/scoring";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { now } from "@/lib/id";

/**
 * Results dashboard.
 *
 * A warm, celebratory summary of a completed session: top strengths, matched
 * strengths profile, learning style, sensory notes, activities, best
 * environment, support recommendations and possible pathways. Also hosts the
 * editable caregiver/teacher notes and the links to the printable report.
 *
 * All numbers come from the pure scoring engine — this file is presentation
 * only.
 */
export function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const session = sessionId ? localStore.getSession(sessionId) : undefined;
  const person = session ? localStore.getPerson(session.personId) : undefined;

  const result = useMemo(() => (session ? scoreSession(session) : null), [session]);
  const [notes, setNotes] = useState(person?.notes ?? "");
  const [savedNote, setSavedNote] = useState(false);

  if (!session || !result || !person) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg text-ink">We couldn't find those results.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-brand">← Back home</Link>
      </Card>
    );
  }

  const primary = result.matchedProfiles[0];

  function saveNotes() {
    if (!person) return;
    localStore.savePerson({ ...person, notes, updatedAt: now() });
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Celebration header */}
      <section className="text-center">
        <div aria-hidden="true" className="text-5xl">🎉</div>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">
          {person.displayName}&apos;s strengths
        </h1>
        <p className="mt-2 text-ink-soft">
          Here&apos;s where {person.displayName} naturally shines. Every one of
          these is a real strength to build on.
        </p>
      </section>

      {/* Primary profile */}
      {primary && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4 bg-brand-soft p-6">
            <span aria-hidden="true" className="text-5xl">{primary.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                Strengths profile
              </p>
              <h2 className="text-2xl font-extrabold text-ink">{primary.title}</h2>
              <p className="text-ink-soft">{primary.tagline}</p>
            </div>
            <SpeakButton text={`${primary.title}. ${primary.description}`} />
          </div>
          <p className="p-6 text-lg text-ink">{primary.description}</p>
        </Card>
      )}

      {/* Top 3 strengths with bars */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-bold text-ink">Top 3 strengths</h2>
        <ol className="space-y-4">
          {result.topStrengths.map((s, i) => (
            <li key={s.category.id}>
              <div className="mb-1 flex items-center gap-3">
                <span aria-hidden="true" className="text-2xl">{s.category.icon}</span>
                <span className="flex-1 font-bold text-ink">
                  {i + 1}. {s.category.label}
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-surface-2 border-2 border-line nf-bordered">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.percent}%`, backgroundColor: s.category.color }}
                />
              </div>
              <p className="mt-1 text-sm text-ink-soft">{s.category.blurb}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Learning style + sensory */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-ink">
            <span aria-hidden="true">🧠</span> Learning style
          </h2>
          <p className="text-ink">{result.learningStyle}</p>
        </Card>
        <Card className="p-6">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-ink">
            <span aria-hidden="true">👂</span> Sensory preferences
          </h2>
          {result.sensoryNotes.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {result.sensoryNotes.map((n) => (
                <li
                  key={n.channel}
                  className="rounded-full border-2 border-line bg-surface-2 px-3 py-1 text-sm font-semibold text-ink nf-bordered"
                >
                  {n.label} · likes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-soft">No strong sensory signal yet — worth observing over time.</p>
          )}
        </Card>
      </div>

      {/* Best environment + support */}
      <Card className="p-6">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-ink">
          <span aria-hidden="true">🏡</span> Best environment
        </h2>
        <p className="text-ink">{result.bestEnvironment}</p>
        <h3 className="mb-2 mt-5 font-bold text-ink">Support recommendations</h3>
        <ul className="space-y-2">
          {result.supportRecommendations.map((r, i) => (
            <li key={i} className="flex gap-2 text-ink">
              <span aria-hidden="true" className="text-brand">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Suggested activities */}
      <Card className="p-6">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-ink">
          <span aria-hidden="true">🎯</span> Try these activities
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {result.suggestedActivities.map((a, i) => (
            <li key={i} className="rounded-xl2 border-2 border-line bg-surface-2 p-3 text-ink nf-bordered">
              {a}
            </li>
          ))}
        </ul>
      </Card>

      {/* Pathways */}
      <Card className="p-6">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-ink">
          <span aria-hidden="true">🧭</span> Possible pathways to explore
        </h2>
        <p className="mb-3 text-sm text-ink-soft">
          Gentle ideas — hobbies, interests or directions that often suit these
          strengths. Nothing here is fixed.
        </p>
        <ul className="flex flex-wrap gap-2">
          {result.pathways.map((p) => (
            <li
              key={p}
              className="rounded-full border-2 border-brand/40 bg-brand-soft/50 px-4 py-2 font-semibold text-ink nf-bordered"
            >
              {p}
            </li>
          ))}
        </ul>
      </Card>

      {/* Caregiver / teacher notes */}
      <Card className="p-6">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-ink">
          <span aria-hidden="true">📝</span> Caregiver / teacher notes
        </h2>
        <p className="mb-3 text-sm text-ink-soft">
          Private notes stay with this profile and appear on the printed report.
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="e.g. Lights up around music; prefers a quiet corner after lunch…"
          className="w-full rounded-xl2 border-2 border-line bg-surface p-4 text-ink outline-none focus:border-brand nf-bordered"
        />
        <div className="mt-3 flex items-center gap-3">
          <Button variant="secondary" onClick={saveNotes}>Save notes</Button>
          {savedNote && <span className="font-semibold text-brand" role="status">Saved ✓</span>}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to={`/report/${session.id}`}>
          <Button size="lg" icon="📄" block>View printable report</Button>
        </Link>
        <Link to="/create">
          <Button size="lg" variant="secondary" icon="✨" block>New discovery</Button>
        </Link>
        <Link to="/">
          <Button size="lg" variant="quiet" icon="🏠" block>Home</Button>
        </Link>
      </div>
    </div>
  );
}
