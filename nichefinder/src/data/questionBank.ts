import type { Question, AgeGroupId } from "@/types";

/**
 * Sample question bank (local JSON-style source of truth).
 * ========================================================
 *
 * In the MVP this lives in code as typed data. The shape matches the future
 * database exactly (see `types/index.ts` → `Question`), so a real backend can
 * serve the identical structure later and the Admin editor can add/edit these
 * without any code change.
 *
 * Design rules for every question:
 *  - Simple wording, one idea per question.
 *  - 2–4 large touch options, each with a friendly icon.
 *  - Positive framing — there are no wrong answers.
 *  - Each option adds small points (1–3) to one or more strength categories.
 *  - Some options also hint at a sensory preference (never scored good/bad).
 *
 * Questions are tagged with the age groups they suit. Younger paths use
 * `pictureMode` for bigger icons and less text.
 */

export const QUESTIONS: Question[] = [
  /* ---------------------------------------------------------------- */
  /* Ages 5–7 — picture-forward, very simple                          */
  /* ---------------------------------------------------------------- */
  {
    id: "q_57_1",
    ageGroups: ["5-7"],
    pictureMode: true,
    prompt: "What would you rather do?",
    helper: "Tap the picture you like more.",
    options: [
      { id: "a", label: "Listen to music", icon: "🎵", weights: { music: 3 }, sensory: "sound" },
      { id: "b", label: "Draw with colors", icon: "🖍️", weights: { visual_art: 3 } },
      { id: "c", label: "Build with blocks", icon: "🧱", weights: { building: 3 }, sensory: "texture" },
      { id: "d", label: "Help someone", icon: "🤝", weights: { helping: 3 } },
    ],
  },
  {
    id: "q_57_2",
    ageGroups: ["5-7"],
    pictureMode: true,
    prompt: "Which makes you happy?",
    options: [
      { id: "a", label: "Running and jumping", icon: "🏃", weights: { movement: 3 }, sensory: "movement" },
      { id: "b", label: "Animals and plants", icon: "🐶", weights: { nature: 3 } },
      { id: "c", label: "Puzzles", icon: "🧩", weights: { problem_solving: 3 } },
      { id: "d", label: "Singing", icon: "🎤", weights: { music: 2, storytelling: 1 }, sensory: "sound" },
    ],
  },
  {
    id: "q_57_3",
    ageGroups: ["5-7"],
    pictureMode: true,
    prompt: "What do you like to play?",
    options: [
      { id: "a", label: "Pretend and dress-up", icon: "🎭", weights: { storytelling: 3 } },
      { id: "b", label: "Sort toys by color", icon: "🌈", weights: { organizing: 3 } },
      { id: "c", label: "Tablet games", icon: "📱", weights: { technology: 3 }, sensory: "light" },
    ],
  },
  {
    id: "q_57_4",
    ageGroups: ["5-7"],
    pictureMode: true,
    prompt: "Where do you feel best?",
    options: [
      { id: "a", label: "A quiet cozy corner", icon: "🧸", weights: { quiet_focus: 3 } },
      { id: "b", label: "Playing with friends", icon: "👫", weights: { social: 3 } },
      { id: "c", label: "Outside in the park", icon: "🌳", weights: { nature: 2, movement: 1 } },
    ],
  },
  {
    id: "q_57_5",
    ageGroups: ["5-7"],
    pictureMode: true,
    prompt: "What feels nice to you?",
    helper: "This helps us learn what your senses like.",
    options: [
      { id: "a", label: "Soft, squishy things", icon: "🧶", weights: { building: 1 }, sensory: "touch" },
      { id: "b", label: "Music and sounds", icon: "🔔", weights: { music: 1 }, sensory: "sound" },
      { id: "c", label: "Bright colors and lights", icon: "✨", weights: { visual_art: 1 }, sensory: "light" },
      { id: "d", label: "Swinging and spinning", icon: "🎠", weights: { movement: 1 }, sensory: "movement" },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Ages 8–12 — curious explorers                                    */
  /* ---------------------------------------------------------------- */
  {
    id: "q_812_1",
    ageGroups: ["8-12"],
    prompt: "What would you rather try?",
    options: [
      { id: "a", label: "Make a video or tell a story", icon: "🎬", weights: { storytelling: 3 } },
      { id: "b", label: "Code a simple game", icon: "🎮", weights: { technology: 3, problem_solving: 1 } },
      { id: "c", label: "Play a team sport", icon: "⚽", weights: { movement: 2, social: 1 } },
      { id: "d", label: "Care for an animal", icon: "🐾", weights: { nature: 2, helping: 1 } },
    ],
  },
  {
    id: "q_812_2",
    ageGroups: ["8-12"],
    prompt: "What makes you feel excited?",
    options: [
      { id: "a", label: "Building or making something", icon: "🛠️", weights: { building: 3 } },
      { id: "b", label: "Music and rhythm", icon: "🥁", weights: { music: 3 }, sensory: "sound" },
      { id: "c", label: "Solving a tricky puzzle", icon: "🧩", weights: { problem_solving: 3 } },
      { id: "d", label: "Drawing or designing", icon: "🎨", weights: { visual_art: 3 } },
    ],
  },
  {
    id: "q_812_3",
    ageGroups: ["8-12"],
    prompt: "What do you notice first in a new place?",
    options: [
      { id: "a", label: "The colors and how it looks", icon: "👁️", weights: { visual_art: 2 }, sensory: "light" },
      { id: "b", label: "The sounds", icon: "🔊", weights: { music: 2 }, sensory: "sound" },
      { id: "c", label: "How it's organized", icon: "🗂️", weights: { organizing: 2 } },
      { id: "d", label: "The people there", icon: "👥", weights: { social: 2 } },
    ],
  },
  {
    id: "q_812_4",
    ageGroups: ["8-12"],
    prompt: "In a group project, what do you like to do?",
    options: [
      { id: "a", label: "Lead and plan it", icon: "⭐", weights: { leadership: 3 } },
      { id: "b", label: "Help everyone get along", icon: "🤝", weights: { helping: 2, social: 1 } },
      { id: "c", label: "Work on my own part quietly", icon: "🧘", weights: { quiet_focus: 3 } },
      { id: "d", label: "Make it look great", icon: "🎨", weights: { visual_art: 2 } },
    ],
  },
  {
    id: "q_812_5",
    ageGroups: ["8-12"],
    prompt: "What feels easier for you?",
    options: [
      { id: "a", label: "Remembering songs and sounds", icon: "🎵", weights: { music: 2 }, sensory: "sound" },
      { id: "b", label: "Fixing or figuring things out", icon: "🔧", weights: { problem_solving: 2, building: 1 } },
      { id: "c", label: "Talking and explaining", icon: "💬", weights: { storytelling: 2, social: 1 } },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Ages 13–17 — teens finding direction                             */
  /* ---------------------------------------------------------------- */
  {
    id: "q_1317_1",
    ageGroups: ["13-17"],
    prompt: "Which of these would you pick for a free afternoon?",
    options: [
      { id: "a", label: "Make music or a beat", icon: "🎧", weights: { music: 3 }, sensory: "sound" },
      { id: "b", label: "Design or edit something", icon: "🖌️", weights: { visual_art: 3 } },
      { id: "c", label: "Build or fix something real", icon: "🔩", weights: { building: 3 } },
      { id: "d", label: "Code or explore tech", icon: "💻", weights: { technology: 3 } },
    ],
  },
  {
    id: "q_1317_2",
    ageGroups: ["13-17"],
    prompt: "What kind of task pulls you in most?",
    options: [
      { id: "a", label: "A hard puzzle or strategy", icon: "🧩", weights: { problem_solving: 3 } },
      { id: "b", label: "Helping someone who's stuck", icon: "🤝", weights: { helping: 3 } },
      { id: "c", label: "Organizing a plan or event", icon: "🗓️", weights: { organizing: 2, leadership: 1 } },
      { id: "d", label: "Performing or presenting", icon: "🎤", weights: { storytelling: 3 } },
    ],
  },
  {
    id: "q_1317_3",
    ageGroups: ["13-17"],
    prompt: "Where do you do your best thinking?",
    options: [
      { id: "a", label: "Somewhere quiet and calm", icon: "🧘", weights: { quiet_focus: 3 } },
      { id: "b", label: "Outside in nature", icon: "🌲", weights: { nature: 3 } },
      { id: "c", label: "Around other people", icon: "👥", weights: { social: 3 } },
      { id: "d", label: "While moving or active", icon: "🏃", weights: { movement: 3 }, sensory: "movement" },
    ],
  },
  {
    id: "q_1317_4",
    ageGroups: ["13-17"],
    prompt: "When something goes wrong, what's your instinct?",
    options: [
      { id: "a", label: "Figure out how to fix it", icon: "🔧", weights: { problem_solving: 2, building: 1 } },
      { id: "b", label: "Rally people to help", icon: "⭐", weights: { leadership: 2, social: 1 } },
      { id: "c", label: "Comfort whoever's upset", icon: "💛", weights: { helping: 3 } },
    ],
  },
  {
    id: "q_1317_5",
    ageGroups: ["13-17"],
    prompt: "What kind of environment helps you focus?",
    helper: "This tells us about sensory preferences.",
    options: [
      { id: "a", label: "Music or background sound", icon: "🎵", weights: { music: 1 }, sensory: "sound" },
      { id: "b", label: "Low light and calm", icon: "🌙", weights: { quiet_focus: 1 }, sensory: "light" },
      { id: "c", label: "Something to fidget with", icon: "🪀", weights: { movement: 1 }, sensory: "touch" },
      { id: "d", label: "Being able to move around", icon: "🚶", weights: { movement: 1 }, sensory: "movement" },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Ages 18–30 — shaping a path                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "q_1830_1",
    ageGroups: ["18-30"],
    prompt: "Which kind of work energizes you most?",
    options: [
      { id: "a", label: "Creative and expressive", icon: "🎨", weights: { visual_art: 2, storytelling: 1 } },
      { id: "b", label: "Technical and hands-on", icon: "🛠️", weights: { building: 2, technology: 1 } },
      { id: "c", label: "People and caregiving", icon: "🤝", weights: { helping: 2, social: 1 } },
      { id: "d", label: "Analytical and problem-solving", icon: "🧠", weights: { problem_solving: 2 } },
    ],
  },
  {
    id: "q_1830_2",
    ageGroups: ["18-30"],
    prompt: "In a team, where do you naturally land?",
    options: [
      { id: "a", label: "Setting direction and leading", icon: "⭐", weights: { leadership: 3 } },
      { id: "b", label: "Keeping things organized", icon: "🗂️", weights: { organizing: 3 } },
      { id: "c", label: "The focused expert who goes deep", icon: "🔬", weights: { quiet_focus: 2, problem_solving: 1 } },
      { id: "d", label: "The connector who brings people together", icon: "🌐", weights: { social: 2, helping: 1 } },
    ],
  },
  {
    id: "q_1830_3",
    ageGroups: ["18-30"],
    prompt: "What would you rather spend a weekend on?",
    options: [
      { id: "a", label: "A music or audio project", icon: "🎚️", weights: { music: 3 }, sensory: "sound" },
      { id: "b", label: "Outdoors or with animals", icon: "🏕️", weights: { nature: 3 } },
      { id: "c", label: "Learning a new technology", icon: "💻", weights: { technology: 3 } },
      { id: "d", label: "A sport or active challenge", icon: "🚴", weights: { movement: 3 }, sensory: "movement" },
    ],
  },
  {
    id: "q_1830_4",
    ageGroups: ["18-30"],
    prompt: "What feels most rewarding?",
    options: [
      { id: "a", label: "Making something people use", icon: "🔨", weights: { building: 2, technology: 1 } },
      { id: "b", label: "Helping someone grow", icon: "🌱", weights: { helping: 3 } },
      { id: "c", label: "Telling a story that lands", icon: "🎤", weights: { storytelling: 3 } },
      { id: "d", label: "Solving something no one else could", icon: "🧩", weights: { problem_solving: 3 } },
    ],
  },
  {
    id: "q_1830_5",
    ageGroups: ["18-30"],
    prompt: "What working environment suits you best?",
    options: [
      { id: "a", label: "Quiet, focused and independent", icon: "🧘", weights: { quiet_focus: 3 } },
      { id: "b", label: "Busy, social and collaborative", icon: "👥", weights: { social: 3 } },
      { id: "c", label: "Structured with clear routines", icon: "📋", weights: { organizing: 3 } },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Ages 31–55 — building on strengths                               */
  /* ---------------------------------------------------------------- */
  {
    id: "q_3155_1",
    ageGroups: ["31-55"],
    prompt: "Looking back, what have you enjoyed most?",
    options: [
      { id: "a", label: "Creating and designing things", icon: "🎨", weights: { visual_art: 2, storytelling: 1 } },
      { id: "b", label: "Leading and building teams", icon: "⭐", weights: { leadership: 3 } },
      { id: "c", label: "Caring for and supporting people", icon: "🤝", weights: { helping: 3 } },
      { id: "d", label: "Solving complex problems", icon: "🧠", weights: { problem_solving: 3 } },
    ],
  },
  {
    id: "q_3155_2",
    ageGroups: ["31-55"],
    prompt: "What kind of task makes time fly?",
    options: [
      { id: "a", label: "Making or fixing something", icon: "🛠️", weights: { building: 3 } },
      { id: "b", label: "Organizing and planning", icon: "🗂️", weights: { organizing: 3 } },
      { id: "c", label: "Music, sound or performance", icon: "🎵", weights: { music: 2, storytelling: 1 }, sensory: "sound" },
      { id: "d", label: "Being outdoors or with nature", icon: "🌿", weights: { nature: 3 } },
    ],
  },
  {
    id: "q_3155_3",
    ageGroups: ["31-55"],
    prompt: "How do you recharge best?",
    options: [
      { id: "a", label: "Quiet time alone", icon: "🧘", weights: { quiet_focus: 3 } },
      { id: "b", label: "Time with people I care about", icon: "👨‍👩‍👧", weights: { social: 2, helping: 1 } },
      { id: "c", label: "Moving, exercise or sport", icon: "🏃", weights: { movement: 3 }, sensory: "movement" },
    ],
  },
  {
    id: "q_3155_4",
    ageGroups: ["31-55"],
    prompt: "What would you love to learn or try next?",
    options: [
      { id: "a", label: "A new technology or tool", icon: "💻", weights: { technology: 3 } },
      { id: "b", label: "A creative craft or art", icon: "🧵", weights: { visual_art: 2, building: 1 } },
      { id: "c", label: "Coaching, teaching or mentoring", icon: "🧑‍🏫", weights: { helping: 2, leadership: 1 } },
      { id: "d", label: "Writing, speaking or storytelling", icon: "✍️", weights: { storytelling: 3 } },
    ],
  },
  {
    id: "q_3155_5",
    ageGroups: ["31-55"],
    prompt: "What kind of role fits you best right now?",
    options: [
      { id: "a", label: "Guiding and directing others", icon: "⭐", weights: { leadership: 3 } },
      { id: "b", label: "The dependable, organized backbone", icon: "📋", weights: { organizing: 3 } },
      { id: "c", label: "The focused specialist", icon: "🔬", weights: { quiet_focus: 2, problem_solving: 1 } },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Ages 56–80 — celebrating a lifetime of strengths                 */
  /* ---------------------------------------------------------------- */
  {
    id: "q_5680_1",
    ageGroups: ["56-80"],
    prompt: "What brings you the most joy these days?",
    options: [
      { id: "a", label: "Time in nature or gardening", icon: "🌻", weights: { nature: 3 } },
      { id: "b", label: "Being with family and friends", icon: "👵", weights: { social: 2, helping: 1 } },
      { id: "c", label: "Music, singing or listening", icon: "🎶", weights: { music: 3 }, sensory: "sound" },
      { id: "d", label: "A good puzzle or game", icon: "🧩", weights: { problem_solving: 3 } },
    ],
  },
  {
    id: "q_5680_2",
    ageGroups: ["56-80"],
    prompt: "What have people always come to you for?",
    options: [
      { id: "a", label: "Advice and a caring ear", icon: "💛", weights: { helping: 3 } },
      { id: "b", label: "Getting things organized", icon: "🗂️", weights: { organizing: 3 } },
      { id: "c", label: "Fixing or making things", icon: "🔧", weights: { building: 3 } },
      { id: "d", label: "A good story or wisdom", icon: "📖", weights: { storytelling: 3 } },
    ],
  },
  {
    id: "q_5680_3",
    ageGroups: ["56-80"],
    prompt: "What would you enjoy doing more of?",
    options: [
      { id: "a", label: "Creating art or crafts", icon: "🎨", weights: { visual_art: 3 } },
      { id: "b", label: "Gentle movement or walking", icon: "🚶", weights: { movement: 2 }, sensory: "movement" },
      { id: "c", label: "Helping in the community or ministry", icon: "🤝", weights: { helping: 2, social: 1 } },
      { id: "d", label: "Learning something new", icon: "💡", weights: { problem_solving: 1, technology: 1 } },
    ],
  },
  {
    id: "q_5680_4",
    ageGroups: ["56-80"],
    prompt: "Where do you feel most at peace?",
    options: [
      { id: "a", label: "A calm, quiet place", icon: "🧘", weights: { quiet_focus: 3 } },
      { id: "b", label: "Outdoors with fresh air", icon: "🌳", weights: { nature: 3 } },
      { id: "c", label: "Surrounded by loved ones", icon: "👨‍👩‍👧‍👦", weights: { social: 3 } },
    ],
  },
  {
    id: "q_5680_5",
    ageGroups: ["56-80"],
    prompt: "What kind of activity feels good to your senses?",
    helper: "This helps us note sensory preferences.",
    options: [
      { id: "a", label: "Soft textures and handwork", icon: "🧶", weights: { building: 1 }, sensory: "texture" },
      { id: "b", label: "Music and familiar sounds", icon: "🎵", weights: { music: 1 }, sensory: "sound" },
      { id: "c", label: "Warm light and calm colors", icon: "🕯️", weights: { visual_art: 1 }, sensory: "light" },
    ],
  },
];

/** Return all questions that belong to a given age group. */
export function questionsForAge(ageGroup: AgeGroupId): Question[] {
  return QUESTIONS.filter((q) => q.ageGroups.includes(ageGroup));
}
