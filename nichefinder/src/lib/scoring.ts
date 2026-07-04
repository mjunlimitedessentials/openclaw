import type {
  AssessmentSession,
  AssessmentResult,
  CategoryScore,
  CategoryId,
  SensoryChannel,
  SensoryNote,
  Profile,
  Question,
} from "@/types";
import { CATEGORIES, CATEGORY_MAP } from "@/data/categories";
import { PROFILES } from "@/data/profiles";
import { ACTIVITIES, LEARNING_STYLES } from "@/data/activities";
import { QUESTIONS } from "@/data/questionBank";

/**
 * Scoring engine
 * ==============
 *
 * Pure functions only: given a session (answers) and the question bank, produce
 * an `AssessmentResult`. No React, no storage, no DOM — which makes it trivial
 * to unit-test and to move server-side later.
 *
 * The philosophy is strengths-only. We never compute a "weakness" score. Low
 * categories are simply not surfaced as strengths; support recommendations are
 * derived from the *matched profile*, framed as growth, never as deficits.
 */

const SENSORY_LABELS: Record<SensoryChannel, string> = {
  sound: "Sound",
  touch: "Touch",
  light: "Light",
  movement: "Movement",
  texture: "Texture",
};

/** Index questions by id once for fast lookup. */
const QUESTION_MAP: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

/**
 * Tally raw category points and sensory hits from a session's answers.
 */
function tally(session: AssessmentSession): {
  points: Record<CategoryId, number>;
  sensory: Record<SensoryChannel, number>;
  answered: number;
} {
  const points = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, 0]),
  ) as Record<CategoryId, number>;

  const sensory: Record<SensoryChannel, number> = {
    sound: 0,
    touch: 0,
    light: 0,
    movement: 0,
    texture: 0,
  };

  let answered = 0;

  for (const [questionId, optionId] of Object.entries(session.answers)) {
    const question = QUESTION_MAP[questionId];
    if (!question) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;

    answered += 1;

    for (const [cat, pts] of Object.entries(option.weights)) {
      points[cat as CategoryId] += pts ?? 0;
    }
    if (option.sensory) {
      sensory[option.sensory] += 1;
    }
  }

  return { points, sensory, answered };
}

/** Convert raw points into sorted, percentage-normalised category scores. */
function toScores(points: Record<CategoryId, number>): CategoryScore[] {
  const max = Math.max(1, ...Object.values(points));
  return CATEGORIES.map((category) => ({
    category,
    points: points[category.id],
    percent: Math.round((points[category.id] / max) * 100),
  })).sort((a, b) => b.points - a.points);
}

/**
 * Match the person's top categories against the archetype profiles.
 * A profile scores by how much its categories overlap (weighted by the
 * person's points in those categories). Returns strongest matches first.
 */
function matchProfiles(points: Record<CategoryId, number>): Profile[] {
  const ranked = PROFILES.map((profile) => {
    const score = profile.categories.reduce(
      (sum, cat) => sum + (points[cat] ?? 0),
      0,
    );
    return { profile, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.map((r) => r.profile);
}

/** Pick the best-fitting learning style from the top strengths. */
function pickLearningStyle(topCategories: CategoryId[]): string {
  for (const category of topCategories) {
    const match = LEARNING_STYLES.find((ls) => ls.categories.includes(category));
    if (match) return match.style;
  }
  return "Blended — thrives with a mix of visual, hands-on and social learning.";
}

/** Build friendly sensory notes, strongest signal first. */
function buildSensoryNotes(sensory: Record<SensoryChannel, number>): SensoryNote[] {
  return (Object.keys(sensory) as SensoryChannel[])
    .map((channel) => ({
      channel,
      label: SENSORY_LABELS[channel],
      count: sensory[channel],
    }))
    .filter((n) => n.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Main entry point. Turn a session into a complete, presentation-ready result.
 */
export function scoreSession(session: AssessmentSession): AssessmentResult {
  const { points, sensory, answered } = tally(session);
  const scores = toScores(points);
  const topStrengths = scores.filter((s) => s.points > 0).slice(0, 3);
  const topCategoryIds = topStrengths.map((s) => s.category.id);

  const matchedProfiles = matchProfiles(points);
  const primary = matchedProfiles[0];

  // Suggested activities: pull from each of the top strengths, de-duplicated.
  const suggestedActivities = dedupe(
    topCategoryIds.flatMap((cat) => ACTIVITIES[cat].activities.slice(0, 2)),
  );

  // Pathways: gather across top strengths (breadth over depth), de-duplicated.
  const pathways = dedupe(
    topCategoryIds.flatMap((cat) => ACTIVITIES[cat].pathways),
  ).slice(0, 8);

  // Support recommendations come from the primary profile's growth framing.
  const supportRecommendations = primary
    ? [
        `Responds well to: ${primary.respondsWellTo}`,
        `Needs support with: ${primary.needsSupportWith}`,
        `Recommended next step: try one activity from the list above this week.`,
      ]
    : [
        "Recommended next step: explore a few activities and notice what sparks joy.",
      ];

  return {
    sessionId: session.id,
    personId: session.personId,
    scores,
    topStrengths,
    matchedProfiles: matchedProfiles.slice(0, 3),
    learningStyle: pickLearningStyle(topCategoryIds),
    sensoryNotes: buildSensoryNotes(sensory),
    suggestedActivities,
    bestEnvironment: primary?.bestEnvironment ??
      "A calm, flexible space that offers a few different ways to engage.",
    supportRecommendations,
    pathways,
    answeredCount: answered,
    totalQuestions: session.questionOrder.length,
  };
}

/** Small helper: preserve order, drop duplicates. */
function dedupe<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Re-export for views that need category metadata alongside scores. */
export { CATEGORY_MAP };
