import type { Category, CategoryId, AgeGroup, SupportLevel } from "@/types";

/**
 * The 13 strength categories.
 * Colours are warm and distinct so report cards and bars are easy to tell
 * apart at a glance (they are overridden in High Contrast mode).
 */
export const CATEGORIES: Category[] = [
  {
    id: "music",
    label: "Music, Sound & Rhythm",
    blurb: "Drawn to sound, beat, melody and frequency.",
    icon: "🎵",
    color: "#7c3aed",
  },
  {
    id: "visual_art",
    label: "Visual Art, Design & Color",
    blurb: "Notices color, shape and how things look.",
    icon: "🎨",
    color: "#db2777",
  },
  {
    id: "movement",
    label: "Movement, Sports & Dance",
    blurb: "Learns and thrives through the body and motion.",
    icon: "🤸",
    color: "#ea580c",
  },
  {
    id: "building",
    label: "Building & Hands-On Making",
    blurb: "Loves to make, fix and put things together.",
    icon: "🔨",
    color: "#b45309",
  },
  {
    id: "technology",
    label: "Technology, Computers & AI",
    blurb: "Curious about screens, machines and how tech works.",
    icon: "💻",
    color: "#2563eb",
  },
  {
    id: "nature",
    label: "Nature, Animals & Outdoors",
    blurb: "Calm and engaged with living things and the outdoors.",
    icon: "🌿",
    color: "#16a34a",
  },
  {
    id: "helping",
    label: "Helping, Caregiving & Ministry",
    blurb: "Motivated by supporting and caring for others.",
    icon: "🤝",
    color: "#0d9488",
  },
  {
    id: "storytelling",
    label: "Storytelling, Speaking & Performance",
    blurb: "Expresses ideas through words, stories and performing.",
    icon: "🎭",
    color: "#c026d3",
  },
  {
    id: "organizing",
    label: "Organizing, Systems & Structure",
    blurb: "Enjoys order, sorting, planning and routine.",
    icon: "🗂️",
    color: "#0891b2",
  },
  {
    id: "problem_solving",
    label: "Problem-Solving & Puzzles",
    blurb: "Lights up when figuring things out.",
    icon: "🧩",
    color: "#4f46e5",
  },
  {
    id: "leadership",
    label: "Leadership & Guiding Others",
    blurb: "Naturally organizes people and takes initiative.",
    icon: "⭐",
    color: "#d97706",
  },
  {
    id: "quiet_focus",
    label: "Quiet Focus & Independent Work",
    blurb: "Does best with calm, space and focused solo time.",
    icon: "🧘",
    color: "#0f766e",
  },
  {
    id: "social",
    label: "Social Connection & Group Work",
    blurb: "Energized by people, teams and togetherness.",
    icon: "👫",
    color: "#e11d48",
  },
];

/** Fast lookup by id — used everywhere the UI needs a category's metadata. */
export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

/* ------------------------------------------------------------------ */
/* Age groups                                                          */
/* ------------------------------------------------------------------ */

export const AGE_GROUPS: AgeGroup[] = [
  { id: "5-7", label: "Ages 5–7", hint: "Early years — pictures and simple choices.", icon: "🧸" },
  { id: "8-12", label: "Ages 8–12", hint: "Curious explorers finding what they love.", icon: "🚀" },
  { id: "13-17", label: "Ages 13–17", hint: "Teens discovering their direction.", icon: "🎧" },
  { id: "18-30", label: "Ages 18–30", hint: "Young adults shaping a path.", icon: "🌅" },
  { id: "31-55", label: "Ages 31–55", hint: "Adults building on their strengths.", icon: "🌟" },
  { id: "56-80", label: "Ages 56–80", hint: "A lifetime of strengths to celebrate.", icon: "🌻" },
];

/* ------------------------------------------------------------------ */
/* Support levels                                                      */
/* ------------------------------------------------------------------ */

export const SUPPORT_LEVELS: {
  id: SupportLevel;
  label: string;
  hint: string;
  icon: string;
}[] = [
  {
    id: "independent",
    label: "On my own",
    hint: "The person answers the questions themselves.",
    icon: "🙋",
  },
  {
    id: "assisted",
    label: "With a caregiver",
    hint: "A parent or caregiver helps read and choose together.",
    icon: "👨‍👧",
  },
  {
    id: "teacher",
    label: "Teacher / coach mode",
    hint: "A teacher, coach or support worker guides the session.",
    icon: "🧑‍🏫",
  },
];
