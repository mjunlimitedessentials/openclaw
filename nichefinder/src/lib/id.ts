/**
 * Tiny id + time helpers.
 * Uses `crypto.randomUUID` when available (all modern browsers) and falls back
 * to a timestamp-based id otherwise. Isolated here so ids are consistent and
 * easy to swap for server-generated ids later.
 */
export function newId(prefix = "id"): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${uuid}`;
}

export function now(): number {
  return Date.now();
}
