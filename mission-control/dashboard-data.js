// MISSION CONTROL — cached data feed (SANITIZED TEMPLATE)
//
// SECURITY NOTE (2026-09-20): this repository is PUBLIC, so this file is a
// sanitized template only. Live operator data is generated at refresh time
// and published ONLY to the operator's private Claude artifact — it must
// never be committed here. Earlier commits on this branch contained live
// snapshots; treat that history as exposed until it is purged.
//
// Contract: every populated field must come from a live probe at generatedAt;
// failed/unauthorized sources are marked offline/auth and their panels render
// NO SIGNAL. Empty arrays / absent blocks degrade gracefully — never break
// the page.
window.MISSION_DATA = {
  generatedAt: null,
  operator: {
    name: "OPERATOR NAME",
    email: "operator@example.com",
    org: "Your Organization",
    timezone: "America/New_York"
  },

  // AI briefing — empty here; the refresh skill writes prioritized,
  // cross-referenced actions into the private build only.
  briefing: {
    headline: "",
    actions: []
  },

  // Connector status board — one entry per connector, probed live.
  // status: "online" | "offline" | "auth"
  sources: [],

  // Today tile — { label, sub, events: [{time,title,note}], next }
  today: null,

  // Business ops — { updates: [{tag, kind?, money?, title, detail}] }
  business: { updates: [] },

  // Grant radar — { verified: "<date>", items: [{amount,name,deadline,fit,url}] }
  grants: { items: [] },

  // Gmail — threads: [{at,from,subject,tag,money?}]; nulls = NO SIGNAL.
  gmail: {
    inboxEstimateLast3Days: null,
    unreadShown: null,
    threads: []
  },

  // Calendar — events: [{day,time,title,loc,note}]
  calendar: {
    timezone: "America/New_York",
    calendarCount: null,
    calendars: [],
    events: []
  },

  notion: {
    openTasks: null,
    tasksDb: "",
    // Set per-installation: the Notion tasks database ID the refresh skill
    // should query. Never hardcode a personal database ID in the repo.
    tasksDbId: "",
    recentPages: []
  },

  drive: { files: [] },

  canva: { designs: [] },

  slack: {
    workspace: "",
    silentDays: null,
    channels: []
  },

  higgsfield: {
    credits: null,
    plan: ""
  },

  // Finance panel — rendered from this block (see FIN-10 in index.html);
  // absent/empty = NO SIGNAL. { led: "on"|"off"|"auth", notes: [], status: "" }
  finance: null,

  // Telemetry series — real probed values only; charts hidden when empty.
  telemetry: {
    credits: { label: "CREDITS — PROBE HISTORY", unit: "credits", points: [] },
    weekLoad: { label: "CALENDAR LOAD — NEXT 7 DAYS", unit: "events / day", points: [] }
  }
};
