import type { Profile, ProfileId } from "@/types";

/**
 * Original strengths archetypes.
 *
 * These are inspired by the *idea* of workplace strengths/personality models
 * but are written from scratch and framed entirely around growth. There is no
 * "low potential" archetype — every profile describes where a person shines and
 * what helps them shine more.
 *
 * The scoring engine matches a person's top categories against each profile's
 * `categories` list; the best overlap wins.
 */
export const PROFILES: Profile[] = [
  {
    id: "creator",
    title: "The Creator",
    icon: "🎨",
    tagline: "Turns ideas into color, shape and beauty.",
    description:
      "You see the world in color and possibility. Making things — drawing, designing, imagining — is where you feel most alive and most yourself.",
    categories: ["visual_art", "storytelling"],
    bestEnvironment: "Open, materials-rich spaces with freedom to make and few rigid rules.",
    respondsWellTo: "Visual examples, choice of materials, and time to explore without a 'right answer'.",
    needsSupportWith: "Structure and step-by-step routines, offered gently and with visuals.",
  },
  {
    id: "builder",
    title: "The Builder",
    icon: "🔨",
    tagline: "Learns by making, fixing and putting things together.",
    description:
      "Your hands think. You understand things best when you can build, take apart and try them for real.",
    categories: ["building", "problem_solving"],
    bestEnvironment: "Hands-on, tactile settings with tools, parts and space to tinker.",
    respondsWellTo: "Real objects, demonstrations, and 'let me try it' learning.",
    needsSupportWith: "Long stretches of sitting still or listening — build in movement and doing.",
  },
  {
    id: "helper",
    title: "The Helper",
    icon: "🤝",
    tagline: "Feels best when caring for and supporting others.",
    description:
      "You notice how people feel and you want to help. Kindness is a real, powerful strength — and it's yours.",
    categories: ["helping", "social"],
    bestEnvironment: "Warm, people-centered settings where care and connection matter.",
    respondsWellTo: "Clear ways to contribute, gratitude, and roles that help others.",
    needsSupportWith: "Remembering their own needs — encourage healthy limits and rest.",
  },
  {
    id: "sound_explorer",
    title: "The Sound Explorer",
    icon: "🎧",
    tagline: "Tuned in to music, rhythm and frequency.",
    description:
      "Sound moves you. Rhythm, melody and tone are how you focus, feel and understand the world.",
    categories: ["music"],
    bestEnvironment: "Spaces where sound is welcome — and control over noise when it's too much.",
    respondsWellTo: "Music, rhythm cues, songs for learning, and headphones for focus.",
    needsSupportWith: "Loud, unpredictable noise — offer noise-reducing options and quiet corners.",
  },
  {
    id: "visual_thinker",
    title: "The Visual Thinker",
    icon: "👁️",
    tagline: "Understands the world through images and color.",
    description:
      "You notice what others miss — color, detail, how things look and fit. You think in pictures.",
    categories: ["visual_art", "organizing"],
    bestEnvironment: "Visually clear, uncluttered spaces with pictures, charts and color coding.",
    respondsWellTo: "Diagrams, visual schedules, demonstrations and color-coded systems.",
    needsSupportWith: "Long spoken-only instructions — pair words with visuals.",
  },
  {
    id: "organizer",
    title: "The Organizer",
    icon: "🗂️",
    tagline: "Brings order, calm and structure.",
    description:
      "You love things in their place. Sorting, planning and routine feel good — and they help everyone around you too.",
    categories: ["organizing", "quiet_focus"],
    bestEnvironment: "Predictable, well-structured settings with clear routines and expectations.",
    respondsWellTo: "Checklists, schedules, advance notice of changes, and tidy spaces.",
    needsSupportWith: "Sudden change — give warnings and a clear plan when things shift.",
  },
  {
    id: "tech_explorer",
    title: "The Tech Explorer",
    icon: "💻",
    tagline: "Curious about how machines and tech work.",
    description:
      "Screens, buttons, code and gadgets pull you in. You love figuring out how technology works.",
    categories: ["technology", "problem_solving"],
    bestEnvironment: "Access to devices and tools, with room to experiment and problem-solve.",
    respondsWellTo: "Interactive tech, clear goals, and freedom to explore how things work.",
    needsSupportWith: "Healthy screen balance — pair tech time with movement and connection.",
  },
  {
    id: "leader",
    title: "The Leader",
    icon: "⭐",
    tagline: "Guides, organizes and inspires others.",
    description:
      "People follow your lead. You like to set direction, bring others together and make things happen.",
    categories: ["leadership", "social"],
    bestEnvironment: "Team settings with real responsibility and a chance to guide.",
    respondsWellTo: "Leadership roles, clear goals, and being trusted with a task.",
    needsSupportWith: "Sharing the lead and taking turns — coach patience and listening.",
  },
  {
    id: "quiet_strategist",
    title: "The Quiet Strategist",
    icon: "🧠",
    tagline: "Thinks deeply and works best in calm focus.",
    description:
      "You do your best thinking in quiet. Given space and time, you solve problems others rush past.",
    categories: ["quiet_focus", "problem_solving"],
    bestEnvironment: "Calm, low-stimulation spaces with focused, independent work time.",
    respondsWellTo: "Quiet, advance notice, one thing at a time, and time to think before answering.",
    needsSupportWith: "Busy, loud group settings — offer breaks and a calm retreat space.",
  },
  {
    id: "movement_learner",
    title: "The Movement Learner",
    icon: "🤸",
    tagline: "Thinks and learns best while moving.",
    description:
      "Your body helps your brain. You focus and learn best when you can move, act it out and stay active.",
    categories: ["movement"],
    bestEnvironment: "Active spaces that allow movement, standing, sport and hands-on doing.",
    respondsWellTo: "Movement breaks, acting things out, sports and learning by doing.",
    needsSupportWith: "Sitting still for long periods — build in frequent, planned movement.",
  },
  {
    id: "nature_connector",
    title: "The Nature Connector",
    icon: "🌿",
    tagline: "Calm and alive around nature and animals.",
    description:
      "The outdoors is your happy place. Plants, animals and open air help you feel calm and focused.",
    categories: ["nature", "quiet_focus"],
    bestEnvironment: "Outdoor or nature-rich settings, or spaces with plants, animals and natural light.",
    respondsWellTo: "Time outside, caring for plants or animals, and nature-based activities.",
    needsSupportWith: "Long indoor stretches — add outdoor breaks and natural elements inside.",
  },
  {
    id: "storyteller",
    title: "The Storyteller",
    icon: "🎭",
    tagline: "Shares ideas through words, stories and performance.",
    description:
      "You have things to say and a way of saying them. Words, stories and performing are your superpower.",
    categories: ["storytelling", "social"],
    bestEnvironment: "Expressive settings with a real audience and room to speak and perform.",
    respondsWellTo: "Storytelling, drama, presenting, and being heard.",
    needsSupportWith: "Waiting for a turn and listening — coach turn-taking with warmth.",
  },
];

export const PROFILE_MAP: Record<ProfileId, Profile> = Object.fromEntries(
  PROFILES.map((p) => [p.id, p]),
) as Record<ProfileId, Profile>;
