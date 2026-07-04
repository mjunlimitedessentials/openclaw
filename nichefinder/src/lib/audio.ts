/**
 * Read-aloud support via the browser's built-in Speech Synthesis API.
 *
 * Kept dependency-free and defensive: on browsers/devices without speech
 * synthesis, every function is a safe no-op and `isSpeechSupported()` returns
 * false so the UI can hide the audio buttons.
 */

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Speak the given text aloud. Cancels any in-progress speech first so tapping
 * a new "read aloud" button never overlaps voices.
 * `rate` is slightly slowed by default — calmer and easier to follow.
 */
export function speak(text: string, opts: { rate?: number; pitch?: number } = {}): void {
  if (!isSpeechSupported() || !text.trim()) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = opts.rate ?? 0.92;
    utterance.pitch = opts.pitch ?? 1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  } catch {
    // Never let audio failures interrupt the questionnaire.
  }
}

/** Stop any current read-aloud. Called on navigation and on unmount. */
export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* no-op */
  }
}
