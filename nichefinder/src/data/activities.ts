import type { CategoryId } from "@/types";

/**
 * Recommended activities and possible pathways per strength category.
 *
 * `activities` are things to try now (age-neutral, gently worded).
 * `pathways` are possible niche / hobby / career directions — always framed as
 * "possible" and "explore", never as fixed labels.
 *
 * This is deliberately data, not logic, so an admin/editor can extend it later
 * (see the Admin editor) without code changes.
 */
export const ACTIVITIES: Record<CategoryId, { activities: string[]; pathways: string[] }> = {
  music: {
    activities: [
      "Explore instruments, drums or a simple keyboard",
      "Make playlists and sort songs by feeling",
      "Try rhythm and clapping games",
      "Use music or a beat while learning or working",
    ],
    pathways: ["Music & sound", "DJ / audio", "Music therapy", "Podcasting", "Sound design"],
  },
  visual_art: {
    activities: [
      "Offer varied art materials and let them choose",
      "Try photography or simple design apps",
      "Color-code and decorate their own space",
      "Visit galleries or explore art online",
    ],
    pathways: ["Art & illustration", "Graphic design", "Photography", "Interior / fashion design"],
  },
  movement: {
    activities: [
      "Try different sports until one feels fun",
      "Use movement breaks between focused tasks",
      "Explore dance, swimming or martial arts",
      "Act things out when learning something new",
    ],
    pathways: ["Sport & coaching", "Dance", "Physical therapy", "Personal training", "Trades"],
  },
  building: {
    activities: [
      "Provide blocks, kits, tools or a repair project",
      "Try model-building or simple woodworking",
      "Take apart and rebuild safe old gadgets",
      "Cook or bake — building with ingredients",
    ],
    pathways: ["Engineering", "Construction & trades", "Making / crafts", "Robotics", "Culinary"],
  },
  technology: {
    activities: [
      "Try block-based coding or a friendly coding app",
      "Explore how a device or robot works",
      "Make something simple: a game, a slideshow, a bot",
      "Learn keyboard shortcuts and helpful tools",
    ],
    pathways: ["Software", "IT support", "Game design", "AI & data", "Digital media"],
  },
  nature: {
    activities: [
      "Care for a plant, garden or animal",
      "Spend regular time outdoors",
      "Explore nature walks, collecting or observing",
      "Learn about animals, weather or the environment",
    ],
    pathways: ["Animal care", "Conservation", "Farming / gardening", "Outdoor guiding", "Veterinary"],
  },
  helping: {
    activities: [
      "Give real ways to help at home or in class",
      "Volunteer or support a cause together",
      "Practice kind check-ins with friends and family",
      "Explore caregiving, first-aid or ministry roles",
    ],
    pathways: ["Nursing / care", "Teaching aide", "Counseling", "Ministry", "Social work"],
  },
  storytelling: {
    activities: [
      "Tell, record or write stories",
      "Try drama, puppets or role-play",
      "Present a topic they love to family",
      "Start a simple video or audio diary",
    ],
    pathways: ["Writing", "Acting / theatre", "Broadcasting", "Public speaking", "Content creation"],
  },
  organizing: {
    activities: [
      "Let them plan a schedule or sort a collection",
      "Create checklists and visual routines together",
      "Organize a shelf, room or event",
      "Try planners, labels and color-coding",
    ],
    pathways: ["Project coordination", "Logistics", "Administration", "Librarianship", "Operations"],
  },
  problem_solving: {
    activities: [
      "Offer puzzles, logic games and brain teasers",
      "Try escape-room style challenges",
      "Build and debug simple machines or code",
      "Play strategy games together",
    ],
    pathways: ["Engineering", "Data & analysis", "Research", "Finance", "Skilled trades"],
  },
  leadership: {
    activities: [
      "Give a real leadership role or team task",
      "Practice planning and guiding a small group",
      "Try captaining, mentoring or organizing an event",
      "Reflect together on fair, kind leading",
    ],
    pathways: ["Management", "Entrepreneurship", "Coaching", "Community organizing", "Team lead"],
  },
  quiet_focus: {
    activities: [
      "Protect calm, uninterrupted focus time",
      "Offer deep-dive projects on a favorite topic",
      "Create a quiet, low-stimulation work corner",
      "Use headphones or a 'do not disturb' signal",
    ],
    pathways: ["Research", "Writing", "Programming", "Analysis", "Craftsmanship"],
  },
  social: {
    activities: [
      "Create regular group and team activities",
      "Try clubs, teams or community groups",
      "Practice conversation and turn-taking games",
      "Pair up for buddy learning",
    ],
    pathways: ["Hospitality", "Sales & service", "Events", "Community work", "Team roles"],
  },
};

/**
 * Learning-style hints, keyed by the categories that most imply them. The
 * scoring engine picks the best match from a person's top strengths.
 */
export const LEARNING_STYLES: { categories: CategoryId[]; style: string }[] = [
  { categories: ["music"], style: "Auditory — learns well through sound, rhythm and spoken words." },
  { categories: ["visual_art"], style: "Visual — learns well through pictures, color and demonstrations." },
  { categories: ["movement"], style: "Kinesthetic — learns best by moving, doing and hands-on practice." },
  { categories: ["building"], style: "Hands-on — learns by making, building and trying things for real." },
  { categories: ["technology"], style: "Interactive — learns well through screens, tools and experimenting." },
  { categories: ["storytelling"], style: "Verbal — learns well through stories, talking and explaining." },
  { categories: ["organizing"], style: "Structured — learns best with clear steps, routines and order." },
  { categories: ["quiet_focus"], style: "Reflective — learns best with quiet, time and independent focus." },
  { categories: ["social"], style: "Social — learns well with others, in pairs and small groups." },
  { categories: ["problem_solving"], style: "Inquiry-led — learns by questioning, puzzling and figuring out." },
];
