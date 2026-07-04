import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AgeGroupId, SupportLevel, PersonProfile, AssessmentSession } from "@/types";
import { AGE_GROUPS, SUPPORT_LEVELS } from "@/data/categories";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { localStore, effectiveQuestions } from "@/lib/storage";
import { newId, now } from "@/lib/id";

/**
 * A gentle 3-step setup: name → age group → support level.
 * Steps are shown one at a time so the screen is never busy. Nothing is
 * required to be typed except an optional display name (the caregiver can do
 * that part); the main user only ever taps.
 */
export function CreateProfilePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroupId | null>(null);
  const [supportLevel, setSupportLevel] = useState<SupportLevel | null>(null);

  function begin() {
    if (!ageGroup || !supportLevel) return;

    const person: PersonProfile = {
      id: newId("person"),
      displayName: displayName.trim() || "Explorer",
      ageGroup,
      supportLevel,
      createdAt: now(),
      updatedAt: now(),
    };
    localStore.savePerson(person);

    // Build this run's question order from the effective bank for the age group.
    const questionOrder = effectiveQuestions()
      .filter((q) => q.ageGroups.includes(ageGroup))
      .map((q) => q.id);

    const session: AssessmentSession = {
      id: newId("session"),
      personId: person.id,
      ageGroup,
      questionOrder,
      answers: {},
      currentIndex: 0,
      status: "in_progress",
      createdAt: now(),
      updatedAt: now(),
    };
    localStore.saveSession(session);

    navigate(`/assessment/${session.id}`);
  }

  const steps = ["Name", "Age group", "How to answer"];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <ol className="flex items-center justify-center gap-2" aria-label="Setup steps">
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={i === step ? "step" : undefined}
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full border-2 font-bold nf-bordered",
                i < step
                  ? "border-brand bg-brand text-white"
                  : i === step
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line bg-surface text-ink-soft",
              ].join(" ")}
            >
              {i < step ? "✓" : i + 1}
            </span>
            {i < steps.length - 1 && <span aria-hidden="true" className="h-0.5 w-6 bg-line" />}
          </li>
        ))}
      </ol>

      {/* Step 0: name (optional) */}
      {step === 0 && (
        <Card className="p-6 sm:p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-ink">Who is this for?</h1>
          <p className="mt-2 text-ink-soft">
            A first name or nickname helps us make the report personal. This is
            optional — you can skip it.
          </p>
          <label htmlFor="nf-name" className="mt-6 block font-semibold text-ink">
            First name or nickname
          </label>
          <input
            id="nf-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Sam"
            autoComplete="off"
            className="mt-2 w-full rounded-xl2 border-2 border-line bg-surface px-4 py-4 text-lg text-ink outline-none focus:border-brand nf-bordered"
          />
          <div className="mt-6 flex justify-between">
            <Button variant="quiet" onClick={() => navigate("/")}>← Home</Button>
            <Button icon="→" onClick={() => setStep(1)}>Next</Button>
          </div>
        </Card>
      )}

      {/* Step 1: age group */}
      {step === 1 && (
        <Card className="p-6 sm:p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-ink">Choose an age group</h1>
          <p className="mt-2 text-ink-soft">
            This gently tailors the questions. Pick the closest fit.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AGE_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setAgeGroup(g.id)}
                aria-pressed={ageGroup === g.id}
                className={[
                  "flex items-center gap-4 rounded-xl2 border-[3px] p-4 text-left transition nf-bordered",
                  ageGroup === g.id
                    ? "border-brand bg-brand-soft"
                    : "border-line bg-surface hover:border-brand",
                ].join(" ")}
              >
                <span aria-hidden="true" className="text-3xl">{g.icon}</span>
                <span>
                  <span className="block text-lg font-bold text-ink">{g.label}</span>
                  <span className="block text-sm text-ink-soft">{g.hint}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="quiet" onClick={() => setStep(0)}>← Back</Button>
            <Button icon="→" disabled={!ageGroup} onClick={() => setStep(2)}>Next</Button>
          </div>
        </Card>
      )}

      {/* Step 2: support level */}
      {step === 2 && (
        <Card className="p-6 sm:p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-ink">How will you answer?</h1>
          <p className="mt-2 text-ink-soft">
            Choose the setup that fits. You can change nothing else — the
            questions stay the same, this just tailors the guidance.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {SUPPORT_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSupportLevel(lvl.id)}
                aria-pressed={supportLevel === lvl.id}
                className={[
                  "flex items-center gap-4 rounded-xl2 border-[3px] p-4 text-left transition nf-bordered",
                  supportLevel === lvl.id
                    ? "border-brand bg-brand-soft"
                    : "border-line bg-surface hover:border-brand",
                ].join(" ")}
              >
                <span aria-hidden="true" className="text-3xl">{lvl.icon}</span>
                <span>
                  <span className="block text-lg font-bold text-ink">{lvl.label}</span>
                  <span className="block text-sm text-ink-soft">{lvl.hint}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="quiet" onClick={() => setStep(1)}>← Back</Button>
            <Button icon="✨" size="lg" disabled={!supportLevel} onClick={begin}>
              Start
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
