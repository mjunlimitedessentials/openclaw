/**
 * NicheFinder — core domain types
 * ===============================
 *
 * These types are the contract between the question bank, the scoring engine,
 * the results/report views and the (future) database. Keeping them in one place
 * means a real backend can implement the same shapes later without touching UI
 * code.
 */

/* ------------------------------------------------------------------ */
/* Strength categories                                                 */
/* ------------------------------------------------------------------ */

/**
 * The 13 strength areas we score for. Sensory *preferences* are tracked
 * separately (see `SensoryChannel`) because they describe *how* a person likes
 * to engage rather than *what* they are drawn to.
 */
export type CategoryId =
  | "music"
  | "visual_art"
  | "movement"
  | "building"
  | "technology"
  | "nature"
  | "helping"
  | "storytelling"
  | "organizing"
  | "problem_solving"
  | "leadership"
  | "quiet_focus"
  | "social";

/** Sensory channels we note preferences for (never scored as good/bad). */
export type SensoryChannel = "sound" | "touch" | "light" | "movement" | "texture";

export interface Category {
  id: CategoryId;
  /** Short, warm label shown to caregivers/teachers. */
  label: string;
  /** One-line plain-language description. */
  blurb: string;
  /** Emoji used as the friendly visual icon across the UI. */
  icon: string;
  /** Tailwind-friendly accent (hex) used for chips, bars and report cards. */
  color: string;
}

/* ------------------------------------------------------------------ */
/* Personality / strengths profiles                                    */
/* ------------------------------------------------------------------ */

/** Original strengths archetypes (inspired by, never copied from, any test). */
export type ProfileId =
  | "creator"
  | "builder"
  | "helper"
  | "sound_explorer"
  | "visual_thinker"
  | "organizer"
  | "tech_explorer"
  | "leader"
  | "quiet_strategist"
  | "movement_learner"
  | "nature_connector"
  | "storyteller";

export interface Profile {
  id: ProfileId;
  /** e.g. "The Sound Explorer" */
  title: string;
  icon: string;
  /** Warm one-liner. */
  tagline: string;
  /** 2-3 sentence, strengths-based description. */
  description: string;
  /** Categories that, when strong, point toward this profile. */
  categories: CategoryId[];
  /** Growth-based framing fields (never negative). */
  bestEnvironment: string;
  respondsWellTo: string;
  needsSupportWith: string;
}

/* ------------------------------------------------------------------ */
/* Age groups & support levels                                         */
/* ------------------------------------------------------------------ */

export type AgeGroupId = "5-7" | "8-12" | "13-17" | "18-30" | "31-55" | "56-80";

export interface AgeGroup {
  id: AgeGroupId;
  label: string;
  /** Descriptive helper text for the chooser. */
  hint: string;
  icon: string;
}

/** Who is operating the device / helping the main user answer. */
export type SupportLevel = "independent" | "assisted" | "teacher";

/* ------------------------------------------------------------------ */
/* Questions & answers                                                 */
/* ------------------------------------------------------------------ */

/**
 * A weight maps an answer to one or more strength categories.
 * Points are small integers (1-3). Multiple categories per answer are allowed
 * so questions can be nuanced rather than 1:1.
 */
export type CategoryWeights = Partial<Record<CategoryId, number>>;

export interface AnswerOption {
  id: string;
  /** Simple label, e.g. "Listen to music". */
  label: string;
  /** Emoji / visual icon shown large on the touch card. */
  icon: string;
  /** Optional longer text read aloud (falls back to `label`). */
  readAloud?: string;
  /** Points this answer contributes. */
  weights: CategoryWeights;
  /** Optional sensory signal this answer hints at. */
  sensory?: SensoryChannel;
}

export interface Question {
  id: string;
  /** Which age paths this question belongs to. */
  ageGroups: AgeGroupId[];
  /** Simple prompt, e.g. "What would you rather do?". */
  prompt: string;
  /** Optional supporting sentence for caregivers. */
  helper?: string;
  /** 2-4 large touch cards. */
  options: AnswerOption[];
  /** Whether this is a picture-forward question (bigger icons, less text). */
  pictureMode?: boolean;
}

/* ------------------------------------------------------------------ */
/* Profiles (the person taking the assessment) & sessions              */
/* ------------------------------------------------------------------ */

/** A person we are discovering strengths for. No sensitive data required. */
export interface PersonProfile {
  id: string;
  /** First name or nickname only — enough to personalise, nothing clinical. */
  displayName: string;
  ageGroup: AgeGroupId;
  supportLevel: SupportLevel;
  /** Free-text caregiver/teacher notes (optional). */
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

/** A single in-progress or completed run through the questionnaire. */
export interface AssessmentSession {
  id: string;
  personId: string;
  ageGroup: AgeGroupId;
  /** Ordered question ids for this run. */
  questionOrder: string[];
  /** Map of questionId -> chosen optionId. */
  answers: Record<string, string>;
  /** Index of the current question (for save & resume). */
  currentIndex: number;
  status: "in_progress" | "completed";
  createdAt: number;
  updatedAt: number;
}

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

export interface CategoryScore {
  category: Category;
  points: number;
  /** 0-100 relative strength, for bars. */
  percent: number;
}

export interface SensoryNote {
  channel: SensoryChannel;
  label: string;
  count: number;
}

/**
 * Everything the results dashboard & report need. Produced purely from a
 * session + the question bank by the scoring engine — no UI logic inside.
 */
export interface AssessmentResult {
  sessionId: string;
  personId: string;
  /** Sorted high -> low. */
  scores: CategoryScore[];
  /** Convenience slice: the top three strengths. */
  topStrengths: CategoryScore[];
  /** Best-matching archetype(s), strongest first. */
  matchedProfiles: Profile[];
  learningStyle: string;
  sensoryNotes: SensoryNote[];
  suggestedActivities: string[];
  bestEnvironment: string;
  supportRecommendations: string[];
  /** Possible niche / career / hobby pathways. */
  pathways: string[];
  answeredCount: number;
  totalQuestions: number;
}
