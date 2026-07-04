import { useState } from "react";
import { Link } from "react-router-dom";
import type { AgeGroupId, CategoryId, Question, AnswerOption } from "@/types";
import { QUESTIONS } from "@/data/questionBank";
import { CATEGORIES, AGE_GROUPS } from "@/data/categories";
import { localStore } from "@/lib/storage";
import { newId } from "@/lib/id";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/**
 * Admin dashboard — question editor.
 *
 * A working mockup of the content-management surface: view the built-in bank,
 * add new questions (which persist to the custom-question store and immediately
 * appear in the questionnaire), and delete custom ones. Editing built-in
 * questions and full category management are stubbed with clear "next step"
 * affordances so the data model is obviously ready for a real backend.
 *
 * NOTE: in production this screen would sit behind authentication. For the MVP
 * it is open and stores everything locally.
 */

interface DraftOption {
  label: string;
  icon: string;
  category: CategoryId;
  points: number;
}

const BLANK_OPTION: DraftOption = { label: "", icon: "⭐", category: "music", points: 2 };

export function AdminPage() {
  const [custom, setCustom] = useState<Question[]>(() => localStore.getCustomQuestions());
  const [showForm, setShowForm] = useState(false);

  // New-question draft state.
  const [prompt, setPrompt] = useState("");
  const [ages, setAges] = useState<AgeGroupId[]>([]);
  const [options, setOptions] = useState<DraftOption[]>([
    { ...BLANK_OPTION },
    { ...BLANK_OPTION, icon: "🎨", category: "visual_art" },
  ]);

  function toggleAge(id: AgeGroupId) {
    setAges((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  function updateOption(i: number, patch: Partial<DraftOption>) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  }

  const canSave =
    prompt.trim().length > 0 &&
    ages.length > 0 &&
    options.filter((o) => o.label.trim()).length >= 2;

  function saveQuestion() {
    if (!canSave) return;
    const built: Question = {
      id: newId("q_custom"),
      ageGroups: ages,
      prompt: prompt.trim(),
      options: options
        .filter((o) => o.label.trim())
        .map<AnswerOption>((o, i) => ({
          id: String.fromCharCode(97 + i), // a, b, c, d
          label: o.label.trim(),
          icon: o.icon || "⭐",
          weights: { [o.category]: o.points } as AnswerOption["weights"],
        })),
    };
    const next = [...custom, built];
    localStore.saveCustomQuestions(next);
    setCustom(next);
    // Reset draft.
    setPrompt("");
    setAges([]);
    setOptions([{ ...BLANK_OPTION }, { ...BLANK_OPTION, icon: "🎨", category: "visual_art" }]);
    setShowForm(false);
  }

  function deleteCustom(id: string) {
    const next = custom.filter((q) => q.id !== id);
    localStore.saveCustomQuestions(next);
    setCustom(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Admin · Question editor</h1>
          <p className="text-ink-soft">
            {QUESTIONS.length} built-in questions · {custom.length} custom
          </p>
        </div>
        <Link to="/" className="font-semibold text-brand">← Home</Link>
      </div>

      {/* Add question */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Add a new question</h2>
          <Button variant={showForm ? "quiet" : "primary"} onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Close" : "＋ New question"}
          </Button>
        </div>

        {showForm && (
          <div className="mt-5 space-y-5 animate-fade-in">
            {/* Prompt */}
            <div>
              <label htmlFor="q-prompt" className="mb-1 block font-semibold text-ink">
                Question prompt
              </label>
              <input
                id="q-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. What would you rather do?"
                className="w-full rounded-xl2 border-2 border-line bg-surface px-4 py-3 text-ink outline-none focus:border-brand nf-bordered"
              />
            </div>

            {/* Age groups */}
            <div>
              <p className="mb-1 font-semibold text-ink">Show for age groups</p>
              <div className="flex flex-wrap gap-2">
                {AGE_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleAge(g.id)}
                    aria-pressed={ages.includes(g.id)}
                    className={[
                      "rounded-full border-2 px-3 py-1 text-sm font-semibold transition nf-bordered",
                      ages.includes(g.id)
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-surface text-ink hover:border-brand",
                    ].join(" ")}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="mb-2 font-semibold text-ink">Answer options (2–4)</p>
              <div className="space-y-3">
                {options.map((o, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[3rem_1fr] items-center gap-2 rounded-xl2 border-2 border-line p-3 nf-bordered sm:grid-cols-[3rem_1fr_10rem_5rem_2.5rem]"
                  >
                    <input
                      value={o.icon}
                      onChange={(e) => updateOption(i, { icon: e.target.value })}
                      aria-label={`Option ${i + 1} icon`}
                      className="w-full rounded-lg border-2 border-line bg-surface p-2 text-center text-2xl nf-bordered"
                    />
                    <input
                      value={o.label}
                      onChange={(e) => updateOption(i, { label: e.target.value })}
                      placeholder={`Option ${i + 1} label`}
                      aria-label={`Option ${i + 1} label`}
                      className="w-full rounded-lg border-2 border-line bg-surface p-2 text-ink outline-none focus:border-brand nf-bordered"
                    />
                    <select
                      value={o.category}
                      onChange={(e) => updateOption(i, { category: e.target.value as CategoryId })}
                      aria-label={`Option ${i + 1} strength category`}
                      className="w-full rounded-lg border-2 border-line bg-surface p-2 text-ink nf-bordered"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <select
                      value={o.points}
                      onChange={(e) => updateOption(i, { points: Number(e.target.value) })}
                      aria-label={`Option ${i + 1} points`}
                      className="w-full rounded-lg border-2 border-line bg-surface p-2 text-ink nf-bordered"
                    >
                      {[1, 2, 3].map((p) => (
                        <option key={p} value={p}>{p} pt</option>
                      ))}
                    </select>
                    {options.length > 2 ? (
                      <button
                        type="button"
                        onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label={`Remove option ${i + 1}`}
                        className="justify-self-center text-xl text-ink-soft hover:text-accent"
                      >
                        ✕
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                ))}
              </div>
              {options.length < 4 && (
                <button
                  type="button"
                  onClick={() => setOptions((prev) => [...prev, { ...BLANK_OPTION }])}
                  className="mt-3 font-semibold text-brand"
                >
                  ＋ Add option
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={saveQuestion} disabled={!canSave} icon="💾">Save question</Button>
              {!canSave && (
                <span className="text-sm text-ink-soft">
                  Add a prompt, pick at least one age group, and fill 2+ options.
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Custom questions list */}
      {custom.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-3 text-xl font-bold text-ink">Custom questions</h2>
          <ul className="space-y-3">
            {custom.map((q) => (
              <li
                key={q.id}
                className="flex items-start justify-between gap-3 rounded-xl2 border-2 border-line p-4 nf-bordered"
              >
                <div>
                  <p className="font-semibold text-ink">{q.prompt}</p>
                  <p className="text-sm text-ink-soft">
                    {q.ageGroups.join(", ")} · {q.options.length} options
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCustom(q.id)}
                  className="shrink-0 font-semibold text-accent hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Built-in bank (read-only preview) */}
      <Card className="p-6">
        <h2 className="mb-1 text-xl font-bold text-ink">Built-in question bank</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Read-only in the MVP. In the full product these become editable and sync
          to the database — the data shape is already identical.
        </p>
        <ul className="divide-y divide-line">
          {QUESTIONS.map((q) => (
            <li key={q.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-ink">{q.prompt}</p>
                <p className="text-sm text-ink-soft">
                  {q.ageGroups.join(", ")} · {q.options.length} options
                  {q.pictureMode ? " · picture mode" : ""}
                </p>
              </div>
              <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink-soft">
                built-in
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Category management placeholder — shows extensibility */}
      <Card className="p-6">
        <h2 className="mb-1 text-xl font-bold text-ink">Strength categories</h2>
        <p className="mb-4 text-sm text-ink-soft">
          The {CATEGORIES.length} categories below power scoring. Adding a new
          category later means one entry in <code>data/categories.ts</code> plus
          activities in <code>data/activities.ts</code> — no other code changes.
        </p>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded-full border-2 border-line bg-surface px-3 py-1 text-sm font-semibold text-ink nf-bordered"
            >
              <span aria-hidden="true">{c.icon}</span> {c.label}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
