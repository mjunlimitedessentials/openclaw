import type {
  PersonProfile,
  AssessmentSession,
  Question,
} from "@/types";
import { QUESTIONS } from "@/data/questionBank";

/**
 * Storage layer
 * =============
 *
 * The whole app talks to this module, never to `localStorage` directly. That
 * indirection is deliberate: swapping in a real database (Supabase, Postgres,
 * an API) later means re-implementing this one interface — no UI changes.
 *
 * Everything is namespaced under `nf.` and stored as JSON. All reads are
 * defensive (corrupt/missing data returns sensible empties) so a half-written
 * session can never crash the app.
 */

export interface DataStore {
  listPeople(): PersonProfile[];
  getPerson(id: string): PersonProfile | undefined;
  savePerson(person: PersonProfile): void;
  deletePerson(id: string): void;

  listSessions(): AssessmentSession[];
  getSession(id: string): AssessmentSession | undefined;
  getSessionsForPerson(personId: string): AssessmentSession[];
  saveSession(session: AssessmentSession): void;
  deleteSession(id: string): void;

  /** Admin-editable question overrides (see AdminPage). */
  getCustomQuestions(): Question[];
  saveCustomQuestions(questions: Question[]): void;
}

const KEYS = {
  people: "nf.people",
  sessions: "nf.sessions",
  customQuestions: "nf.customQuestions",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt data should degrade gracefully, never throw into the UI.
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked (private mode). Fail quietly; the current
    // in-memory session still works for the rest of the visit.
  }
}

/** localStorage-backed implementation of the DataStore interface. */
export const localStore: DataStore = {
  listPeople() {
    return read<PersonProfile[]>(KEYS.people, []).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  },
  getPerson(id) {
    return this.listPeople().find((p) => p.id === id);
  },
  savePerson(person) {
    const all = read<PersonProfile[]>(KEYS.people, []);
    const idx = all.findIndex((p) => p.id === person.id);
    if (idx >= 0) all[idx] = person;
    else all.push(person);
    write(KEYS.people, all);
  },
  deletePerson(id) {
    write(
      KEYS.people,
      read<PersonProfile[]>(KEYS.people, []).filter((p) => p.id !== id),
    );
    // Cascade: remove this person's sessions too.
    write(
      KEYS.sessions,
      read<AssessmentSession[]>(KEYS.sessions, []).filter(
        (s) => s.personId !== id,
      ),
    );
  },

  listSessions() {
    return read<AssessmentSession[]>(KEYS.sessions, []).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  },
  getSession(id) {
    return this.listSessions().find((s) => s.id === id);
  },
  getSessionsForPerson(personId) {
    return this.listSessions().filter((s) => s.personId === personId);
  },
  saveSession(session) {
    const all = read<AssessmentSession[]>(KEYS.sessions, []);
    const idx = all.findIndex((s) => s.id === session.id);
    if (idx >= 0) all[idx] = session;
    else all.push(session);
    write(KEYS.sessions, all);
  },
  deleteSession(id) {
    write(
      KEYS.sessions,
      read<AssessmentSession[]>(KEYS.sessions, []).filter((s) => s.id !== id),
    );
  },

  getCustomQuestions() {
    return read<Question[]>(KEYS.customQuestions, []);
  },
  saveCustomQuestions(questions) {
    write(KEYS.customQuestions, questions);
  },
};

/**
 * The effective question bank = built-in questions + any admin additions.
 * Admin edits/additions are stored separately so a future content update to the
 * built-in bank never clobbers a user's custom questions.
 */
export function effectiveQuestions(): Question[] {
  return [...QUESTIONS, ...localStore.getCustomQuestions()];
}
