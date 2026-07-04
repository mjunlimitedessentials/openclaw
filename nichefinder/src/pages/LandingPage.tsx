import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { localStore } from "@/lib/storage";
import { AGE_GROUPS } from "@/data/categories";

/**
 * Landing page — warm, hopeful, uncluttered.
 * Explains the tool in one breath, offers a single clear "Start" action, and
 * quietly surfaces any saved / in-progress sessions so returning users can pick
 * up exactly where they left off (Save & Resume).
 */
export function LandingPage() {
  const navigate = useNavigate();
  const people = localStore.listPeople();
  const sessions = localStore.listSessions();

  const inProgress = sessions.filter((s) => s.status === "in_progress");
  const completed = sessions.filter((s) => s.status === "completed");
  const nameFor = (personId: string) =>
    people.find((p) => p.id === personId)?.displayName ?? "Someone";
  const ageLabel = (id: string) => AGE_GROUPS.find((a) => a.id === id)?.label ?? id;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center">
        <div aria-hidden="true" className="mb-4 text-6xl">🌱</div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Discover where you naturally{" "}
          <span className="text-brand">thrive</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          NicheFinder is a gentle, touch-based way to find a person's real
          strengths, interests and learning style — for ages 5 to 80. No right or
          wrong answers. No labels. Just what makes each person light up.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="xl" icon="✨" onClick={() => navigate("/create")}>
            Start a discovery
          </Button>
          <Button size="xl" variant="secondary" icon="🛠️" onClick={() => navigate("/admin")}>
            Admin / edit questions
          </Button>
        </div>
      </section>

      {/* Resume in-progress */}
      {inProgress.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-ink">Pick up where you left off</h2>
          <ul className="space-y-3">
            {inProgress.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/assessment/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl2 border-2 border-line p-4 hover:border-brand nf-bordered"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-2xl">⏳</span>
                    <span>
                      <span className="block font-semibold text-ink">{nameFor(s.personId)}</span>
                      <span className="block text-sm text-ink-soft">
                        {ageLabel(s.ageGroup)} · Question {s.currentIndex + 1} of {s.questionOrder.length}
                      </span>
                    </span>
                  </span>
                  <span className="font-semibold text-brand">Continue →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Past results */}
      {completed.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-ink">Saved strength profiles</h2>
          <ul className="space-y-3">
            {completed.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/results/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl2 border-2 border-line p-4 hover:border-brand nf-bordered"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-2xl">🌟</span>
                    <span>
                      <span className="block font-semibold text-ink">{nameFor(s.personId)}</span>
                      <span className="block text-sm text-ink-soft">{ageLabel(s.ageGroup)}</span>
                    </span>
                  </span>
                  <span className="font-semibold text-brand">View →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Reassurance / values */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: "🧩", title: "Strengths, not tests", text: "We look for what works, never what's 'wrong'." },
          { icon: "🫶", title: "Built for everyone", text: "Designed with the special-needs community in mind." },
          { icon: "🕊️", title: "Calm & unhurried", text: "No timers, no pressure. Pause and resume anytime." },
        ].map((f) => (
          <Card key={f.title} className="p-5 text-center">
            <div aria-hidden="true" className="mb-2 text-4xl">{f.icon}</div>
            <h3 className="font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{f.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
