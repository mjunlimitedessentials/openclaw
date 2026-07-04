/**
 * Accessible progress bar for the questionnaire.
 * Announced to assistive tech via role="progressbar" + aria values, and shows a
 * gentle "Question X of Y" label. No countdown, no timer — never any pressure.
 */
export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const safeTotal = Math.max(1, total);
  const pct = Math.round((current / safeTotal) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm font-semibold text-ink-soft">
        <span>
          Question {Math.min(current, safeTotal)} of {safeTotal}
        </span>
        <span aria-hidden="true">{pct}%</span>
      </div>
      <div
        className="h-4 w-full rounded-full bg-surface-2 border-2 border-line overflow-hidden nf-bordered"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: question ${Math.min(current, safeTotal)} of ${safeTotal}`}
      >
        <div
          className="h-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
