import { useEffect } from "react";
import type { Question } from "@/types";
import { AnswerCard } from "@/components/AnswerCard";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { useSettings } from "@/context/SettingsContext";
import { speak, stopSpeaking } from "@/lib/audio";

/**
 * Renders one question: the prompt (with read-aloud) and its 2–4 large answer
 * cards. Choosing a card only *selects* it — advancing is a separate, deliberate
 * "Next" tap on the page, so nothing ever happens by accident.
 */
export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: {
  question: Question;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
}) {
  const { settings } = useSettings();
  const pictureMode = settings.pictureMode || question.pictureMode;

  // Auto read-aloud the prompt when the question appears (if enabled).
  useEffect(() => {
    if (settings.audioAutoRead) {
      speak(`${question.prompt}. ${question.options.map((o) => o.label).join(", ")}`);
    }
    return () => stopSpeaking();
  }, [question.id, settings.audioAutoRead]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2 options -> 2 cols; 3–4 options -> 2 cols on mobile, up to 2 rows.
  const cols = question.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2";

  return (
    <section aria-labelledby="nf-question-prompt" className="animate-fade-in">
      <div className="mb-6 flex items-start gap-3">
        <h2
          id="nf-question-prompt"
          className="flex-1 text-2xl font-bold leading-snug text-ink sm:text-3xl"
        >
          {question.prompt}
        </h2>
        <SpeakButton
          text={`${question.prompt}. ${question.helper ?? ""}`}
          label="Read the question aloud"
          className="mt-1"
        />
      </div>

      {question.helper && (
        <p className="mb-5 text-lg text-ink-soft">{question.helper}</p>
      )}

      <div className={`grid grid-cols-1 gap-4 ${cols}`}>
        {question.options.map((option) => (
          <AnswerCard
            key={option.id}
            option={option}
            selected={selectedOptionId === option.id}
            onSelect={() => onSelect(option.id)}
            pictureMode={pictureMode}
          />
        ))}
      </div>
    </section>
  );
}
