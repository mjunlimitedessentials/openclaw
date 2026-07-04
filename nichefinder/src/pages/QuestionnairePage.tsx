import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { AssessmentSession, Question } from "@/types";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { localStore, effectiveQuestions } from "@/lib/storage";
import { now } from "@/lib/id";
import { stopSpeaking } from "@/lib/audio";

/**
 * The questionnaire runner.
 *
 * Save & resume is automatic: every answer and every navigation writes the
 * session back to the store, so closing the tab and returning later (via the
 * landing page) resumes at the exact question. There is no timer and no way to
 * "fail" — the only actions are choose, Next, Back and Pause.
 */
export function QuestionnairePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Load the session once; keep a local mutable copy we persist on every change.
  const [session, setSession] = useState<AssessmentSession | undefined>(() =>
    sessionId ? localStore.getSession(sessionId) : undefined,
  );

  // Resolve the ordered questions for this session from the effective bank.
  const questions = useMemo<Question[]>(() => {
    if (!session) return [];
    const map = new Map(effectiveQuestions().map((q) => [q.id, q]));
    return session.questionOrder
      .map((id) => map.get(id))
      .filter((q): q is Question => Boolean(q));
  }, [session]);

  if (!session) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg text-ink">We couldn't find that session.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-brand">← Back home</Link>
      </Card>
    );
  }

  const index = Math.min(session.currentIndex, Math.max(0, questions.length - 1));
  const question = questions[index];
  const selected = question ? session.answers[question.id] : undefined;
  const isLast = index >= questions.length - 1;

  /** Persist a patch to the session in both state and storage. */
  function persist(patch: Partial<AssessmentSession>) {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch, updatedAt: now() };
      localStore.saveSession(next);
      return next;
    });
  }

  function choose(optionId: string) {
    if (!question) return;
    persist({ answers: { ...session!.answers, [question.id]: optionId } });
  }

  function goNext() {
    stopSpeaking();
    if (isLast) {
      persist({ status: "completed", currentIndex: index });
      navigate(`/results/${session!.id}`);
      return;
    }
    persist({ currentIndex: index + 1 });
  }

  function goBack() {
    stopSpeaking();
    if (index === 0) return;
    persist({ currentIndex: index - 1 });
  }

  function pause() {
    stopSpeaking();
    // Progress is already saved on every change; just leave calmly.
    navigate("/");
  }

  return (
    <div className="space-y-6">
      {/* Top bar: progress + pause/resume */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar current={index + 1} total={questions.length} />
        </div>
        <Button variant="quiet" size="md" icon="⏸️" onClick={pause}>
          <span className="hidden sm:inline">Pause &amp; save</span>
          <span className="sm:hidden">Save</span>
        </Button>
      </div>

      {question ? (
        <Card className="p-5 sm:p-8">
          <QuestionCard
            question={question}
            selectedOptionId={selected}
            onSelect={choose}
          />
        </Card>
      ) : (
        <Card className="p-8 text-center text-ink">No questions for this age group yet.</Card>
      )}

      {/* Navigation. "Next" is always deliberate and never auto-advances. */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" size="lg" onClick={goBack} disabled={index === 0}>
          ← Back
        </Button>

        <p className="text-center text-sm text-ink-soft" aria-live="polite">
          {selected ? "Nice choice! Tap Next when ready." : "Tap a card to choose."}
        </p>

        <Button
          size="lg"
          icon={isLast ? "🌟" : "→"}
          onClick={goNext}
          disabled={!selected}
        >
          {isLast ? "See results" : "Next"}
        </Button>
      </div>
    </div>
  );
}
